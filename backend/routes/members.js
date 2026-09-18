const express = require('express');
const router = express.Router();
const db = require('../../database/db');

// GET all members with membership plan
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT m.member_id, m.first_name, m.last_name, m.email, m.phone, m.plan_id, m.join_date, m.status, p.plan_name, p.monthly_fee
      FROM MEMBERS m
      LEFT JOIN MEMBERSHIP_PLANS p ON m.plan_id = p.plan_id
      ORDER BY m.member_id ASC
    `;
    const result = await db.query(sql);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET membership plans
router.get('/plans', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM MEMBERSHIP_PLANS ORDER BY plan_id ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add member (Insert button)
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, plan_id, status } = req.body;
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ success: false, error: 'First name, Last name, and Email are required!' });
    }

    const sql = `
      INSERT INTO MEMBERS (member_id, first_name, last_name, email, phone, plan_id, join_date, status)
      VALUES (
        SEQ_MEMBERS.NEXTVAL,
        '${first_name.replace(/'/g, "''")}',
        '${last_name.replace(/'/g, "''")}',
        '${email.replace(/'/g, "''")}',
        '${(phone || '').replace(/'/g, "''")}',
        ${plan_id ? Number(plan_id) : 'NULL'},
        SYSDATE,
        '${(status || 'ACTIVE').replace(/'/g, "''")}'
      )
    `;
    await db.query(sql);
    res.json({ success: true, message: 'Member registered successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update member (Update button)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { first_name, last_name, email, phone, plan_id, status } = req.body;

    const sql = `
      UPDATE MEMBERS
      SET first_name = '${first_name.replace(/'/g, "''")}',
          last_name = '${last_name.replace(/'/g, "''")}',
          email = '${email.replace(/'/g, "''")}',
          phone = '${(phone || '').replace(/'/g, "''")}',
          plan_id = ${plan_id ? Number(plan_id) : 'NULL'},
          status = '${(status || 'ACTIVE').replace(/'/g, "''")}'
      WHERE member_id = ${id}
    `;
    await db.query(sql);
    res.json({ success: true, message: 'Member details updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE member (Delete button)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `DELETE FROM MEMBERS WHERE member_id = ${id}`;
    await db.query(sql);
    res.json({ success: true, message: 'Member deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;