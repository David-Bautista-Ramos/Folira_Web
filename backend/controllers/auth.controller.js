import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import GeneroLiterario from "../models/generoLiterario.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import * as Yup from "yup";

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
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre completo solo puede contener letras y espacios."
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

// Sign up - Registro
export const signup = async (req, res) => {
  try {
    const { nombre, nombreCompleto, correo, contrasena, pais } = req.body;

    // Validación con Yup
    await userValidationSchema.validate(req.body, { abortEarly: false });

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

    // Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // Crear un nuevo usuario
    const newUser = new User({
      nombre,
      nombreCompleto,
      correo,
      contrasena: hashedPassword,
      pais,
      roles: "usuario", // Asignar roles como corresponda
    });

    // Guardar el usuario
    await newUser.save();

    // Generar token y guardar en cookie
    generateTokenAndSetCookie(newUser._id, res);

    // Respuesta de éxito
    return res.status(201).json({
      _id: newUser._id,
      nombre: newUser.nombre,
      nombreCompleto: newUser.nombreCompleto,
      correo: newUser.correo,
      pais: newUser.pais,
      fotoPerfil: newUser.fotoPerfil,
      fotoPerfilBan: newUser.fotoPerfilBan,
      generoLiterarioPreferido: newUser.generoLiterarioPreferido,
      seguidos: newUser.seguidos,
      seguidores: newUser.seguidores,
      estado: newUser.estado,
      roles: newUser.roles,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Error de validación de Yup
      return res.status(400).json({ error: error.errors.join(", ") });
    }
    console.error("Error in signup controller:", error.message);
    return res.status(500).json({ error: "Error en el servidor." });
  }
};

// Login - Inicio de sesión
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Buscar usuario por correo
    const user = await User.findOne({ correo });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Correo o contraseña incorrectos." });
    }

    // Comparar contraseñas
    const isPasswordCorrect = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "Correo o contraseña incorrectos." });
    }

    // Generar token y guardar en cookie
    generateTokenAndSetCookie(user._id, res);

    // Respuesta de éxito
    return res.status(200).json({
      _id: user._id,
      nombre: user.nombre,
      nombreCompleto: user.nombreCompleto,
      correo: user.correo,
      pais: user.pais,
      fotoPerfil: user.fotoPerfil,
      fotoPerfilBan: user.fotoPerfilBan,
      generoLiterarioPreferido: user.generoLiterarioPreferido,
      amigos: user.amigos,
      seguidores: user.seguidores,
      estado: user.estado,
      roles: user.roles,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    return res.status(500).json({ error: "Error en el servidor." });
  }
};

// Logout - Cerrar sesión
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Sesión cerrada con éxito." });
  } catch (error) {
    console.error("Error en logout controller:", error.message);
    return res.status(500).json({ error: "Error en el servidor." });
  }
};

// Obtener usuario autenticado (getMe)
export const getMe = async (req, res) => {
  try {
    // Encuentra el usuario sin la contraseña
    const user = await User.findById(req.user._id).select("-contrasena");

    // Si no se encuentra el usuario, devolver un error 404
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Obtener los géneros literarios preferidos del usuario
    const generosLiterario = await GeneroLiterario.find({
      _id: { $in: user.generoLiterarioPreferido }
    }).select("nombre fotoGenero"); // Selecciona solo el nombre y la foto

    // Mapear los géneros literarios para incluir la información de nombre y foto
    const generosPreferidos = generosLiterario.map(genero => ({
      id: genero._id,
      nombre: genero.nombre,
      fotoGenero: genero.fotoGenero // Asegúrate de que este campo existe en tu modelo
    }));

    // Responder con el usuario y sus géneros literarios preferidos
    return res.status(200).json({ ...user.toObject(), generosPreferidos });
  } catch (error) {
    console.error("Error in getMe controller:", error.message);
    return res.status(500).json({ error: "Error en el servidor." });
  }
};
