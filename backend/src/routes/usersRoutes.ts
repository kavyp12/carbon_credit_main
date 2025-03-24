import { Router, Request, Response } from "express";
import { getUser, updateUser } from "../controllers/usersController";

const router = Router();

router.get("/users/:userId", getUser); // Line 6
router.patch("/users/:userId", updateUser); // Line 7

export default router;