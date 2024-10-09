import Autor from "../models/autor.model.js";
import Comunidad from "../models/comunidad.model.js";
import Libro from "../models/libro.model.js";
import User from "../models/user.model.js";


export const obtenerRecomendacionLibros = async (req, res) => {
    try {
        const userId = req.user._id;
        const usuario = await User.findById(userId).populate('generoLiterarioPreferido');

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        const generosPreferidos = usuario.generoLiterarioPreferido.map(g => g._id);
        const librosRecomendados = await Libro.find({ generos: { $in: generosPreferidos } }).populate('autores');

        return res.status(200).json(librosRecomendados);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener recomendaciones de libros." });
    }
};


export const obtenerRecomendacionAutores = async (req, res) => {
    try {
        const userId = req.user._id;
        const usuario = await User.findById(userId).populate('generoLiterarioPreferido');

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        const generosPreferidos = usuario.generoLiterarioPreferido.map(g => g._id);
        const libros = await Libro.find({ generos: { $in: generosPreferidos } });
        const autoresRecomendados = await Autor.find({ librosReconocidos: { $in: libros.map(libro => libro._id) } });

        return res.status(200).json(autoresRecomendados);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener recomendaciones de autores." });
    }
};


export const obtenerRecomendacionComunidades = async (req, res) => {
    try {
        const userId = req.user._id;
        const comunidadesRecomendadas = await Comunidad.find({ miembros: userId });

        return res.status(200).json(comunidadesRecomendadas);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener recomendaciones de comunidades." });
    }
};

