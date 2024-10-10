import mongoose from "mongoose";
import Libro from "../models/libro.model.js";
<<<<<<< HEAD
import Autor from "../models/autor.model.js";
import GeneroLiterario from "../models/generoLiterario.model.js";

=======
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
export const crearLibro = async (req, res) => {
    try {
        const { titulo, ISBN, fechaPublicacion, editorial, sinopsis, portada, calificacion, generos, autores } = req.body;

        // Verificar si el ISBN ya existe
        const libroExistente = await Libro.findOne({ ISBN });
        if (libroExistente) {
            return res.status(400).json({ error: "El libro con este ISBN ya existe." });
        }

<<<<<<< HEAD
        // Verificar que los géneros y autores sean arrays y no estén vacíos
        if (!Array.isArray(generos) || generos.length === 0) {
            return res.status(400).json({ error: "El campo 'generos' debe ser un array no vacío." });
        }
        if (!Array.isArray(autores) || autores.length === 0) {
            return res.status(400).json({ error: "El campo 'autores' debe ser un array no vacío." });
        }

        // Verificar que los géneros literarios seleccionados existen en la base de datos
        const generosDB = await GeneroLiterario.find({ _id: { $in: generos } });
        if (generosDB.length !== generos.length) {
            return res.status(400).json({ error: "Algunos géneros seleccionados son inválidos." });
        }

        // Verificar que los autores seleccionados existen en la base de datos
        const autoresDB = await Autor.find({ _id: { $in: autores } });
        if (autoresDB.length !== autores.length) {
            return res.status(400).json({ error: "Algunos autores seleccionados son inválidos." });
        }

        // Convertir géneros y autores a ObjectId
        const generosObjectIds = generosDB.map(genero => genero._id);
        const autoresObjectIds = autoresDB.map(autor => autor._id);

        // Crear el nuevo libro
=======
        // Verificar que generos y autores sean arrays
        if (!Array.isArray(generos)) {
            return res.status(400).json({ error: "El campo 'generos' debe ser un array." });
        }
        if (!Array.isArray(autores)) {
            return res.status(400).json({ error: "El campo 'autores' debe ser un array." });
        }

        // Convertir géneros y autores a ObjectId
        const generosObjectIds = generos.map(id => new mongoose.Types.ObjectId(id));
        const autoresObjectIds = autores.map(id => new mongoose.Types.ObjectId(id));

>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
        const nuevoLibro = new Libro({
            titulo,
            ISBN,
            fechaPublicacion,
            editorial,
            sinopsis,
            portada,
            calificacion,
            generos: generosObjectIds,
            autores: autoresObjectIds
        });

        // Guardar el libro en la base de datos
        await nuevoLibro.save();
        res.status(201).json({ message: "Libro creado con éxito", libro: nuevoLibro });
    } catch (error) {
        console.error("Error al crear el libro:", error.message);
        res.status(500).json({ error: "Error al crear el libro." });
    }
};

export const obtenerLibro = async (req, res) => {
    try {
        const libros = await Libro.find().populate('generos').populate('autores');
        res.status(200).json(libros);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

// Obtener todos los libros activos
export const obtenerLibrosAct = async (req, res) => {
    try {
        const estado = true;

        const libros = await Libro.find({ estado: estado }).populate('generos autores');
        res.status(200).json({ libros });
    } catch (error) {
        console.error("Error al obtener los libros:", error.message);
        res.status(500).json({ error: "Error al obtener los libros." });
    }
};

export const obtenerLibrosDes = async (req, res) => {
    try {
        const estado = false;

        const libros = await Libro.find({ estado: estado }).populate('generos autores');
        res.status(200).json({ libros });
    } catch (error) {
        console.error("Error al obtener los libros:", error.message);
        res.status(500).json({ error: "Error al obtener los libros." });
    }
};

// Obtener un libro por su ID
export const obtenerLibroPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const libro = await Libro.findById(id).populate('generos autores');
        if (!libro) {
            return res.status(404).json({ error: "Libro no encontrado." });
        }
        res.status(200).json({ libro });
    } catch (error) {
        console.error("Error al obtener el libro:", error.message);
        res.status(500).json({ error: "Error al obtener el libro." });
    }
};

// Editar un libro existente
export const editarLibro = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, ISBN, fechaPublicacion, editorial, sinopsis, portada, calificacion, generos, autores, estado } = req.body;

        const libroActualizado = await Libro.findByIdAndUpdate(
            id, 
            { titulo, ISBN, fechaPublicacion, editorial, sinopsis, portada, calificacion, generos, autores, estado }, 
            { new: true, runValidators: true }
        );

        if (!libroActualizado) {
            return res.status(404).json({ error: "Libro no encontrado." });
        }

        res.status(200).json({ message: "Libro actualizado con éxito", libro: libroActualizado });
    } catch (error) {
        console.error("Error al actualizar el libro:", error.message);
        res.status(500).json({ error: "Error al actualizar el libro." });
    }
};

// Desactivar un libro
export const desactivarLibro = async (req, res) => {
    try {
        const { id } = req.params;
        const libroActualizado = await Libro.findByIdAndUpdate(id, { estado: false }, { new: true });

        if (!libroActualizado) {
            return res.status(404).json({ error: "Libro no encontrado." });
        }

        res.status(200).json({ message: "Libro desactivado con éxito", libro: libroActualizado });
    } catch (error) {
        console.error("Error al desactivar el libro:", error.message);
        res.status(500).json({ error: "Error al desactivar el libro." });
    }
};

// Activar un libro
export const activarLibro = async (req, res) => {
    try {
        const { id } = req.params;
        const libroActualizado = await Libro.findByIdAndUpdate(id, { estado: true }, { new: true });

        if (!libroActualizado) {
            return res.status(404).json({ error: "Libro no encontrado." });
        }

        res.status(200).json({ message: "Libro activado con éxito", libro: libroActualizado });
    } catch (error) {
        console.error("Error al activar el libro:", error.message);
        res.status(500).json({ error: "Error al activar el libro." });
    }
};

// Eliminar un libro
export const eliminarLibro = async (req, res) => {
    try {
        const { id } = req.params;
        const libroEliminado = await Libro.findByIdAndDelete(id);

        if (!libroEliminado) {
            return res.status(404).json({ error: "Libro no encontrado." });
        }

        res.status(200).json({ message: "Libro eliminado con éxito", libro: libroEliminado });
    } catch (error) {
        console.error("Error al eliminar el libro:", error.message);
        res.status(500).json({ error: "Error al eliminar el libro." });
    }
};
