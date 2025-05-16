const Table = require("../models/tableModel");

const TableController = {
    // Lấy danh sách bàn
    getTables: async (req, res) => {
        try {
            const tables = await Table.find();
            res.status(200).json({
                success: true,
                data: tables,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi lấy danh sách bàn",
                error: error.message,
            });
        }
    },

    // Lấy thông tin một bàn
    getTable: async (req, res) => {
        try {
            const table = await Table.findById(req.params.id);
            if (!table) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bàn",
                });
            }
            res.status(200).json({
                success: true,
                data: table,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi lấy thông tin bàn",
                error: error.message,
            });
        }
    },

    // Tạo bàn mới
    createTable: async (req, res) => {
        try {
            const { table_number, capacity, location, description, features } =
                req.body;

            // Kiểm tra bàn đã tồn tại
            const existingTable = await Table.findOne({ table_number });
            if (existingTable) {
                return res.status(400).json({
                    success: false,
                    message: "Số bàn đã tồn tại",
                });
            }

            const newTable = await Table.create({
                table_number,
                capacity,
                location,
                description,
                features,
            });

            res.status(201).json({
                success: true,
                data: newTable,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi tạo bàn mới",
                error: error.message,
            });
        }
    },

    // Cập nhật thông tin bàn
    updateTable: async (req, res) => {
        try {
            const {
                table_number,
                capacity,
                location,
                description,
                features,
                status,
            } = req.body;

            // Kiểm tra bàn tồn tại
            const table = await Table.findById(req.params.id);
            if (!table) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bàn",
                });
            }

            // Kiểm tra số bàn mới có bị trùng không
            if (table_number && table_number !== table.table_number) {
                const existingTable = await Table.findOne({ table_number });
                if (existingTable) {
                    return res.status(400).json({
                        success: false,
                        message: "Số bàn đã tồn tại",
                    });
                }
            }

            const updatedTable = await Table.findByIdAndUpdate(
                req.params.id,
                {
                    table_number,
                    capacity,
                    location,
                    description,
                    features,
                    status,
                },
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                data: updatedTable,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi cập nhật thông tin bàn",
                error: error.message,
            });
        }
    },

    // Xóa bàn
    deleteTable: async (req, res) => {
        try {
            const table = await Table.findById(req.params.id);
            if (!table) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bàn",
                });
            }

            // Kiểm tra nếu bàn đang được sử dụng
            if (table.status !== "available") {
                return res.status(400).json({
                    success: false,
                    message: "Không thể xóa bàn đang được sử dụng",
                });
            }

            await Table.findByIdAndDelete(req.params.id);

            res.status(200).json({
                success: true,
                message: "Xóa bàn thành công",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi xóa bàn",
                error: error.message,
            });
        }
    },

    // Cập nhật trạng thái bàn
    updateTableStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const table = await Table.findById(req.params.id);

            if (!table) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bàn",
                });
            }

            const updatedTable = await Table.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                data: updatedTable,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi cập nhật trạng thái bàn",
                error: error.message,
            });
        }
    },
};

module.exports = TableController;
