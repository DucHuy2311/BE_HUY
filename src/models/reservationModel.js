const pool = require("../config/database");

class Reservation {
  static async create({
    user_id,
    table_id,
    reservation_time,
    duration,
    number_of_guests,
    deposit_required,
  }) {
    try {
      const [result] = await pool.query(
        "INSERT INTO Reservations (user_id, table_id, reservation_time, duration, number_of_guests, deposit_required) VALUES (?, ?, ?, ?, ?, ?)",
        [
          user_id,
          table_id,
          reservation_time,
          duration,
          number_of_guests,
          deposit_required,
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  }

  static async findById(reservationId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM Reservations WHERE reservation_id = ?",
        [reservationId]
      );
      return rows[0];
    } catch (error) {
      console.error("Error finding reservation:", error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await pool.query("SELECT * FROM Reservations");
      return rows;
    } catch (error) {
      console.error("Error finding reservations:", error);
      throw error;
    }
  }

  static async updateStatus(reservationId, status) {
    try {
      const [result] = await pool.query(
        "UPDATE Reservations SET status = ? WHERE reservation_id = ?",
        [status, reservationId]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error updating reservation status:", error);
      throw error;
    }
  }

  static async checkLateReservations() {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM Reservations 
         WHERE status IN ('pending', 'deposit_paid') AND reservation_time < NOW() - INTERVAL 15 MINUTE`
      );
      return rows;
    } catch (error) {
      console.error("Error checking late reservations:", error);
      throw error;
    }
  }
}

module.exports = Reservation;
