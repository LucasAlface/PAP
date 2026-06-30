const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../.env") });
const { Sequelize } = require("sequelize");

const useSsl =
  process.env.DB_SSL === "true" ||
  process.env.DB_SSL === "1" ||
  process.env.DATABASE_URL?.includes("sslmode=require") ||
  process.env.DATABASE_URL?.includes("neon.tech");

const options = {
  dialect: "postgres",
  logging: false,
  ...(useSsl && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }),
};

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, options)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        ...options,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
      }
    );

module.exports = sequelize;
