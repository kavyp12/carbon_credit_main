import { Response } from "express";
import Project from "../models/project";
import { AuthenticatedRequest } from "../middleware/auth";

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  const { title, type, location, price, amount } = req.body;
  const userId = req.user?.userId;

  const errors: Record<string, string> = {};
  if (!userId) errors.userId = "User authentication required";
  if (!title) errors.title = "Title is required";
  if (!type) errors.type = "Type is required";
  if (!location) errors.location = "Location is required";
  if (!price) errors.price = "Price is required";
  if (!amount) errors.amount = "Amount is required";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const project = await Project.create({
      userId: userId!,
      title,
      type,
      location,
      price,
      amount,
      amountAvailable: amount,
      status: "pending",
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error("Project creation error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId; // Integer from JWT
    console.log("Fetching projects for userId:", userId);
    const projects = await Project.findAll({
      where: {
        userId: String(userId), // Convert to string
      },
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const getPendingProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const projects = await Project.findAll({ where: { status: ["pending", "reviewing"] } });
    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching pending projects:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, price, amount, status, adminNotes } = req.body;
  const userId = req.user?.userId;

  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this project" });
    }

    project.title = title || project.title;
    project.price = price || project.price;
    project.amount = amount || project.amount;
    project.status = status || project.status;
    project.adminNotes = adminNotes || project.adminNotes;
    await project.save();

    return res.status(200).json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const mintTokens = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { amount } = req.body;
  const userId = req.user?.userId;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Valid amount is required" });
  }

  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to mint tokens for this project" });
    }
    if (project.amountAvailable < amount) {
      return res.status(400).json({ message: "Insufficient available credits" });
    }

    project.amountAvailable -= amount;
    await project.save();

    return res.status(200).json(project);
  } catch (error) {
    console.error("Error minting tokens:", error);
    return res.status(500).json({ message: "Server error" });
  }
};