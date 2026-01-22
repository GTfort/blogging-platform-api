// scripts/create-db.js
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Read schema file
    const seedPath = path.join(__dirname, "../db/seeds.sql");
    const seed = fs.readFileSync(seedPath, "utf8");

    // Split by semicolon to execute each statement
    const statements = seed.split(";").filter((stmt) => stmt.trim());

    for (const statement of statements) {
      await connection.query(statement);
    }

    console.log("✅ Successfully seeded the database");
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
  } finally {
    await connection.end();
  }
}

seedDatabase();
