// config/database.js
const mysql = require("mysql2/promise");
require("dotenv").config();

class Database {
  constructor() {
    this.pool = null;
    this.config = {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "blogging_platform",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    };
  }

  async connect() {
    try {
      // Create connection pool
      this.pool = mysql.createPool(this.config);

      // Test connection
      const connection = await this.pool.getConnection();
      console.log("✅ MySQL connected successfully");
      connection.release();

      return this.pool;
    } catch (error) {
      console.error("❌ MySQL connection failed:", error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.end();
      console.log("✅ MySQL disconnected");
    }
  }

  async query(sql, params = []) {
    if (!this.pool) {
      throw new Error("Database not connected");
    }

    try {
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error("Database query error:", error.message);
      throw error;
    }
  }

  async transaction(callback) {
    if (!this.pool) {
      throw new Error("Database not connected");
    }

    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new Database();
