// controllers/kycController.ts
import { Request, Response } from "express";
import Kyc from "../models/kyc";
import { UploadedFile } from "express-fileupload";
import * as fs from "fs/promises";
import * as path from "path";

export const submitKyc = async (req: Request, res: Response) => {
  console.log("Incoming KYC request body:", req.body);
  console.log("Incoming KYC files:", req.files);

  const { userId, wallet, fullName, idNumber, address, additionalInfo } = req.body;
  
  // Check if req.files exists - important when using route-specific middleware
  if (!req.files) {
    return res.status(400).json({ errors: { files: "No files were uploaded" } });
  }
  
  const idDocument = req.files?.idDocument as UploadedFile;
  const selfie = req.files?.selfie as UploadedFile;

  const errors: Record<string, string> = {};
  if (!userId) errors.userId = "User ID is required";
  if (!wallet) errors.wallet = "Wallet address is required";
  if (!fullName) errors.fullName = "Full name is required";
  if (!idNumber) errors.idNumber = "ID number is required";
  if (!address) errors.address = "Address is required";
  if (!idDocument) errors.idDocument = "ID document is required";
  if (!selfie) errors.selfie = "Selfie is required";

  console.log("Validation errors (if any):", errors);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Define the uploads directory path
    const uploadDir = path.join(__dirname, "../../public/uploads");

    // Create the uploads directory if it doesn't exist
    await fs.mkdir(uploadDir, { recursive: true });

    // Define file paths
    const idDocPath = `/uploads/${Date.now()}-${idDocument.name}`;
    const selfiePath = `/uploads/${Date.now()}-${selfie.name}`;

    // Move files to the uploads directory
    await idDocument.mv(path.join(__dirname, "../../public", idDocPath));
    await selfie.mv(path.join(__dirname, "../../public", selfiePath));

    const kyc = await Kyc.create({
      userId,
      walletAddress: wallet,
      status: "pending",
      fullName,
      idNumber,
      address,
      idDocument: idDocPath,
      selfie: selfiePath,
      additionalInfo,
    });

    return res.status(201).json({ message: "KYC submitted successfully", kycId: kyc.id });
  } catch (error) {
    console.error("KYC submission error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Other functions remain unchanged
export const getPendingKyc = async (req: Request, res: Response) => {
  try {
    const pendingKyc = await Kyc.findAll({ where: { status: "pending" } });
    return res.status(200).json(pendingKyc);
  } catch (error) {
    console.error("Error fetching pending KYC:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllKyc = async (req: Request, res: Response) => {
  try {
    const allKyc = await Kyc.findAll();
    return res.status(200).json(allKyc);
  } catch (error) {
    console.error("Error fetching all KYC:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateKycStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ errors: { status: "Invalid status" } });
  }

  try {
    const kyc = await Kyc.findByPk(id);
    if (!kyc) {
      return res.status(404).json({ message: "KYC request not found" });
    }

    kyc.status = status;
    await kyc.save();

    return res.status(200).json({ message: `KYC ${status} successfully`, kyc });
  } catch (error) {
    console.error("Error updating KYC status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};