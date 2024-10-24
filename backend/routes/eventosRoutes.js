import express from 'express';
import { registrarEvento } from '../controllers/constaryEntregarInsig.js'; // Asegúrate de que la ruta sea correcta
import { protectRoutes } from '../middleware/protectRoutes.js';

const router = express.Router();


router.post('/eventos',protectRoutes, registrarEvento); // Registrar evento de usuario

export default router;