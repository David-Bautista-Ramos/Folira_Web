import GeneroLiterario from "../models/generoLiterario.model.js";


export const crearGenero = async (req, res) => {
    try {
      const { nombre, descripcion, fotoGenero } = req.body;
  
      // Verificar si ya existe un género literario con el mismo nombre
      const generoExistente = await GeneroLiterario.findOne({ nombre });
      if (generoExistente) {
        return res.status(400).json({ error: 'El género literario ya existe.' });
      }
  
      const nuevoGenero = new GeneroLiterario({
        nombre,
        descripcion,
        fotoGenero
      });
  
      // Guardar el género literario en la base de datos
      await nuevoGenero.save();
      res.status(201).json({ message: "Género literario creado con éxito", genero: nuevoGenero });
    } catch (error) {
      console.error("Error al crear el género literario:", error.message);
      res.status(500).json({ error: "Error al crear el género literario." });
    }
 };

export const obtenerGeneros = async(req, res) => {
  try {
    const generos = await GeneroLiterario.find();
    res.status(200).json(generos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerGenerosAct = async (req, res) => {
    try {
        const estado = true;
        
        const generos = await GeneroLiterario.find({ estado: estado });
        res.status(200).json({ generos });
    } catch (error) {
        console.error("Error al obtener los géneros literarios:", error.message);
        res.status(500).json({ error: "Error al obtener los géneros literarios." });
    }
 };

 export const obtenerGenerosDes = async (req, res) => {
  try {
      const estado = false; // O 0 si el campo `estado` está guardado como 0/1 en lugar de true/false

      // Filtrar por el campo `estado`
      const generos = await GeneroLiterario.find({ estado: estado });
      res.status(200).json({ generos });
  } catch (error) {
      console.error("Error al obtener los géneros literarios:", error.message);
      res.status(500).json({ error: "Error al obtener los géneros literarios." });
  }
};

export const editarGenero = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, fotoGenero } = req.body;
  
      const generoActualizado = await GeneroLiterario.findByIdAndUpdate(id, { nombre, descripcion, fotoGenero }, { new: true, runValidators: true });
  
      if (!generoActualizado) {
        return res.status(404).json({ error: "Género literario no encontrado." });
      }
  
      res.status(200).json({ message: "Género literario actualizado con éxito", genero: generoActualizado });
    } catch (error) {
      console.error("Error al editar el género literario:", error.message);
      res.status(500).json({ error: "Error al editar el género literario." });
    }
 };

export const desactivarGenero = async (req, res) => {
    try {
      const { id } = req.params;
  
      const generoActualizado = await GeneroLiterario.findByIdAndUpdate(id, { estado: false }, { new: true });
  
      if (!generoActualizado) {
        return res.status(404).json({ error: "Género literario no encontrado." });
      }
  
      res.status(200).json({ message: "Género literario desactivado con éxito", genero: generoActualizado });
    } catch (error) {
      console.error("Error al desactivar el género literario:", error.message);
      res.status(500).json({ error: "Error al desactivar el género literario." });
    }
 };

export const activarGenero = async (req, res) => {
    try {
      const { id } = req.params;
  
      const generoActualizado = await GeneroLiterario.findByIdAndUpdate(id, { estado: true }, { new: true });
  
      if (!generoActualizado) {
        return res.status(404).json({ error: "Género literario no encontrado." });
      }
  
      res.status(200).json({ message: "Género literario activado con éxito", genero: generoActualizado });
    } catch (error) {
      console.error("Error al activar el género literario:", error.message);
      res.status(500).json({ error: "Error al activar el género literario." });
    }
 };  

export const eliminarGenero = async (req, res) => {
    try {
      const { id } = req.params;
  
      const generoEliminado = await GeneroLiterario.findByIdAndDelete(id);
  
      if (!generoEliminado) {
        return res.status(404).json({ error: "Género literario no encontrado." });
      }
  
      res.status(200).json({ message: "Género literario eliminado con éxito", genero: generoEliminado });
    } catch (error) {
      console.error("Error al eliminar el género literario:", error.message);
      res.status(500).json({ error: "Error al eliminar el género literario." });
    }
 };
  