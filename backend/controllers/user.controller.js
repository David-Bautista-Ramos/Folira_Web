import GeneroLiterario from "../models/generoLiterario.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";
import bcrypt from "bcryptjs";

export const getUserProfile =async (req, res) =>{
    const {correo} = req.params;

    try {
        const user = await User.findOne({correo}).select("-contrasena");

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
	const { nombre, correo,generoLiterarioPreferido, currentcontrasena, newcontrasena, pais, biografia } = req.body;
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