const express = require('express');
const router = express.Router();
const db = require('../../database/db');

// POST run arbitrary SQL query ("Type query & fetch it")
router.post('/', async (req, res) => {
  const startTime = Date.now();
  try {
    const { sql } = req.body;

    if (!sql || typeof sql !== 'string' || sql.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'SQL statement cannot be empty.'
      });
    }

    const result = await db.query(sql);
    const executionTimeMs = Date.now() - startTime;

    res.json({
      success: true,
      sql: sql.trim(),
      executionTimeMs,
      columns: result.columns || [],
      rows: result.rows || [],
      rowCount: result.rowCount || 0,
      message: result.message || 'Query executed successfully'
    });
  } catch (err) {
    const executionTimeMs = Date.now() - startTime;
    res.status(400).json({
      success: false,
      error: err.message,
      executionTimeMs
    });
  }
});

module.exports = router;