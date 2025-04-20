const Menu = require("../models/menuModel");

class MenuController {
  static async createMenuItem(req, res) {
    try {
      if (req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied" });
      const { name, price, category } = req.body;
      const menuId = await Menu.create({ name, price, category });
      res.status(201).json({ message: "Menu item created", menuId });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating menu item", error: error.message });
    }
  }

  static async getMenuItems(req, res) {
    try {
      const menuItems = await Menu.findAll();
      res.json(menuItems);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching menu items", error: error.message });
    }
  }

  static async updateMenuItem(req, res) {
    try {
      if (req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied" });
      const { menuId } = req.params;
      const { name, price, category } = req.body;
      await Menu.update(menuId, { name, price, category });
      res.json({ message: "Menu item updated" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating menu item", error: error.message });
    }
  }

  static async deleteMenuItem(req, res) {
    try {
      if (req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied" });
      const { menuId } = req.params;
      await Menu.delete(menuId);
      res.json({ message: "Menu item deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting menu item", error: error.message });
    }
  }
}

module.exports = MenuController;
