import express from 'express';
import {activar, actualizarUsuario, cambiarEstadoUsuario, crearUser, desactivar, eliminarUsuario, followUnfollowUser, getSuggestedUsers, getUserProfile, obtenerUsuarioPorId, obtenerUsuarios, updateUser} from '../controllers/user.controller.js'
import { protectRoutes } from '../middleware/protectRoutes.js';

const router =express.Router();

router.get("/profile/:nombre",protectRoutes,getUserProfile);
router.get("/sugerencias",protectRoutes,getSuggestedUsers);
router.post("/follow/:id",protectRoutes,followUnfollowUser);
router.post("/upadte",protectRoutes,updateUser);
router.post("/estadoDes/:id",protectRoutes,desactivar);
router.post("/estadoAct/:id",protectRoutes,activar);

//ADMIN
router.post("/createUser",protectRoutes,crearUser);
router.get("/allUsers",protectRoutes,obtenerUsuarios);
router.get("/user/:id",protectRoutes,obtenerUsuarioPorId);
router.post("/upadateUsers/:id",protectRoutes,actualizarUsuario);
router.post("/estados/:id",protectRoutes,cambiarEstadoUsuario);
router.delete("/delete/:id",protectRoutes,eliminarUsuario);

export default router;