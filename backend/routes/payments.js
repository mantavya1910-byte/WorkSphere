const express = require('express');
const router = express.Router();
const db = require('../../database/db');

// GET all payments
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT p.payment_id, p.booking_id, p.amount, p.payment_date, p.method AS payment_method, p.method, p.status,
             b.booking_date, b.start_time, b.end_time,
             pr.first_name || ' ' || pr.last_name AS member_name,
             r.room_name
      FROM PAYMENTS p
      JOIN BOOKINGS b ON p.booking_id = b.booking_id
      JOIN MEMBERS m ON b.member_id = m.member_id
      JOIN PERSON pr ON m.person_id = pr.person_id
      JOIN MEETING_ROOMS r ON b.room_id = r.room_id
      ORDER BY p.payment_id DESC
    `;
    const result = await db.query(sql);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add payment
router.post('/', async (req, res) => {
  try {
    const { booking_id, amount, payment_method, method, status } = req.body;
    const payMethod = method || payment_method;
    if (!booking_id || !amount || !payMethod) {
      return res.status(400).json({ success: false, error: 'Booking ID, Amount, and Payment Method are required!' });
    }

    const sql = `
      INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
      VALUES (
        SEQ_PAYMENTS.NEXTVAL,
        ${Number(booking_id)},
        ${Number(amount)},
        SYSDATE,
        '${payMethod.replace(/'/g, "''")}',
        '${(status || 'COMPLETED').replace(/'/g, "''")}'
      )
    `;
    await db.query(sql);
    res.json({ success: true, message: 'Payment recorded successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE payment
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `DELETE FROM PAYMENTS WHERE payment_id = ${id}`;
    await db.query(sql);
    res.json({ success: true, message: 'Payment record deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
