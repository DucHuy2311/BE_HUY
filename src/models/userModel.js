const pool = require("../config/database");

class User {
  static async create({ username, password, email, full_name, phone, role }) {
    try {
      const [result] = await pool.query(
        "INSERT INTO Users (username, password, email, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
        [username, password, email, full_name, phone, role]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async findByUsername(username) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM Users WHERE username = ?",
        [username]
      );
      return rows[0];
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [
        email,
      ]);
      return rows[0];
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  static async findById(userId) {
    try {
      const [rows] = await pool.query("SELECT * FROM Users WHERE user_id = ?", [
        userId,
      ]);
      return rows[0];
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await pool.query(
        "SELECT user_id, username, email, full_name, phone, role, created_at, last_login, status FROM Users"
      );
      return rows;
    } catch (error) {
      console.error("Error finding users:", error);
      throw error;
    }
  }

  static async update(userId, { email, full_name, phone }) {
    try {
      await pool.query(
        "UPDATE Users SET email = ?, full_name = ?, phone = ? WHERE user_id = ?",
        [email, full_name, phone, userId]
      );
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  static async updatePassword(userId, hashedPassword) {
    try {
      await pool.query("UPDATE Users SET password = ? WHERE user_id = ?", [
        hashedPassword,
        userId,
      ]);
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }

  static async delete(userId) {
    try {
      await pool.query(
        'UPDATE Users SET status = "inactive" WHERE user_id = ?',
        [userId]
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  static async updateLastLogin(userId) {
    try {
      await pool.query(
        "UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?",
        [userId]
      );
    } catch (error) {
      console.error("Error updating last login:", error);
      throw error;
    }
  }
}

module.exports = User;
