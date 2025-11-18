-- ============================================
-- CAESARS PALACE HOTEL MANAGEMENT SYSTEM
-- COMPLETE SQL QUERIES COLLECTION
-- ============================================

-- ============================================
-- 1. DATABASE CREATION
-- ============================================

DROP DATABASE IF EXISTS hotel_management;
CREATE DATABASE hotel_management;
USE hotel_management;

-- ============================================
-- 2. TABLE CREATION (DDL)
-- ============================================

-- Guest Table
CREATE TABLE Guest (
    Guest_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Contact_Info VARCHAR(20) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Nationality VARCHAR(50),
    Gender ENUM('Male', 'Female', 'Other') NOT NULL,
    Check_In_Status BOOLEAN DEFAULT FALSE,
    Registration_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (Email),
    INDEX idx_check_in_status (Check_In_Status)
);

-- Staff Table
CREATE TABLE Staff (
    Staff_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Dept VARCHAR(50) NOT NULL,
    Age INT NOT NULL,
    Contact_Info VARCHAR(20) NOT NULL,
    Salary DECIMAL(10, 2) NOT NULL,
    Join_Date DATE NOT NULL,
    CONSTRAINT chk_age CHECK (Age >= 18 AND Age <= 65),
    CONSTRAINT chk_salary CHECK (Salary > 0),
    INDEX idx_dept (Dept)
);

-- Room Table
CREATE TABLE Room (
    Room_No INT PRIMARY KEY,
    Category ENUM('Single', 'Double', 'Suite', 'Deluxe') NOT NULL,
    Rent DECIMAL(10, 2) NOT NULL,
    Status ENUM('Available', 'Occupied', 'Maintenance', 'Cleaning') DEFAULT 'Available',
    Last_Cleaned DATETIME,
    CONSTRAINT chk_rent CHECK (Rent > 0),
    INDEX idx_status (Status),
    INDEX idx_category (Category)
);

-- Reservation Table
CREATE TABLE Reservation (
    Reservation_ID INT PRIMARY KEY AUTO_INCREMENT,
    Guest_ID INT NOT NULL,
    Room_No INT NOT NULL,
    Check_In_Date DATE NOT NULL,
    Check_Out_Date DATE NOT NULL,
    Total_Amount DECIMAL(10, 2) NOT NULL,
    Status ENUM('Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled') DEFAULT 'Confirmed',
    Booking_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_dates CHECK (Check_Out_Date > Check_In_Date),
    CONSTRAINT fk_guest FOREIGN KEY (Guest_ID) REFERENCES Guest(Guest_ID) ON DELETE CASCADE,
    CONSTRAINT fk_room FOREIGN KEY (Room_No) REFERENCES Room(Room_No) ON DELETE CASCADE,
    INDEX idx_guest (Guest_ID),
    INDEX idx_room (Room_No),
    INDEX idx_status (Status),
    INDEX idx_dates (Check_In_Date, Check_Out_Date)
);


-- Payment Table
CREATE TABLE Payment (
    Payment_ID INT PRIMARY KEY AUTO_INCREMENT,
    Reservation_ID INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    Payment_Method ENUM('Cash', 'Card', 'UPI', 'Online') NOT NULL,
    Payment_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Completed',
    CONSTRAINT fk_reservation FOREIGN KEY (Reservation_ID) REFERENCES Reservation(Reservation_ID) ON DELETE CASCADE,
    CONSTRAINT chk_amount CHECK (Amount > 0),
    INDEX idx_reservation (Reservation_ID),
    INDEX idx_status (Status)
);

-- Services Table
CREATE TABLE Services (
    Service_ID INT PRIMARY KEY AUTO_INCREMENT,
    Service_Name VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT,
    Charges DECIMAL(10, 2) NOT NULL,
    CONSTRAINT chk_charges CHECK (Charges >= 0),
    INDEX idx_service_name (Service_Name)
);

-- Room_Services Table
CREATE TABLE Room_Services (
    Room_Service_ID INT PRIMARY KEY AUTO_INCREMENT,
    Room_No INT NOT NULL,
    Service_ID INT NOT NULL,
    Quantity INT DEFAULT 1,
    Total_Charge DECIMAL(10, 2) NOT NULL,
    Service_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rs_room FOREIGN KEY (Room_No) REFERENCES Room(Room_No) ON DELETE CASCADE,
    CONSTRAINT fk_rs_service FOREIGN KEY (Service_ID) REFERENCES Services(Service_ID) ON DELETE CASCADE,
    CONSTRAINT chk_quantity CHECK (Quantity > 0),
    INDEX idx_room_service (Room_No, Service_ID)
);

-- Audit_Log Table
CREATE TABLE Audit_Log (
    Log_ID INT PRIMARY KEY AUTO_INCREMENT,
    Table_Name VARCHAR(50) NOT NULL,
    Operation ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    Record_ID INT NOT NULL,
    Old_Value TEXT,
    New_Value TEXT,
    Modified_By VARCHAR(100) DEFAULT 'SYSTEM',
    Modified_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_operation (Table_Name, Operation),
    INDEX idx_modified_date (Modified_Date)
);


-- ============================================
-- 3. FUNCTIONS
-- ============================================

DELIMITER //

CREATE FUNCTION StayDuration(inDate DATE, outDate DATE)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN DATEDIFF(outDate, inDate);
END //

DELIMITER ;

-- ============================================
-- 4. STORED PROCEDURES
-- ============================================

DELIMITER //

-- Procedure to book a room
CREATE PROCEDURE BookRoom(
    IN p_guest_id INT,
    IN p_room_no INT,
    IN p_check_in DATE,
    IN p_check_out DATE
)
BEGIN
    DECLARE v_rent DECIMAL(10, 2);
    DECLARE v_days INT;
    DECLARE v_total DECIMAL(10, 2);
    DECLARE v_room_status VARCHAR(20);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Booking failed';
    END;
    
    START TRANSACTION;
    
    IF p_check_out <= p_check_in THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Check-out date must be after check-in date';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM Guest WHERE Guest_ID = p_guest_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Guest not found';
    END IF;
    
    SELECT Status, Rent INTO v_room_status, v_rent 
    FROM Room 
    WHERE Room_No = p_room_no;
    
    IF v_room_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Room not found';
    END IF;
    
    IF v_room_status != 'Available' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Room is not available';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM Reservation 
        WHERE Room_No = p_room_no 
        AND Status IN ('Confirmed', 'CheckedIn')
        AND (
            (p_check_in BETWEEN Check_In_Date AND Check_Out_Date)
            OR (p_check_out BETWEEN Check_In_Date AND Check_Out_Date)
            OR (Check_In_Date BETWEEN p_check_in AND p_check_out)
        )
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Room already reserved for these dates';
    END IF;
    
    SET v_days = StayDuration(p_check_in, p_check_out);
    SET v_total = v_rent * v_days;
    
    INSERT INTO Reservation (Guest_ID, Room_No, Check_In_Date, Check_Out_Date, Total_Amount, Status)
    VALUES (p_guest_id, p_room_no, p_check_in, p_check_out, v_total, 'Confirmed');
    
    UPDATE Room SET Status = 'Occupied' WHERE Room_No = p_room_no;
    UPDATE Guest SET Check_In_Status = TRUE WHERE Guest_ID = p_guest_id;
    
    COMMIT;
    
    SELECT LAST_INSERT_ID() AS Reservation_ID, v_total AS Total_Amount;
END //

