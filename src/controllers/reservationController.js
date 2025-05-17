const Reservation = require("../models/reservationModel");
const Table = require("../models/tableModel");
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");

class ReservationController {
    static async getReservationById(req, res) {
        try {
            const reservation = await Reservation.findById(req.params.id)
                .populate("table_id")
                .populate("menu_items.item_id");

            console.log("reservation với id ", req.params.id, reservation);

            if (!reservation) {
                return res
                    .status(404)
                    .json({ message: "Reservation not found" });
            }

            res.json(reservation);
        } catch (error) {
            res.status(500).json({
                message: "Error fetching reservation",
                error: error.message,
            });
            throw new Error(error);
        }
    }

    static async createReservation(req, res) {
        try {
            const {
                table_id,
                reservation_time,
                duration,
                number_of_guests,
                deposit_required,
                special_requests,
                menu_items,
                user_name,
                user_phone,
            } = req.body;
            console.log("req.body", req.body);

            const user_id = req?.user?._id || null;

            // Kiểm tra bàn có sẵn sàng không
            const table = await Table.findOne({ _id: table_id });
            console.log("table", table);
            if (!table || table.status !== "available") {
                return res.status(400).json({ message: "Table not available" });
            }

            // Tạo reservation mới

            const reservation = new Reservation({
                user_id,
                table_id,
                reservation_time,
                duration,
                number_of_guests,
                deposit_required,
                special_requests,
                menu_items,
                user_name,
                user_phone,
            });

            await reservation.save();

            // Cập nhật trạng thái bàn
            await Table.findByIdAndUpdate(table_id, { status: "reserved" });

            res.status(201).json({
                message: "Reservation created successfully",
                reservation,
            });
        } catch (error) {
            console.log("error", error);
            res.status(500).json({
                message: "Error creating reservation",
                error: error.message,
            });
        }
    }

    static async getReservations(req, res) {
        try {
            const reservations = await Reservation.find()
                .populate("table_id")
                .populate("menu_items.item_id");
            console.log("reservations", reservations);
            res.json(reservations);
        } catch (error) {
            res.status(500).json({
                message: "Error fetching reservations",
                error: error.message,
            });
        }
    }

    // static async getReservationById(req, res) {
    //     try {
    //         const reservation = await Reservation.findById(req.params.id)
    //             .populate("table_id")
    //             .populate("menu_items.item_id");

    //         if (!reservation) {
    //             return res
    //                 .status(404)
    //                 .json({ message: "Reservation not found" });
    //         }

    //         res.json(reservation);
    //     } catch (error) {
    //         res.status(500).json({
    //             message: "Error fetching reservation",
    //             error: error.message,
    //         });
    //     }
    // }

    static async updateReservationStatus(req, res) {
        try {
            const { status } = req.body;
            const reservation = await Reservation.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true, runValidators: true }
            );

            if (!reservation) {
                return res
                    .status(404)
                    .json({ message: "Reservation not found" });
            }

            // Nếu reservation bị hủy, cập nhật trạng thái bàn
            if (status === "cancelled" || status === "no_show") {
                await Table.findByIdAndUpdate(reservation.table_id, {
                    status: "available",
                });
            }

            res.json({
                message: `Reservation status updated to ${status}`,
                reservation,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error updating reservation status",
                error: error.message,
            });
        }
    }

    static async markNoShow(req, res) {
        try {
            if (req.user.role !== "admin") {
                return res.status(403).json({ message: "Access denied" });
            }

            const reservation = await Reservation.findById(req.params.id)
                .populate("user_id", "-password")
                .populate("table_id");

            if (!reservation) {
                return res
                    .status(404)
                    .json({ message: "Reservation not found" });
            }

            // Cập nhật trạng thái reservation
            reservation.status = "no_show";
            await reservation.save();

            // Cập nhật trạng thái bàn
            await Table.findByIdAndUpdate(reservation.table_id, {
                status: "available",
            });

            // Tìm và cập nhật payment nếu có
            const payment = await Payment.findOne({
                reservation_id: reservation._id,
            });
            if (payment) {
                payment.payment_status = "refunded";
                await payment.save();
            }

            res.json({
                message: "Reservation marked as no-show, refund initiated",
                userContact: {
                    email: reservation.user_id.email,
                    phone: reservation.user_id.phone,
                },
            });
        } catch (error) {
            res.status(500).json({
                message: "Error marking no-show",
                error: error.message,
            });
        }
    }

    static async checkLateReservations(req, res) {
        try {
            if (req.user.role !== "admin") {
                return res.status(403).json({ message: "Access denied" });
            }

            const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
            const lateReservations = await Reservation.find({
                status: { $in: ["pending", "deposit_paid"] },
                reservation_time: { $lt: fifteenMinutesAgo },
            }).populate("user_id", "-password");

            const results = [];
            for (const reservation of lateReservations) {
                // Cập nhật trạng thái reservation
                reservation.status = "cancelled";
                await reservation.save();

                // Cập nhật trạng thái bàn
                await Table.findByIdAndUpdate(reservation.table_id, {
                    status: "available",
                });

                // Tìm và cập nhật payment nếu có
                const payment = await Payment.findOne({
                    reservation_id: reservation._id,
                });
                if (payment) {
                    payment.payment_status = "refunded";
                    await payment.save();
                }

                results.push({
                    reservationId: reservation._id,
                    userContact: {
                        email: reservation.user_id.email,
                        phone: reservation.user_id.phone,
                    },
                });
            }

            res.json({
                message: "Checked late reservations",
                results,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error checking late reservations",
                error: error.message,
            });
        }
    }
}

module.exports = ReservationController;
