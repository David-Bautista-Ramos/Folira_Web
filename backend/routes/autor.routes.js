import express from 'express';
import { protectRoutes } from '../middleware/protectRoutes.js';
import { activarAutor, crearAutor, desactivarAutor, editarAutor, eliminarAutor, obtenerAutores, obtenerAutoresAct, obtenerAutoresDes, obtenerAutorPorId } from '../controllers/autor.controller.js';

const router =express.Router();

router.post("/autores", protectRoutes, crearAutor);
router.get("/autores", protectRoutes, obtenerAutores);
router.get("/autoresdes", protectRoutes, obtenerAutoresDes);
router.get("/autoresact", protectRoutes, obtenerAutoresAct);
<<<<<<< HEAD
router.get("/autores/:id", protectRoutes, obtenerAutorPorId);
=======
router.get("/autoresid/:id", protectRoutes, obtenerAutorPorId);
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
router.put("/autores/:id", protectRoutes, editarAutor);
router.put("/autoresdes/:id", protectRoutes, desactivarAutor);
router.put("/autoresact/:id", protectRoutes, activarAutor);
router.delete("/deleteautores/:id", protectRoutes, eliminarAutor);

export default router;