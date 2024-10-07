import express from 'express';
import { protectRoutes } from '../middleware/protectRoutes.js';
import { crearResena, obtenerResena ,obtenerResenasAct, obtenerResenasDes, obtenerResenaPorId,editarResena,desactivarResena,activarResena,eliminarResena } from '../controllers/resena.controller.js';

const router =express.Router();

router.post("/resenas", protectRoutes, crearResena);
router.get("/getresenas", protectRoutes, obtenerResena);
router.get("/getresenasact", protectRoutes, obtenerResenasAct);
router.get("/getresenasdes", protectRoutes, obtenerResenasDes);
router.get("/getresenas/:id", protectRoutes, obtenerResenaPorId);
router.put("/putresenas/:id", protectRoutes, editarResena);
router.put("/desresenas/:id", protectRoutes, desactivarResena);
router.put("/actresenas/:id", protectRoutes, activarResena);
router.delete("/deleteresenas/:id", protectRoutes, eliminarResena);

export default router;