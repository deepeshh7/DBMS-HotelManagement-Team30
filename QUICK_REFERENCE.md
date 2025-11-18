# QUICK REFERENCE GUIDE
## Caesars Palace Hotel Management System

---

## 🚀 QUICK START

### Database Setup
```bash
mysql -u root -p
source schema.sql
```

### Backend Setup
```bash
cd hotel-management-backend
npm install
npm start
```

### Frontend Setup
```bash
cd hotel-management-frontend
npm install
npm start
```

### Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin Login: admin@hotel.com / admin123

---

## 📊 DATABASE QUICK REFERENCE

### Tables
1. **Guest** - Customer information
2. **Staff** - Employee records
3. **Room** - Room inventory
4. **Reservation** - Booking records
5. **Payment** - Payment transactions
6. **Services** - Service catalog
7. **Room_Services** - Service assignments
8. **Audit_Log** - Change tracking

### Functions
- `StayDuration(check_in, check_out)` - Calculate nights

### Stored Procedures
- `BookRoom(guest_id, room_no, check_in, check_out)` - Create reservation
- `MakePayment(reservation_id, amount, method)` - Record payment

### Triggers
- `trg_reservation_checkin` - Auto-update on check-in
- `trg_reservation_checkout` - Auto-update on check-out
- `trg_reservation_cancel` - Auto-update on cancellation
- `trg_guest_insert/update/delete` - Audit logging
- `trg_reservation_insert/update` - Audit logging

---

## 💻 COMMON SQL QUERIES

### View All Reservations with Details
```sql
SELECT r.*, g.Name as GuestName, rm.Category as RoomCategory
FROM Reservation r
JOIN Guest g ON r.Guest_ID = g.Guest_ID
JOIN Room rm ON r.Room_No = rm.Room_No
ORDER BY r.Booking_Date DESC;
```

### Find Available Rooms for Dates
```sql
SELECT r.* FROM Room r
WHERE r.Room_No NOT IN (
    SELECT Room_No FROM Reservation 
    WHERE Status IN ('Confirmed', 'CheckedIn')
    AND NOT (Check_Out_Date <= '2025-11-15' OR Check_In_Date >= '2025-11-18')
);
```

### Total Revenue
```sql
SELECT SUM(Amount) AS Total_Revenue
FROM Payment WHERE Status = 'Completed';
```

### Reservations by Status
```sql
SELECT Status, COUNT(*) AS Count
FROM Reservation GROUP BY Status;
```

---

## 🔧 API ENDPOINTS

### Guests
- `GET /api/guests` - Get all guests
- `POST /api/guests` - Create guest
- `DELETE /api/guests/:id` - Delete guest

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/available?checkIn=&checkOut=` - Get available rooms
- `POST /api/rooms` - Add/update room

### Reservations
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create reservation (calls BookRoom)
- `PUT /api/reservations/:id/status` - Update status

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Record payment (calls MakePayment)

### Staff
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Add staff
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Add service

### Room Services
- `GET /api/room-services` - Get all assignments
- `POST /api/room-services` - Assign service

---

## 🎨 FRONTEND COMPONENTS

### Customer Portal
- **LandingPage.jsx** - Homepage
- **Login.jsx** - Authentication
- **CustomerPortal.jsx** - Customer interface

### Admin Dashboard
- **AdminDashboard.jsx** - Admin interface
- **Dashboard.jsx** - Overview statistics
- **Rooms.jsx** - Room management
- **Guests.jsx** - Guest management
- **Staff.jsx** - Staff management
- **Reservations.jsx** - Booking management
- **Payments.jsx** - Payment processing
- **Services.jsx** - Service management

---

## 🔍 TESTING COMMANDS

### Test Function
```sql
SELECT StayDuration('2025-11-15', '2025-11-18');
```

### Test BookRoom Procedure
```sql
CALL BookRoom(1, 102, '2025-11-15', '2025-11-18');
```

### Test MakePayment Procedure
```sql
CALL MakePayment(1, 4500.00, 'Card');
```

### Test Trigger
```sql
UPDATE Reservation SET Status = 'CheckedIn' WHERE Reservation_ID = 1;
SELECT * FROM Room WHERE Room_No = 102; -- Should be 'Occupied'
```

### View Audit Log
```sql
SELECT * FROM Audit_Log ORDER BY Modified_Date DESC LIMIT 10;
```

---

## 📁 FILE LOCATIONS

### Documentation
- `PROJECT_REPORT.md` - Main report (Sections 1-6)
- `PROJECT_REPORT_PART2.md` - Sections 7-9
- `CODE_SNIPPETS.md` - Section 10
- `ALL_SQL_QUERIES.sql` - All SQL queries
- `DELIVERABLES_SUMMARY.md` - Complete checklist
- `DBMS_FEATURES_USED.md` - Feature documentation
- `PROJECT_OVERVIEW.md` - System overview
- `schema.sql` - Database schema

### Code
- `hotel-management-backend/` - Backend code
- `hotel-management-frontend/` - Frontend code

---

## 🐛 TROUBLESHOOTING

### Backend won't start
```bash
# Check MySQL is running
mysql -u root -p

# Verify .env file
cat hotel-management-backend/.env

# Check port 5000
netstat -ano | findstr :5000
```

### Frontend won't connect
```bash
# Verify backend is running
curl http://localhost:5000/api/guests

# Check CORS in server.js
# Clear browser cache
```

### Database errors
```sql
-- Check tables exist
SHOW TABLES;

-- Check procedures exist
SHOW PROCEDURE STATUS WHERE Db = 'hotel_management';

-- Check triggers exist
SHOW TRIGGERS;
```

---

## 📊 SAMPLE DATA

### Sample Guest
```sql
INSERT INTO Guest (Name, Contact_Info, Email, Nationality, Gender)
VALUES ('John Doe', '9123456789', 'john@email.com', 'USA', 'Male');
```

### Sample Room
```sql
INSERT INTO Room (Room_No, Category, Rent, Status)
VALUES (101, 'Single', 1500.00, 'Available');
```

### Sample Reservation
```sql
CALL BookRoom(1, 101, '2025-11-20', '2025-11-23');
```

### Sample Payment
```sql
CALL MakePayment(1, 4500.00, 'Card');
```

---

## 🎯 KEY METRICS

- **Total Tables**: 8
- **Total Functions**: 1
- **Total Procedures**: 2
- **Total Triggers**: 9
- **Total Indexes**: 14
- **Total Constraints**: 15+
- **API Endpoints**: 20+
- **React Components**: 12

---

## 📞 CREDENTIALS

### Admin Login
- Email: admin@hotel.com
- Password: admin123

### Database
- Host: localhost
- Port: 3306
- Database: hotel_management
- User: root
- Password: (your MySQL password)

---

## ✅ SUBMISSION CHECKLIST

- [ ] All documentation files included
- [ ] Screenshots captured
- [ ] SQL queries tested
- [ ] Application running
- [ ] Team details filled
- [ ] Code commented
- [ ] README updated

---

**Quick Reference Version:** 1.0  
**Last Updated:** November 18, 2025

