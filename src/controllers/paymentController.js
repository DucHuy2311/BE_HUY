const Payment = require("../models/paymentModel");
const Reservation = require("../models/reservationModel");

class PaymentController {
    static async createPayment(req, res) {
        try {
            const { reservation_id, amount, payment_method } = req.body;
            const user_id = req.user._id;

            // Kiểm tra reservation tồn tại
            const reservation = await Reservation.findById(reservation_id);
            if (!reservation) {
                return res.status(404).json({ message: "Reservation not found" });
            }

            // Tạo payment mới
            const payment = new Payment({
                reservation_id,
                user_id,
                amount,
                payment_method,
                payment_status: "completed", // Giả định thanh toán thành công
            });

            await payment.save();

            res.status(201).json({
                message: "Payment created successfully",
                payment,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error creating payment",
                error: error.message,
            });
        }
    }

    static async getPaymentById(req, res) {
        try {
            const payment = await Payment.findById(req.params.id).populate("reservation_id").populate("user_id", "-password");

            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }

            res.json(payment);
        } catch (error) {
            res.status(500).json({
                message: "Error fetching payment",
                error: error.message,
            });
        }
    }

    static async updatePaymentStatus(req, res) {
        try {
            const { status } = req.body;
            const payment = await Payment.findByIdAndUpdate(req.params.id, { payment_status: status }, { new: true, runValidators: true });

            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }

            res.json({
                message: "Payment status updated successfully",
                payment,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error updating payment status",
                error: error.message,
            });
        }
    }

    static async getPaymentsByReservation(req, res) {
        try {
            const payments = await Payment.find({
                reservation_id: req.params.reservationId,
            }).populate("user_id", "-password");

            res.json(payments);
        } catch (error) {
            res.status(500).json({
                message: "Error fetching payments",
                error: error.message,
            });
        }
    }
}

module.exports = PaymentController;
