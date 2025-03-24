import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "carbon_user",
  password: process.env.DB_PASSWORD || "carbon_pass",
  database: process.env.DB_NAME || "carbon_db",
});

export default sequelize;