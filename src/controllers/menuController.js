const Menu = require("../models/menuModel");

class MenuController {
    static async updateStatus(req, res) {
        try {
            console.log(req.body.status);
            const update = await Menu.findOneAndUpdate(
                { _id: req.params.id },
                {
                    status: req.body.status,
                }
            );
            res.status(200).json({
                update,
            });
        } catch (error) {
            res.status(500).json({
                error: error,
            });
        }
    }

    static async createMenuItem(req, res) {
        try {
            // if (req.user.role !== "admin") {
            //     return res.status(403).json({ message: "Access denied" });
            // }

            const { name, price, sale_price, category, description, image } =
                req.body;
            const menuItem = new Menu({
                name,
                price,
                sale_price,
                category,
                description,
                image,
            });

            await menuItem.save();
            res.status(201).json({
                message: "Menu item created successfully",
                menuItem,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error creating menu item",
                error: error.message,
            });
        }
    }

    static async getMenuItem(req, res) {
        try {
            const menuItems = await Menu.find({
                _id: req.params.id,
            });
            res.json(menuItems);
        } catch (error) {
            res.status(500).json({
                message: "Error fetching menu items",
                error: error.message,
            });
        }
    }

    static async getMenuItems(req, res) {
        try {
            const menuItems = await Menu.find();
            res.json(menuItems);
        } catch (error) {
            res.status(500).json({
                message: "Error fetching menu items",
                error: error.message,
            });
        }
    }

    static async getMenuItemById(req, res) {
        try {
            const menuItem = await Menu.findById(req.params.id);
            if (!menuItem) {
                return res.status(404).json({ message: "Menu item not found" });
            }
            res.json(menuItem);
        } catch (error) {
            res.status(500).json({
                message: "Error fetching menu item",
                error: error.message,
            });
        }
    }

    static async updateMenuItem(req, res) {
        try {
            // if (req.user.role !== "admin") {
            //     return res.status(403).json({ message: "Access denied" });
            // }

            const {
                name,
                price,
                sale_price,
                category,
                description,
                image,
                status,
            } = req.body;
            const menuItem = await Menu.findByIdAndUpdate(
                req.params.id,
                {
                    name,
                    price,
                    sale_price,
                    category,
                    description,
                    image,
                    status,
                },
                { new: true, runValidators: true }
            );

            if (!menuItem) {
                return res.status(404).json({ message: "Menu item not found" });
            }

            res.json({
                message: "Menu item updated successfully",
                menuItem,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error updating menu item",
                error: error.message,
            });
        }
    }

    static async deleteMenuItem(req, res) {
        try {
            // if (req.user.role !== "admin") {
            //     return res.status(403).json({ message: "Access denied" });
            // }

            const menuItem = await Menu.findByIdAndDelete(req.params.id);
            if (!menuItem) {
                return res.status(404).json({ message: "Menu item not found" });
            }

            res.json({ message: "Menu item deleted successfully" });
        } catch (error) {
            res.status(500).json({
                message: "Error deleting menu item",
                error: error.message,
            });
        }
    }
}

module.exports = MenuController;
