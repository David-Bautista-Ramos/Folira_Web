import express from "express";
import { protectRoutes } from "../middleware/protectRoutes.js";
import { crearNotificacion, deleteNotifications, deteteNotification, eliminarNotificacion, getNotifications, marcarNotificacionLeida, obtenerNotificaciones, obtenerNotificacionesNoLeidas, obtenerTodasNotificaciones } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoutes, getNotifications);
router.delete("/", protectRoutes, deleteNotifications);
router.delete("/notificacion/:notificationId", protectRoutes, deteteNotification);

{ /*ADMIN*/ }
router.post("/notifi", protectRoutes, crearNotificacion);
router.get("/notifi", protectRoutes, obtenerTodasNotificaciones);
router.get("/notifi/:para", protectRoutes, obtenerNotificaciones);
router.put("/notifi/:id", protectRoutes, marcarNotificacionLeida);
router.get("/notifinole/:para", protectRoutes, obtenerNotificacionesNoLeidas);
router.delete("/notifi/:id", protectRoutes, eliminarNotificacion);


export default router;