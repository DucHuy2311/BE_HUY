const pool = require("../config/database");

class Table {
  static async findAll() {
    try {
      const [rows] = await pool.query("SELECT * FROM Tables");
      return rows;
    } catch (error) {
      console.error("Error finding tables:", error);
      throw error;
    }
  }

  static async findById(tableId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM Tables WHERE table_id = ?",
        [tableId]
      );
      return rows[0];
    } catch (error) {
      console.error("Error finding table:", error);
      throw error;
    }
  }

  static async updateStatus(tableId, status) {
    try {
      const [result] = await pool.query(
        "UPDATE Tables SET status = ? WHERE table_id = ?",
        [status, tableId]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error updating table status:", error);
      throw error;
    }
  }
}

module.exports = Table;
