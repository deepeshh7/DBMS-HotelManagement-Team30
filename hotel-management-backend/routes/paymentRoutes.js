const express = require('express');
const router = express.Router();
const pool = require('../config/db');
// GET payments
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, r.Guest_ID, g.Name AS GuestName
       FROM Payment p
       JOIN Reservation r ON p.Reservation_ID = r.Reservation_ID
       JOIN Guest g ON r.Guest_ID = g.Guest_ID
       ORDER BY p.Payment_Date DESC`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST make payment (direct insert, bypassing stored procedure for service charges)
router.post('/', async (req, res) => {
  try {
    const { reservationId, amount, method } = req.body;
    
    // Validate inputs
    if (!reservationId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid payment data' });
    }
    
    // Check if reservation exists
    const [reservation] = await pool.query(
      'SELECT * FROM Reservation WHERE Reservation_ID = ?',
      [reservationId]
    );
    
    if (reservation.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    // Insert payment directly (allows payment for room + services)
    await pool.query(
      'INSERT INTO Payment (Reservation_ID, Amount, Payment_Method, Status) VALUES (?, ?, ?, ?)',
      [reservationId, amount, method, 'Completed']
    );
    
    res.json({ message: 'Payment recorded successfully' });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

module.exports = router;

