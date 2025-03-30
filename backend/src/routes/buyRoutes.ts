import { Router } from "express";
import { submitBuyRequest, getPendingBuyRequests, updateBuyRequestStatus, getApprovedCredits } from "../controllers/buyController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/submit", authenticateToken, async (req, res, next) => {
  try {
    await submitBuyRequest(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/pending", authenticateToken, async (req, res, next) => {
  try {
    await getPendingBuyRequests(req, res);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", authenticateToken, async (req, res, next) => {
  try {
    await updateBuyRequestStatus(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/approved", authenticateToken, async (req, res, next) => {
  try {
    await getApprovedCredits(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;