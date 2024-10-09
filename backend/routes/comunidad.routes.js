import express from "express";
import { protectRoutes } from "../middleware/protectRoutes.js";
import { activarComunidad, crearComunidad, desactivarComunidad, editarComunidad, eliminarComunidad, obtenerComunidades, obtenerComunidadesAct, obtenerComunidadesDes, obtenerComunidadPorId, unirseComunidad } from "../controllers/comunidad.controller.js";

const router = express.Router();

router.post("/comunidad", protectRoutes, crearComunidad);
router.get("/comunidad", protectRoutes, obtenerComunidades);
router.get("/comunidadact", protectRoutes, obtenerComunidadesAct);
router.get("/comunidaddes", protectRoutes, obtenerComunidadesDes);
router.get("/comunidad/:id", protectRoutes, obtenerComunidadPorId);
router.put("/unircomunidad/:comunidadId", protectRoutes, unirseComunidad);
router.put("/putcomunidad/:id", protectRoutes, editarComunidad);
router.put("/comunidaddes/:id", protectRoutes, desactivarComunidad);
router.put("/comunidadact/:id", protectRoutes, activarComunidad);
router.delete("/comunidad/:id", protectRoutes, eliminarComunidad);


export default router;