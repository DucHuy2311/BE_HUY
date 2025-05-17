const express = require("express");
const router = express.Router();
const Table = require("../models/tableModel");
const MenuItem = require("../models/menuModel");
const Reservation = require("../models/reservationModel");

router.get("/dashboard-stats", async (req, res) => {
    try {
        const tables = await Table.find();
        const foods = await MenuItem.find();
        const reservations = await Reservation.find();

        const tableCount = tables.length;
        const foodCount = foods.length;
        const reservationCount = reservations.length;
        const guestCount = reservations.reduce(
            (acc, cur) => acc + (cur.number_of_guests || 0),
            0
        );
        const totalRevenue = reservations.reduce(
            (acc, cur) => acc + (cur.total_price || 0),
            0
        );

        // Thống kê top món ăn phổ biến
        const foodOrders = {};
        reservations.forEach((r) => {
            (r.menu_items || []).forEach((item) => {
                foodOrders[item.name] = (foodOrders[item.name] || 0) + 1;
            });
        });
        const popularFoodItems = Object.entries(foodOrders)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, orders]) => ({ name, orders }));

        res.json({
            tableCount,
            foodCount,
            reservationCount,
            guestCount,
            totalRevenue,
            popularFoodItems,
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

module.exports = router;
