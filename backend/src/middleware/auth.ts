import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthenticatedRequest extends Request {
  user?: { userId: string; email: string; userType: string };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ message: "Authentication token required" });
    return;
  }
  
  const jwtSecret = env.JWT_SECRET;
  console.log("JWT_SECRET in auth.ts:", jwtSecret ? "Defined" : "Not defined"); // Debug
  
  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined in auth.ts");
    res.status(500).json({ message: "Server configuration error" });
    return;
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret) as { 
      userId: string; 
      email: string; 
      userType: string 
    };
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};