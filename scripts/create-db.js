// scripts/create-db.js
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Read schema file
    const schemaPath = path.join(__dirname, "../db/schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Split by semicolon to execute each statement
    const statements = schema.split(";").filter((stmt) => stmt.trim());

    for (const statement of statements) {
      await connection.query(statement);
    }

    console.log("✅ Database and tables created successfully");
  } catch (error) {
    console.error("❌ Error creating database:", error.message);
  } finally {
    await connection.end();
  }
}

createDatabase();
