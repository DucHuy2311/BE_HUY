const bcrypt = require("bcrypt");
const User = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({
            status: "active",
        }).select("-password");
        res.json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ message: "Error retrieving users" });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
            status: "active",
        }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ message: "Error retrieving user" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { email, full_name, phone } = req.body;
        const userId = req.user._id;
        const user = await User.findOneAndUpdate({ _id: userId, status: "active" }, { email, full_name, phone }, { new: true, runValidators: true }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndUpdate(userId, { status: "inactive" }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;
        const user = await User.findOne({ _id: userId, status: "active" });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Error changing password" });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findOne({ _id: userId, status: "active" }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error getting user profile:", error);
        res.status(500).json({ message: "Error retrieving user profile" });
    }
};

exports.updateUserPUT = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
};
