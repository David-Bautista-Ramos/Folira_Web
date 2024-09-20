import express from "express";
import {
	commentOnPost,
	createPost,
	deletePost,
	getAllPosts,
	getFollowingPosts,
	getLikedPosts,
	getUserPosts,
	likeUnlikePost
} from "../controllers/post.controller.js";
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = express.Router();

router.get("/all",protectRoutes,getAllPosts);
router.get("/seguidores",protectRoutes,getFollowingPosts);
router.get("/likes/:id", protectRoutes, getLikedPosts);
router.get("/user/:correo", protectRoutes, getUserPosts);
router.post("/create", protectRoutes, createPost);
router.post("/like/:id", protectRoutes, likeUnlikePost);
router.post("/comment/:id", protectRoutes, commentOnPost);
router.delete("/:id", protectRoutes, deletePost);

export default router;