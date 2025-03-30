import { Router } from "express";
import { submitKyc, getPendingKyc, updateKycStatus, getAllKyc } from "../controllers/kycController";
import fileUpload from "express-fileupload";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Add fileUpload middleware only to the submit route
router.post("/submit", fileUpload(), async (req, res, next) => {
  try {
    await submitKyc(req, res);
  } catch (err) {
    next(err);
  }
});

// Add authentication to admin routes
router.get("/pending", authenticateToken, async (req, res, next) => {
  try {
    await getPendingKyc(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/all", authenticateToken, async (req, res, next) => {
  try {
    await getAllKyc(req, res);
  }
  catch (err) {
    next(err);
  }
});

router.patch("/:id", authenticateToken, async (req, res, next) => {
  try {
    await updateKycStatus(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;