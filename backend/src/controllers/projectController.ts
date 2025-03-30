// controllers/projectController.ts
import { Response } from "express";
import Project from "../models/project";
import { AuthenticatedRequest } from "../middleware/auth";

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  console.log("Received project data:", req.body);
  console.log("Uploaded files:", Array.isArray(req.files) ? req.files.map((f: any) => ({ name: f.originalname, path: f.path })) : "No files");
  const files = (req.files as unknown as Express.Multer.File[]) || [];
  const userId = req.user?.userId;

  console.log("User ID from token:", userId);

  const { title, type, location, price, amount, description } = req.body;
  
  const errors: Record<string, string> = {};
  if (!userId) errors.userId = "User authentication required";
  if (!title) errors.title = "Title is required";
  if (!type) errors.type = "Type is required";
  if (!location) errors.location = "Location is required";
  const parsedPrice = parseFloat(price);
  const parsedAmount = parseInt(amount, 10);
  if (isNaN(parsedPrice) || parsedPrice <= 0) errors.price = "Price must be a valid positive number";
  if (isNaN(parsedAmount) || parsedAmount <= 0) errors.amount = "Amount must be a valid positive integer";
  if (files.length === 0) errors.files = "At least one document is required";

  if (Object.keys(errors).length > 0) {
    console.log("Validation errors:", errors);
    return res.status(400).json({ errors });
  }

  try {
    const filePaths = files.map(file => file.path);
    console.log("File paths to save:", filePaths);

    const project = await Project.create({
      userId: String(userId!), // Ensure string
      title,
      type,
      location,
      price: parsedPrice,
      amount: parsedAmount,
      amountAvailable: parsedAmount,
      description: description || null,
      documents: filePaths,
      status: "pending",
    });

    console.log("Project created:", project.toJSON());
    return res.status(201).json(project);
  } catch (error) {
    console.error("Project creation error:", error);
    return res.status(500).json({ message: "Server error", details: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const getUserProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    console.log("Fetching projects for userId:", userId);
    const projects = await Project.findAll({
      where: {
        userId: String(userId),
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
    console.log("Pending projects fetched:", projects.map(p => ({ id: p.id, status: p.status }))); // Log fetched projects
    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching pending projects:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// Modified updateProject function
export const updateProject = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, price, amount, status, adminNotes } = req.body;
  const userId = req.user?.userId;
  const userType = req.user?.userType;

  try {
    console.log(`Updating project ${id}, user ${userId} (${userType}), status: ${status}`);
    
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    if (project.userId !== String(userId) && userType !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to update this project" });
    }

    // Create an updates object to track changes
    const updates: any = {};
    
    if (title) updates.title = title;
    if (price) updates.price = parseFloat(price);
    if (amount) updates.amount = parseInt(amount, 10);
    
    // Handle status updates - don't check userType here since we already verified auth above
    if (status) {
      updates.status = status;
      console.log(`Setting project ${id} status to: ${status}`);
      
      if (adminNotes) {
        updates.adminNotes = adminNotes;
      }
    }

    // Use update method which returns [rowsAffected, updatedRecords]
    const [rowsAffected] = await Project.update(updates, {
      where: { id }
    });
    
    if (rowsAffected === 0) {
      return res.status(400).json({ message: "Project update failed" });
    }
    
    // Fetch the updated project to return to client
    const updatedProject = await Project.findByPk(id);
    console.log(`Project ${id} updated successfully with status: ${updatedProject?.status}`);

    return res.status(200).json({
      message: "Project updated successfully", 
      project: updatedProject
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ message: "Server error", details: error instanceof Error ? error.message : "Unknown error" });
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
    
    // Check if project is approved
    if (project.status !== "approved") {
      return res.status(400).json({ message: "Project must be approved before minting tokens" });
    }
    
    if (project.userId !== String(userId)) {
      return res.status(403).json({ message: "Unauthorized to mint tokens for this project" });
    }
    
    if (project.amountAvailable < amount) {
      return res.status(400).json({ message: "Insufficient available credits" });
    }

    project.amountAvailable -= amount;
    await project.save();

    return res.status(200).json({
      message: "Tokens minted successfully",
      project
    });
  } catch (error) {
    console.error("Error minting tokens:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// New method for admin to get all projects
export const getAllProjects = async (req: AuthenticatedRequest, res: Response) => {
  const userType = req.user?.userType;
  
  // Ensure only admins can access all projects
  if (userType !== 'admin') {
    return res.status(403).json({ message: "Unauthorized. Admin access required." });
  }
  
  try {
    const projects = await Project.findAll();
    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return res.status(500).json({ message: "Server error" });
  }
};