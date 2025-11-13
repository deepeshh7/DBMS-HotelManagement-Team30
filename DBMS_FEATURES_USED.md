# Complete List of DBMS Features Used in Caesars Palace Hotel Management System

## 📋 Summary

| Feature Type | Count | Details |
|--------------|-------|---------|
| **Functions** | 1 | StayDuration() |
| **Stored Procedures** | 2 | BookRoom(), MakePayment() |
| **Triggers** | 9 | Check-in, Check-out, Cancel, Audit (6) |
| **JOIN Queries** | 4 | INNER JOIN, LEFT JOIN |
| **Nested Queries** | 2 | In stored procedures |
| **Constraints** | 15+ | CHECK, UNIQUE, FOREIGN KEY |
| **Indexes** | 14 | Performance optimization |

---

## 🔧 1. FUNCTIONS (1 Total)

### Function 1: StayDuration()

**Purpose:** Calculate number of nights between check-in and check-out dates

**Definition:**
```sql
CREATE FUNCTION StayDuration(inDate DATE, outDate DATE)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN DATEDIFF(outDate, inDate);
END;
```

**Usage:**
```sql
-- In BookRoom procedure
SET v_days = StayDuration(p_check_in, p_check_out);
SET v_total = v_rent * v_days;
```

**Example:**
```sql
SELECT StayDuration('2025-11-12', '2025-11-15');
-- Returns: 3 (nights)
```

**Where Used:**
- ✅ BookRoom stored procedure
- ✅ Calculates total bill amount

---

## 📦 2. STORED PROCEDURES (2 Total)

### Procedure 1: BookRoom()

**Purpose:** Create a new reservation with validation and automatic updates

**Parameters:**
- `p_guest_id` - Guest ID
- `p_room_no` - Room number
- `p_check_in` - Check-in date
- `p_check_out` - Check-out date

**Definition:**
```sql
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
    
    -- Error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Booking failed';
    END;
    
    START TRANSACTION;
    
    -- 1. Validate dates
    IF p_check_out <= p_check_in THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Check-out date must be after check-in date';
    END IF;
    
    -- 2. Check if guest exists (NESTED QUERY)
    IF NOT EXISTS (SELECT 1 FROM Guest WHERE Guest_ID = p_guest_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Guest not found';
    END IF;
    
    -- 3. Check room availability
    SELECT Status, Rent INTO v_room_status, v_rent 
    FROM Room 
    WHERE Room_No = p_room_no;
    
    IF v_room_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Room not found';
    END IF;
    
    IF v_room_status != 'Available' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Room is not available';
    END IF;
    
    -- 4. Check for overlapping reservations (NESTED QUERY)
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
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Room already reserved for these dates';
    END IF;
    
    -- 5. Calculate total amount using FUNCTION
    SET v_days = StayDuration(p_check_in, p_check_out);
    SET v_total = v_rent * v_days;
    
    -- 6. Create reservation
    INSERT INTO Reservation (Guest_ID, Room_No, Check_In_Date, Check_Out_Date, Total_Amount, Status)
    VALUES (p_guest_id, p_room_no, p_check_in, p_check_out, v_total, 'Confirmed');
    
    -- 7. Update room status
    UPDATE Room SET Status = 'Occupied' WHERE Room_No = p_room_no;
    
    -- 8. Update guest check-in status
    UPDATE Guest SET Check_In_Status = TRUE WHERE Guest_ID = p_guest_id;
    
    COMMIT;
    
    SELECT LAST_INSERT_ID() AS Reservation_ID, v_total AS Total_Amount;
END;
```

**Features Used:**
- ✅ Transaction (START TRANSACTION, COMMIT, ROLLBACK)
- ✅ Error handling (DECLARE EXIT HANDLER)
- ✅ Variables (DECLARE)
- ✅ Conditional logic (IF statements)
- ✅ Nested queries (EXISTS, NOT EXISTS)
- ✅ Function call (StayDuration)
- ✅ Multiple DML operations (INSERT, UPDATE)

**Called From:**
```javascript
// hotel-management-backend/routes/reservationRoutes.js
await conn.query('CALL BookRoom(?, ?, ?, ?)', 
  [guestId, roomNo, checkIn, checkOut]);
```

---

### Procedure 2: MakePayment()

**Purpose:** Record payment with validation

**Parameters:**
- `p_reservation_id` - Reservation ID
- `p_amount` - Payment amount
- `p_method` - Payment method (Cash/Card/UPI/Online)

**Definition:**
```sql
CREATE PROCEDURE MakePayment(
    IN p_reservation_id INT,
    IN p_amount DECIMAL(10, 2),
    IN p_method VARCHAR(20)
)
BEGIN
    DECLARE v_total_amount DECIMAL(10, 2);
    DECLARE v_paid_amount DECIMAL(10, 2);
    DECLARE v_payment_status VARCHAR(20);
    
    -- Error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Payment failed';
    END;
    
    START TRANSACTION;
    
    -- 1. Validate reservation exists
    SELECT Total_Amount INTO v_total_amount 
    FROM Reservation 
    WHERE Reservation_ID = p_reservation_id;
    
    IF v_total_amount IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Reservation not found';
    END IF;
    
    -- 2. Check if amount is valid
    IF p_amount <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid payment amount';
    END IF;
    
    -- 3. Calculate total paid amount (AGGREGATE FUNCTION)
    SELECT COALESCE(SUM(Amount), 0) INTO v_paid_amount
    FROM Payment
    WHERE Reservation_ID = p_reservation_id AND Status = 'Completed';
    
    -- 4. Check if payment exceeds total
    IF (v_paid_amount + p_amount) > v_total_amount THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Payment exceeds reservation total';
    END IF;
    
    -- 5. Determine payment status
    IF (v_paid_amount + p_amount) >= v_total_amount THEN
        SET v_payment_status = 'Completed';
    ELSE
        SET v_payment_status = 'Completed';
    END IF;
    
    -- 6. Insert payment record
    INSERT INTO Payment (Reservation_ID, Amount, Payment_Method, Status)
    VALUES (p_reservation_id, p_amount, p_method, v_payment_status);
    
    COMMIT;
    
    SELECT LAST_INSERT_ID() AS Payment_ID, v_payment_status AS Status;
END;
```

**Features Used:**
- ✅ Transaction
- ✅ Error handling
- ✅ Variables
- ✅ Conditional logic
- ✅ Aggregate function (SUM)
- ✅ COALESCE function

**Called From:**
```javascript
// hotel-management-backend/routes/paymentRoutes.js
await conn.query('CALL MakePayment(?, ?, ?)', 
  [reservationId, amount, method]);
```

---

## ⚡ 3. TRIGGERS (9 Total)

### Category A: Reservation Status Triggers (3)

#### Trigger 1: trg_reservation_checkin

**Purpose:** Auto-update room and guest status when checking in

**Type:** AFTER UPDATE

**Definition:**
```sql
CREATE TRIGGER trg_reservation_checkin
AFTER UPDATE ON Reservation
FOR EACH ROW
BEGIN
    IF NEW.Status = 'CheckedIn' AND OLD.Status != 'CheckedIn' THEN
        UPDATE Room SET Status = 'Occupied' WHERE Room_No = NEW.Room_No;
        UPDATE Guest SET Check_In_Status = TRUE WHERE Guest_ID = NEW.Guest_ID;
    END IF;
END;
```

**When Fired:**
- Admin clicks "Check In" button
- Reservation status changes from 'Confirmed' → 'CheckedIn'

**Actions:**
1. Room status → 'Occupied'
2. Guest Check_In_Status → TRUE

---

#### Trigger 2: trg_reservation_checkout

**Purpose:** Auto-update room and guest status when checking out

**Type:** AFTER UPDATE

**Definition:**
```sql
CREATE TRIGGER trg_reservation_checkout
AFTER UPDATE ON Reservation
FOR EACH ROW
BEGIN
    IF NEW.Status = 'CheckedOut' AND OLD.Status != 'CheckedOut' THEN
        UPDATE Room SET Status = 'Available', Last_Cleaned = NULL 
        WHERE Room_No = NEW.Room_No;
        UPDATE Guest SET Check_In_Status = FALSE WHERE Guest_ID = NEW.Guest_ID;
    END IF;
END;
```

**When Fired:**
- Admin clicks "Check Out" button
- Reservation status changes to 'CheckedOut'

**Actions:**
1. Room status → 'Available'
2. Room Last_Cleaned → NULL
3. Guest Check_In_Status → FALSE

---

#### Trigger 3: trg_reservation_cancel

**Purpose:** Auto-update room and guest status when cancelling

**Type:** AFTER UPDATE

**Definition:**
```sql
CREATE TRIGGER trg_reservation_cancel
AFTER UPDATE ON Reservation
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Cancelled' AND OLD.Status IN ('Confirmed', 'CheckedIn') THEN
        UPDATE Room SET Status = 'Available' WHERE Room_No = NEW.Room_No;
        UPDATE Guest SET Check_In_Status = FALSE WHERE Guest_ID = NEW.Guest_ID;
    END IF;
END;
```

**When Fired:**
- Admin clicks "Cancel" button
- Reservation status changes to 'Cancelled'

**Actions:**
1. Room status → 'Available'
2. Guest Check_In_Status → FALSE

---

### Category B: Audit Triggers (6)

#### Trigger 4: trg_guest_insert

**Purpose:** Log when new guest is added

**Type:** AFTER INSERT

**Definition:**
```sql
CREATE TRIGGER trg_guest_insert
AFTER INSERT ON Guest
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Log (Table_Name, Operation, Record_ID, New_Value)
    VALUES ('Guest', 'INSERT', NEW.Guest_ID, 
            CONCAT('Name:', NEW.Name, ', Email:', NEW.Email));
END;
```

**Example Log:**
```
Table_Name: Guest
Operation: INSERT
Record_ID: 5
New_Value: Name:John Doe, Email:john@email.com
Modified_Date: 2025-11-12 10:30:00
```

---

#### Trigger 5: trg_guest_update

**Purpose:** Log when guest details are modified

**Type:** AFTER UPDATE

**Definition:**
```sql
CREATE TRIGGER trg_guest_update
AFTER UPDATE ON Guest
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Log (Table_Name, Operation, Record_ID, Old_Value, New_Value)
    VALUES ('Guest', 'UPDATE', NEW.Guest_ID,
            CONCAT('Name:', OLD.Name, ', Email:', OLD.Email),
            CONCAT('Name:', NEW.Name, ', Email:', NEW.Email));
END;
```

---

#### Trigger 6: trg_guest_delete

**Purpose:** Log when guest is deleted

**Type:** AFTER DELETE

**Definition:**
```sql
CREATE TRIGGER trg_guest_delete
AFTER DELETE ON Guest
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Log (Table_Name, Operation, Record_ID, Old_Value)
    VALUES ('Guest', 'DELETE', OLD.Guest_ID,
            CONCAT('Name:', OLD.Name, ', Email:', OLD.Email));
END;
```

---

#### Trigger 7: trg_reservation_insert

**Purpose:** Log when new reservation is created

**Type:** AFTER INSERT

**Definition:**
```sql
CREATE TRIGGER trg_reservation_insert
AFTER INSERT ON Reservation
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Log (Table_Name, Operation, Record_ID, New_Value)
    VALUES ('Reservation', 'INSERT', NEW.Reservation_ID,
            CONCAT('Guest:', NEW.Guest_ID, ', Room:', NEW.Room_No, ', Status:', NEW.Status));
END;
```

---

#### Trigger 8: trg_reservation_update

**Purpose:** Log when reservation status changes

**Type:** AFTER UPDATE

**Definition:**
```sql
CREATE TRIGGER trg_reservation_update
AFTER UPDATE ON Reservation
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Log (Table_Name, Operation, Record_ID, Old_Value, New_Value)
    VALUES ('Reservation', 'UPDATE', NEW.Reservation_ID,
            CONCAT('Status:', OLD.Status),
            CONCAT('Status:', NEW.Status));
END;
```

---

## 🔗 4. JOIN QUERIES (4 Total)

### JOIN 1: Reservations with Guest and Room Details

**Location:** `hotel-management-backend/routes/reservationRoutes.js`

**Query:**
```sql
SELECT r.*, g.Name as GuestName, rm.Category as RoomCategory, rm.Rent as RoomRent
FROM Reservation r
JOIN Guest g ON r.Guest_ID = g.Guest_ID
JOIN Room rm ON r.Room_No = rm.Room_No
ORDER BY r.Booking_Date DESC
```

**Type:** INNER JOIN (2 tables joined)

**Purpose:** Get reservation details with guest name and room information

**Result Columns:**
- All reservation columns
- GuestName (from Guest table)
- RoomCategory (from Room table)
- RoomRent (from Room table)

---

### JOIN 2: Payments with Guest Information

**Location:** `hotel-management-backend/routes/paymentRoutes.js`

**Query:**
```sql
SELECT p.*, r.Guest_ID, g.Name AS GuestName
FROM Payment p
JOIN Reservation r ON p.Reservation_ID = r.Reservation_ID
JOIN Guest g ON r.Guest_ID = g.Guest_ID
ORDER BY p.Payment_Date DESC
```

**Type:** INNER JOIN (2 tables joined)

**Purpose:** Get payment details with guest name

**Result Columns:**
- All payment columns
- Guest_ID (from Reservation table)
- GuestName (from Guest table)

---

### JOIN 3: Room Services with Service Details and Guest Info

**Location:** `hotel-management-backend/routes/roomServiceRoutes.js`

**Query:**
```sql
SELECT rs.*, s.Service_Name, s.Charges, r.Reservation_ID, g.Name as GuestName
FROM Room_Services rs
JOIN Services s ON rs.Service_ID = s.Service_ID
LEFT JOIN Reservation r ON rs.Room_No = r.Room_No 
  AND rs.Service_Date >= r.Check_In_Date 
  AND rs.Service_Date <= r.Check_Out_Date
  AND r.Status IN ('CheckedIn', 'CheckedOut')
LEFT JOIN Guest g ON r.Guest_ID = g.Guest_ID
ORDER BY rs.Service_Date DESC
```

**Type:** INNER JOIN + LEFT JOIN (3 tables joined)

**Purpose:** Get room service details with service name and guest information

**Features:**
- ✅ Multiple JOIN conditions
- ✅ Date range filtering in JOIN
- ✅ Status filtering in JOIN

**Result Columns:**
- All room service columns
- Service_Name, Charges (from Services table)
- Reservation_ID (from Reservation table)
- GuestName (from Guest table)

---

### JOIN 4: Complex Join in Frontend (JavaScript)

**Location:** Multiple frontend components

**Example from Reservations.jsx:**
```javascript
// Fetch multiple tables and join in JavaScript
const [reservationsRes, guestsRes, roomsRes, roomServicesRes] = await Promise.all([
  API.get('/reservations'),
  API.get('/guests'),
  API.get('/rooms'),
  API.get('/room-services')
]);

// Manual join logic
const serviceCharges = roomServices
  .filter(rs => rs.Room_No === roomNo && 
                serviceDate >= checkIn && 
                serviceDate <= checkOut)
  .reduce((sum, rs) => sum + parseFloat(rs.Total_Charge), 0);
```

---

## 🔍 5. NESTED QUERIES (2 Total)

### Nested Query 1: Check Guest Exists

**Location:** BookRoom stored procedure

**Query:**
```sql
IF NOT EXISTS (SELECT 1 FROM Guest WHERE Guest_ID = p_guest_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Guest not found';
END IF;
```

**Type:** Correlated subquery with EXISTS

**Purpose:** Validate guest exists before creating reservation

---

### Nested Query 2: Check Overlapping Reservations

**Location:** BookRoom stored procedure

**Query:**
```sql
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
```

**Type:** Correlated subquery with EXISTS

**Purpose:** Prevent double-booking of rooms

**Logic:** Checks if any existing reservation overlaps with requested dates

---

## 🛡️ 6. CONSTRAINTS (15+ Total)

### Primary Key Constraints (8)
```sql
Guest_ID INT PRIMARY KEY AUTO_INCREMENT
Staff_ID INT PRIMARY KEY AUTO_INCREMENT
Room_No INT PRIMARY KEY
Reservation_ID INT PRIMARY KEY AUTO_INCREMENT
Payment_ID INT PRIMARY KEY AUTO_INCREMENT
Service_ID INT PRIMARY KEY AUTO_INCREMENT
Room_Service_ID INT PRIMARY KEY AUTO_INCREMENT
Log_ID INT PRIMARY KEY AUTO_INCREMENT
```

### Foreign Key Constraints (6)
```sql
CONSTRAINT fk_guest FOREIGN KEY (Guest_ID) REFERENCES Guest(Guest_ID) ON DELETE CASCADE
CONSTRAINT fk_room FOREIGN KEY (Room_No) REFERENCES Room(Room_No) ON DELETE CASCADE
CONSTRAINT fk_reservation FOREIGN KEY (Reservation_ID) REFERENCES Reservation(Reservation_ID) ON DELETE CASCADE
CONSTRAINT fk_rs_room FOREIGN KEY (Room_No) REFERENCES Room(Room_No) ON DELETE CASCADE
CONSTRAINT fk_rs_service FOREIGN KEY (Service_ID) REFERENCES Services(Service_ID) ON DELETE CASCADE
```

### CHECK Constraints (6)
```sql
CONSTRAINT chk_age CHECK (Age >= 18 AND Age <= 65)
CONSTRAINT chk_salary CHECK (Salary > 0)
CONSTRAINT chk_rent CHECK (Rent > 0)
CONSTRAINT chk_dates CHECK (Check_Out_Date > Check_In_Date)
CONSTRAINT chk_amount CHECK (Amount > 0)
CONSTRAINT chk_charges CHECK (Charges >= 0)
CONSTRAINT chk_quantity CHECK (Quantity > 0)
```

### UNIQUE Constraints (2)
```sql
Email VARCHAR(100) UNIQUE NOT NULL
Service_Name VARCHAR(100) NOT NULL UNIQUE
```

### NOT NULL Constraints (20+)
Applied to all essential columns

---

## 📊 7. INDEXES (14 Total)

### Single Column Indexes (10)
```sql
INDEX idx_email (Email)                    -- Guest table
INDEX idx_check_in_status (Check_In_Status) -- Guest table
INDEX idx_dept (Dept)                      -- Staff table
INDEX idx_status (Status)                  -- Room table
INDEX idx_category (Category)              -- Room table
INDEX idx_guest (Guest_ID)                 -- Reservation table
INDEX idx_room (Room_No)                   -- Reservation table
INDEX idx_status (Status)                  -- Reservation table
INDEX idx_reservation (Reservation_ID)     -- Payment table
INDEX idx_status (Status)                  -- Payment table
INDEX idx_service_name (Service_Name)      -- Services table
```

### Composite Indexes (4)
```sql
INDEX idx_dates (Check_In_Date, Check_Out_Date)  -- Reservation table
INDEX idx_room_service (Room_No, Service_ID)     -- Room_Services table
INDEX idx_table_operation (Table_Name, Operation) -- Audit_Log table
INDEX idx_modified_date (Modified_Date)          -- Audit_Log table
```

**Purpose:** Speed up queries with WHERE, JOIN, and ORDER BY clauses

---

## 📈 8. AGGREGATE FUNCTIONS USED

### In Stored Procedures
```sql
-- SUM with COALESCE
SELECT COALESCE(SUM(Amount), 0) INTO v_paid_amount
FROM Payment
WHERE Reservation_ID = p_reservation_id AND Status = 'Completed';
```

### In Frontend JavaScript
```javascript
// Calculate total service charges
const serviceCharges = roomServices
  .filter(rs => rs.Room_No === roomNo)
  .reduce((sum, rs) => sum + parseFloat(rs.Total_Charge), 0);

// Count reservations by status
SELECT Status, COUNT(*) FROM Reservation GROUP BY Status;
```

---

## 🎯 Summary of DBMS Concepts

### ✅ Advanced Features
1. **Stored Procedures** - Business logic in database
2. **Triggers** - Automatic data synchronization
3. **Functions** - Reusable calculations
4. **Transactions** - ACID compliance
5. **Error Handling** - Graceful failure management

### ✅ Data Integrity
1. **Primary Keys** - Unique identification
2. **Foreign Keys** - Referential integrity
3. **CHECK Constraints** - Data validation
4. **UNIQUE Constraints** - No duplicates
5. **NOT NULL** - Required fields

### ✅ Performance
1. **Indexes** - Fast data retrieval
2. **Connection Pooling** - Efficient connections
3. **Prepared Statements** - SQL injection prevention

### ✅ Queries
1. **INNER JOIN** - Combine related data
2. **LEFT JOIN** - Include unmatched rows
3. **Nested Queries** - Complex conditions
4. **Aggregate Functions** - Calculations

### ✅ Audit & Logging
1. **Audit_Log Table** - Track all changes
2. **Audit Triggers** - Automatic logging
3. **Timestamps** - When changes occurred

---

**Total DBMS Features: 50+**

This project demonstrates comprehensive use of database management concepts suitable for a DBMS course project!
