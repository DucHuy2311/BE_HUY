const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        table_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Table",
            required: true,
        },
        reservation_time: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
            min: 30,
            max: 240,
        },
        number_of_guests: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
        },
        deposit_required: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "confirmed", "deposit_paid", "completed", "cancelled", "no_show"],
        },
        special_requests: {
            type: String,
            trim: true,
        },
        menu_items: [
            {
                item_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Menu",
                },
                quantity: {
                    type: Number,
                    min: 1,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
