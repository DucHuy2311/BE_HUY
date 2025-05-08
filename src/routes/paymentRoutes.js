const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");

// Tạo thanh toán
router.post("/", authMiddleware, PaymentController.createPayment);

module.exports = router;
