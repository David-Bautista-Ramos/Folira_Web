import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    try {
        const{nombre, correo, contrasena, pais,roles} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
			return res.status(400).json({ error: "Formato del correo invalido" });
		}

        const existingUser = await User.findOne({ nombre });
		if (existingUser) {
			return res.status(400).json({ error: "nombre de usuario ya existe" });

		}

		const existingEmail = await User.findOne({ correo });
		if (existingEmail) {
			return res.status(400).json({ error: "correo ya existente" });
		}

		if (contrasena.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(contrasena, salt);

        const newUser =new User({
            nombre ,
            correo ,
            contrasena: hashedPassword,
            pais,
            roles,
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
                _id: newUser._id,
                nombre: newUser.nombre,
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
        }else{
            res.status(400).json({error:"Datos de usuario invalidos"})
        }
    
    } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({error:"Datos de usuario invalidos"});
    }
}

export const login = async (req, res) => {
    try {

        const {correo, contrasena} = req.body;
        const user =await User.findOne({correo});
        const isPasswordCorrect = await bcrypt.compare(contrasena, user?.contrasena || "" )

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"correo o contraseña incorreactos "})
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            nombre: user.nombre,
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
        console.log("Error in login controller",error.message);
        res.status(500).json({error:"Datos de usuario invalidos"});
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Sesion cerrada con exito"})
    } catch (error) {
        console.log("Error en logout controller",error.message);
        res.status(500).json({error:"error Interno"})
    }
}
export const getMe =async(req, res) => {
    try {
        const user = await  User.findById(req.user._id).select("-contrasena")
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in el getMe controller",error.message);
        res.status(500).json({error:"Error interno server"})
    }
}