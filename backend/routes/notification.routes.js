import express from "express";
import { protectRoutes } from "../middleware/protectRoutes.js";
import { crearNotificacion, deleteNotifications, deteteNotification, eliminarNotificacion, getNotifications, marcarNotificacionLeida, marcarNotificacionNoLeida, obtenerNotificaciones, obtenerNotificacionesId, obtenerNotificacionesLeidasAD, obtenerNotificacionesNoLeidas, obtenerNotificacionesNoLeidasAD, obtenerTodasNotificaciones, obtenerUsuarios, updateNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoutes, getNotifications);
router.delete("/", protectRoutes, deleteNotifications);
router.delete("/notificacion/:notificationId", protectRoutes, deteteNotification);

{ /*ADMIN*/ }
router.post("/notifi", protectRoutes, crearNotificacion);
router.get("/allUsers", protectRoutes, obtenerUsuarios);
router.get("/notifi", protectRoutes, obtenerTodasNotificaciones);
router.get("/notifi/:para", protectRoutes, obtenerNotificaciones);
router.put("/notifi/:id", protectRoutes, marcarNotificacionLeida);
router.get("/notifi/:id", protectRoutes, obtenerNotificacionesId);
router.put("/notifino/:id", protectRoutes, marcarNotificacionNoLeida);
router.put("/actuNotifi/:id", protectRoutes,updateNotification)
router.get("/notifinole/:para", protectRoutes, obtenerNotificacionesNoLeidas);
router.get("/notifinoleact", protectRoutes, obtenerNotificacionesLeidasAD);
router.get("/notifinoledes", protectRoutes, obtenerNotificacionesNoLeidasAD);
router.delete("/notifi/:id", protectRoutes, eliminarNotificacion);


export default router;