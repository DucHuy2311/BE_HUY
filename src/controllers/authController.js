const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
  static async register(req, res) {
    try {
      const { username, password, email, full_name, phone, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await User.create({
        username,
        password: hashedPassword,
        email,
        full_name,
        phone,
        role: role || "customer", // Mặc định là customer
      });
      res.status(201).json({ message: "User registered", userId });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findByUsername(username);
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      await User.updateLastLogin(user.user_id);
      const token = jwt.sign(
        { userId: user.user_id, role: user.role },
        process.env.JWT_SECRET || "secret",
        {
          expiresIn: "1h",
        }
      );
      res.json({ message: "Login successful", token, role: user.role });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error logging in", error: error.message });
    }
  }
}

module.exports = AuthController;
