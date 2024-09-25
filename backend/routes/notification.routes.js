import express from "express";
import { protectRoutes } from "../middleware/protectRoutes.js";
import { deleteNotifications, getNotifications } from "../controllers/notification.controller.js";
import { deteteNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoutes, getNotifications);
router.delete("/", protectRoutes, deleteNotifications);
router.delete("/:id", protectRoutes, deteteNotification);

export default router;