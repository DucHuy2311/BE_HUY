const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/reservationController");

/**
 * Tạo đặt bàn mới
 * POST /reservations
 * Body: { table_id, reservation_time, duration, number_of_guests, deposit_required, special_requests, menu_items }
 */
router.post("/", ReservationController.createReservation);

/**
 * Lấy danh sách tất cả đặt bàn
 * GET /reservations
 */
router.get("/", ReservationController.getReservations);

router.get("/:id", ReservationController.getReservationById);

/**
 * Cập nhật trạng thái đặt bàn
 * PUT /reservations/status/:reservationId
 * Body: { status }
 * Status có thể là: pending, confirmed, deposit_paid, completed, cancelled, no_show
 */
router.put("/status/:id", ReservationController.updateReservationStatus);

/**
 * Đánh dấu đặt bàn là không đến (no-show)
 * POST /reservations/no-show/:reservationId
 * Tự động cập nhật trạng thái bàn và xử lý hoàn tiền nếu có
 */
router.post("/no-show/:reservationId", ReservationController.markNoShow);

/**
 * Kiểm tra các đặt bàn đến muộn
 * GET /reservations/check-late
 * Tự động hủy các đặt bàn quá 15 phút không đến
 */
router.get("/check-late", ReservationController.checkLateReservations);

module.exports = router;
