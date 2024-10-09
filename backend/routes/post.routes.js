import express from "express";
import {
	actualizarPublicacion,
	cambiarEstadoPublicacionact,
	cambiarEstadoPublicaciondes,
	commentOnPost,
	createPost,
	deletePost,
	editarComentario,
	eliminarComentario,
	getAllPosts,
	getFollowingPosts,
	getLikedPosts,
	getUserPosts,
	likeUnlikePost,
	obtenerPublicacionesAct,
	obtenerPublicacionesDes,
	obtenerPublicacionPorId
} from "../controllers/post.controller.js";
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = express.Router();

router.get("/all",protectRoutes,getAllPosts);
router.get("/seguidores",protectRoutes,getFollowingPosts);
router.get("/likes/:id", protectRoutes, getLikedPosts);
router.get("/user/:nombre", protectRoutes, getUserPosts);
router.post("/create", protectRoutes, createPost);
router.post("/like/:id", protectRoutes, likeUnlikePost);
router.post("/comment/:id", protectRoutes, commentOnPost);
router.delete("/:id", protectRoutes, deletePost);

{/*Admin*/}
//para crear el de arriba, para traer todas las post, borrar
router.get("/userPost/:postId",protectRoutes,obtenerPublicacionPorId);
router.put("/post/:postId",protectRoutes,actualizarPublicacion);
router.put("/editarcomen/:postId/:comentarioId",protectRoutes,editarComentario);
router.put("/actpost/:postId", protectRoutes, cambiarEstadoPublicacionact);
router.put("/despost/:postId", protectRoutes, cambiarEstadoPublicaciondes);
router.get("/getactpost",  protectRoutes, obtenerPublicacionesAct);
router.get("/getdespost",  protectRoutes, obtenerPublicacionesDes);
router.delete("/deletecomen/:postId/:comentarioId",protectRoutes,eliminarComentario);

export default router;