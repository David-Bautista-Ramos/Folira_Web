import GeneroLiterario from "../models/generoLiterario.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import * as Yup from "yup";
import path from "path";
import { fileURLToPath } from "url"; // Necesario para convertir import.meta.url a __dirname

export const getUserProfile = async (req, res) => {
  const { nombre } = req.params;

  try {
    const user = await User.findOne({ nombre }).select("-contrasena");

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "no puedes seguirte o dejar de seguirte a ti mismo" });
    }

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "Usuario no encontrado" });

    const isFollowing = currentUser.seguidos.includes(id);

    if (isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { seguidores: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { seguidos: id } });

      res
        .status(200)
        .json({ message: "Usuario dejado de seguir exitosamente" });
    } else {
      // Follow the user
      await User.findByIdAndUpdate(id, { $push: { seguidores: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { seguidos: id } });
      // Send notification to the user
      const newNotification = new Notification({
        tipo: "seguidor",
        de: req.user._id,
        para: userToModify._id,
      });

      await newNotification.save();

      res.status(200).json({ message: "Usuario Seguido con exito" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    // Obtener el listado de usuarios seguidos por el usuario actual
    const user = await User.findById(userId)
      .populate("seguidos", "_id")
      .populate("generoLiterarioPreferido", "_id");

    // Obtener una lista de IDs de los usuarios seguidos por el usuario actual
    const followedUserIds = user.seguidos.map(
      (followedUser) => followedUser._id
    );

    // Obtener los géneros literarios preferidos del usuario actual
    const userPreferredGenres = user.generoLiterarioPreferido.map(
      (genre) => genre._id
    );

    // Encontrar usuarios sugeridos, excluyendo los que ya sigue el usuario actual y excluyéndose a sí mismo,
    // pero priorizando aquellos que comparten géneros literarios en común
    const users = await User.aggregate([
      {
        $match: {
          _id: { $nin: [...followedUserIds, userId] }, // Excluir usuarios seguidos y el mismo usuario
          generoLiterarioPreferido: { $in: userPreferredGenres }, // Usuarios que comparten géneros literarios en común
        },
      },
      { $sample: { size: 10 } }, // Elegir aleatoriamente 10 usuarios
      {
        $project: {
          nombre: 1,
          correo: 1,
          fotoPerfil: 1,
          generoLiterarioPreferido: 1, // Incluir géneros literarios en el resultado
        },
      },
    ]);

    res.status(200).json(users.slice(0, 5)); // Enviar solo los primeros 4 usuarios sugeridos
  } catch (error) {
    console.log("Error in getSuggestedUsers: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const {
    nombre,
    nombreCompleto,
    correo,
    generoLiterarioPreferido,
    currentcontrasena,
    newcontrasena,
    pais,
    biografia,
  } = req.body;
  let { fotoPerfil, fotoPerfilBan } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (
      (!newcontrasena && currentcontrasena) ||
      (!currentcontrasena && newcontrasena)
    ) {
      return res
        .status(400)
        .json({
          error: "Please provide both current password and new password",
        });
    }

    if (currentcontrasena && newcontrasena) {
      const isMatch = await bcrypt.compare(currentcontrasena, user.contrasena);
      if (!isMatch)
        return res
          .status(400)
          .json({ error: "Contraseña anterior incorrecta" });
      if (newcontrasena.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.contrasena = await bcrypt.hash(newcontrasena, salt);
    }

    // Actualizar foto de perfil y foto de banner si es necesario
    if (fotoPerfil) {
      if (user.fotoPerfil) {
        await cloudinary.uploader.destroy(
          user.fotoPerfil.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(fotoPerfil);
      user.fotoPerfil = uploadedResponse.secure_url;
    }

    if (fotoPerfilBan) {
      if (user.fotoPerfilBan) {
        await cloudinary.uploader.destroy(
          user.fotoPerfilBan.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(fotoPerfilBan);
      user.fotoPerfilBan = uploadedResponse.secure_url;
    }

    // Buscar los géneros literarios seleccionados
    if (generoLiterarioPreferido && generoLiterarioPreferido.length > 0) {
      const generos = await GeneroLiterario.find({
        _id: { $in: generoLiterarioPreferido },
      });
      if (generos.length !== generoLiterarioPreferido.length) {
        return res
          .status(400)
          .json({ error: "Some selected literary genres are invalid" });
      }
      user.generoLiterarioPreferido = generos.map((genero) => genero._id); // Actualiza los géneros literarios del usuario
    }

    // Actualizar otros campos del usuario
    user.nombre = nombre || user.nombre;
    user.nombreCompleto = nombreCompleto || user.nombreCompleto;
    user.correo = correo || user.correo;
    user.pais = pais || user.pais;
    user.biografia = biografia || user.biografia;
    user.fotoPerfil = fotoPerfil || user.fotoPerfil;
    user.fotoPerfilBan = fotoPerfilBan || user.fotoPerfilBan;

    await user.save();

    // Eliminar la contraseña del objeto de respuesta
    user.contrasena = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const desactivar = async (req, res) => {
  try {
    const userId = req.user._id; // Asegúrate de que el middleware de autenticación asigna correctamente el usuario a req.user

    // Buscar el usuario en la base de datos por su ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Cambia el estado del usuario directamente
    user.estado = false; // Desactiva la cuenta

    // Guarda los cambios en la base de datos
    await user.save();

    // Respuesta exitosa al cliente
    res.status(200).json({ message: "Usuario Desactivado con éxito" });
  } catch (error) {
    console.log("Error en la función de activación:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const activar = async (req, res) => {
  try {
    const userId = req.user._id; // Asegúrate de que el middleware de autenticación asigna correctamente el usuario a req.user

    // Buscar el usuario en la base de datos por su ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Cambia el estado del usuario directamente
    user.estado = true; // Activa la cuenta

    // Guarda los cambios en la base de datos
    await user.save();

    // Respuesta exitosa al cliente
    res.status(200).json({ message: "Usuario activado con éxito" });
  } catch (error) {
    console.log("Error en la función de activación:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const validDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
];
// Esquema de validación usando Yup

const userValidationSchema = Yup.object().shape({
  nombre: Yup.string()
    .required("El nombre es obligatorio.")
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(50, "El nombre no puede tener más de 50 caracteres.")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "El nombre solo puede contener letras y números."
    ),

  nombreCompleto: Yup.string()
    .required("El nombre completo es obligatorio.")
    .min(5, "El nombre completo debe tener al menos 5 caracteres.")
    .max(100, "El nombre completo no puede exceder los 100 caracteres.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "El nombre completo solo puede contener letras."
    ),

  correo: Yup.string()
    .required("El correo es obligatorio.")
    .email("Formato de correo inválido.")
    .test("valid-domain", "Dominio de correo no válido.", (value) => {
      if (!value) return false;
      const domain = value.split("@")[1];
      return validDomains.includes(domain);
    }),

  contrasena: Yup.string()
    .required("La contraseña es obligatoria.")
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .matches(/[a-z]/, "La contraseña debe tener al menos una letra minúscula.")
    .matches(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula.")
    .matches(/\d/, "La contraseña debe tener al menos un número.")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "La contraseña debe tener al menos un carácter especial."
    ),

  pais: Yup.string()
    .required("El país es obligatorio.")
    .min(3, "El país debe tener al menos 3 caracteres.")
    .max(56, "El país no puede exceder los 56 caracteres."),
});

// Esquema de validación sin el campo contraseña
const userValidationSchemaADMIN = Yup.object().shape({
  nombre: Yup.string()
    .required("El nombre es obligatorio.")
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(50, "El nombre no puede tener más de 50 caracteres.")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "El nombre solo puede contener letras y números."
    ),

  nombreCompleto: Yup.string()
    .required("El nombre completo es obligatorio.")
    .min(5, "El nombre completo debe tener al menos 5 caracteres.")
    .max(100, "El nombre completo no puede exceder los 100 caracteres.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "El nombre completo solo puede contener letras."
    ),
    
  correo: Yup.string()
    .required("El correo es obligatorio.")
    .email("Formato de correo inválido.")
    .test("valid-domain", "Dominio de correo no válido.", (value) => {
      if (!value) return false;
      const domain = value.split("@")[1];
      return validDomains.includes(domain);
    }),
});

{
  /*metodos para el admin*/
}
// Crear un nuevo usuario
// Crear un nuevo usuario
// Configuración de Nodemailer
// Configuración del transportador de Nodemailer
const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: (process.env.EMAIL_USER = "foliraweb@gmail.com"), // Asegúrate de que esto sea tu correo electrónico
    pass: (process.env.EMAIL_PASS = "ytle kapv jhyo gopu"), // Asegúrate de que esto sea tu contraseña o contraseña de aplicación
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verificar la conexión
transporter
  .verify()
  .then(() => {
    console.log("Configuración de correo electrónico verificada");
  })
  .catch((err) => {
    console.error("Error al verificar la configuración:", err);
  });

// Definir __dirname en un entorno ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const crearUser = async (req, res) => {
  try {
    const { nombre, nombreCompleto, correo, pais, roles } = req.body;
    let { fotoPerfil, fotoPerfilBan } = req.body;

    // Validación con Yup
    await userValidationSchemaADMIN.validate(
      { nombre, nombreCompleto, correo, pais, roles },
      { abortEarly: false }
    );

    // Verificar si el nombre de usuario ya existe
    const existingUser = await User.findOne({ nombre });
    if (existingUser) {
      return res.status(400).json({ error: "El nombre de usuario ya existe." });
    }

    // Verificar si el correo ya existe
    const existingEmail = await User.findOne({ correo });
    if (existingEmail) {
      return res.status(400).json({ error: "El correo ya está registrado." });
    }

    // Subir fotos de perfil y banner si se proporcionan
    let fotoPerfilURL = "";
    let fotoPerfilBanURL = "";

    if (fotoPerfil) {
      const uploadedResponse = await cloudinary.uploader.upload(fotoPerfil);
      fotoPerfilURL = uploadedResponse.secure_url;
    }

    if (fotoPerfilBan) {
      const uploadedResponse = await cloudinary.uploader.upload(fotoPerfilBan);
      fotoPerfilBanURL = uploadedResponse.secure_url;
    }

    // Generar una contraseña aleatoria
    const randomPassword = crypto.randomBytes(8).toString("hex"); // Contraseña de 16 caracteres

    // Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    // Crear un nuevo usuario
    const newUser = new User({
      nombre,
      nombreCompleto,
      correo,
      contrasena: hashedPassword,
      pais,
      roles, // Asignar roles como corresponda
      fotoPerfil: fotoPerfilURL,
      fotoPerfilBan: fotoPerfilBanURL,
    });

    // Guardar el usuario
    await newUser.save();

    // Configuración del correo electrónico
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.correo,
      subject: "🎉 ¡Bienvenido a Plataforma Folira! 🎉",
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <img src="cid:logoFolira" alt="Logo Folira" style="width: 150px; margin-bottom: 20px; border-radius:100px;">
        <h1 style="color: #111827;">¡Bienvenido a Folira!</h1>
        <p style="font-size: 16px; color: #34495e;">Hola y Bienvenid@ <strong>${nombreCompleto}</strong>.</p>
        <p style="font-size: 16px; color: #34495e;">
          Te damos la bienvenida a Folira. Aquí están tus credenciales de acceso:
        </p>
        <div style="text-align: left; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
          <p><strong>Correo:</strong> ${correo}</p>
          <p><strong>Clave temporal:</strong> ${randomPassword}</p>
          <p style="font-size: 14px; color: #142157;">Se recomienda cambiar la clave al iniciar sesión.</p>
        </div>
        <p style="font-size: 16px; color: #34495e; margin-top: 20px;">¡Gracias por unirte a nosotros!</p>
      </div>
    `,
      attachments: [
        {
          filename: "logo-Folira.png",
          path: path.join(__dirname, "../assets/img/Folira_logo.png"), // Usar path.join
          cid: "logoFolira", // cid para referenciar en el HTML
        },
      ],
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    // Respuesta de éxito
    return res.status(201).json({
      _id: newUser._id,
      nombre: newUser.nombre,
      nombreCompleto: newUser.nombreCompleto,
      correo: newUser.correo,
      pais: newUser.pais,
      roles: newUser.roles,
      message:
        "Usuario creado con éxito, la contraseña ha sido enviada al correo del usuario.",
    });
  } catch (error) {
    console.error("Error en el controlador de creación de usuario:", error); // Muestra el error completo en consola
    if (error.name === "ValidationError") {
      // Error de validación de Yup
      return res
        .status(400)
        .json({
          error: Array.isArray(error.errors)
            ? error.errors.join(", ")
            : error.errors,
        });
    }
    console.error(
      "Error en el controlador de creación de usuario:",
      error.message
    );
    return res.status(500).json({ error: "Error en el servidor." });
  }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find(); // Puedes agregar filtros si es necesario
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { userId } = req.params;
    const usuario = await User.findById(userId);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};


// Actualizar un usuario por ID
export const actualizarUsuario = async (req, res) => {
  const {
    nombre,
    nombreCompleto,
    correo,
    generoLiterarioPreferido,
    currentcontrasena,
    newcontrasena,
    pais,
    biografia,
  } = req.body;
  let { fotoPerfil, fotoPerfilBan } = req.body;

  // Obtiene el ID del usuario desde los parámetros de la solicitud
  const userId = req.params.userId;

  try {
    // Verifica si el usuario existe
    let user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Validar si el usuario que está realizando la actualización es un administrador
    if (req.user.roles !== "admin" && req.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para actualizar este usuario" });
    }

    // Validar contraseñas
    if (
      (!newcontrasena && currentcontrasena) ||
      (!currentcontrasena && newcontrasena)
    ) {
      return res
        .status(400)
        .json({
          error:
            "Por favor, proporciona tanto la contraseña actual como la nueva",
        });
    }

    if (currentcontrasena && newcontrasena) {
      const isMatch = await bcrypt.compare(currentcontrasena, user.contrasena);
      if (!isMatch)
        return res
          .status(400)
          .json({ error: "La contraseña actual es incorrecta" });

      if (newcontrasena.length < 6) {
        return res
          .status(400)
          .json({
            error: "La nueva contraseña debe tener al menos 6 caracteres",
          });
      }
      user.contrasena = await bcrypt.hash(newcontrasena, 10);
    }

    // Actualizar nombre, correo, país y biografía
    user.nombre = nombre || user.nombre;
    user.nombreCompleto = nombreCompleto || user.nombreCompleto;
    user.correo = correo || user.correo;
    user.pais = pais || user.pais;
    user.biografia = biografia || user.biografia;
    user.fotoPerfil = fotoPerfil || user.fotoPerfil;
    user.fotoPerfilBan = fotoPerfilBan || user.fotoPerfilBan;

    // Actualizar foto de perfil si es necesario
    if (fotoPerfil) {
      if (user.fotoPerfil) {
        await cloudinary.uploader.destroy(
          user.fotoPerfil.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(fotoPerfil);
      user.fotoPerfil = uploadedResponse.secure_url;
    }

    // Actualizar foto de banner si es necesario
    if (fotoPerfilBan) {
      if (user.fotoPerfilBan) {
        await cloudinary.uploader.destroy(
          user.fotoPerfilBan.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(fotoPerfilBan);
      user.fotoPerfilBan = uploadedResponse.secure_url;
    }

    // Buscar los géneros literarios seleccionados
    if (generoLiterarioPreferido && generoLiterarioPreferido.length > 0) {
      const generos = await GeneroLiterario.find({
        _id: { $in: generoLiterarioPreferido },
      });
      if (generos.length !== generoLiterarioPreferido.length) {
        return res
          .status(400)
          .json({
            error: "Algunos géneros literarios seleccionados son inválidos",
          });
      }
      user.generoLiterarioPreferido = generos.map((genero) => genero._id); // Actualiza los géneros literarios del usuario
    }

    // Guardar los cambios en el usuario
    await user.save();

    user.contrasena = null;

    res
      .status(200)
      .json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Activar o desactivar usuario (cambiar el estado)
export const cambiarEstadoUsuario = async (req, res) => {
  try {
    const userId = req.params.id;
    const { nuevoEstado } = req.body; // { nuevoEstado: true/false }

    const usuarioActualizado = await User.findByIdAndUpdate(
      userId,
      { estado: nuevoEstado },
      { new: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const mensaje = nuevoEstado
      ? "Usuario activado con éxito"
      : "Usuario desactivado con éxito";
    res.status(200).json({ message: mensaje, usuarioActualizado });
  } catch (error) {
    res.status(500).json({ error: "Error al cambiar el estado del usuario" });
  }
};

// Eliminar un usuario por ID
export const eliminarUsuario = async (req, res) => {
  try {
    const userId = req.params.id;

    const usuarioEliminado = await User.findByIdAndDelete(userId);

    if (!usuarioEliminado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

export const obtenerUserAct = async (req, res) => {
  try {
    const estado = true;

    const user = await User.find({ estado: estado });
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error al obtener los user:", error.message);
    res.status(500).json({ error: "Error al obtener los user." });
  }
};

export const obtenerUsersDes = async (req, res) => {
  try {
    const estado = false;

    const user = await User.find({ estado: estado });
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error al obtener los user:", error.message);
    res.status(500).json({ error: "Error al obtener los user." });
  }
};
