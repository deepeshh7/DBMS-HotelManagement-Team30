const express = require('express');
const router = express.Router();

const pool = require('../config/db');

// GET all rooms
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Room ORDER BY Room_No');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET available rooms for a date range
router.get('/available', async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    
    if (!checkIn || !checkOut) {
      // If no dates provided, return all rooms
      const [rows] = await pool.query('SELECT * FROM Room ORDER BY Room_No');
      return res.json(rows);
    }

    // Get rooms that are NOT booked during the requested date range
    const query = `
      SELECT r.* 
      FROM Room r
      WHERE r.Room_No NOT IN (
        SELECT res.Room_No 
        FROM Reservation res
        WHERE res.Status IN ('Confirmed', 'CheckedIn')
        AND NOT (
          res.Check_Out_Date <= ? OR res.Check_In_Date >= ?
        )
      )
      ORDER BY r.Room_No
    `;
    
    const [rows] = await pool.query(query, [checkIn, checkOut]);
    res.json(rows);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// POST add/update room
router.post('/', async (req, res) => {
  try {
    const { Room_No, Category, Rent } = req.body;
    const [existing] = await pool.query('SELECT Room_No FROM Room WHERE Room_No = ?', [Room_No]);
    if (existing.length) {
      await pool.query('UPDATE Room SET Category=?, Rent=? WHERE Room_No=?', [Category, Rent, Room_No]);
      return res.json({ message: 'Room updated' });
    } else {
      await pool.query('INSERT INTO Room (Room_No, Category, Rent) VALUES (?, ?, ?)', [Room_No, Category, Rent]);
      return res.json({ message: 'Room created' });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

