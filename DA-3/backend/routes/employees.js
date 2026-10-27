const express = require('express');
const router = express.Router();
const db = require('../../database/db');

// GET all employees with Person details and recursive Supervisor name
router.get('/', async (req, res) => {
  try {
    const sql = `SELECT * FROM VW_EMPLOYEES_FULL ORDER BY employee_id ASC`;
    const result = await db.query(sql);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET supervisory hierarchy (Self-join recursive demonstration query)
router.get('/hierarchy', async (req, res) => {
  try {
    const sql = `
      SELECT 
        e.employee_id, 
        pe.first_name || ' ' || pe.last_name AS employee_name,
        e.job_title,
        e.salary,
        e.supervisor_id,
        NVL(ps.first_name || ' ' || ps.last_name, 'TOP-LEVEL DIRECTOR') AS supervisor_name,
        NVL(s.job_title, 'EXECUTIVE BOARD') AS supervisor_title
      FROM EMPLOYEES e
      JOIN PERSON pe ON e.person_id = pe.person_id
      LEFT JOIN EMPLOYEES s ON e.supervisor_id = s.employee_id
      LEFT JOIN PERSON ps ON s.person_id = ps.person_id
      ORDER BY e.supervisor_id NULLS FIRST, e.employee_id ASC
    `;
    const result = await db.query(sql);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
