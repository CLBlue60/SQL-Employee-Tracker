// Importing required modules
const { Pool } = require("pg");
require("dotenv").config();

// Creating a new Pool instance for database connection
const db = new Pool({
  host: "localhost", // Hostname where the database server is running
  user: process.env.DB_USER, // Database user (retrieved from environment variables)
  password: process.env.DB_PASSWORD, // Database password (retrieved from environment variables)
  database: process.env.DB_NAME, // Database name (retrieved from environment variables)
  port: 5432, // Port on which the database server is listening
});

// Exporting the database connection pool for use in other modules
module.exports = db;
