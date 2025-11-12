const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET staff
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Staff ORDER BY Staff_ID DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST add staff
router.post('/', async (req, res) => {
  try {
    const { Name, Dept, Age, Contact_Info, Salary, Join_Date } = req.body;
    const joinDate = Join_Date || new Date().toISOString().split('T')[0];
    const [result] = await pool.query(
      'INSERT INTO Staff (Name, Dept, Age, Contact_Info, Salary, Join_Date) VALUES (?, ?, ?, ?, ?, ?)',
      [Name, Dept, Age, Contact_Info, Salary, joinDate]
    );
    res.json({ insertedId: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update staff
router.put('/:id', async (req, res) => {
  try {
    const staffId = req.params.id;
    const { Name, Dept, Age, Contact_Info, Salary } = req.body;
    await pool.query(
      'UPDATE Staff SET Name = ?, Dept = ?, Age = ?, Contact_Info = ?, Salary = ? WHERE Staff_ID = ?',
      [Name, Dept, Age, Contact_Info, Salary, staffId]
    );
    res.json({ message: 'Staff member updated successfully' });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// DELETE staff
router.delete('/:id', async (req, res) => {
  try {
    const staffId = req.params.id;
    await pool.query('DELETE FROM Staff WHERE Staff_ID = ?', [staffId]);
    res.json({ message: 'Staff member deleted successfully' });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

module.exports = router;

