 
Mini project report on
Hotel Management System
Bachelor of Technology
in
Computer Science & Engineering
UE23CS351A – DBMS Project 
TEAM NO : 30
Submitted by:
Deepesh Padhy
Chandan B
Dhrushaj Achar	PES2UG23CS163
PES2UG23CS140
PES2UG23CS171

PES University

     









1.	ABSTRACT
The hotel industry requires an efficient system to manage daily operations including room bookings, guest management, staff administration, service assignments, and payment processing. Manual management of these operations is time-consuming, error-prone, and lacks real-time availability tracking.
The system includes an admin dashboard that manages rooms, guests, staff, reservations, payments, and services, supports real-time updates through database triggers, handles complex business logic using stored procedures for tasks like booking validation and payment processing, and maintains a complete audit trail of all database operations for accountability.

Technology Stack: React.js frontend, Node.js/Express backend, MySQL database
Database Features: Stored procedures, triggers, functions, joins, nested queries
Security: Parameterized queries, foreign key constraints, input validation
User Experience: Responsive design, real-time availability, automatic calculations

________________________________________
2.	USER REQUIREMENT SPECIFICATION

2.1 Functional Requirements

Customer Portal Requirements

FR1: Room Browsing
•	Users shall be able to view all available rooms.
•	Users shall be able to filter rooms by category (Single, Double, Suite, Deluxe).
•	Users shall be able to filter rooms by price range.
•	Users shall be able to view room details including category and rent per night.

FR2: Room Booking
•	Users shall be able to select check-in and check-out dates.
•	The system shall display only rooms available for the selected date range.
•	Users shall be able to book a room by providing their name and email.
•	The system shall automatically create a guest profile if one does not already exist.
•	The system shall calculate the total amount based on the number of nights.

FR3: Booking Management
•	Users shall be able to view all their bookings.
•	Users shall be able to view booking status (Confirmed, CheckedIn, CheckedOut, Cancelled).
•	Users shall be able to view the total bill, including room charges and service charges.

Admin Dashboard Requirements

FR4: Guest Management
•	Admin shall be able to view all guests.
•	Admin shall be able to add new guests with details (Name, Contact, Email, Nationality, Gender).
•	Admin shall be able to delete guests (only if they are not checked-in).
•	Admin shall be able to view guest check-in status.

FR5: Room Management
•	Admin shall be able to view all rooms.
•	Admin shall be able to add new rooms with details (Room Number, Category, Rent).
•	Admin shall be able to update room details.
•	Admin shall be able to view room status (Available, Occupied, Maintenance, Cleaning).

FR6: Staff Management
•	Admin shall be able to view all staff members.
•	Admin shall be able to add new staff with details (Name, Department, Age, Contact, Salary, Join Date).
•	Admin shall be able to update staff details (Salary, Department, Contact).
•	Admin shall be able to delete staff members.

FR7: Reservation Management
•	Admin shall be able to view all reservations with guest and room details.
•	Admin shall be able to create new reservations.
•	Admin shall be able to check-in guests (status: Confirmed → CheckedIn).
•	Admin shall be able to check-out guests (status: CheckedIn → CheckedOut).
•	Admin shall be able to cancel reservations.
•	The system shall automatically update room status based on reservation status.

FR8: Payment Management
•	Admin shall be able to view all payments.
•	Admin shall be able to record new payments.
•	The system shall display the total bill (room charges + service charges).
•	The system shall display the amount already paid.
•	The system shall calculate the remaining amount.
•	Admin shall be able to select payment method (Cash, Card, UPI, Online).

FR9: Service Management
•	Admin shall be able to view all available services.
•	Admin shall be able to add new services with details (Name, Description, Charges).
•	Admin shall be able to assign services to checked-in guests.
•	Admin shall be able to specify the quantity of each service.
•	The system shall calculate total service charges.

2.2 Non-Functional Requirements

NFR1: Performance
•	System shall respond to user actions within 2 seconds.
•	Database queries shall be optimized using indexes.
•	The system shall support at least 50 concurrent users.

NFR2: Security
•	The system shall prevent SQL injection using parameterized queries.
•	The system shall validate all user inputs.
•	The system shall maintain audit logs for all critical operations.
•	The system shall enforce foreign key constraints to maintain data integrity.

NFR3: Reliability
•	The system shall use database transactions for critical operations.
•	The system shall handle errors gracefully with clear error messages.
•	The system shall maintain data consistency using triggers.

NFR4: Usability
•	The interface shall be intuitive and easy to navigate.
•	The system shall display meaningful error messages.
•	The system shall provide success confirmations for all operations.
•	The system shall use color-coded status badges for quick identification.

NFR5: Maintainability
•	Code shall be modular and well-organized.
•	The database schema shall be normalized.
•	The system shall maintain comprehensive audit logs.

2.3 System Constraints

SC1: Technical Constraints
•	Frontend: React.js 19.2.0
•	Backend: Node.js with Express.js
•	Database: MySQL 8.0+
•	Browser Support: Modern browsers (Chrome, Firefox, Edge)

SC2: Business Rules
•	Check-out date must be after check-in date.
•	A room cannot be double-booked for overlapping dates.
•	A guest cannot be deleted if currently checked-in.
•	Payment amount cannot exceed reservation total.
•	Staff age must be between 18 and 65.
•	
•	All monetary values must be positive.
________________________________________
3. SOFTWARE AND TOOLS USED

3.1 Development Tools
•	Visual Studio Code (Latest) – Code editor and IDE
•	MySQL Workbench (8.0+) – Database design and management
•	Postman (Latest) – API testing
•	Git (2.x) – Version control system
•	Node.js (14+) – JavaScript runtime environment
•	npm (6+) – Package manager for JavaScript

3.2 Frontend Technologies
•	React.js (19.2.0) – UI framework for building components
•	Axios (1.7.9) – HTTP client for API requests
•	CSS3 – Styling and responsive design
•	JavaScript (ES6+) – Client-side programming language

3.3 Backend Technologies
•	Node.js (14+) – Server-side JavaScript runtime
•	Express.js (4.21.2) – Web application framework
•	mysql2 (3.11.5) – MySQL database driver
•	cors (2.8.5) – Enables cross-origin resource sharing
•	dotenv (16.4.7) – Environment variable management

3.4 Database
•	MySQL (8.0+) – Relational database management system
•	InnoDB Engine – ACID-compliant storage engine
3.5 Programming Languages
•	JavaScript – Used for both frontend and backend logic
•	SQL – Used for database queries, procedures, triggers, and functions
•	HTML5 – Used for web page structure
•	CSS3 – Used for styling and layout

3.6 Development Environment
•	Operating Systems: Windows, Linux, or macOS
•	Supported Browsers: Google Chrome, Mozilla Firefox, Microsoft Edge (latest versions)
•	Terminals: PowerShell or Bash

________________________________________
4.	ER DIAGRAM
 
________________________________________

          5. Relational Schema
5.1 Table Schemas
•	Guest
o	Stores guest details.
o	PK: Guest_ID
o	Email must be unique.
•	Staff
o	Stores staff details.
o	PK: Staff_ID
o	Age between 18–65, Salary > 0.
•	Room
o	Stores room information.
o	PK: Room_No
o	Rent > 0.
•	Reservation
o	Stores booking details.
o	PK: Reservation_ID
o	FK: Guest_ID, Room_No
o	Check_Out_Date > Check_In_Date.
•	Payment
o	Stores payment records.
o	PK: Payment_ID
o	FK: Reservation_ID
o	Amount > 0.
•	Services
o	List of available services.
o	PK: Service_ID
o	Service_Name unique, Charges ≥ 0.
•	Room_Services
o	Services assigned to rooms/guests.
o	PK: Room_Service_ID
o	FK: Room_No, Service_ID
o	Quantity > 0.
•	Audit_Log
o	Logs all database changes.
o	PK: Log_ID

5.2 Normalization (Brief)
•	1NF: All values are atomic; no repeating groups.
•	2NF: No partial dependencies; all attributes fully depend on primary key.
•	3NF: No transitive dependencies; removes redundancy.
________________________________________
6.	DDL Commands
Database Commands
•	DROP DATABASE
•	CREATE DATABASE
•	USE
Table Commands
•	CREATE TABLE
•	ALTER TABLE
•	DROP TABLE
Column & Constraint Commands (inside CREATE/ALTER)
•	PRIMARY KEY
•	FOREIGN KEY
•	UNIQUE
•	CHECK
•	INDEX
•	AUTO_INCREMENT
•	DEFAULT
•	ENUM
•	NOT NULL
Index Commands
•	CREATE INDEX (via ADD INDEX)
•	DROP INDEX

________________________________________
7.	CRUD OPERATIONS

7.1 CREATE Operations
-- Create Guest
INSERT INTO Guest (Name, Contact_Info, Email, Nationality, Gender) 
VALUES ('John Doe', '9123456789', 'john@email.com', 'USA', 'Male');

-- Create Reservation (Stored Procedure)
CALL BookRoom(1, 102, '2025-11-15', '2025-11-18');

-- Create Service
INSERT INTO Services (Service_Name, Description, Charges) 
VALUES ('Room Service', 'Food delivery to room', 200.00);

7.2 READ Operations
-- Read All Guests
SELECT * FROM Guest ORDER BY Guest_ID DESC;

-- Read Reservations with Join
SELECT r.*, g.Name AS GuestName, rm.Category AS RoomCategory, rm.Rent AS RoomRent
FROM Reservation r
JOIN Guest g ON r.Guest_ID = g.Guest_ID
JOIN Room rm ON r.Room_No = rm.Room_No
ORDER BY r.Booking_Date DESC;

-- Read Payments with Guest Info
SELECT p.*, r.Guest_ID, g.Name AS GuestName
FROM Payment p
JOIN Reservation r ON p.Reservation_ID = r.Reservation_ID
JOIN Guest g ON r.Guest_ID = g.Guest_ID
ORDER BY p.Payment_Date DESC;

7.3 UPDATE Operations
-- Update Reservation Status (Check-In)
UPDATE Reservation 
SET Status = 'CheckedIn' 
WHERE Reservation_ID = 1;

-- Update Staff Details
UPDATE Staff
SET Salary = 28000.00, Dept = 'Front Desk', Contact_Info = '9876543210'
WHERE Staff_ID = 1;

7.4 DELETE Operations
-- Delete Guest
DELETE FROM Guest WHERE Guest_ID = 5;

-- Delete Staff
DELETE FROM Staff WHERE Staff_ID = 3;
________________________________________

8. APPLICATION FEATURES
8.1 Landing Page
•	Hotel homepage with hero banner
•	Buttons for Book Now (customer) and Admin Login
•	Basic hotel info and amenities
 

8.2 Customer Portal
•	Browse available rooms with filters (category, price, dates)
•	View room details and total stay cost
•	Book rooms directly using check-in and check-out dates
•	View personal bookings with status and billing information
•	 

 



8.3 Admin Dashboard
•	Overview of hotel statistics (rooms, guests, reservations, revenue)
•	Room Management: Add/update rooms, change status
•	Guest Management: Add, view, update, delete guests
•	Staff Management: Manage staff details
•	Reservation Management:
o	Create reservations
o	Check-in / Check-out / Cancel bookings
o	Extend guest stay by modifying check-out date
•	Payment Management: Record payments and track bills
•	Service Management: Add services and assign them to guests
•	 


8.4 User Experience Features
•	Real-time updates for room availability and billing
•	Input validation and error handling
•	Responsive UI for mobile and desktop
•	Status badges for quick visual identification
•	
 

________________________________________

9. ADVANCED DATABASE FEATURES

9.1 Stored Procedures
Procedure: BookRoom
DELIMITER //
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

    START TRANSACTION;

    IF p_check_out <= p_check_in THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid dates';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM Guest WHERE Guest_ID = p_guest_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Guest not found';
    END IF;

    SELECT Status, Rent INTO v_room_status, v_rent
    FROM Room WHERE Room_No = p_room_no;

    IF v_room_status != 'Available' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Room not available';
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
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Room already booked';
    END IF;

    SET v_days = StayDuration(p_check_in, p_check_out);
    SET v_total = v_rent * v_days;

    INSERT INTO Reservation (
        Guest_ID, Room_No, Check_In_Date, Check_Out_Date,
        Total_Amount, Status
    ) VALUES (
        p_guest_id, p_room_no, p_check_in, p_check_out,
        v_total, 'Confirmed'
    );

    UPDATE Room SET Status = 'Occupied' WHERE Room_No = p_room_no;
    UPDATE Guest SET Check_In_Status = TRUE WHERE Guest_ID = p_guest_id;

    COMMIT;

    SELECT LAST_INSERT_ID() AS Reservation_ID, v_total AS Total_Amount;
END //
DELIMITER ;

Procedure: MakePayment
DELIMITER //
CREATE PROCEDURE MakePayment(
    IN p_reservation_id INT,
    IN p_amount DECIMAL(10, 2),
    IN p_method VARCHAR(20)
)
BEGIN
    DECLARE v_total DECIMAL(10, 2);
    DECLARE v_paid DECIMAL(10, 2);

    START TRANSACTION;

    SELECT Total_Amount INTO v_total
    FROM Reservation
    WHERE Reservation_ID = p_reservation_id;

    SELECT COALESCE(SUM(Amount), 0)
    INTO v_paid
    FROM Payment
    WHERE Reservation_ID = p_reservation_id;

    IF (v_paid + p_amount) > v_total THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Overpayment';
    END IF;

    INSERT INTO Payment (Reservation_ID, Amount, Payment_Method, Status)
    VALUES (p_reservation_id, p_amount, p_method, 'Completed');

    COMMIT;

    SELECT LAST_INSERT_ID() AS Payment_ID;
END //
DELIMITER ;

9.2 Functions
Function: StayDuration
DELIMITER //
CREATE FUNCTION StayDuration(inDate DATE, outDate DATE)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN DATEDIFF(outDate, inDate);
END //
DELIMITER ;

9.3 Triggers
Trigger: Check-In
DELIMITER //
CREATE TRIGGER trg_reservation_checkin
AFTER UPDATE ON Reservation
FOR EACH ROW
BEGIN
    IF NEW.Status = 'CheckedIn' AND OLD.Status != 'CheckedIn' THEN
        UPDATE Room SET Status = 'Occupied' WHERE Room_No = NEW.Room_No;
        UPDATE Guest SET Check_In_Status = TRUE WHERE Guest_ID = NEW.Guest_ID;
    END IF;
END //
DELIMITER ;
Trigger: Check-Out
DELIMITER //
CREATE TRIGGER trg_reservation_checkout
AFTER UPDATE ON Reservation
FOR EACH ROW
BEGIN
    IF NEW.Status = 'CheckedOut' AND OLD.Status != 'CheckedOut' THEN
        UPDATE Room 
        SET Status = 'Available', Last_Cleaned = NULL 
        WHERE Room_No = NEW.Room_No;

        UPDATE Guest 
        SET Check_In_Status = FALSE 
        WHERE Guest_ID = NEW.Guest_ID;
    END IF;
END //
DELIMITER ;
Trigger: Audit (Insert)
DELIMITER //
CREATE TRIGGER trg_guest_insert
AFTER INSERT ON Guest
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Log (Table_Name, Operation, Record_ID, New_Value)
    VALUES ('Guest', 'INSERT', NEW.Guest_ID,
            CONCAT('Name:', NEW.Name, ', Email:', NEW.Email));
END //
DELIMITER ;

9.4 JOIN Queries
JOIN: Reservation + Guest + Room
SELECT r.*, g.Name AS GuestName, rm.Category AS RoomCategory, rm.Rent AS RoomRent
FROM Reservation r
JOIN Guest g ON r.Guest_ID = g.Guest_ID
JOIN Room rm ON r.Room_No = rm.Room_No
ORDER BY r.Booking_Date DESC;
JOIN: Payments with Guest
SELECT p.*, g.Name AS GuestName
FROM Payment p
JOIN Reservation r ON p.Reservation_ID = r.Reservation_ID
JOIN Guest g ON r.Guest_ID = g.Guest_ID
ORDER BY p.Payment_Date DESC;
JOIN: Room Services + Services + Guest
SELECT rs.*, s.Service_Name, g.Name AS GuestName
FROM Room_Services rs
JOIN Services s ON rs.Service_ID = s.Service_ID
LEFT JOIN Reservation r ON r.Room_No = rs.Room_No
LEFT JOIN Guest g ON g.Guest_ID = r.Guest_ID;

9.5 Nested Queries
Check Guest Exists
SELECT 1 
FROM Guest 
WHERE Guest_ID = p_guest_id;
Check Overlapping Reservations
SELECT 1 
FROM Reservation
WHERE Room_No = p_room_no
AND Status IN ('Confirmed', 'CheckedIn')
AND (
    (p_check_in BETWEEN Check_In_Date AND Check_Out_Date)
    OR (p_check_out BETWEEN Check_In_Date AND Check_Out_Date)
    OR (Check_In_Date BETWEEN p_check_in AND p_check_out)
);
Find Available Rooms
SELECT Room_No 
FROM Room
WHERE Room_No NOT IN (
    SELECT Room_No FROM Reservation
    WHERE Status IN ('Confirmed', 'CheckedIn')
    AND NOT (
        Check_Out_Date <= '2025-11-15'
        OR Check_In_Date >= '2025-11-18'
    )
);

9.6 Aggregate Queries
Total Revenue
SELECT SUM(Amount) AS Total_Revenue
FROM Payment
WHERE Status = 'Completed';
Reservations by Status
SELECT Status, COUNT(*) AS Count
FROM Reservation
GROUP BY Status;
Average Rent by Category
SELECT Category, AVG(Rent) AS Avg_Rent
FROM Room
GROUP BY Category;
Total Service Charges per Guest
SELECT g.Name, SUM(rs.Total_Charge) AS Total_Service_Charges
FROM Guest g
JOIN Reservation r ON g.Guest_ID = r.Guest_ID
JOIN Room_Services rs ON r.Room_No = rs.Room_No
GROUP BY g.Guest_ID, g.Name;
________________________________________

10. CODE SNIPPETS FOR INVOKING PROCEDURES / FUNCTIONS / TRIGGERS

10.1 Invoking Stored Procedures
BookRoom Procedure — MySQL
CALL BookRoom(1, 102, '2025-11-15', '2025-11-18');
MakePayment Procedure — MySQL
CALL MakePayment(1, 4500.00, 'Card');
BookRoom Procedure — Node.js
await conn.query(
  'CALL BookRoom(?, ?, ?, ?)',
  [guestId, roomNo, checkIn, checkOut]
);
MakePayment Procedure — Node.js
await conn.query(
  'CALL MakePayment(?, ?, ?)', 
  [reservationId, amount, method]
);
BookRoom Procedure — React Frontend
await API.post('/reservations', {
  guestId: form.guestId,
  roomNo: form.roomNo,
  checkIn: form.checkIn,
  checkOut: form.checkOut
});
MakePayment Procedure — React Frontend
await API.post('/payments', {
  reservationId: form.reservationId,
  amount: form.amount,
  method: form.method
});

10.2 Invoking Functions
StayDuration Function — MySQL
SELECT StayDuration('2025-11-15', '2025-11-18');
Using StayDuration in Query
SELECT Reservation_ID,
       StayDuration(Check_In_Date, Check_Out_Date) AS Nights
FROM Reservation;
Using StayDuration Inside a Procedure
SET v_days = StayDuration(p_check_in, p_check_out);

10.3 Trigger Invocation
Trigger Fired on Check-In
UPDATE Reservation 
SET Status = 'CheckedIn' 
WHERE Reservation_ID = 1;
Trigger Fired on Check-Out
UPDATE Reservation 
SET Status = 'CheckedOut' 
WHERE Reservation_ID = 1;
Trigger Fired on Guest Insert
INSERT INTO Guest (Name, Contact_Info, Email, Nationality, Gender)
VALUES ('John Doe', '9123456789', 'john@email.com', 'USA', 'Male');
Trigger Invocation from Backend (Example)
await pool.query(
  'UPDATE Reservation SET Status = ? WHERE Reservation_ID = ?',
  [status, reservationId]
);












