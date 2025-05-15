const express = require("express");
const router = express.Router();
const MenuController = require("../controllers/menuController");
const authMiddleware = require("../middlewares/authMiddleware");

// Tạo mới menu
router.post("/", authMiddleware, MenuController.createMenuItem);

// Lấy danh sách menu
router.get("/", authMiddleware, MenuController.getMenuItems);

router.get("/:id", authMiddleware, MenuController.getMenuItem);

// Cập nhật menu
router.put("/:menuId", authMiddleware, MenuController.updateMenuItem);

// Xóa menu
router.delete("/:menuId", authMiddleware, MenuController.deleteMenuItem);

router.post("/:id/status", authMiddleware, MenuController.updateStatus);

module.exports = router;
