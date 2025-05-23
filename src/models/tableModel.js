const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
    {
        table_number: {
            type: String,
            required: true,
            unique: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
        },
        status: {
            type: String,
            default: "available",
            enum: ["available", "occupied", "reserved", "maintenance"], // available: trống, occupied: đã đặt, reserved: đã đặt, maintenance: đang sửa chữa
        },
        location: {
            type: String,
            required: true,
            enum: ["indoor", "outdoor", "vip_room"], // indoor: nội thất, outdoor: ngoại thất, vip_room: phòng vip
        },
        description: {
            type: String,
            trim: true,
        },
        features: [
            {
                type: String,
                enum: [
                    "window_view",
                    "private_room",
                    "smoking_area",
                    "wheelchair_accessible",
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
