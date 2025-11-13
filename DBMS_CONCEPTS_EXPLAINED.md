# DBMS Concepts & Web Integration - Complete Guide

## 📚 Table of Contents
1. [Database Design & Normalization](#database-design)
2. [SQL Concepts Used](#sql-concepts)
3. [How Database Connects to Web](#database-to-web-connection)
4. [Data Flow Explanation](#data-flow)
5. [DBMS Features Implementation](#dbms-features)

---

## 🗄️ Database Design & Normalization

### What is Database Normalization?

Normalization is organizing data to reduce redundancy and improve data integrity.

### Our Database is in **3rd Normal Form (3NF)**

#### 1st Normal Form (1NF)
✅ Each column contains atomic (single) values
✅ Each column has a unique name
✅ Each row is unique (has primary key)

**Example:**
```sql
-- ❌ NOT in 1NF (multiple values in one column)
Guest: ID=1, Name="John", Phones="123,456,789"

-- ✅ IN 1NF (atomic values)
Guest: ID=1, Name="John", Contact_Info="123456789"
```

#### 2nd Normal Form (2NF)
✅ Must be in 1NF
✅ No partial dependencies (all non-key columns depend on entire primary key)

**Example:**
```sql
-- ✅ Reservation table
Reservation_ID | Guest_ID | Room_No | Total_Amount
      1        |    5     |   101   |   4500

-- Guest_ID and Room_No together determine the reservation
-- Total_Amount depends on the entire key, not just part of it
```

#### 3rd Normal Form (3NF)
✅ Must be in 2NF
✅ No transitive dependencies (non-key columns don't depend on other non-key columns)

**Example:**
```sql
-- ❌ NOT in 3NF
Reservation: ID, Guest_ID, Guest_Name, Guest_Email
-- Guest_Name depends on Guest_ID (transitive dependency)

-- ✅ IN 3NF (separate tables)
Reservation: ID, Guest_ID
Guest: Guest_ID, Name, Email
```

### Entity-Relationship (ER) Diagram

```
┌─────────┐         ┌──────────────┐         ┌──────┐
│  Guest  │────────>│ Reservation  │<────────│ Room │
└─────────┘  1:N    └──────────────┘   N:1   └──────┘
                           │
                           │ 1:N
                           ▼
                    ┌──────────┐
                    │ Payment  │
                    └──────────┘

┌──────────┐         ┌────────────────┐         ┌──────┐
│ Services │────────>│ Room_Services  │<────────│ Room │
└──────────┘  1:N    └────────────────┘   N:1   └──────┘
```

### Relationships Explained

**1. Guest → Reservation (One-to-Many)**
- One guest can have multiple reservations
- Each reservation belongs to one guest

**2. Room → Reservation (One-to-Many)**
- One room can have multiple reservations (over time)
- Each reservation is for one room

**3. Reservation → Payment (One-to-Many)**
- One reservation can have multiple payments (partial payments)
- Each payment is for one reservation

**4. Room ↔ Services (Many-to-Many)**
- One room can have multiple services
- One service can be used by multiple rooms
- **Room_Services** is the junction table

---

## 🔧 SQL Concepts Used

### 1. Primary Keys (PK)

**What:** Unique identifier for each row

```sql
CREATE TABLE Guest (
    Guest_ID INT PRIMARY KEY AUTO_INCREMENT,  -- PK
    Name VARCHAR(100),
    Email VARCHAR(100) UNIQUE
);
```

**Why:** Ensures each guest has a unique ID

### 2. Foreign Keys (FK)

**What:** Links tables together, maintains referential integrity

```sql
CREATE TABLE Reservation (
    Reservation_ID INT PRIMARY KEY,
    Guest_ID INT,
    Room_No INT,
    FOREIGN KEY (Guest_ID) REFERENCES Guest(Guest_ID),
    FOREIGN KEY (Room_No) REFERENCES Room(Room_No)
);
```

**Why:** 
- Can't create reservation for non-existent guest
- Can't delete guest who has active reservations

### 3. Constraints

**UNIQUE Constraint**
```sql
Email VARCHAR(100) UNIQUE  -- No duplicate emails
```

**CHECK Constraint**
```sql
CONSTRAINT chk_age CHECK (Age >= 18 AND Age <= 65)
CONSTRAINT chk_dates CHECK (Check_Out_Date > Check_In_Date)
```

**NOT NULL Constraint**
```sql
Name VARCHAR(100) NOT NULL  -- Name is required
```

### 4. Indexes

**What:** Speed up data retrieval

```sql
INDEX idx_email (Email),
INDEX idx_status (Status),
INDEX idx_dates (Check_In_Date, Check_Out_Date)
```

**Why:** Faster searches when filtering by email, status, or dates

### 5. Stored Procedures

**What:** Pre-compiled SQL code stored in database

**Example: BookRoom Procedure**
```sql
CREATE PROCEDURE BookRoom(
    IN p_guest_id INT,
    IN p_room_no INT,
    IN p_check_in DATE,
    IN p_check_out DATE
)
BEGIN
    -- Validate dates
    IF p_check_out <= p_check_in THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid dates';
    END IF;
    
    -- Check room availability
    IF (SELECT Status FROM Room WHERE Room_No = p_room_no) != 'Available' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Room not available';
    END IF;
    
    -- Calculate total
    SET v_total = v_rent * DATEDIFF(p_check_out, p_check_in);
    
    -- Create reservation
    INSERT INTO Reservation (...) VALUES (...);
    
    -- Update room status
    UPDATE Room SET Status = 'Occupied' WHERE Room_No = p_room_no;
END;
```

**Benefits:**
- ✅ Business logic in database
- ✅ Reduces network traffic
- ✅ Ensures data consistency
- ✅ Reusable code

### 6. Triggers

**What:** Automatic actions when data changes

**Example: Check-In Trigger**
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

**When it runs:**
- Admin clicks "Check In" button
- Reservation status changes to 'CheckedIn'
- Trigger automatically:
  - Marks room as Occupied
  - Updates guest check-in status

**Benefits:**
- ✅ Automatic data synchronization
- ✅ No need to write update code in application
- ✅ Ensures consistency

### 7. Functions

**What:** Returns a single value

```sql
CREATE FUNCTION StayDuration(inDate DATE, outDate DATE)
RETURNS INT
BEGIN
    RETURN DATEDIFF(outDate, inDate);
END;
```

**Usage:**
```sql
SELECT StayDuration('2025-11-12', '2025-11-15');  -- Returns: 3
```

### 8. Transactions

**What:** Group of SQL statements that execute as one unit

```sql
START TRANSACTION;

    INSERT INTO Reservation (...);
    UPDATE Room SET Status = 'Occupied';
    UPDATE Guest SET Check_In_Status = TRUE;

COMMIT;  -- Save all changes

-- OR

ROLLBACK;  -- Undo all changes if error
```

**ACID Properties:**
- **A**tomicity: All or nothing
- **C**onsistency: Data remains valid
- **I**solation: Transactions don't interfere
- **D**urability: Changes are permanent

### 9. Joins

**INNER JOIN** - Get matching records from both tables
```sql
SELECT r.*, g.Name as GuestName
FROM Reservation r
INNER JOIN Guest g ON r.Guest_ID = g.Guest_ID;
```

**LEFT JOIN** - Get all from left table, matching from right
```sql
SELECT rs.*, s.Service_Name
FROM Room_Services rs
LEFT JOIN Services s ON rs.Service_ID = s.Service_ID;
```

### 10. Aggregate Functions

```sql
-- Count total reservations
SELECT COUNT(*) FROM Reservation;

-- Sum of all payments
SELECT SUM(Amount) FROM Payment;

-- Average room rent
SELECT AVG(Rent) FROM Room;

-- Group by status
SELECT Status, COUNT(*) 
FROM Reservation 
GROUP BY Status;
```

---

## 🔗 How Database Connects to Web

### Architecture Overview

```
┌─────────────┐      HTTP       ┌─────────────┐      SQL      ┌──────────┐
│   Browser   │ ←──────────────→ │   Node.js   │ ←───────────→ │  MySQL   │
│  (React)    │   JSON/REST     │  (Express)  │   Queries     │ Database │
└─────────────┘                 └─────────────┘               └──────────┘
```

### Step-by-Step Connection Process

#### Step 1: Database Configuration

**File: `hotel-management-backend/config/db.js`**
```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,        // localhost
  user: process.env.DB_USER,        // root
  password: process.env.DB_PASSWORD, // Deepz420#
  database: process.env.DB_NAME,    // hotel_management
  port: process.env.DB_PORT,        // 3306
  waitForConnections: true,
  connectionLimit: 10,              // Max 10 simultaneous connections
  queueLimit: 0
});

module.exports = pool;
```

**What's happening:**
- Creates a pool of database connections
- Reuses connections instead of creating new ones
- More efficient than single connection

#### Step 2: Environment Variables

**File: `hotel-management-backend/.env`**
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD="Deepz420#"
DB_NAME=hotel_management
PORT=5000
```

**Why use .env:**
- ✅ Keep passwords secret
- ✅ Easy to change settings
- ✅ Different settings for dev/production

#### Step 3: Backend Routes (API Endpoints)

**File: `hotel-management-backend/routes/guestRoutes.js`**
```javascript
const express = require('express');
const router = express.Router();
const pool = require('../config/db');  // Import database connection

// GET all guests
router.get('/', async (req, res) => {
  try {
    // Execute SQL query
    const [rows] = await pool.query('SELECT * FROM Guest ORDER BY Guest_ID DESC');
    
    // Send data as JSON
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new guest
router.post('/', async (req, res) => {
  try {
    const { Name, Contact_Info, Email, Nationality, Gender } = req.body;
    
    // Execute INSERT query
    const [result] = await pool.query(
      'INSERT INTO Guest (Name, Contact_Info, Email, Nationality, Gender) VALUES (?, ?, ?, ?, ?)',
      [Name, Contact_Info, Email, Nationality, Gender]
    );
    
    res.json({ insertedId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

**What's happening:**
1. Import database connection pool
2. Define route handlers (GET, POST, PUT, DELETE)
3. Execute SQL queries using pool
4. Return results as JSON

#### Step 4: Server Setup

**File: `hotel-management-backend/server.js`**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const guestsRouter = require('./routes/guestRoutes');
const roomsRouter = require('./routes/roomRoutes');
// ... other routes

const app = express();

// Middleware
app.use(cors());              // Allow cross-origin requests
app.use(express.json());      // Parse JSON request bodies

// Register routes
app.use('/api/guests', guestsRouter);
app.use('/api/rooms', roomsRouter);
// ... other routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**What's happening:**
1. Create Express app
2. Enable CORS (allows React to call API)
3. Parse JSON data
4. Register all routes
5. Start server on port 5000

#### Step 5: Frontend API Configuration

**File: `hotel-management-frontend/src/api.js`**
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // Backend URL
  timeout: 6000,
});

export default API;
```

**What's happening:**
- Configure axios to always use backend URL
- Set timeout for requests
- Export for use in components

#### Step 6: React Component Using API

**File: `hotel-management-frontend/src/components/Guests.jsx`**
```javascript
import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Guests() {
  const [guests, setGuests] = useState([]);

  // Load guests when component mounts
  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      // Call backend API
      const res = await API.get('/guests');
      
      // Update state with data
      setGuests(res.data);
    } catch (err) {
      console.error('Failed to load guests');
    }
  };

  const addGuest = async (formData) => {
    try {
      // Send POST request
      await API.post('/guests', formData);
      
      // Reload guests
      await loadGuests();
    } catch (err) {
      console.error('Failed to add guest');
    }
  };

  return (
    <div>
      {guests.map(guest => (
        <div key={guest.Guest_ID}>
          {guest.Name} - {guest.Email}
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Complete Data Flow Example

### Example: Customer Books a Room

#### 1. User Action (Frontend)
```
User clicks "Book Now" button
↓
React component calls: handleBookRoom(roomNo)
```

#### 2. Frontend API Call
```javascript
// CustomerPortal.jsx
const handleBookRoom = async (roomNo) => {
  await API.post('/reservations', {
    guestId: guest.Guest_ID,
    roomNo: roomNo,
    checkIn: '2025-11-12',
    checkOut: '2025-11-15'
  });
};
```

#### 3. HTTP Request
```
POST http://localhost:5000/api/reservations
Content-Type: application/json

{
  "guestId": 5,
  "roomNo": 101,
  "checkIn": "2025-11-12",
  "checkOut": "2025-11-15"
}
```

#### 4. Backend Route Handler
```javascript
// reservationRoutes.js
router.post('/', async (req, res) => {
  const { guestId, roomNo, checkIn, checkOut } = req.body;
  
  // Call stored procedure
  await conn.query('CALL BookRoom(?, ?, ?, ?)', 
    [guestId, roomNo, checkIn, checkOut]);
  
  res.json({ message: 'Reservation created' });
});
```

#### 5. Database Stored Procedure
```sql
-- BookRoom procedure executes
BEGIN
  -- Calculate nights
  SET v_days = DATEDIFF(checkOut, checkIn);  -- 3 nights
  
  -- Get room rent
  SELECT Rent INTO v_rent FROM Room WHERE Room_No = 101;  -- ₹1500
  
  -- Calculate total
  SET v_total = v_rent * v_days;  -- ₹4500
  
  -- Insert reservation
  INSERT INTO Reservation (Guest_ID, Room_No, Check_In_Date, Check_Out_Date, Total_Amount)
  VALUES (5, 101, '2025-11-12', '2025-11-15', 4500);
  
  -- Update room status
  UPDATE Room SET Status = 'Occupied' WHERE Room_No = 101;
  
  -- Update guest status
  UPDATE Guest SET Check_In_Status = TRUE WHERE Guest_ID = 5;
END;
```

#### 6. Database Triggers Fire
```sql
-- trg_reservation_insert trigger
INSERT INTO Audit_Log (Table_Name, Operation, Record_ID, New_Value)
VALUES ('Reservation', 'INSERT', 1, 'Guest:5, Room:101');
```

#### 7. Response Back to Frontend
```
HTTP 200 OK
Content-Type: application/json

{
  "message": "Reservation created"
}
```

#### 8. Frontend Updates UI
```javascript
// Show success message
showMessage('success', 'Room booked successfully!');

// Reload data
loadRooms();
loadMyBookings();
```

---

## 🎯 DBMS Features Implementation

### 1. Data Integrity

**Primary Keys**
```sql
Guest_ID INT PRIMARY KEY AUTO_INCREMENT
```
- Ensures each guest is unique
- Auto-generates IDs

**Foreign Keys**
```sql
FOREIGN KEY (Guest_ID) REFERENCES Guest(Guest_ID) ON DELETE CASCADE
```
- Can't create reservation for non-existent guest
- Deleting guest deletes their reservations

**Constraints**
```sql
CONSTRAINT chk_age CHECK (Age >= 18 AND Age <= 65)
Email VARCHAR(100) UNIQUE
```
- Validates data before insertion
- Prevents invalid data

### 2. Data Consistency

**Transactions**
```sql
START TRANSACTION;
  INSERT INTO Reservation (...);
  UPDATE Room SET Status = 'Occupied';
COMMIT;
```
- Both operations succeed or both fail
- No partial updates

**Triggers**
```sql
-- Auto-update related tables
AFTER UPDATE ON Reservation
  UPDATE Room ...
  UPDATE Guest ...
```
- Keeps data synchronized
- No manual updates needed

### 3. Data Security

**Parameterized Queries**
```javascript
// ✅ SAFE - Prevents SQL injection
pool.query('SELECT * FROM Guest WHERE Email = ?', [email]);

// ❌ UNSAFE - Vulnerable to SQL injection
pool.query(`SELECT * FROM Guest WHERE Email = '${email}'`);
```

**Audit Logging**
```sql
-- Track all changes
INSERT INTO Audit_Log (Table_Name, Operation, Old_Value, New_Value)
```

### 4. Performance Optimization

**Indexes**
```sql
INDEX idx_email (Email)
INDEX idx_status (Status)
```
- Faster searches
- Optimized queries

**Connection Pooling**
```javascript
connectionLimit: 10
```
- Reuse connections
- Handle multiple requests

**Stored Procedures**
```sql
CALL BookRoom(...)
```
- Pre-compiled code
- Faster execution

### 5. Data Redundancy Elimination

**Normalization**
```
Instead of:
Reservation: ID, Guest_Name, Guest_Email, Room_No, Room_Category

We have:
Reservation: ID, Guest_ID, Room_No
Guest: Guest_ID, Name, Email
Room: Room_No, Category
```
- No duplicate data
- Update in one place

---

## 🔍 Query Examples

### Simple SELECT
```sql
SELECT * FROM Guest WHERE Email = 'john@email.com';
```

### JOIN Query
```sql
SELECT r.Reservation_ID, g.Name, rm.Room_No, rm.Category
FROM Reservation r
INNER JOIN Guest g ON r.Guest_ID = g.Guest_ID
INNER JOIN Room rm ON r.Room_No = rm.Room_No
WHERE r.Status = 'CheckedIn';
```

### Aggregate Query
```sql
SELECT 
  Status, 
  COUNT(*) as Total,
  SUM(Total_Amount) as Revenue
FROM Reservation
GROUP BY Status;
```

### Subquery
```sql
SELECT * FROM Guest
WHERE Guest_ID IN (
  SELECT Guest_ID FROM Reservation WHERE Status = 'CheckedIn'
);
```

---

## 📝 Summary

### Database → Backend → Frontend Flow

1. **MySQL Database** stores all data
2. **Node.js Backend** connects to database using mysql2
3. **Express Routes** handle HTTP requests and execute SQL
4. **React Frontend** calls backend APIs using axios
5. **User sees data** rendered in browser

### Key DBMS Concepts Used

✅ Normalization (3NF)  
✅ Primary & Foreign Keys  
✅ Constraints & Validation  
✅ Stored Procedures  
✅ Triggers  
✅ Transactions  
✅ Indexes  
✅ Joins  
✅ Aggregate Functions  
✅ Audit Logging  

### Why This Architecture?

- **Separation of Concerns**: Database, backend, frontend are independent
- **Scalability**: Can add more servers, databases
- **Maintainability**: Easy to update one part without affecting others
- **Security**: Database not directly accessible from browser
- **Performance**: Connection pooling, indexes, stored procedures

---

**End of DBMS Concepts Guide**
