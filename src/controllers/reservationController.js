const Reservation = require("../models/reservationModel");
const Table = require("../models/tableModel");
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");

class ReservationController {
  static async createReservation(req, res) {
    try {
      const {
        table_id,
        reservation_time,
        duration,
        number_of_guests,
        deposit_required,
      } = req.body;
      const user_id = req.user.userId; // Lấy từ token
      const table = await Table.findById(table_id);
      if (!table || table.status !== "available") {
        return res.status(400).json({ message: "Table not available" });
      }

      const reservationId = await Reservation.create({
        user_id,
        table_id,
        reservation_time,
        duration,
        number_of_guests,
        deposit_required,
      });
      res.status(201).json({ message: "Reservation created", reservationId });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating reservation", error: error.message });
    }
  }

  static async getReservations(req, res) {
    try {
      const reservations = await Reservation.findAll();
      res.json(reservations);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching reservations", error: error.message });
    }
  }

  static async updateReservationStatus(req, res) {
    try {
      const { reservationId } = req.params;
      const { status } = req.body;
      if (req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied" });
      await Reservation.updateStatus(reservationId, status);
      res.json({ message: `Reservation status updated to ${status}` });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error updating reservation status",
          error: error.message,
        });
    }
  }

  static async markNoShow(req, res) {
    try {
      const { reservationId } = req.params;
      if (req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied" });
      const reservation = await Reservation.findById(reservationId);
      const user = await User.findById(reservation.user_id);
      await Reservation.updateStatus(reservationId, "cancelled");
      const payment = await Payment.findByReservationId(reservationId);
      if (payment) {
        await Payment.updateStatus(payment.payment_id, "refunded");
      }
      res.json({
        message: "Reservation marked as no-show, refund initiated",
        userContact: { email: user.email, phone: user.phone },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error marking no-show", error: error.message });
    }
  }

  static async checkLateReservations(req, res) {
    try {
      if (req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied" });
      const lateReservations = await Reservation.checkLateReservations();
      const results = [];
      for (const reservation of lateReservations) {
        const user = await User.findById(reservation.user_id);
        await Reservation.updateStatus(reservation.reservation_id, "cancelled");
        const payment = await Payment.findByReservationId(
          reservation.reservation_id
        );
        if (payment) {
          await Payment.updateStatus(payment.payment_id, "refunded");
        }
        results.push({
          reservationId: reservation.reservation_id,
          userContact: { email: user.email, phone: user.phone },
        });
      }
      res.json({ message: "Checked late reservations", results });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error checking late reservations",
          error: error.message,
        });
    }
  }
}

module.exports = ReservationController;
