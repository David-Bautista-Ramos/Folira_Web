import express from 'express';
import {followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser} from '../controllers/user.controller.js'
import { protectRoutes } from '../middleware/protectRoutes.js';

const router =express.Router();

router.get("/profile/:correo",protectRoutes,getUserProfile);
router.get("/sugerencias",protectRoutes,getSuggestedUsers);
router.post("/follow/:id",protectRoutes,followUnfollowUser);
router.post("/upadte",protectRoutes,updateUser);


export default router;