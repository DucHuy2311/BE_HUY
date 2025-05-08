const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Tất cả các routes đều cần xác thực
router.use(authMiddleware);

// Lấy thông tin tất cả users (chỉ admin)
router.get("/", userController.getAllUsers);

// Lấy thông tin user theo ID
router.get("/:id", userController.getUserById);

// cập nhật thông tin 
router.put("/:id", userController.updateUserPUT);

// Cập nhật thông tin user
router.put("/profile", userController.updateUser);

// Xóa user
router.delete("/:id", userController.deleteUser);

// Đổi mật khẩu
router.put("/change-password", userController.changePassword);

// Lấy thông tin profile của user hiện tại
router.get("/profile/me", userController.getUserProfile);

module.exports = router;
