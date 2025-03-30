import { Request, Response } from "express";
import BuyRequest from "../models/buyRequest";
import Project from "../models/project";
import { AuthenticatedRequest } from "../middleware/auth";

export const submitBuyRequest = async (req: AuthenticatedRequest, res: Response) => {
  const { projectId, amount } = req.body;
  const buyerId = req.user?.userId;

  const errors: Record<string, string> = {};
  if (!buyerId) errors.buyerId = "Authentication required";
  if (!projectId) errors.projectId = "Project ID is required";
  if (!amount || amount <= 0) errors.amount = "Valid amount is required";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const project = await Project.findByPk(projectId);
    if (!project || project.status !== "approved") {
      return res.status(404).json({ message: "Project not found or not approved" });
    }
    if (project.amount < amount) {
      return res.status(400).json({ message: "Insufficient credits available" });
    }

    const totalCost = amount * project.price;
    const buyRequest = await BuyRequest.create({
      buyerId,
      projectId,
      amount,
      totalCost,
      status: "pending",
    });

    return res.status(201).json({ message: "Buy request submitted successfully", buyRequestId: buyRequest.id });
  } catch (error) {
    console.error("Buy request error:", error);
    return res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : String(error) });
  }
};

export const getPendingBuyRequests = async (req: Request, res: Response) => {
  try {
    const requests = await BuyRequest.findAll({
      where: { status: "pending" },
      include: [{ model: Project, attributes: ["title", "sellerId", "price", "amount"] }],
    });
    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching pending buy requests:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateBuyRequestStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ errors: { status: "Invalid status" } });
  }

  try {
    const buyRequest = await BuyRequest.findByPk(id);
    if (!buyRequest) {
      return res.status(404).json({ message: "Buy request not found" });
    }

    if (status === "approved") {
      const project = await Project.findByPk(buyRequest.projectId);
      if (!project || project.amount < buyRequest.amount) {
        return res.status(400).json({ message: "Insufficient credits remaining" });
      }
      project.amount -= buyRequest.amount;
      await project.save();
    }

    buyRequest.status = status;
    await buyRequest.save();

    return res.status(200).json({ message: `Buy request ${status} successfully`, buyRequest });
  } catch (error) {
    console.error("Error updating buy request status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getApprovedCredits = async (req: AuthenticatedRequest, res: Response) => {
  const buyerId = req.user?.userId;
  try {
    const approvedRequests = await BuyRequest.findAll({
      where: { buyerId, status: "approved" },
      include: [{ model: Project, attributes: ["title", "description", "type", "location", "price"] }],
    });
    return res.status(200).json(approvedRequests);
  } catch (error) {
    console.error("Error fetching approved credits:", error);
    return res.status(500).json({ message: "Server error" });
  }
};