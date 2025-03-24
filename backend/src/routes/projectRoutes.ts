import { Router, Response, NextFunction, RequestHandler } from "express";
import { createProject, getUserProjects, getPendingProjects, updateProject, mintTokens } from "../controllers/projectController";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// Utility to wrap async handlers and handle errors
const asyncHandler = (fn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req as AuthenticatedRequest, res, next)).catch(next);
  };
};

// Protected routes (require authentication)
router.post("/", authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await createProject(req, res);
}));

router.get("/user", authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await getUserProjects(req, res);
}));

router.get("/pending", authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await getPendingProjects(req, res);
}));

router.patch("/:id", authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await updateProject(req, res);
}));

router.patch("/:id/mint", authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await mintTokens(req, res);
}));

export default router;