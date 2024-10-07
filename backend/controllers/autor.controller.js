import Autor from "../models/autor.model.js";

// Crear un nuevo autor
export const crearAutor = async (req, res) => {
    try {
        const { nombre, seudonimo, fechaNacimiento, pais, biografia, fotoAutor, distinciones } = req.body;

        // Verificar si ya existe un autor con el mismo nombre
        const autorExistente = await Autor.findOne({ nombre });
        if (autorExistente) {
            return res.status(400).json({ error: 'El autor ya existe.' });
        }

        const nuevoAutor = new Autor({
            nombre,
            seudonimo,
            fechaNacimiento,
            pais,
            biografia,
            fotoAutor,
            distinciones,
        });

        // Guardar el autor en la base de datos
        await nuevoAutor.save();
        res.status(201).json({ message: "Autor creado con éxito", autor: nuevoAutor });
    } catch (error) {
        console.error("Error al crear el autor:", error.message);
        res.status(500).json({ error: "Error al crear el autor." });
    }
};

export const obtenerAutores = async (req, res) => {
    try {
        const autores = await Autor.find();
        res.status(200).json(autores);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

// Obtener todos los autores (activos o inactivos)
export const obtenerAutoresAct = async (req, res) => {
    try {
        const estado = true;

        const autores = await Autor.find({ estado: estado });
        res.status(200).json({ autores });
    } catch (error) {
        console.error("Error al obtener los autores:", error.message);
        res.status(500).json({ error: "Error al obtener los autores." });
    }
};
export const obtenerAutoresDes = async (req, res) => {
    try {
        const estado = false;

        const autores = await Autor.find({ estado: estado });
        res.status(200).json({ autores });
    } catch (error) {
        console.error("Error al obtener los autores:", error.message);
        res.status(500).json({ error: "Error al obtener los autores." });
    }
};
// Obtener un autor por su ID
export const obtenerAutorPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const autor = await Autor.findById(id);
        if (!autor) {
            return res.status(404).json({ error: "Autor no encontrado." });
        }

        res.status(200).json({ autor });
    } catch (error) {
        console.error("Error al obtener el autor:", error.message);
        res.status(500).json({ error: "Error al obtener el autor." });
    }
};

// Editar un autor
export const editarAutor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, seudonimo, fechaNacimiento, pais, biografia, fotoAutor, distinciones } = req.body;

        const autorActualizado = await Autor.findByIdAndUpdate(id, { nombre, seudonimo, fechaNacimiento, pais, biografia, fotoAutor, distinciones }, { new: true, runValidators: true });

        if (!autorActualizado) {
            return res.status(404).json({ error: "Autor no encontrado." });
        }

        res.status(200).json({ message: "Autor actualizado con éxito", autor: autorActualizado });
    } catch (error) {
        console.error("Error al actualizar el autor:", error.message);
        res.status(500).json({ error: "Error al actualizar el autor." });
    }
};

// Desactivar un autor
export const desactivarAutor = async (req, res) => {
    try {
        const { id } = req.params;

        const autorActualizado = await Autor.findByIdAndUpdate(id, { estado: false }, { new: true });

        if (!autorActualizado) {
            return res.status(404).json({ error: "Autor no encontrado." });
        }

        res.status(200).json({ message: "Autor desactivado con éxito", autor: autorActualizado });
    } catch (error) {
        console.error("Error al desactivar el autor:", error.message);
        res.status(500).json({ error: "Error al desactivar el autor." });
    }
};

// Activar un autor
export const activarAutor = async (req, res) => {
    try {
        const { id } = req.params;

        const autorActualizado = await Autor.findByIdAndUpdate(id, { estado: true }, { new: true });

        if (!autorActualizado) {
            return res.status(404).json({ error: "Autor no encontrado." });
        }

        res.status(200).json({ message: "Autor activado con éxito", autor: autorActualizado });
    } catch (error) {
        console.error("Error al activar el autor:", error.message);
        res.status(500).json({ error: "Error al activar el autor." });
    }
};

// Eliminar un autor
export const eliminarAutor = async (req, res) => {
    try {
        const { id } = req.params;

        const autorEliminado = await Autor.findByIdAndDelete(id);

        if (!autorEliminado) {
            return res.status(404).json({ error: "Autor no encontrado." });
        }

        res.status(200).json({ message: "Autor eliminado con éxito", autor: autorEliminado });
    } catch (error) {
        console.error("Error al eliminar el autor:", error.message);
        res.status(500).json({ error: "Error al eliminar el autor." });
    }
};
