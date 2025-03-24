import { Router } from "express";
import { signUp, login } from "../controllers/authController";

const router = Router();

router.post("/signup", async (req, res, next) => {
  try {
    await signUp(req, res);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    await login(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;