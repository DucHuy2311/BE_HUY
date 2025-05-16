const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
    static async register(req, res) {
        try {
            const { username, password, email, full_name, phone, role } =
                req.body;

            // Kiểm tra xem username hoặc email đã tồn tại chưa
            const existingUser = await User.findOne({
                $or: [{ username }, { email }],
                status: "active",
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "Username or email already exists",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username,
                password: hashedPassword,
                email,
                full_name,
                phone,
                role: role || "customer",
            });

            await user.save();
            res.status(201).json({
                message: "User registered successfully",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error) {
            res.status(500).json({
                message: "Error registering user",
                error: error.message,
            });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Kiểm tra thông tin đăng nhập
            if (email === "admin@admin.com" && password === "123") {
                // Tạo token
                const token = jwt.sign(
                    { email, role: "admin" },
                    process.env.JWT_SECRET || "your-secret-key",
                    { expiresIn: "1d" }
                );

                res.status(200).json({
                    success: true,
                    data: {
                        token,
                        user: {
                            email,
                            role: "admin",
                        },
                    },
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "Email hoặc mật khẩu không đúng",
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi đăng nhập",
                error: error.message,
            });
        }
    }
}

module.exports = AuthController;
