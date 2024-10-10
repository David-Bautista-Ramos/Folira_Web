import express from "express";
<<<<<<< HEAD
import { guardarLibro, obtenerLibrosGuardados } from '../controllers/librosGurdados.controller.js';
=======
import { guardarLibro, obtenerLibrosGuardados } from '../controllers/librosGuardados.controller.js'
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = express.Router();

// Ruta para guardar un libro en la lista de guardados
router.post('/guardar-libro',protectRoutes, guardarLibro);

// Ruta para obtener la lista de libros guardados de un usuario
router.get('/libros-guardados/:userId',protectRoutes, obtenerLibrosGuardados);

export default router;
