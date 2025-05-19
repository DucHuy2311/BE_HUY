// DOM Elements
const tableSelect = document.getElementById("table");
const reservationForm = document.getElementById("reservationForm");
const formModal = document.querySelector(".form-modal");
const closeReservationModal = document.getElementById("closeReservationModal");

// Constants
const API_BASE_URL = "http://localhost:5000/api";

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  loadTables();
  setupEventListeners();
});

function setupEventListeners() {
  closeReservationModal.addEventListener("click", () => {
    formModal.style.display = "none";
  });

  reservationForm.addEventListener("submit", handleReservationSubmit);

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === formModal) {
      formModal.style.display = "none";
    }
  });
}

// Load available tables
async function loadTables() {
  try {
    const tables = await getTables();
    displayTables(tables);
  } catch (error) {
    console.error("Error loading tables:", error);
    showError("Không thể tải danh sách bàn. Vui lòng thử lại sau.");
  }
}

const getLabel = (status) => {
  if (status === "available") {
    return "Trống";
  } else return "Đã đặt";
};

// Display tables in select
function displayTables(tables) {
  // Clear existing options except the first one
  while (tableSelect.options.length > 1) {
    tableSelect.remove(1);
  }

  // Add table options
  tables.forEach((table) => {
    if (table.status === "available") {
      console.log("table", table);
      const option = document.createElement("option");
      option.value = table._id;
      option.textContent = `Bàn ${table.table_number} - ${
        table.capacity
      } người - ${getLabel(table.status)}`;
      tableSelect.appendChild(option);
    }
  });
}

// Handle reservation form submission
async function handleReservationSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const reservationData = {
    tableId: formData.get("table"),
    user_name: formData.get("name"),
    user_phone: formData.get("phone"),
    email: formData.get("email"),
    number_of_guests: parseInt(formData.get("guests")),
    reservation_time: formData.get("date") + " " + formData.get("time"),
    special_requests: formData.get("notes"),
    deposit_required: 200000,
    //   reservation_time: formData.get("reservation_time"),
  };

  console.log("reservationData", reservationData);

  try {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) throw new Error("Đặt bàn thất bại");

    const result = await response.json();
    showSuccess("Đặt bàn thành công! Chúng tôi sẽ gửi email xác nhận cho bạn.");
    formModal.style.display = "none";
    loadTables(); // Refresh table list
  } catch (error) {
    console.error("Error creating reservation:", error);
    showError("Không thể đặt bàn. Vui lòng thử lại sau.");
  }
}

// Utility functions
function showError(message) {
  alert(message); // Replace with better UI notification
}

function showSuccess(message) {
  alert(message); // Replace with better UI notification
}

async function getTables() {
  const tables = await fetch("http://localhost:5000/api/tables");
  const data = await tables.json();
  console.log(data.data);
  return data.data;
}
