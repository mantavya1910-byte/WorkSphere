const express = require('express');
const router = express.Router();
const db = require('../../database/db');

// GET all members with Person details and Membership Plan
router.get('/', async (req, res) => {
  try {
    const sql = `SELECT * FROM VW_MEMBERS_FULL ORDER BY member_id ASC`;
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

// POST add member (Inserts into PERSON superclass and MEMBERS subclass)
router.post('/', async (req, res) => {
  try {
    const { first_name, middle_name, last_name, email, phone, street, city, plan_id, status } = req.body;
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ success: false, error: 'First name, Last name, and Email are required!' });
    }

    // 1. Insert into PERSON superclass
    const personSql = `
      INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, phone, street, city)
      VALUES (
        SEQ_PERSON.NEXTVAL,
        '${first_name.replace(/'/g, "''")}',
        ${middle_name ? `'${middle_name.replace(/'/g, "''")}'` : 'NULL'},
        '${last_name.replace(/'/g, "''")}',
        '${email.replace(/'/g, "''")}',
        '${(phone || '').replace(/'/g, "''")}',
        '${(street || '').replace(/'/g, "''")}',
        '${(city || 'Chennai').replace(/'/g, "''")}'
      )
    `;
    await db.query(personSql);

    // 2. Insert into MEMBERS subclass referencing generated person_id
    const memberSql = `
      INSERT INTO MEMBERS (member_id, person_id, plan_id, join_date, status)
      VALUES (
        SEQ_MEMBERS.NEXTVAL,
        SEQ_PERSON.CURRVAL,
        ${plan_id ? Number(plan_id) : 'NULL'},
        SYSDATE,
        '${(status || 'ACTIVE').replace(/'/g, "''")}'
      )
    `;
    await db.query(memberSql);
    res.json({ success: true, message: 'Member registered successfully in Person and Member tables!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update member (Updates both PERSON and MEMBERS)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { first_name, middle_name, last_name, email, phone, plan_id, status } = req.body;

    // Fetch person_id for this member
    const memRes = await db.query(`SELECT person_id FROM MEMBERS WHERE member_id = ${id}`);
    const personId = memRes.rows[0]?.PERSON_ID;

    if (personId) {
      const updatePersonSql = `
        UPDATE PERSON
        SET first_name = '${first_name.replace(/'/g, "''")}',
            ${middle_name !== undefined ? `middle_name = '${middle_name.replace(/'/g, "''")}',` : ''}
            last_name = '${last_name.replace(/'/g, "''")}',
            email = '${email.replace(/'/g, "''")}',
            phone = '${(phone || '').replace(/'/g, "''")}'
        WHERE person_id = ${personId}
      `;
      await db.query(updatePersonSql);
    }

    const updateMemberSql = `
      UPDATE MEMBERS
      SET plan_id = ${plan_id ? Number(plan_id) : 'NULL'},
          status = '${(status || 'ACTIVE').replace(/'/g, "''")}'
      WHERE member_id = ${id}
    `;
    await db.query(updateMemberSql);

    res.json({ success: true, message: 'Member details updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE member (Deletes member record and associated person record)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const memRes = await db.query(`SELECT person_id FROM MEMBERS WHERE member_id = ${id}`);
    const personId = memRes.rows[0]?.PERSON_ID;

    if (personId) {
      await db.query(`DELETE FROM PERSON WHERE person_id = ${personId}`);
    } else {
      await db.query(`DELETE FROM MEMBERS WHERE member_id = ${id}`);
    }

    res.json({ success: true, message: 'Member deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
