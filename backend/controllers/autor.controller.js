import Autor from "../models/autor.model.js";
import cloudinary from "cloudinary";

// Crear un nuevo autor
// Crear un nuevo autor
export const crearAutor = async (req, res) => {
  try {
    const {
      nombre,
      seudonimo,
      fechaNacimiento,
      pais,
      biografia,
      distinciones,
      generoLiterarioPreferido,
    } = req.body;
    let { fotoAutor } = req.body;

    // Verificar si ya existe un autor con el mismo nombre
    const autorExistente = await Autor.findOne({ nombre });
    if (autorExistente) {
      return res.status(400).json({ error: "El autor ya existe." });
    }

    // Manejar la subida de la foto del autor, si existe
    let fotoAutorUrl = null;
    if (fotoAutor) {
      const uploadedResponse = await cloudinary.uploader.upload(fotoAutor);
      fotoAutorUrl = uploadedResponse.secure_url;
    }

    // Verificar los géneros literarios seleccionados
    let generosSeleccionados = [];
    if (generoLiterarioPreferido && generoLiterarioPreferido.length > 0) {
      const generos = await GeneroLiterario.find({
        _id: { $in: generoLiterarioPreferido },
      });
      if (generos.length !== generoLiterarioPreferido.length) {
        return res
          .status(400)
          .json({
            error: "Algunos géneros literarios seleccionados son inválidos.",
          });
      }
      generosSeleccionados = generos.map((genero) => genero._id); // Obtener los IDs de los géneros literarios
    }

    // Crear el nuevo autor
    const nuevoAutor = new Autor({
      nombre,
      seudonimo,
      fechaNacimiento,
      pais,
      biografia,
      fotoAutor: fotoAutorUrl, // Guardar la URL de la foto subida
      distinciones,
      generoLiterarioPreferido: generosSeleccionados, // Asociar géneros literarios
    });

    // Guardar el autor en la base de datos
    await nuevoAutor.save();
    res
      .status(201)
      .json({ message: "Autor creado con éxito", autor: nuevoAutor });
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
export const obtenerAutoresActUser = async (req, res) => {
  try {
    const estado = true;

    const autores = await Autor.find({ estado: estado });
    res.status(200).json({autores});
  } catch (error) {
    console.error("Error al obtener los autores:", error.message);
    res.status(500).json({ error: "Error al obtener los autores." });
  }
};

// Obtener todos los autores (activos o inactivos)
export const obtenerAutoresAct = async (req, res) => {
  try {
    const estado = true;

    const autores = await Autor.find({ estado: estado });
    res.status(200).json(autores);
  } catch (error) {
    console.error("Error al obtener los autores:", error.message);
    res.status(500).json({ error: "Error al obtener los autores." });
  }
};
export const obtenerAutoresDes = async (req, res) => {
  try {
    const estado = false;

    const autores = await Autor.find({ estado: estado });
    res.status(200).json(autores);
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

    res.status(200).json(autor);
  } catch (error) {
    console.error("Error al obtener el autor:", error.message);
    res.status(500).json({ error: "Error al obtener el autor." });
  }
};

// Editar un autor
// Editar un autor
export const editarAutor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      seudonimo,
      fechaNacimiento,
      pais,
      biografia,
      distinciones,
      generoLiterarioPreferido,
    } = req.body;
    let { fotoAutor } = req.body;

    // Buscar el autor por ID
    const autorExistente = await Autor.findById(id);
    if (!autorExistente) {
      return res.status(404).json({ error: "Autor no encontrado." });
    }

    // Manejo de la foto
    if (fotoAutor) {
      if (autorExistente.fotoAutor) {
        // Eliminar la imagen anterior de Cloudinary
        await cloudinary.uploader.destroy(
          autorExistente.fotoAutor.split("/").pop().split(".")[0]
        );
      }
      // Subir la nueva imagen
      const uploadedResponse = await cloudinary.uploader.upload(fotoAutor);
      fotoAutor = uploadedResponse.secure_url;
    } else {
      // Si no se actualiza la imagen, conservar la anterior
      fotoAutor = autorExistente.fotoAutor;
    }

    // Verificar los géneros literarios seleccionados
    let generosSeleccionados = [];
    if (generoLiterarioPreferido && generoLiterarioPreferido.length > 0) {
      const generos = await GeneroLiterario.find({
        _id: { $in: generoLiterarioPreferido },
      });
      if (generos.length !== generoLiterarioPreferido.length) {
        return res
          .status(400)
          .json({
            error: "Algunos géneros literarios seleccionados son inválidos.",
          });
      }
      generosSeleccionados = generos.map((genero) => genero._id); // Obtener los IDs de los géneros literarios
    } else {
      generosSeleccionados = autorExistente.generoLiterarioPreferido; // Mantener los géneros actuales si no se cambian
    }

    // Actualizar el autor con los nuevos datos
    const autorActualizado = await Autor.findByIdAndUpdate(
      id,
      {
        nombre,
        seudonimo,
        fechaNacimiento,
        pais,
        biografia,
        fotoAutor,
        distinciones,
        generoLiterarioPreferido: generosSeleccionados,
      },
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .json({
        message: "Autor actualizado con éxito",
        autor: autorActualizado,
      });
  } catch (error) {
    console.error("Error al actualizar el autor:", error.message);
    res.status(500).json({ error: "Error al actualizar el autor." });
  }
};

// Desactivar un autor
export const desactivarAutor = async (req, res) => {
  try {
    const { id } = req.params;

    const autorActualizado = await Autor.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    if (!autorActualizado) {
      return res.status(404).json({ error: "Autor no encontrado." });
    }

    res
      .status(200)
      .json({
        message: "Autor desactivado con éxito",
        autor: autorActualizado,
      });
  } catch (error) {
    console.error("Error al desactivar el autor:", error.message);
    res.status(500).json({ error: "Error al desactivar el autor." });
  }
};

// Activar un autor
export const activarAutor = async (req, res) => {
  try {
    const { id } = req.params;

    const autorActualizado = await Autor.findByIdAndUpdate(
      id,
      { estado: true },
      { new: true }
    );

    if (!autorActualizado) {
      return res.status(404).json({ error: "Autor no encontrado." });
    }

    res
      .status(200)
      .json({ message: "Autor activado con éxito", autor: autorActualizado });
  } catch (error) {
    console.error("Error al activar el autor:", error.message);
    res.status(500).json({ error: "Error al activar el autor." });
  }
};

// Eliminar un autor
export const eliminarAutor = async (req, res) => {
  try {
    const id = req.params.id;

    const autorEliminado = await Autor.findByIdAndDelete(id);

    if (!autorEliminado) {
      return res.status(404).json({ error: "Autor no encontrado." });
    }

    res
      .status(200)
      .json({ message: "Autor eliminado con éxito", autor: autorEliminado });
  } catch (error) {
    console.error("Error al eliminar el autor:", error.message);
    res.status(500).json({ error: "Error al eliminar el autor." });
  }
};
