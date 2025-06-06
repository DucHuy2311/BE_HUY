const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    // Nếu không có token, trả về lỗi 401
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

        // Kiểm tra nếu là admin account
        if (decoded.email === "admin@admin.com") {
            req.user = {
                username: "admin",
                email: "admin@admin.com",
                role: "admin",
                status: "active",
            };
        } else {
            req.user = decoded;
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
