const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/reservationController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, ReservationController.createReservation);
router.get("/", authMiddleware, ReservationController.getReservations);
router.put(
  "/status/:reservationId",
  authMiddleware,
  ReservationController.updateReservationStatus
);
router.post(
  "/no-show/:reservationId",
  authMiddleware,
  ReservationController.markNoShow
);
router.get(
  "/check-late",
  authMiddleware,
  ReservationController.checkLateReservations
);

module.exports = router;
