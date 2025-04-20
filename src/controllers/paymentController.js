const Payment = require("../models/paymentModel");
const Reservation = require("../models/reservationModel");

class PaymentController {
  static async createPayment(req, res) {
    try {
      const { reservation_id, amount, payment_method } = req.body;
      const user_id = req.user.userId;
      const reservation = await Reservation.findById(reservation_id);
      if (!reservation)
        return res.status(404).json({ message: "Reservation not found" });

      const paymentId = await Payment.create({
        reservation_id,
        user_id,
        amount,
        payment_method,
      });
      await Payment.updateStatus(paymentId, "completed"); // Giả định thanh toán thành công
      res.status(201).json({ message: "Payment created", paymentId });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating payment", error: error.message });
    }
  }
}

module.exports = PaymentController;
