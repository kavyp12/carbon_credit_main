import { Request, Response } from "express";
import User from "../models/user";

// Specify the params type with { userId: string }
export const getUser = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({
      email: user.email,
      fullName: user.fullName,
      companyName: user.companyName,
      userType: user.userType,
      bio: user.bio || "",
      phone: user.phone || "",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
  const { userId } = req.params;
  const updates = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    await user.update(updates);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};