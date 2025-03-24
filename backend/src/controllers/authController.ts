import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { env } from "../config/env";

export const signUp = async (req: Request, res: Response) => {
  const { fullName, email, password, companyName, userType, agreeTerms } = req.body;
  const errors: Record<string, string> = {};
  
  if (!fullName) errors.fullName = "Full name is required";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Valid email is required";
  if (!password || password.length < 8) errors.password = "Password must be at least 8 characters";
  if (!companyName) errors.companyName = "Company name is required";
  if (!["buyer", "seller"].includes(userType)) errors.userType = "Invalid user type";
  if (!agreeTerms) errors.agreeTerms = "You must agree to terms";
  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ errors: { email: "Email already exists" } });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      companyName,
      userType,
      agreeTerms,
    });
    
    return res.status(201).json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    console.error("Sign up error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const errors: Record<string, string> = {};
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Valid email is required";
  if (!password) errors.password = "Password is required";
  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  
  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(400).json({ errors: { email: "Email not found" } });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ errors: { password: "Incorrect password" } });
    }
    
    // Get JWT_SECRET from env config
    const jwtSecret = env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error("JWT_SECRET is not available");
      return res.status(500).json({ message: "Server configuration error" });
    }
    
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        userType: user.userType 
      }, 
      jwtSecret,
      { expiresIn: "1h" }
    );
    
    console.log("Login user data:", { 
      userId: user.id, 
      fullName: user.fullName, 
      token: token.substring(0, 10) + "..." // Log only part of the token for security
    });
    
    return res.status(200).json({
      message: "Login successful",
      userId: user.id,
      fullName: user.fullName,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};