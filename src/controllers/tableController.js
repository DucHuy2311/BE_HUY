const Table = require("../models/tableModel");

class TableController {
  static async getTables(req, res) {
    try {
      const tables = await Table.findAll();
      res.json(tables);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching tables", error: error.message });
    }
  }
}

module.exports = TableController;
