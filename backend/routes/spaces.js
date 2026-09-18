const express = require('express');
const router = express.Router();
const db = require('../../database/db');

// GET all spaces
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM COWORKING_SPACES ORDER BY space_id ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add space (Insert button)
router.post('/', async (req, res) => {
  try {
    const { name, street, city, state, pin } = req.body;
    if (!name || !city) {
      return res.status(400).json({ success: false, error: 'Space name and City are required!' });
    }
    const sql = `INSERT INTO COWORKING_SPACES (space_id, name, street, city, state, pin) 
                 VALUES (SEQ_SPACES.NEXTVAL, '${name.replace(/'/g, "''")}', '${(street || '').replace(/'/g, "''")}', '${city.replace(/'/g, "''")}', '${(state || 'Tamil Nadu').replace(/'/g, "''")}', '${(pin || '').replace(/'/g, "''")}')`;
    await db.query(sql);
    res.json({ success: true, message: 'Coworking Space added successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update space (Update button)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, street, city, state, pin } = req.body;
    const sql = `UPDATE COWORKING_SPACES 
                 SET name = '${name.replace(/'/g, "''")}', 
                     street = '${(street || '').replace(/'/g, "''")}', 
                     city = '${city.replace(/'/g, "''")}', 
                     state = '${(state || '').replace(/'/g, "''")}', 
                     pin = '${(pin || '').replace(/'/g, "''")}' 
                 WHERE space_id = ${id}`;
    await db.query(sql);
    res.json({ success: true, message: 'Coworking Space updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE space (Delete button)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `DELETE FROM COWORKING_SPACES WHERE space_id = ${id}`;
    await db.query(sql);
    res.json({ success: true, message: 'Coworking Space deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;