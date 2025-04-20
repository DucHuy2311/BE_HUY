const pool = require("../config/database");

class Payment {
  static async create({ reservation_id, user_id, amount, payment_method }) {
    try {
      const [result] = await pool.query(
        "INSERT INTO Payments (reservation_id, user_id, amount, payment_method) VALUES (?, ?, ?, ?)",
        [reservation_id, user_id, amount, payment_method]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  }

  static async updateStatus(paymentId, status) {
    try {
      const [result] = await pool.query(
        "UPDATE Payments SET payment_status = ? WHERE payment_id = ?",
        [status, paymentId]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  }

  static async findByReservationId(reservationId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM Payments WHERE reservation_id = ?",
        [reservationId]
      );
      return rows[0];
    } catch (error) {
      console.error("Error finding payment:", error);
      throw error;
    }
  }
}

module.exports = Payment;
