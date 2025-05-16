const express = require("express");
const router = express.Router();
const TableController = require("../controllers/tableController");

// Lấy danh sách bàn
router.get("/", TableController.getTables);

// Lấy thông tin một bàn
router.get("/:id", TableController.getTable);

// Tạo bàn mới
router.post("/", TableController.createTable);

// Cập nhật thông tin bàn
router.put("/:id", TableController.updateTable);

// Xóa bàn
router.delete("/:id", TableController.deleteTable);

// Cập nhật trạng thái bàn
router.put("/status/:id", TableController.updateTableStatus);

module.exports = router;
