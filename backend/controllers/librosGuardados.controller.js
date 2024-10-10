import Libro from "../models/libro.model.js";
import User from "../models/user.model.js";

// 1. Controlador para guardar un libro en la lista de libros guardados del usuario
export const guardarLibro = async (req, res) => {
    const { userId, libroId } = req.body; // Recibes el ID del usuario y del libro
  
    try {
      // Verificar si el libro existe
      const libro = await Libro.findById(libroId);
      if (!libro) {
        return res.status(404).json({ message: 'El libro no existe' });
      }
  
      // Actualizar la lista de libros guardados del usuario
      const usuario = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { librosGuardados: libroId } }, // $addToSet evita duplicados
        { new: true }
      );
  
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json({ message: 'Libro guardado con éxito', usuario });
    } catch (error) {
      res.status(500).json({ message: 'Error al guardar el libro', error });
    }
  };
  
  // 2. Controlador para obtener la lista de libros guardados por el usuario
export const obtenerLibrosGuardados = async (req, res) => {
    const { userId } = req.params; // Recibes el ID del usuario
  
    try {
      // Encontrar al usuario y poblar el array de libros guardados
      const usuario = await User.findById(userId)
        .populate('librosGuardados') // Popular para obtener los detalles completos de los libros
        .exec();
  
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json({ librosGuardados: usuario.librosGuardados });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los libros guardados', error });
    }
  };