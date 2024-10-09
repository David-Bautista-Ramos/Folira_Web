import express from "express";
import { guardarLibro, obtenerLibrosGuardados } from '../controllers/librosGurdados.controller.js';
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = express.Router();

// Ruta para guardar un libro en la lista de guardados
router.post('/guardar-libro',protectRoutes, guardarLibro);

// Ruta para obtener la lista de libros guardados de un usuario
router.get('/libros-guardados/:userId',protectRoutes, obtenerLibrosGuardados);

export default router;
