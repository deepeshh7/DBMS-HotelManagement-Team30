## 10. CODE SNIPPETS FOR INVOKING PROCEDURES/FUNCTIONS/TRIGGERS

### 10.1 Invoking Stored Procedures

#### From MySQL Command Line

**BookRoom Procedure:**
```sql
-- Syntax
CALL BookRoom(guest_id, room_no, check_in_date, check_out_date);

-- Example 1: Successful booking
CALL BookRoom(1, 102, '2025-11-15', '2025-11-18');
-- Output: Reservation_ID = 1, Total_Amount = 4500.00

-- Example 2: Error - Invalid dates
CALL BookRoom(1, 102, '2025-11-18', '2025-11-15');
-- Error: Check-out date must be after check-in date

-- Example 3: Error - Room not available
CALL BookRoom(1, 102, '2025-11-15', '2025-11-18');
-- Error: Room already reserved for these dates
```

**MakePayment Procedure:**
```sql
-- Syntax
CALL MakePayment(reservation_id, amount, payment_method);

-- Example 1: Full payment
CALL MakePayment(1, 4500.00, 'Card');
-- Output: Payment_ID = 1, Status = 'Completed'

-- Example 2: Partial payment
CALL MakePayment(2, 5000.00, 'Cash');
-- Output: Payment_ID = 2, Status = 'Completed'

-- Example 3: Error - Overpayment
CALL MakePayment(1, 5000.00, 'UPI');
-- Error: Payment exceeds reservation total
```

#### From Node.js Backend

**BookRoom from reservationRoutes.js:**
```javascript
// hotel-management-backend/routes/reservationRoutes.js
router.post('/', async (req, res) => {
  try {
    const { guestId, roomNo, checkIn, checkOut } = req.body;
    const conn = await pool.getConnection();
    
    try {
      // Call stored procedure
      const [result] = await conn.query(
        'CALL BookRoom(?, ?, ?, ?)', 
        [guestId, roomNo, checkIn, checkOut]
      );
      
      res.json({ 
        message: 'Reservation created',
        data: result[0]
      });
    } catch (spErr) {
      res.status(400).json({ error: spErr.message });
    } finally {
      conn.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

**MakePayment from paymentRoutes.js:**
```javascript
// hotel-management-backend/routes/paymentRoutes.js
router.post('/', async (req, res) => {
  try {
    const { reservationId, amount, method } = req.body;
    const conn = await pool.getConnection();
    
    try {
      // Call stored procedure
      const [result] = await conn.query(
        'CALL MakePayment(?, ?, ?)', 
        [reservationId, amount, method]
      );
      
      res.json({ 
        message: 'Payment recorded',
        data: result[0]
      });
    } catch (spErr) {
      res.status(400).json({ error: spErr.message });
    } finally {
      conn.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

#### From React Frontend

**BookRoom from Reservations.jsx:**
```javascript
// hotel-management-frontend/src/components/Reservations.jsx
const create = async () => {
  if (!form.guestId || !form.roomNo || !form.checkIn || !form.checkOut) {
    showMessage('error', 'Please fill all fields');
    return;
  }

  try {
    // API call that invokes BookRoom procedure
    await API.post('/reservations', {
      guestId: form.guestId,
      roomNo: form.roomNo,
      checkIn: form.checkIn,
      checkOut: form.checkOut
    });
    
    await loadData();
    setForm({ guestId: '', roomNo: '', checkIn: '', checkOut: '' });
    showMessage('success', 'Reservation created successfully');
  } catch (e) {
    showMessage('error', e.response?.data?.error || 'Failed to create reservation');
  }
};
```

**MakePayment from Payments.jsx:**
```javascript
// hotel-management-frontend/src/components/Payments.jsx
const pay = async () => {
  if (!form.reservationId || !form.amount || parseFloat(form.amount) <= 0) {
    showMessage('error', 'Please fill all fields with valid values');
    return;
  }

  try {
    // API call that invokes MakePayment procedure
    await API.post('/payments', {
      reservationId: form.reservationId,
      amount: parseFloat(form.amount),
      method: form.method
    });
    
    await loadData();
    setForm({ reservationId: '', amount: '', method: 'Cash' });
    showMessage('success', 'Payment recorded successfully');
  } catch (err) {
    showMessage('error', err.response?.data?.error || 'Payment failed');
  }
};
```

### 10.2 Invoking Functions

#### From MySQL Command Line

**StayDuration Function:**
```sql
-- Syntax
SELECT StayDuration(check_in_date, check_out_date);

-- Example 1: Calculate nights
SELECT StayDuration('2025-11-15', '2025-11-18');
-- Output: 3

-- Example 2: Use in query
SELECT Reservation_ID,
       Check_In_Date,
       Check_Out_Date,
       StayDuration(Check_In_Date, Check_Out_Date) AS Nights,
       Total_Amount,
       Total_Amount / StayDuration(Check_In_Date, Check_Out_Date) AS Per_Night_Rate
FROM Reservation
WHERE Status = 'Confirmed';

-- Example 3: Use in WHERE clause
SELECT * FROM Reservation
WHERE StayDuration(Check_In_Date, Check_Out_Date) > 5;
```

#### From Stored Procedure

**Used in BookRoom:**
```sql
-- Inside BookRoom procedure
SET v_days = StayDuration(p_check_in, p_check_out);
SET v_total = v_rent * v_days;
```

### 10.3 Trigger Invocation

Triggers are automatically invoked by database events. Here's how they get triggered:

#### Check-In Trigger

**Automatic Invocation:**
```sql
-- When this UPDATE is executed:
UPDATE Reservation SET Status = 'CheckedIn' WHERE Reservation_ID = 1;

-- Trigger trg_reservation_checkin automatically fires and executes:
UPDATE Room SET Status = 'Occupied' WHERE Room_No = 102;
UPDATE Guest SET Check_In_Status = TRUE WHERE Guest_ID = 1;
```

**From Backend API:**
```javascript
// hotel-management-backend/routes/reservationRoutes.js
router.put('/:id/status', async (req, res) => {
  try {
    const reservationId = req.params.id;
    const { status } = req.body;
    
    // This UPDATE triggers trg_reservation_checkin
    await pool.query(
      'UPDATE Reservation SET Status = ? WHERE Reservation_ID = ?', 
      [status, reservationId]
    );
    
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

**From Frontend:**
```javascript
// hotel-management-frontend/src/components/Reservations.jsx
const setStatus = async (id, status) => {
  try {
    // This API call triggers the check-in trigger
    await API.put(`/reservations/${id}/status`, { status });
    await loadData();
    showMessage('success', `Reservation ${status} successfully`);
  } catch (err) {
    showMessage('error', 'Failed to update status');
  }
};

// Usage
<button onClick={() => setStatus(r.Reservation_ID, 'CheckedIn')}>
  Check In
</button>
```

#### Check-Out Trigger

**Automatic Invocation:**
```sql
-- When this UPDATE is executed:
UPDATE Reservation SET Status = 'CheckedOut' WHERE Reservation_ID = 1;

-- Trigger trg_reservation_checkout automatically fires and executes:
UPDATE Room SET Status = 'Available', Last_Cleaned = NULL WHERE Room_No = 102;
UPDATE Guest SET Check_In_Status = FALSE WHERE Guest_ID = 1;
```

#### Audit Triggers

**Guest Insert Trigger:**
```sql
-- When this INSERT is executed:
INSERT INTO Guest (Name, Contact_Info, Email, Nationality, Gender)
VALUES ('John Doe', '9123456789', 'john@email.com', 'USA', 'Male');

-- Trigger trg_guest_insert automatically fires and executes:
INSERT INTO Audit_Log (Table_Name, Operation, Record_ID, New_Value)
VALUES ('Guest', 'INSERT', LAST_INSERT_ID(), 
        'Name:John Doe, Email:john@email.com');
```

**From Backend:**
```javascript
// hotel-management-backend/routes/guestRoutes.js
router.post('/', async (req, res) => {
  try {
    const { Name, Contact_Info, Email, Nationality, Gender } = req.body;
    
    // This INSERT triggers trg_guest_insert
    const [result] = await pool.query(
      'INSERT INTO Guest (Name, Contact_Info, Email, Nationality, Gender) VALUES (?, ?, ?, ?, ?)',
      [Name, Contact_Info, Email, Nationality, Gender]
    );
    
    res.json({ insertedId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

**Verify Audit Log:**
```sql
-- Check what was logged
SELECT * FROM Audit_Log 
WHERE Table_Name = 'Guest' 
ORDER BY Modified_Date DESC 
LIMIT 10;
```

### 10.4 Complete Workflow Example

**Scenario: Customer books a room, checks in, uses services, makes payment, and checks out**

```sql
-- Step 1: Create guest (triggers trg_guest_insert)
INSERT INTO Guest (Name, Contact_Info, Email, Nationality, Gender)
VALUES ('Alice Smith', '9876543210', 'alice@email.com', 'UK', 'Female');
-- Guest_ID = 5

-- Step 2: Book room (calls BookRoom procedure)
CALL BookRoom(5, 103, '2025-11-20', '2025-11-23');
-- Reservation_ID = 10, Total_Amount = 7500.00
-- Automatically sets Room 103 to 'Occupied'
-- Automatically sets Guest 5 Check_In_Status to TRUE

-- Step 3: Check in (triggers trg_reservation_checkin)
UPDATE Reservation SET Status = 'CheckedIn' WHERE Reservation_ID = 10;
-- Confirms Room 103 is 'Occupied'
-- Confirms Guest 5 is checked in

-- Step 4: Assign service
INSERT INTO Room_Services (Room_No, Service_ID, Quantity, Total_Charge)
VALUES (103, 1, 2, 400.00);
-- Room Service assigned

-- Step 5: Make payment (calls MakePayment procedure)
CALL MakePayment(10, 7900.00, 'Card');
-- Payment_ID = 15
-- Total: 7500 (room) + 400 (service) = 7900

-- Step 6: Check out (triggers trg_reservation_checkout)
UPDATE Reservation SET Status = 'CheckedOut' WHERE Reservation_ID = 10;
-- Room 103 status changes to 'Available'
-- Guest 5 Check_In_Status changes to FALSE

-- Step 7: Verify audit trail
SELECT * FROM Audit_Log WHERE Record_ID = 5 AND Table_Name = 'Guest';
-- Shows INSERT and UPDATE operations
```

### 10.5 Testing Procedures and Functions

**Test Script:**
```sql
-- Test 1: Function
SELECT 'Test 1: StayDuration Function' AS Test;
SELECT StayDuration('2025-11-15', '2025-11-18') AS Result;
-- Expected: 3

-- Test 2: BookRoom Success
SELECT 'Test 2: BookRoom Success' AS Test;
CALL BookRoom(1, 104, '2025-12-01', '2025-12-05');
-- Expected: Reservation created

-- Test 3: BookRoom Error - Invalid dates
SELECT 'Test 3: BookRoom Error - Invalid Dates' AS Test;
CALL BookRoom(1, 105, '2025-12-05', '2025-12-01');
-- Expected: Error message

-- Test 4: MakePayment Success
SELECT 'Test 4: MakePayment Success' AS Test;
CALL MakePayment(1, 2000.00, 'Cash');
-- Expected: Payment recorded

-- Test 5: Trigger - Check In
SELECT 'Test 5: Check-In Trigger' AS Test;
UPDATE Reservation SET Status = 'CheckedIn' WHERE Reservation_ID = 1;
SELECT Status FROM Room WHERE Room_No = (
    SELECT Room_No FROM Reservation WHERE Reservation_ID = 1
);
-- Expected: Occupied

-- Test 6: Audit Log
SELECT 'Test 6: Audit Log' AS Test;
SELECT * FROM Audit_Log ORDER BY Modified_Date DESC LIMIT 5;
-- Expected: Recent operations logged
```

---

