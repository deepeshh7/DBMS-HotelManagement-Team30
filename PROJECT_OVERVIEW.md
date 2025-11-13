# Caesars Palace Hotel Management System - Complete Project Overview

## 🏨 Project Description

A full-stack hotel management system built for Caesars Palace that handles guest bookings, room management, staff administration, service assignments, and payment processing. The system features separate interfaces for customers and administrators.

---

## 🎯 Key Features

### Customer Portal
- **Browse Available Rooms** - View rooms by category, price range, and availability
- **Book Rooms** - Select check-in/check-out dates and make reservations
- **View Bookings** - See all personal reservations with complete billing breakdown
- **Service Charges** - View additional services added to room bill

### Admin Dashboard
- **Room Management** - Add, view, and manage hotel rooms
- **Guest Management** - Add, edit, delete guest records
- **Staff Management** - Add, edit, delete, update staff details (salary, department, contact)
- **Reservation Management** - Create reservations, check-in/check-out guests, view billing
- **Service Management** - Add services, assign services to guest rooms
- **Payment Management** - Record payments with automatic total bill calculation (room + services)

---

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with black/white/gold theme

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **mysql2** - MySQL driver with promise support

### Database Features
- **Stored Procedures** - BookRoom, MakePayment
- **Triggers** - Auto-update room status on check-in/check-out
- **Functions** - Calculate stay duration
- **Audit Logs** - Track all database changes

---

## 📁 Project Structure

```
DBMS-HotelManagement/
├── hotel-management-backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── routes/
│   │   ├── guestRoutes.js        # Guest CRUD operations
│   │   ├── staffRoutes.js        # Staff CRUD operations
│   │   ├── roomRoutes.js         # Room management
│   │   ├── reservationRoutes.js  # Booking operations
│   │   ├── paymentRoutes.js      # Payment processing
│   │   ├── serviceRoutes.js      # Service management
│   │   └── roomServiceRoutes.js  # Service assignments
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server
│   └── package.json
│
├── hotel-management-frontend/
│   ├── public/
│   │   └── caesars-logo.svg      # Hotel logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx   # Homepage
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── CustomerPortal.jsx # Customer interface
│   │   │   ├── AdminDashboard.jsx # Admin interface
│   │   │   ├── Rooms.jsx         # Room management
│   │   │   ├── Guests.jsx        # Guest management
│   │   │   ├── Staff.jsx         # Staff management
│   │   │   ├── Reservations.jsx  # Booking management
│   │   │   ├── Services.jsx      # Service management
│   │   │   └── Payments.jsx      # Payment management
│   │   ├── api.js                # Axios configuration
│   │   ├── App.js                # Main app component
│   │   ├── App.css               # Global styles
│   │   └── index.js
│   └── package.json
│
└── schema.sql                    # Database schema with sample data
```

---

## 🗄️ Database Schema

### Main Tables

**1. Guest**
- Guest_ID (PK)
- Name, Contact_Info, Email (Unique)
- Nationality, Gender
- Check_In_Status (Boolean)
- Registration_Date

**2. Room**
- Room_No (PK)
- Category (Single/Double/Suite/Deluxe)
- Rent (Decimal)
- Status (Available/Occupied/Maintenance/Cleaning)
- Last_Cleaned

**3. Staff**
- Staff_ID (PK)
- Name, Dept, Age
- Contact_Info, Salary
- Join_Date

**4. Reservation**
- Reservation_ID (PK)
- Guest_ID (FK), Room_No (FK)
- Check_In_Date, Check_Out_Date
- Total_Amount
- Status (Confirmed/CheckedIn/CheckedOut/Cancelled)

**5. Payment**
- Payment_ID (PK)
- Reservation_ID (FK)
- Amount, Payment_Method
- Payment_Date, Status

**6. Services**
- Service_ID (PK)
- Service_Name (Unique)
- Description, Charges

**7. Room_Services**
- Room_Service_ID (PK)
- Room_No (FK), Service_ID (FK)
- Quantity, Total_Charge
- Service_Date

**8. Audit_Log**
- Log_ID (PK)
- Table_Name, Operation
- Record_ID, Old_Value, New_Value
- Modified_By, Modified_Date

---

## 🔐 Authentication

### Admin Login
- **Username:** admin@hotel.com
- **Password:** admin123
- **Access:** Full system control

### Customer Login
- **Method:** Email + Name (no password required for demo)
- **Access:** Browse rooms, make bookings, view own reservations

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v14+)
- MySQL (v8.0+)
- npm or yarn

### Step 1: Database Setup
```bash
# Open MySQL
mysql -u root -p

# Run schema
source C:/Users/deepe/DBMS-HotelManagement/schema.sql
```

### Step 2: Backend Setup
```bash
cd hotel-management-backend
npm install
npm start
```
Backend runs on: **http://localhost:5000**

### Step 3: Frontend Setup
```bash
cd hotel-management-frontend
npm install
npm start
```
Frontend runs on: **http://localhost:3000**

### Step 4: Access the System
- Open browser: **http://localhost:3000**
- Click "Admin Login" or "Browse Rooms"

---

## 💼 Business Workflows

### 1. Customer Books a Room
1. Customer visits landing page
2. Clicks "Browse Rooms" or "Book Now"
3. Enters name and email
4. Selects check-in/check-out dates
5. Clicks "Book Now" on desired room
6. System creates reservation
7. Customer can view booking in "My Bookings"

### 2. Admin Checks In Guest
1. Admin logs in
2. Goes to Reservations tab
3. Finds confirmed reservation
4. Clicks "Check In" button
5. System updates:
   - Reservation status → CheckedIn
   - Room status → Occupied
   - Guest check-in status → True

### 3. Admin Assigns Services
1. Admin goes to Services tab
2. Clicks "+ Assign Service to Room"
3. Selects checked-in guest
4. Selects service (e.g., Room Service, Spa)
5. Enters quantity
6. System adds charges to guest's bill

### 4. Admin Records Payment
1. Admin goes to Payments tab
2. Selects reservation from dropdown
3. System auto-fills total amount (room + services)
4. Selects payment method
5. Clicks "Record Payment"
6. Payment is logged in database

### 5. Admin Checks Out Guest
1. Admin goes to Reservations tab
2. Clicks "Check Out" button
3. System updates:
   - Reservation status → CheckedOut
   - Room status → Available
   - Guest check-in status → False

---

## 📊 Key Calculations

### Total Bill Formula
```
Total Bill = Room Charges + Service Charges

Room Charges = Rent per Night × Number of Nights
Service Charges = Sum of all services during stay
```

### Example
- Room 202 (Deluxe): ₹7500/night
- Stay: 3 nights = ₹22,500
- Services: Extra Bed (₹500)
- **Total Bill: ₹23,000**

---

## 🎨 Design Features

### Color Scheme
- **Primary:** Black (#000)
- **Secondary:** White (#FFF)
- **Accent:** Gold (#B8860B)
- **Background:** Caesars Palace pool image

### UI Components
- Responsive navigation with hamburger menu
- Card-based room display
- Data tables with action buttons
- Form validation and error messages
- Status badges (Available, Occupied, Checked-In, etc.)

---

## 🔧 API Endpoints

### Guests
- `GET /api/guests` - Get all guests
- `POST /api/guests` - Add new guest
- `DELETE /api/guests/:id` - Delete guest

### Staff
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Add staff member
- `PUT /api/staff/:id` - Update staff details
- `DELETE /api/staff/:id` - Delete staff

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Add new room

### Reservations
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create reservation (calls BookRoom procedure)
- `PUT /api/reservations/:id/status` - Update reservation status

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Record payment (calls MakePayment procedure)

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Add new service

### Room Services
- `GET /api/room-services` - Get all room service assignments
- `POST /api/room-services` - Assign service to room

---

## 🛡️ Security Features

1. **SQL Injection Prevention** - Parameterized queries
2. **CORS Enabled** - Cross-origin resource sharing
3. **Input Validation** - Frontend and backend validation
4. **Cascade Delete** - Foreign key constraints prevent orphaned records
5. **Audit Trail** - All changes logged in Audit_Log table

---

## 📈 Database Triggers

### Check-In Trigger
```sql
-- When reservation status changes to CheckedIn
UPDATE Room SET Status = 'Occupied'
UPDATE Guest SET Check_In_Status = TRUE
```

### Check-Out Trigger
```sql
-- When reservation status changes to CheckedOut
UPDATE Room SET Status = 'Available'
UPDATE Guest SET Check_In_Status = FALSE
```

### Audit Triggers
- Log all INSERT, UPDATE, DELETE operations
- Track old and new values
- Record timestamp and user

---

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack web development
- RESTful API design
- Database design and normalization
- SQL stored procedures and triggers
- React component architecture
- State management in React
- Async/await patterns
- CRUD operations
- User authentication
- Responsive UI design

---

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify .env file has correct password
- Ensure port 5000 is not in use

### Frontend won't connect
- Verify backend is running on port 5000
- Check CORS is enabled in server.js
- Clear browser cache

### Database errors
- Ensure schema.sql was run successfully
- Check foreign key constraints
- Verify data types match

---

## 🔄 Future Enhancements

Potential improvements:
- Email notifications for bookings
- Online payment gateway integration
- Room availability calendar view
- Guest reviews and ratings
- Housekeeping task management
- Revenue analytics dashboard
- Multi-language support
- Mobile app version

---

## 📝 Credits

**Project:** Caesars Palace Hotel Management System  
**Database:** MySQL with stored procedures and triggers  
**Frontend:** React.js with custom CSS  
**Backend:** Node.js + Express.js  
**Theme:** Black, White, and Gold luxury design

---

## 📞 Support

For issues or questions:
1. Check database connection in .env
2. Verify all npm packages are installed
3. Ensure MySQL server is running
4. Check browser console for errors
5. Review server logs for API errors

---

**End of Documentation**
