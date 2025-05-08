const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
    static async register(req, res) {
        try {
            const { username, password, email, full_name, phone, role } = req.body;

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

            // Tìm user bằng username hoặc email
            const user = await User.findOne({
                email,
                status: "active",
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Cập nhật last_login
            user.last_login = new Date();
            await user.save();

            const token = jwt.sign(
                {
                    userId: user._id,
                    role: user.role,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({
                message: "Login successful",
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error) {
            res.status(500).json({
                message: "Error logging in",
                error: error.message,
            });
        }
    }
}

module.exports = AuthController;
