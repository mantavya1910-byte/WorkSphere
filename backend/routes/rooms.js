const express = require('express');
const router = express.Router();
const db = require('../../database/db');

// GET all rooms with space name
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT r.room_id, r.space_id, r.room_name, r.room_type, r.capacity, r.hourly_rate, r.status, s.name as space_name, s.city
      FROM MEETING_ROOMS r
      JOIN COWORKING_SPACES s ON r.space_id = s.space_id
      ORDER BY r.room_id ASC
    `;
    const result = await db.query(sql);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add meeting room (Insert button)
router.post('/', async (req, res) => {
  try {
    const { space_id, room_name, room_type, capacity, hourly_rate, status } = req.body;
    
    // Field Constraints validation
    if (!space_id || !room_name || !room_type || !capacity || !hourly_rate) {
      return res.status(400).json({ success: false, error: 'All room fields are required!' });
    }
    if (Number(capacity) <= 0) {
      return res.status(400).json({ success: false, error: 'Capacity must be greater than 0!' });
    }
    if (Number(hourly_rate) <= 0) {
      return res.status(400).json({ success: false, error: 'Hourly rate must be greater than 0!' });
    }

    const sql = `
      INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
      VALUES (
        SEQ_ROOMS.NEXTVAL, 
        ${Number(space_id)}, 
        '${room_name.replace(/'/g, "''")}', 
        '${room_type.replace(/'/g, "''")}', 
        ${Number(capacity)}, 
        ${Number(hourly_rate)}, 
        '${(status || 'AVAILABLE').replace(/'/g, "''")}'
      )
    `;
    await db.query(sql);
    res.json({ success: true, message: 'Meeting room added successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update meeting room (Update button)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { space_id, room_name, room_type, capacity, hourly_rate, status } = req.body;

    if (Number(capacity) <= 0 || Number(hourly_rate) <= 0) {
      return res.status(400).json({ success: false, error: 'Capacity and Hourly Rate must be greater than 0!' });
    }

    const sql = `
      UPDATE MEETING_ROOMS
      SET space_id = ${Number(space_id)},
          room_name = '${room_name.replace(/'/g, "''")}',
          room_type = '${room_type.replace(/'/g, "''")}',
          capacity = ${Number(capacity)},
          hourly_rate = ${Number(hourly_rate)},
          status = '${(status || 'AVAILABLE').replace(/'/g, "''")}'
      WHERE room_id = ${id}
    `;
    await db.query(sql);
    res.json({ success: true, message: 'Meeting room updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE meeting room (Delete button)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `DELETE FROM MEETING_ROOMS WHERE room_id = ${id}`;
    await db.query(sql);
    res.json({ success: true, message: 'Meeting room deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;