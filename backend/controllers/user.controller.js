import GeneroLiterario from "../models/generoLiterario.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";
import bcrypt from "bcryptjs";
import * as Yup from 'yup';


export const getUserProfile =async (req, res) =>{
    const {nombre} = req.params;

    try {
        const user = await User.findOne({nombre}).select("-contrasena");

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile: ", error.message);
		res.status(500).json({ error: error.message });
    }
}

export const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString()) {
			return res.status(400).json({ error: "no puedes seguirte o dejar de seguirte a ti mismo" });

		}

		if (!userToModify || !currentUser) return res.status(400).json({ error: "Usuario no encontrado" });

		const isFollowing = currentUser.seguidos.includes(id);

		if (isFollowing) {
			// Unfollow the user
			await User.findByIdAndUpdate(id, { $pull: { seguidores: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { seguidos: id } });

			res.status(200).json({ message: "Usuario dejado de seguir exitosamente" });
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

		const usersFollowedByMe = await User.findById(userId).select("seguidos");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{ $sample: { size: 10 } },
		]);

		// 1,2,3,4,5,6,
		const filteredUsers = users.filter((user) => !usersFollowedByMe.seguidos.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.contrasena = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		console.log("Error in getSuggestedUsers: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const updateUser = async (req, res) => {
	const { nombre,nombreCompleto, correo,generoLiterarioPreferido, currentcontrasena, newcontrasena, pais, biografia } = req.body;
	let { fotoPerfil, fotoPerfilBan } = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

		if ((!newcontrasena && currentcontrasena) || (!currentcontrasena && newcontrasena)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}

		if (currentcontrasena && newcontrasena) {
			const isMatch = await bcrypt.compare(currentcontrasena, user.contrasena);
			if (!isMatch) return res.status(400).json({ error: "Contraseña anterior incorrecta" });
			if (newcontrasena.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}

			const salt = await bcrypt.genSalt(10);
			user.contrasena = await bcrypt.hash(newcontrasena, salt);
		}

		// Actualizar foto de perfil y foto de banner si es necesario
        if (fotoPerfil) {
            if (user.fotoPerfil) {
                await cloudinary.uploader.destroy(user.fotoPerfil.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(fotoPerfil);
            user.fotoPerfil = uploadedResponse.secure_url;
        }

        if (fotoPerfilBan) {
            if (user.fotoPerfilBan) {
                await cloudinary.uploader.destroy(user.fotoPerfilBan.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(fotoPerfilBan);
            user.fotoPerfilBan = uploadedResponse.secure_url;
        }

        // Buscar los géneros literarios seleccionados
        if (generoLiterarioPreferido && generoLiterarioPreferido.length > 0) {
            const generos = await GeneroLiterario.find({ _id: { $in: generoLiterarioPreferido } });
            if (generos.length !== generoLiterarioPreferido.length) {
                return res.status(400).json({ error: "Some selected literary genres are invalid" });
            }
            user.generoLiterarioPreferido = generos.map(genero => genero._id); // Actualiza los géneros literarios del usuario
        }

        // Actualizar otros campos del usuario
        user.nombre = nombre || user.nombre;
		user.nombreCompleto =nombreCompleto|| user.nombreCompleto;
        user.correo = correo || user.correo;
        user.pais = pais || user.pais;
        user.biografia = biografia || user.biografia;
        user.fotoPerfil =  fotoPerfil || user.fotoPerfil;
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

const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
// Esquema de validación usando Yup
const userValidationSchema = Yup.object().shape({
	nombre: Yup.string()
	  .required('El nombre es obligatorio.')
	  .min(3, 'El nombre debe tener al menos 3 caracteres.')
	  .max(50, 'El nombre no puede tener más de 50 caracteres.')
	  .matches(/^[a-zA-Z0-9]+$/, 'El nombre solo puede contener letras y números.'),
	
	nombreCompleto: Yup.string()
	  .required('El nombre completo es obligatorio.')
	  .min(5, 'El nombre completo debe tener al menos 5 caracteres.')
	  .max(100, 'El nombre completo no puede exceder los 100 caracteres.'),
  
	  correo: Yup.string()
	  .required('El correo es obligatorio.')
	  .email('Formato de correo inválido.')
	  .test('valid-domain', 'Dominio de correo no válido.', (value) => {
		if (!value) return false;
		const domain = value.split('@')[1];
		return validDomains.includes(domain);
	  }),
	contrasena: Yup.string()
	  .required('La contraseña es obligatoria.')
	  .min(8, 'La contraseña debe tener al menos 8 caracteres.')
	  .matches(/[a-z]/, 'La contraseña debe tener al menos una letra minúscula.')
	  .matches(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula.')
	  .matches(/\d/, 'La contraseña debe tener al menos un número.')
	  .matches(/[!@#$%^&*(),.?":{}|<>]/, 'La contraseña debe tener al menos un carácter especial.'),
  
	pais: Yup.string()
	  .required('El país es obligatorio.')
	  .min(3, 'El país debe tener al menos 3 caracteres.')
	  .max(56, 'El país no puede exceder los 56 caracteres.')
  });
  


  {/*metodos para el admin*/}
  // Crear un nuevo usuario
// Crear un nuevo usuario
export const crearUser = async (req, res) => {
	try {
	  const { nombre, nombreCompleto, correo, contrasena, pais, roles } = req.body;
  
	  // Validación con Yup
	  await userValidationSchema.validate(req.body, { abortEarly: false });
  
	  // Verificar si el nombre de usuario ya existe
	  const existingUser = await User.findOne({ nombre });
	  if (existingUser) {
		return res.status(400).json({ error: 'El nombre de usuario ya existe.' });
	  }
  
	  // Verificar si el correo ya existe
	  const existingEmail = await User.findOne({ correo });
	  if (existingEmail) {
		return res.status(400).json({ error: 'El correo ya está registrado.' });
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
		roles, // Asignar roles como corresponda
	  });
  
	  // Guardar el usuario
	  await newUser.save();
  
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
		message: "Usuario creado con éxito", // Mensaje opcional
	  });
	} catch (error) {
	  if (error.name === 'ValidationError') {
		// Error de validación de Yup
		return res.status(400).json({ error: error.errors.join(', ') });
	  }
	  console.error("Error in signup controller:", error.message);
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
	  const userId = req.params.id;
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
	try {
	  const userId = req.params.id;
	  const actualizaciones = req.body;
  
	  const usuarioActualizado = await User.findByIdAndUpdate(userId, actualizaciones, {
		new: true,
	  });
  
	  if (!usuarioActualizado) {
		return res.status(404).json({ error: "Usuario no encontrado" });
	  }
  
	  res.status(200).json({ message: "Usuario actualizado con éxito", usuarioActualizado });
	} catch (error) {
	  res.status(500).json({ error: "Error al actualizar usuario" });
	}
  };
  
  // Activar o desactivar usuario (cambiar el estado)
export const cambiarEstadoUsuario = async (req, res) => {
	try {
	  const userId = req.params.id;
	  const { nuevoEstado } = req.body; // { nuevoEstado: true/false }
  
	  const usuarioActualizado = await User.findByIdAndUpdate(userId, { estado: nuevoEstado }, { new: true });
  
	  if (!usuarioActualizado) {
		return res.status(404).json({ error: "Usuario no encontrado" });
	  }
  
	  const mensaje = nuevoEstado ? "Usuario activado con éxito" : "Usuario desactivado con éxito";
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
  