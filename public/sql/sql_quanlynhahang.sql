-- Bảng Users: Quản lý thông tin người dùng và admin
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Mật khẩu mã hóa
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(15),
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Tables: Quản lý thông tin bàn ăn
CREATE TABLE Tables (
    table_id INT PRIMARY KEY AUTO_INCREMENT,
    table_number VARCHAR(10) NOT NULL, -- Số bàn (VD: B1, B2)
    capacity INT NOT NULL, -- Số người tối đa
    status ENUM('available', 'reserved', 'occupied') DEFAULT 'available',
    location VARCHAR(50) -- Vị trí (VD: Tầng 1, Gần cửa sổ)
);

-- Bảng Menu: quản lý thông tin món ăn
CREATE TABLE Menu (
    menu_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL, 
    sale_price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Reservations: Quản lý đặt bàn theo thời gian thực, bao gồm thông tin đặt cọc
CREATE TABLE Reservations (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    table_id INT,
    reservation_time DATETIME NOT NULL, -- Thời gian đặt
    duration INT NOT NULL, -- Thời gian sử dụng (phút)
    number_of_guests INT NOT NULL,
    deposit_amount DECIMAL(10, 2) DEFAULT 0.00, -- Số tiền đặt cọc
    deposit_required BOOLEAN DEFAULT FALSE, -- Yêu cầu đặt cọc hay không
    status ENUM('pending', 'deposit_paid', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (table_id) REFERENCES Tables(table_id)
);

-- Bảng Payments: Quản lý chi tiết thanh toán đặt cọc
CREATE TABLE Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id INT,
    user_id INT,
    amount DECIMAL(10, 2) NOT NULL, -- Số tiền thanh toán
    payment_method ENUM('cash', 'card', 'bank_transfer', 'online') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(100), -- Mã giao dịch (nếu có)
    FOREIGN KEY (reservation_id) REFERENCES Reservations(reservation_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Trigger để tự động cập nhật trạng thái bàn khi đặt bàn được xác nhận
DELIMITER //
CREATE TRIGGER update_table_status_after_reservation
AFTER UPDATE ON Reservations
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' THEN
        UPDATE Tables
        SET status = 'reserved'
        WHERE table_id = NEW.table_id;
    ELSEIF NEW.status = 'completed' OR NEW.status = 'cancelled' THEN
        UPDATE Tables
        SET status = 'available'
        WHERE table_id = NEW.table_id;
    END IF;
END //
DELIMITER ;

-- Trigger để cập nhật trạng thái đặt bàn khi thanh toán đặt cọc thành công
DELIMITER //
CREATE TRIGGER update_reservation_status_after_payment
AFTER UPDATE ON Payments
FOR EACH ROW
BEGIN
    IF NEW.payment_status = 'completed' THEN
        UPDATE Reservations
        SET status = 'deposit_paid'
        WHERE reservation_id = NEW.reservation_id;
    ELSEIF NEW.payment_status = 'failed' THEN
        UPDATE Reservations
        SET status = 'pending'
        WHERE reservation_id = NEW.reservation_id;
    END IF;
END //
DELIMITER ;


-- Thêm người dùng
INSERT INTO Users (username, password, email, full_name, phone, role) VALUES
('admin', '$2b$10$examplehash', 'admin@example.com', 'Admin User', '123456789', 'admin'),
('customer1', '$2b$10$examplehash', 'customer1@example.com', 'Customer One', '987654321', 'customer');

-- Thêm bàn
INSERT INTO Tables (table_number, capacity, status, location) VALUES
('B1', 4, 'available', 'Tầng 1'),
('B2', 6, 'available', 'Gần cửa sổ');

-- Thêm món ăn
INSERT INTO Menu (name, price, sale_price, category) VALUES
('Phở Bò', 50000, 35000, 'Món chính'),
('Cơm Tấm', 45000, 40000, 'Món chính');