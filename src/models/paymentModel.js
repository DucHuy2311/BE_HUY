const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        reservation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reservation",
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        payment_method: {
            type: String,
            required: true,
            enum: ["cash", "credit_card", "bank_transfer"],
        },
        payment_status: {
            type: String,
            default: "pending",
            enum: ["pending", "completed", "failed", "refunded"],
        },
        transaction_id: {
            type: String,
        },
        payment_date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
