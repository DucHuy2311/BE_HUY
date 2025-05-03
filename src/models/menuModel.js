const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        sale_price: {
            type: Number,
            min: 0,
        },
        category: {
            type: String,
            required: true,
            enum: ["appetizer", "main_course", "dessert", "drink"],
        },
        description: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
        },
        status: {
            type: String,
            default: "available",
            enum: ["available", "unavailable"],
        },
    },
    {
        timestamps: true,
    }
);

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
