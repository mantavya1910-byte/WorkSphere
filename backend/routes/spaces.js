const express = require('express');
const router = express.Router();
const db = require('../../database/db');

// GET all spaces
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT space_id, space_name, space_name AS name, address, address AS street, city, state, pin 
      FROM COWORKING_SPACES 
      ORDER BY space_id ASC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add space (Insert button)
router.post('/', async (req, res) => {
  try {
    const space_name = req.body.space_name || req.body.name;
    const address = req.body.address || req.body.street || '';
    const city = req.body.city;
    const state = req.body.state || 'Tamil Nadu';
    const pin = req.body.pin || '';

    if (!space_name || !city) {
      return res.status(400).json({ success: false, error: 'Space name and City are required!' });
    }

    const sql = `
      INSERT INTO COWORKING_SPACES (space_id, space_name, address, city, state, pin) 
      VALUES (
        SEQ_SPACES.NEXTVAL, 
        '${space_name.replace(/'/g, "''")}', 
        '${address.replace(/'/g, "''")}', 
        '${city.replace(/'/g, "''")}', 
        '${state.replace(/'/g, "''")}', 
        '${pin.replace(/'/g, "''")}'
      )
    `;
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
    const space_name = req.body.space_name || req.body.name;
    const address = req.body.address || req.body.street || '';
    const city = req.body.city;
    const state = req.body.state || 'Tamil Nadu';
    const pin = req.body.pin || '';

    const sql = `
      UPDATE COWORKING_SPACES 
      SET space_name = '${(space_name || '').replace(/'/g, "''")}', 
          address = '${address.replace(/'/g, "''")}', 
          city = '${(city || '').replace(/'/g, "''")}', 
          state = '${state.replace(/'/g, "''")}', 
          pin = '${pin.replace(/'/g, "''")}' 
      WHERE space_id = ${id}
    `;
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
