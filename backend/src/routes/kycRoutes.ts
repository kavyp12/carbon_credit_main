import { Router } from "express";
import { submitKyc, getPendingKyc, updateKycStatus, getAllKyc } from "../controllers/kycController";

const router = Router();

router.post("/submit", async (req, res, next) => {
  try {
    await submitKyc(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/pending", async (req, res, next) => {
  try {
    await getPendingKyc(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/all", async (req, res, next) => {
  try {
    await getAllKyc(req, res);
  }
  catch (err) {
    next(err);
  }
});


router.patch("/:id", async (req, res, next) => {
  try {
    await updateKycStatus(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;