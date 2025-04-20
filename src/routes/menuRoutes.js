const express = require("express");
const router = express.Router();
const MenuController = require("../controllers/menuController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, MenuController.createMenuItem);
router.get("/", MenuController.getMenuItems);
router.put("/:menuId", authMiddleware, MenuController.updateMenuItem);
router.delete("/:menuId", authMiddleware, MenuController.deleteMenuItem);

module.exports = router;
