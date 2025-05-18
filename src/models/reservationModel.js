const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        user_name: {
            type: String,
            required: false,
        },
        user_phone: {
            type: String,
            required: false,
        },
        table_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Table",
            required: false,
        },
        reservation_time: {
            type: Date,
            required: false,
        },
        duration: {
            type: Number,
            required: false,
            min: 30,
            max: 240,
        },
        number_of_guests: {
            // Số lượng khách
            type: Number,
            required: false,
            min: 1,
            max: 20,
        },
        deposit_required: {
            // Số tiền cọc
            type: Number,
            required: false,
            min: 0,
        },
        status: {
            type: String,
            default: "pending",
            enum: [
                "pending", // Đang chờ
                "confirmed", // Đã xác nhận
                "deposit_paid", // Đã thanh toán cọc
                "completed", // Đã hoàn tất
                "cancelled", // Đã hủy
                "no_show", // Không đến
            ],
        },
        special_requests: {
            // Yêu cầu đặc biệt
            type: String,
            trim: true,
        },
        menu_items: [
            {
                // Món ăn
                item_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Menu",
                },
                quantity: {
                    // Số lượng
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
