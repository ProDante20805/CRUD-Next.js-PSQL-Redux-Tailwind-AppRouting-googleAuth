import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';
// Load environment variables from .env file if required
dotenv.config();

// TypeScript: Ensure that DATABASE_URL exists and is a string
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in your environment variables");
}

// Initialize a new Sequelize instance
const sequelize: Sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false, // Set to `console.log` or true to enable SQL logging
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error: Error) => {
    console.error('Unable to connect to the database:', error.message);
  });

export default sequelize;
