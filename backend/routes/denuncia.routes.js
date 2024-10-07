import express from "express";
import { activarDenuncia, crearDenuncia, desactivarDenuncia, editarDenuncia, eliminarDenuncia, obtenerDenunciaPorId, obtenerDenuncias, obtenerDenunciasAct, obtenerDenunciasDes} from '../controllers/denuncia.controller.js'
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = express.Router();

router.post("/denuncia",protectRoutes, crearDenuncia );
router.get("/denuncia",protectRoutes, obtenerDenuncias );
router.get("/denunciaact",protectRoutes, obtenerDenunciasAct );
router.get("/denunciades",protectRoutes, obtenerDenunciasDes );
router.get("/denuncia/:id",protectRoutes, obtenerDenunciaPorId );
router.put("/denuncia/:id",protectRoutes, editarDenuncia );
router.put("/denunciades/:id",protectRoutes, desactivarDenuncia );
router.put("/denunciaact/:id",protectRoutes, activarDenuncia );
router.delete("/denuncia/:id",protectRoutes, eliminarDenuncia );

export default router;