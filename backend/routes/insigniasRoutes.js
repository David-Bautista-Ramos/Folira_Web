import express from 'express';
import { protectRoutes } from "../middleware/protectRoutes.js";
import { actualizarInsignia, crearInsignia, eliminarInsignia, obtenerInsignias } from '../controllers/insigniasController.js'; // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Rutas para las insignias
router.post('/insignias',protectRoutes, crearInsignia); // Crear insignia
router.get('/insignias',protectRoutes, obtenerInsignias); // Obtener todas las insignias
router.put('/insignias/:id',protectRoutes, actualizarInsignia); // Actualizar insignia por ID
router.delete('/insignias/:id',protectRoutes, eliminarInsignia); // Eliminar insignia por ID

export default router;
