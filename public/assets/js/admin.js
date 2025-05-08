// Kiểm tra đăng nhập
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
        window.location.href = "auth.html";
        return;
    }

    // Load danh sách đặt bàn
    loadReservations();

    // Setup các event listeners
    setupEventListeners();
});

// Setup các event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
        item.addEventListener("click", function () {
            document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "auth.html";
    });

    // Filters
    document.getElementById("statusFilter").addEventListener("change", loadReservations);
    document.getElementById("dateFilter").addEventListener("change", loadReservations);
    document.getElementById("searchReservation").addEventListener("input", debounce(loadReservations, 300));

    // Check late reservations
    document.getElementById("checkLateBtn").addEventListener("click", checkLateReservations);

    // Modal close buttons
    document.querySelectorAll(".close-btn, .close-modal").forEach((btn) => {
        btn.addEventListener("click", function () {
            this.closest(".modal").style.display = "none";
        });
    });

    // Status update form
    document.getElementById("statusForm").addEventListener("submit", updateReservationStatus);
}

// Load danh sách đặt bàn
async function loadReservations() {
    try {
        const status = document.getElementById("statusFilter").value;
        const date = document.getElementById("dateFilter").value;
        const search = document.getElementById("searchReservation").value;

        const response = await fetch("http://localhost:3000/api/reservations", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch reservations");

        const reservations = await response.json();
        const filteredReservations = filterReservations(reservations, status, date, search);
        displayReservations(filteredReservations);
    } catch (error) {
        console.error("Error loading reservations:", error);
        showNotification("Lỗi khi tải danh sách đặt bàn", "error");
    }
}

// Lọc đặt bàn
function filterReservations(reservations, status, date, search) {
    return reservations.filter((reservation) => {
        const statusMatch = status === "all" || reservation.status === status;
        const dateMatch = !date || new Date(reservation.reservation_time).toDateString() === new Date(date).toDateString();
        const searchMatch =
            !search ||
            reservation._id.toLowerCase().includes(search.toLowerCase()) ||
            reservation.user_id.full_name.toLowerCase().includes(search.toLowerCase()) ||
            reservation.table_id.number.toString().includes(search);

        return statusMatch && dateMatch && searchMatch;
    });
}

// Hiển thị danh sách đặt bàn
function displayReservations(reservations) {
    const tbody = document.getElementById("reservationsList");
    tbody.innerHTML = "";

    reservations.forEach((reservation) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${reservation._id}</td>
            <td>${reservation.user_id.full_name}</td>
            <td>Bàn ${reservation.table_id.number}</td>
            <td>${formatDateTime(reservation.reservation_time)}</td>
            <td>${reservation.number_of_guests}</td>
            <td><span class="status-badge status-${reservation.status}">${getStatusText(reservation.status)}</span></td>
            <td>
                <button class="btn btn-primary" onclick="showStatusModal('${reservation._id}')">
                    Cập nhật trạng thái
                </button>
                <button class="btn btn-secondary" onclick="showDetailsModal('${reservation._id}')">
                    Chi tiết
                </button>
                ${
                    reservation.status === "pending" || reservation.status === "deposit_paid"
                        ? `
                    <button class="btn btn-warning" onclick="markNoShow('${reservation._id}')">
                        Đánh dấu không đến
                    </button>
                `
                        : ""
                }
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Kiểm tra đặt bàn muộn
async function checkLateReservations() {
    try {
        const response = await fetch("http://localhost:3000/api/reservations/check-late", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) throw new Error("Failed to check late reservations");

        const result = await response.json();
        showNotification(`Đã kiểm tra ${result.results.length} đặt bàn muộn`, "success");
        loadReservations(); // Reload danh sách
    } catch (error) {
        console.error("Error checking late reservations:", error);
        showNotification("Lỗi khi kiểm tra đặt bàn muộn", "error");
    }
}

// Đánh dấu không đến
async function markNoShow(reservationId) {
    try {
        const response = await fetch(`http://localhost:3000/api/reservations/no-show/${reservationId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) throw new Error("Failed to mark no-show");

        const result = await response.json();
        showNotification("Đã đánh dấu không đến và xử lý hoàn tiền", "success");
        loadReservations(); // Reload danh sách
    } catch (error) {
        console.error("Error marking no-show:", error);
        showNotification("Lỗi khi đánh dấu không đến", "error");
    }
}

// Cập nhật trạng thái đặt bàn
async function updateReservationStatus(event) {
    event.preventDefault();
    const reservationId = this.dataset.reservationId;
    const newStatus = document.getElementById("newStatus").value;

    try {
        const response = await fetch(`http://localhost:3000/api/reservations/status/${reservationId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) throw new Error("Failed to update status");

        showNotification("Cập nhật trạng thái thành công", "success");
        document.getElementById("statusModal").style.display = "none";
        loadReservations(); // Reload danh sách
    } catch (error) {
        console.error("Error updating status:", error);
        showNotification("Lỗi khi cập nhật trạng thái", "error");
    }
}

// Hiển thị modal cập nhật trạng thái
function showStatusModal(reservationId) {
    const modal = document.getElementById("statusModal");
    const form = document.getElementById("statusForm");
    form.dataset.reservationId = reservationId;
    modal.style.display = "block";
}

// Hiển thị modal chi tiết
async function showDetailsModal(reservationId) {
    try {
        const response = await fetch(`http://localhost:3000/api/reservations/${reservationId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch reservation details");

        const reservation = await response.json();
        const modal = document.getElementById("detailsModal");
        const details = document.getElementById("reservationDetails");

        details.innerHTML = `
            <div class="details-grid">
                <div class="detail-item">
                    <label>ID:</label>
                    <span>${reservation._id}</span>
                </div>
                <div class="detail-item">
                    <label>Khách hàng:</label>
                    <span>${reservation.user_id.full_name}</span>
                </div>
                <div class="detail-item">
                    <label>Email:</label>
                    <span>${reservation.user_id.email}</span>
                </div>
                <div class="detail-item">
                    <label>Số điện thoại:</label>
                    <span>${reservation.user_id.phone}</span>
                </div>
                <div class="detail-item">
                    <label>Bàn:</label>
                    <span>Bàn ${reservation.table_id.number}</span>
                </div>
                <div class="detail-item">
                    <label>Thời gian:</label>
                    <span>${formatDateTime(reservation.reservation_time)}</span>
                </div>
                <div class="detail-item">
                    <label>Số khách:</label>
                    <span>${reservation.number_of_guests}</span>
                </div>
                <div class="detail-item">
                    <label>Trạng thái:</label>
                    <span class="status-badge status-${reservation.status}">${getStatusText(reservation.status)}</span>
                </div>
                <div class="detail-item">
                    <label>Yêu cầu đặc biệt:</label>
                    <span>${reservation.special_requests || "Không có"}</span>
                </div>
            </div>
        `;

        modal.style.display = "block";
    } catch (error) {
        console.error("Error loading reservation details:", error);
        showNotification("Lỗi khi tải chi tiết đặt bàn", "error");
    }
}

// Utility functions
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getStatusText(status) {
    const statusMap = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        deposit_paid: "Đã đặt cọc",
        completed: "Hoàn thành",
        cancelled: "Đã hủy",
        no_show: "Không đến",
    };
    return statusMap[status] || status;
}

function showNotification(message, type = "info") {
    // Implement notification system here
    alert(message);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
