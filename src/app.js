const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const menuRoutes = require("./routes/menuRoutes");
const tableRoutes = require("./routes/tableRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

app.use(cors());
// public là thư mục chứa các file static
app.use(express.static("public"));

// Multer config cho upload ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        console.log("file", file);
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/dashboard", dashboardRoutes);

// API upload ảnh
app.post("/api/upload", upload.single("image"), (req, res) => {
    console.log("body", req.body);
    console.log("req.file", req.file);
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    // Trả về đường dẫn ảnh
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra",
        error: err.message,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
