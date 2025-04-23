document.addEventListener("DOMContentLoaded", () => {
  // Generate tables for each floor
  generateTables()

  // Set up tab switching
  setupTabs()

  // Set up modal functionality
  setupModals()
})

// Table data structure
const floors = [
  { id: 1, name: "Ground Floor" },
  { id: 2, name: "First Floor" },
  { id: 3, name: "Second Floor" },
  { id: 4, name: "Third Floor" },
]

// Current selected table
let selectedTable = null

// Generate tables for each floor
function generateTables() {
  floors.forEach((floor) => {
    const tableGrid = document.getElementById(`tables-floor-${floor.id}`)

    // Generate 10 tables per floor
    for (let i = 1; i <= 10; i++) {
      // Random number of seats between 2-6
      const seats = Math.floor(Math.random() * 5) + 2

      // All tables are available by default
      const isAvailable = true

      const tableItem = document.createElement("div")
      tableItem.className = `table-item available`
      tableItem.dataset.id = `${floor.id}-${i}`
      tableItem.dataset.floor = floor.id
      tableItem.dataset.number = i
      tableItem.dataset.seats = seats
      tableItem.dataset.available = isAvailable

      tableItem.innerHTML = `
        <div class="table-number">Table ${i}</div>
        <div class="table-seats">${seats} Seats</div>
        <div class="table-status">Available</div>
        <div class="table-shape">
          <div class="table-shape-inner"></div>
        </div>
      `

      tableItem.addEventListener("click", () => selectTable(tableItem))

      tableGrid.appendChild(tableItem)
    }
  })
}

// Set up tab switching
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      button.classList.add("active")
      const floorId = button.dataset.floor
      document.getElementById(`floor-${floorId}`).classList.add("active")
    })
  })
}

// Select a table
function selectTable(tableElement) {
  if (tableElement.dataset.available === "false") return

  selectedTable = {
    id: tableElement.dataset.id,
    floor: tableElement.dataset.floor,
    number: tableElement.dataset.number,
    seats: tableElement.dataset.seats,
  }

  // Update table info in the reservation modal
  const tableInfo = document.getElementById("tableInfo")
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
  `

  // Set max guests to table seats
  document.getElementById("guests").max = selectedTable.seats
  document.getElementById("guests").value = selectedTable.seats

  // Show reservation modal
  document.getElementById("reservationModal").style.display = "flex"
}

// Set up modals
function setupModals() {
  // Reservation modal
  const reservationModal = document.getElementById("reservationModal")
  const closeReservationBtn = document.getElementById("closeReservationModal")
  const reservationForm = document.getElementById("reservationForm")

  closeReservationBtn.addEventListener("click", () => {
    reservationModal.style.display = "none"
  })

  reservationForm.addEventListener("submit", (e) => {
    e.preventDefault()
    showPaymentModal()
  })

  // Payment modal
  const paymentModal = document.getElementById("paymentModal")
  const closePaymentBtn = document.getElementById("closePaymentModal")
  const completePaymentBtn = document.getElementById("completePayment")
  const cancelPaymentBtn = document.getElementById("cancelPayment")

  closePaymentBtn.addEventListener("click", () => {
    paymentModal.style.display = "none"
  })

  completePaymentBtn.addEventListener("click", () => {
    completeReservation()
  })

  cancelPaymentBtn.addEventListener("click", () => {
    paymentModal.style.display = "none"
  })

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === reservationModal) {
      reservationModal.style.display = "none"
    }
    if (e.target === paymentModal) {
      paymentModal.style.display = "none"
    }
  })
}

// Show payment modal
function showPaymentModal() {
  document.getElementById("reservationModal").style.display = "none"

  // Update payment reference
  document.getElementById("paymentReference").textContent =
    `Table ${selectedTable.number}-${Math.floor(Math.random() * 1000)}`

  document.getElementById("paymentModal").style.display = "flex"
}

// Complete reservation
function completeReservation() {
  // Here you would typically send the reservation data to your backend
  alert("Reservation completed successfully!")

  // Close payment modal
  document.getElementById("paymentModal").style.display = "none"

  // Mark table as reserved
  const tableElement = document.querySelector(`[data-id="${selectedTable.id}"]`)
  tableElement.classList.remove("available")
  tableElement.classList.add("reserved")
  tableElement.dataset.available = "false"

  // Update table status text
  const statusElement = tableElement.querySelector(".table-status")
  statusElement.textContent = "Reserved"

  // Reset selected table
  selectedTable = null
}


document.getElementById("searchTablesBtn").addEventListener("click", () => {
  const date = document.getElementById("search-date").value
  const time = document.getElementById("search-time").value

  if (!date || !time) {
    alert("Vui lòng chọn ngày và giờ để tìm bàn.")
    return
  }

  // Giả lập kiểm tra bàn trống theo ngày giờ (thay bằng logic backend nếu có)
  updateTableAvailability(date, time)
})

function updateTableAvailability(date, time) {
  const allTables = document.querySelectorAll(".table-item")

  allTables.forEach((table) => {
    // Giả lập: bàn số lẻ thì trống, chẵn thì đã đặt
    const tableNumber = parseInt(table.dataset.number)
    const isAvailable = tableNumber % 2 !== 0

    table.dataset.available = isAvailable
    table.classList.remove("reserved", "available")

    if (isAvailable) {
      table.classList.add("available")
      table.querySelector(".table-status").textContent = "Available"
    } else {
      table.classList.add("reserved")
      table.querySelector(".table-status").textContent = "Reserved"
    }
  })
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

