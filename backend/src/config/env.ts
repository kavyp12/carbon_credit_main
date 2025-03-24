import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Determine the correct path to .env file
const envFilePath = path.resolve(__dirname, "../../.env");

// Check if .env file exists
if (fs.existsSync(envFilePath)) {
  // Load environment variables
  dotenv.config({ path: envFilePath });
  console.log(`.env file loaded from ${envFilePath}`);
} else {
  console.warn(`Warning: .env file not found at ${envFilePath}, using default values`);
}

// Export environment variables with defaults
export const env = {
  PORT: process.env.PORT || '5000',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  DB_USER: process.env.DB_USER || 'carbon_user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'carbon_pass',
  DB_NAME: process.env.DB_NAME || 'carbon_db',
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'fallbackSecretForDevOnly'
};

// Log environment status for debugging (without exposing sensitive values)
console.log('Environment configuration loaded:');
console.log('- PORT:', env.PORT);
console.log('- DB_HOST:', env.DB_HOST);
console.log('- JWT_SECRET defined:', !!env.JWT_SECRET);

// Validate JWT_SECRET is available
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not found in environment variables, using fallback for development');
}