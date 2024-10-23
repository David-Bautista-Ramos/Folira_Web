import express from "express";
import { eliminarLibroGuardado, guardarLibro, obtenerLibrosGuardados } from '../controllers/librosGurdados.controller.js';
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = express.Router();

// Ruta para guardar un libro en la lista de guardados
router.post('/guardar-libro',protectRoutes, guardarLibro);

// Ruta para obtener la lista de libros guardados de un usuario
router.get('/libros-guardados/:userId',protectRoutes, obtenerLibrosGuardados);

// Ruta para eliminar un libro guardado
router.delete('/eliminar-libro', eliminarLibroGuardado);

export default router;
