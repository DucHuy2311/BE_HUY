const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Đăng ký tài khoản
router.post("/register", register);

// Đăng nhập
router.post("/login", login);

module.exports = router;
