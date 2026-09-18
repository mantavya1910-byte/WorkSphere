const express = require('express');
const router = express.Router();
const db = require('../../database/db');

// GET all bookings with details
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT b.booking_id, b.booking_date, b.start_time, b.end_time, b.total_amount, b.status,
             m.member_id, m.first_name || ' ' || m.last_name as member_name, m.email,
             r.room_id, r.room_name, r.hourly_rate,
             s.name as space_name,
             o.org_name
      FROM BOOKINGS b
      JOIN MEMBERS m ON b.member_id = m.member_id
      JOIN MEETING_ROOMS r ON b.room_id = r.room_id
      JOIN COWORKING_SPACES s ON r.space_id = s.space_id
      LEFT JOIN ORGANIZATIONS o ON b.org_id = o.org_id
      ORDER BY b.booking_id DESC
    `;
    const result = await db.query(sql);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create booking (Insert button)
router.post('/', async (req, res) => {
  try {
    const { member_id, room_id, org_id, booking_date, start_time, end_time, total_amount, payment_method } = req.body;

    if (!member_id || !room_id || !booking_date || !start_time || !end_time) {
      return res.status(400).json({ success: false, error: 'Member, Room, Date, and Time slots are required!' });
    }

    // Attempt insert into BOOKINGS. If double booked, Oracle Trigger TRG_CHECK_ROOM_OVERLAP raises ORA-20001!
    const sql = `
      INSERT INTO BOOKINGS (
        booking_id, member_id, room_id, org_id, booking_date, start_time, end_time, total_amount, status
      ) VALUES (
        SEQ_BOOKINGS.NEXTVAL,
        ${Number(member_id)},
        ${Number(room_id)},
        ${org_id ? Number(org_id) : 'NULL'},
        '${booking_date.replace(/'/g, "''")}',
        '${start_time.replace(/'/g, "''")}',
        '${end_time.replace(/'/g, "''")}',
        ${Number(total_amount || 0)},
        'CONFIRMED'
      )
    `;
    await db.query(sql);

    // If payment method provided, create corresponding payment record
    if (payment_method) {
      const paySql = `
        INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, payment_method, status)
        VALUES (
          SEQ_PAYMENTS.NEXTVAL,
          SEQ_BOOKINGS.CURRVAL,
          ${Number(total_amount || 0)},
          SYSDATE,
          '${payment_method.replace(/'/g, "''")}',
          'COMPLETED'
        )
      `;
      await db.query(paySql);
    }

    res.json({ success: true, message: 'Booking confirmed successfully in Oracle DB!' });
  } catch (err) {
    // Custom trigger error capture
    let friendlyError = err.message;
    if (friendlyError.includes('ORA-20001')) {
      friendlyError = 'CONFLICT (Trigger Activated): This meeting room is already booked for this date and time slot!';
    }
    res.status(400).json({ success: false, error: friendlyError });
  }
});

// PUT update booking (Update button)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { status, booking_date, start_time, end_time } = req.body;

    const updates = [];
    if (status) updates.push(`status = '${status.replace(/'/g, "''")}'`);
    if (booking_date) updates.push(`booking_date = '${booking_date.replace(/'/g, "''")}'`);
    if (start_time) updates.push(`start_time = '${start_time.replace(/'/g, "''")}'`);
    if (end_time) updates.push(`end_time = '${end_time.replace(/'/g, "''")}'`);

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields provided to update.' });
    }

    const sql = `UPDATE BOOKINGS SET ${updates.join(', ')} WHERE booking_id = ${id}`;
    await db.query(sql);
    res.json({ success: true, message: 'Booking updated successfully!' });
  } catch (err) {
    let friendlyError = err.message;
    if (friendlyError.includes('ORA-20001')) {
      friendlyError = 'CONFLICT (Trigger Activated): Updating to this time slot conflicts with an existing booking!';
    }
    res.status(400).json({ success: false, error: friendlyError });
  }
});

// DELETE booking (Delete button)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `DELETE FROM BOOKINGS WHERE booking_id = ${id}`;
    await db.query(sql);
    res.json({ success: true, message: 'Booking deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;