const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all room services
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT rs.*, s.Service_Name, s.Charges, r.Reservation_ID, g.Name as GuestName
       FROM Room_Services rs
       JOIN Services s ON rs.Service_ID = s.Service_ID
       LEFT JOIN Reservation r ON rs.Room_No = r.Room_No 
         AND rs.Service_Date >= r.Check_In_Date 
         AND rs.Service_Date <= r.Check_Out_Date
         AND r.Status IN ('CheckedIn', 'CheckedOut')
       LEFT JOIN Guest g ON r.Guest_ID = g.Guest_ID
       ORDER BY rs.Service_Date DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create room service
router.post('/', async (req, res) => {
  try {
    const { roomNo, serviceId, quantity, totalCharge, reservationId } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO Room_Services (Room_No, Service_ID, Quantity, Total_Charge) VALUES (?, ?, ?, ?)',
      [roomNo, serviceId, quantity, totalCharge]
    );
    
    res.json({ 
      message: 'Service assigned successfully', 
      insertedId: result.insertId,
      reservationId: reservationId 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
