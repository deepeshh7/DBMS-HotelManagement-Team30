const express = require('express');
const router = express.Router();
const pool = require('../config/db');
// GET all guests
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Guest ORDER BY Guest_ID DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create guest
router.post('/', async (req, res) => {
  try {
    const { Name, Contact_Info, Email, Nationality, Gender } = req.body;
    
    // Check if guest with this email already exists
    const [existing] = await pool.query('SELECT Guest_ID FROM Guest WHERE Email = ?', [Email]);
    
    if (existing.length > 0) {
      // Guest already exists, return existing guest ID
      return res.json({ 
        insertedId: existing[0].Guest_ID, 
        message: 'Guest already exists',
        alreadyExists: true 
      });
    }
    
    // Create new guest
    const [result] = await pool.query(
      'INSERT INTO Guest (Name, Contact_Info, Email, Nationality, Gender) VALUES (?, ?, ?, ?, ?)',
      [Name, Contact_Info, Email, Nationality, Gender]
    );
    res.json({ insertedId: result.insertId, alreadyExists: false });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// DELETE guest
router.delete('/:id', async (req, res) => {
  try {
    const guestId = req.params.id;
    await pool.query('DELETE FROM Guest WHERE Guest_ID = ?', [guestId]);
    res.json({ message: 'Guest deleted successfully' });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

module.exports = router;

