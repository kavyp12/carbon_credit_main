// index.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import sequelize from "./config/database";
import authRoutes from "./routes/authRoutes";
import kycRoutes from "./routes/kycRoutes";
import usersRoutes from "./routes/usersRoutes";
import projectRoutes from "./routes/projectRoutes";
import path from "path";
import dotenv from "dotenv";
import { env } from "./config/env";
import buyRoutes from "./routes/buyRoutes";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log("JWT_SECRET from .env at startup:", process.env.JWT_SECRET ? "Defined" : "Not defined");

const app = express();
const PORT = env.PORT || 5000;

app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());
// Remove the global fileUpload middleware to avoid conflicts with multer
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ 
    message: "Server is healthy",
    environment: env.NODE_ENV,
    jwt_configured: !!env.JWT_SECRET
  });
});

const checkJwtConfig = (req: Request, res: Response, next: NextFunction): void => {
  if (!env.JWT_SECRET) {
    console.error("JWT_SECRET is missing for auth routes");
    res.status(500).json({ message: "Server configuration error" });
    return;
  }
  next();
};

app.use("/api/auth", checkJwtConfig, authRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api", usersRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/buy", buyRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`JWT_SECRET available: ${!!env.JWT_SECRET}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
})();