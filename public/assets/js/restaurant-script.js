import TableService from "./services/tableService.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Lấy danh sách bàn từ API
        const tables = await TableService.getTables();
        generateTables(tables);

        // Set up tab switching
        setupTabs();

        // Set up modal functionality
        setupModals();
    } catch (error) {
        console.error("Error initializing:", error);
        alert("Có lỗi xảy ra khi tải dữ liệu bàn. Vui lòng thử lại sau.");
    }
});

// Table data structure
const floors = [
    { id: 1, name: "Ground Floor" },
    { id: 2, name: "First Floor" },
    { id: 3, name: "Second Floor" },
    { id: 4, name: "Third Floor" },
];

// Current selected table
let selectedTable = null;

// Generate tables for each floor
function generateTables(tables) {
    floors.forEach((floor) => {
        const tableGrid = document.getElementById(`tables-floor-${floor.id}`);
        tableGrid.innerHTML = ""; // Clear existing tables

        // Lọc bàn theo tầng
        const floorTables = tables.filter((table) => table.floor === floor.id);

        floorTables.forEach((table) => {
            const tableItem = document.createElement("div");
            tableItem.className = `table-item ${
                table.status === "available" ? "available" : "reserved"
            }`;
            tableItem.dataset.id = table._id;
            tableItem.dataset.floor = table.floor;
            tableItem.dataset.number = table.number;
            tableItem.dataset.seats = table.seats;
            tableItem.dataset.available = table.status === "available";

            tableItem.innerHTML = `
                <div class="table-number">Table ${table.number}</div>
                <div class="table-seats">${table.seats} Seats</div>
                <div class="table-status">${
                    table.status === "available" ? "Available" : "Reserved"
                }</div>
                <div class="table-shape">
                    <div class="table-shape-inner"></div>
                </div>
            `;

            tableItem.addEventListener("click", () => selectTable(tableItem));
            tableGrid.appendChild(tableItem);
        });
    });
}

// Set up tab switching
function setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach((btn) => btn.classList.remove("active"));
            tabContents.forEach((content) =>
                content.classList.remove("active")
            );

            // Add active class to clicked button and corresponding content
            button.classList.add("active");
            const floorId = button.dataset.floor;
            document.getElementById(`floor-${floorId}`).classList.add("active");
        });
    });
}

// Select a table
function selectTable(tableElement) {
    if (tableElement.dataset.available === "false") return;

    selectedTable = {
        id: tableElement.dataset.id,
        floor: tableElement.dataset.floor,
        number: tableElement.dataset.number,
        seats: tableElement.dataset.seats,
    };

    // Update table info in the reservation modal
    const tableInfo = document.getElementById("tableInfo");
    tableInfo.innerHTML = `
    <h3>Table Information</h3>
    <div class="table-info-grid">
      <div class="table-info-item">
        <p>Floor</p>
        <p>${floors[selectedTable.floor - 1].name}</p>
      </div>
      <div class="table-info-item">
        <p>Table Number</p>
        <p>${selectedTable.number}</p>
      </div>
      <div class="table-info-item">
        <p>Seats</p>
        <p>${selectedTable.seats}</p>
      </div>
    </div>
  `;

    // Set max guests to table seats
    document.getElementById("guests").max = selectedTable.seats;
    document.getElementById("guests").value = selectedTable.seats;

    // Show reservation modal
    document.getElementById("reservationModal").style.display = "flex";
}

// Set up modals
function setupModals() {
    // Reservation modal
    const reservationModal = document.getElementById("reservationModal");
    const closeReservationBtn = document.getElementById(
        "closeReservationModal"
    );
    const reservationForm = document.getElementById("reservationForm");

    closeReservationBtn.addEventListener("click", () => {
        reservationModal.style.display = "none";
    });

    reservationForm.addEventListener("submit", (e) => {
        e.preventDefault();
        showPaymentModal();
    });

    // Payment modal
    const paymentModal = document.getElementById("paymentModal");
    const closePaymentBtn = document.getElementById("closePaymentModal");
    const completePaymentBtn = document.getElementById("completePayment");
    const cancelPaymentBtn = document.getElementById("cancelPayment");

    closePaymentBtn.addEventListener("click", () => {
        paymentModal.style.display = "none";
    });

    completePaymentBtn.addEventListener("click", () => {
        completeReservation();
    });

    cancelPaymentBtn.addEventListener("click", () => {
        paymentModal.style.display = "none";
    });

    // Close modals when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === reservationModal) {
            reservationModal.style.display = "none";
        }
        if (e.target === paymentModal) {
            paymentModal.style.display = "none";
        }
    });
}

// Show payment modal
function showPaymentModal() {
    document.getElementById("reservationModal").style.display = "none";

    // Update payment reference
    document.getElementById("paymentReference").textContent = `Table ${
        selectedTable.number
    }-${Math.floor(Math.random() * 1000)}`;

    document.getElementById("paymentModal").style.display = "flex";
}

// Complete reservation
async function completeReservation() {
    try {
        if (!selectedTable) return;

        // Cập nhật trạng thái bàn thành reserved
        await TableService.updateTableStatus(selectedTable.id, "reserved");

        alert("Đặt bàn thành công!");

        // Close payment modal
        document.getElementById("paymentModal").style.display = "none";

        // Mark table as reserved
        const tableElement = document.querySelector(
            `[data-id="${selectedTable.id}"]`
        );
        tableElement.classList.remove("available");
        tableElement.classList.add("reserved");
        tableElement.dataset.available = "false";

        // Update table status text
        const statusElement = tableElement.querySelector(".table-status");
        statusElement.textContent = "Reserved";

        // Reset selected table
        selectedTable = null;
    } catch (error) {
        console.error("Error completing reservation:", error);
        alert("Có lỗi xảy ra khi hoàn tất đặt bàn. Vui lòng thử lại sau.");
    }
}

document.getElementById("searchTablesBtn").addEventListener("click", () => {
    const date = document.getElementById("search-date").value;
    const time = document.getElementById("search-time").value;

    if (!date || !time) {
        alert("Vui lòng chọn ngày và giờ để tìm bàn.");
        return;
    }

    // Giả lập kiểm tra bàn trống theo ngày giờ (thay bằng logic backend nếu có)
    updateTableAvailability(date, time);
});

// Update table availability
async function updateTableAvailability(date, time) {
    try {
        const tables = await TableService.getTables();
        const allTables = document.querySelectorAll(".table-item");

        allTables.forEach((tableElement) => {
            const table = tables.find((t) => t._id === tableElement.dataset.id);
            if (table) {
                const isAvailable = table.status === "available";
                tableElement.dataset.available = isAvailable;
                tableElement.classList.remove("reserved", "available");

                if (isAvailable) {
                    tableElement.classList.add("available");
                    tableElement.querySelector(".table-status").textContent =
                        "Available";
                } else {
                    tableElement.classList.add("reserved");
                    tableElement.querySelector(".table-status").textContent =
                        "Reserved";
                }
            }
        });
    } catch (error) {
        console.error("Error updating table availability:", error);
        alert(
            "Có lỗi xảy ra khi cập nhật trạng thái bàn. Vui lòng thử lại sau."
        );
    }
}

// function updateTableAvailability(date, time) {
//   const allTables = document.querySelectorAll(".table-item")

//   allTables.forEach((table) => {
//     const isAvailable = true // Giả lập: tất cả đều trống

//     table.dataset.available = isAvailable
//     table.classList.remove("reserved", "available")
//     table.classList.add("available")
//     table.querySelector(".table-status").textContent = "Available"
//   })
// }
