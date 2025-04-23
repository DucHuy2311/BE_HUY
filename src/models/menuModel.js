const pool = require("../config/database");

class Menu {
  static async create({ name, price, sale_price, category }) {
    try {
      const [result] = await pool.query(
        "INSERT INTO Menu (name, price, category) VALUES (?, ?, ?, ?)",
        [name, price, sale_price, category]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating menu item:", error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await pool.query("SELECT * FROM Menu");
      return rows;
    } catch (error) {
      console.error("Error finding menu items:", error);
      throw error;
    }
  }

  static async findById(menuId) {
    try {
      const [rows] = await pool.query("SELECT * FROM Menu WHERE menu_id = ?", [
        menuId,
      ]);
      return rows[0];
    } catch (error) {
      console.error("Error finding menu item:", error);
      throw error;
    }
  }

  static async update(menuId, { name, price, sale_price, category }) {
    try {
      const [result] = await pool.query(
        "UPDATE Menu SET name = ?, price = ?,sale_price = ?, category = ? WHERE menu_id = ?",
        [name, price, sale_price, category, menuId]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  }

  static async delete(menuId) {
    try {
      const [result] = await pool.query("DELETE FROM Menu WHERE menu_id = ?", [
        menuId,
      ]);
      return result.affectedRows;
    } catch (error) {
      console.error("Error deleting menu item:", error);
      throw error;
    }
  }
}

module.exports = Menu;
