import express from "express";
import { obtenerRecomendacionAutores, obtenerRecomendacionComunidades, obtenerRecomendacionLibros} from '../controllers/recomendaciones.controller.js';
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = express.Router();

router.get('/recomendaciones/libros',protectRoutes, obtenerRecomendacionLibros);
router.get('/recomendaciones/autores', protectRoutes, obtenerRecomendacionAutores);
router.get('/recomendaciones/comunidades',protectRoutes, obtenerRecomendacionComunidades);

export default router;