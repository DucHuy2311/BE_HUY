const API_URL = "http://localhost:3000/api/tables";

const TableService = {
    // Lấy danh sách bàn
    async getTables() {
        try {
            const response = await fetch(API_URL);
            return await response.json();
        } catch (error) {
            console.error("Error fetching tables:", error);
            throw error;
        }
    },

    // Lấy thông tin một bàn
    async getTable(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching table:", error);
            throw error;
        }
    },

    // Cập nhật trạng thái bàn
    async updateTableStatus(id, status) {
        try {
            const response = await fetch(`${API_URL}/status/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error updating table status:", error);
            throw error;
        }
    },
};

export default TableService;
