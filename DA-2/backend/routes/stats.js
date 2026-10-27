const express = require('express');
const router = express.Router();
const db = require('../../database/db');

// GET live system stats calculated dynamically by Oracle
router.get('/', async (req, res) => {
  try {
    const spacesRes = await db.query('SELECT COUNT(*) as total_spaces FROM COWORKING_SPACES');
    const roomsRes = await db.query('SELECT COUNT(*) as total_rooms, SUM(CASE WHEN status = \'AVAILABLE\' THEN 1 ELSE 0 END) as available_rooms FROM MEETING_ROOMS');
    const membersRes = await db.query('SELECT COUNT(*) as total_members FROM MEMBERS WHERE status = \'ACTIVE\'');
    const bookingsRes = await db.query('SELECT COUNT(*) as total_bookings FROM BOOKINGS WHERE status = \'CONFIRMED\'');
    const revRes = await db.query('SELECT NVL(SUM(amount), 0) as total_revenue FROM PAYMENTS WHERE status = \'COMPLETED\'');

    res.json({
      success: true,
      stats: {
        totalSpaces: spacesRes.rows[0]?.TOTAL_SPACES || 0,
        totalRooms: roomsRes.rows[0]?.TOTAL_ROOMS || 0,
        availableRooms: roomsRes.rows[0]?.AVAILABLE_ROOMS || 0,
        totalMembers: membersRes.rows[0]?.TOTAL_MEMBERS || 0,
        activeBookings: bookingsRes.rows[0]?.TOTAL_BOOKINGS || 0,
        totalRevenue: revRes.rows[0]?.TOTAL_REVENUE || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;