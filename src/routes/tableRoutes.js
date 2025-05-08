const express = require("express");
const router = express.Router();
const TableController = require("../controllers/tableController");

// Lấy danh sách bàn
router.get("/", TableController.getTables);

module.exports = router;
