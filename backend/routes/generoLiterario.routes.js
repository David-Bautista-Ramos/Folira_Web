import express from 'express';
import {
    crearGenero,
    editarGenero,
    desactivarGenero,
    activarGenero,
    eliminarGenero,
    obtenerGenerosAct,
    obtenerGenerosDes,
    obtenerGeneros,
  } from '../controllers/generoLiterario.controller.js';
import { protectRoutes } from "../middleware/protectRoutes.js";
  
const router = express.Router();
  
router.post('/generos',protectRoutes ,crearGenero); // Crear
router.get('/getgeneros',protectRoutes,obtenerGeneros);
router.get('/generosact', protectRoutes, obtenerGenerosAct); // Obtener todos activos
router.get('/generosdes',protectRoutes, obtenerGenerosDes); // Obtener todos inactivos
router.put('/updgeneros/:id',protectRoutes, editarGenero); // Editar
router.put('/generos/desactivar/:id',protectRoutes, desactivarGenero); // Desactivar
router.put('/generos/activar/:id',protectRoutes, activarGenero); // Activar
router.delete('/elimgeneros/:id', protectRoutes, eliminarGenero); // Eliminar físicamente

export default router;