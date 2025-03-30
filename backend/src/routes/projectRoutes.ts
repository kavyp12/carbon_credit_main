// routes/projectRoutes.ts
import { Router, Response, NextFunction, RequestHandler, Request, ErrorRequestHandler } from "express";
import { 
  createProject, 
  getUserProjects, 
  getPendingProjects, 
  updateProject, 
  mintTokens,
  getAllProjects 
} from "../controllers/projectController";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed"));
    }
  },
});

// Middleware to log request details
const logRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log("Request headers:", req.headers);
  console.log("Request body (raw):", req.body);
  next();
};

const asyncHandler = (fn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req as AuthenticatedRequest, res, next)).catch(next);
  };
};

// Error handling for multer
const multerErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err);
    res.status(400).json({ message: `File upload error: ${err.message}` });
  } else if (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error during file upload" });
  } else {
    next();
  }
};

router.post(
  "/",
  authenticateToken,
  logRequest,
  upload.array("files", 5),
  multerErrorHandler,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await createProject(req, res);
  })
);

router.get("/user", authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await getUserProjects(req, res);
}));

router.get("/pending", authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await getPendingProjects(req, res);
}));

router.get("/all", authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await getAllProjects(req, res);
}));

router.patch("/:id", authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await updateProject(req, res);
}));

router.patch("/:id/mint", authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await mintTokens(req, res);
}));

export default router;