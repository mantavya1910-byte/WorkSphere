const express = require('express');
const router = express.Router();
const db = require('../../database/db');

// POST run arbitrary SQL query ("Type query & fetch it")
router.post('/', async (req, res) => {
  const startTime = Date.now();
  try {
    let { sql } = req.body;

    if (!sql || typeof sql !== 'string' || sql.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'SQL statement cannot be empty.'
      });
    }

    let cleanSql = sql.trim().replace(/;+$/, '');

    // Schema Compatibility:
    // 1. If s.name or spaces.name is queried, map to s.space_name
    cleanSql = cleanSql.replace(/\b([a-zA-Z0-9_]+)\.name\b/gi, (match, alias) => {
      const lower = alias.toLowerCase();
      if (['s', 'space', 'spaces', 'coworking_spaces'].includes(lower)) {
        return `${alias}.space_name`;
      }
      return match;
    });

    // 2. If querying m.first_name on MEMBERS directly, seamlessly route to VW_MEMBERS_FULL
    if (/\bm\.(?:first_name|last_name|email|phone)\b/i.test(cleanSql) && /\bFROM\s+MEMBERS\s+m\b/i.test(cleanSql) && !/\bJOIN\s+PERSON\b/i.test(cleanSql)) {
      cleanSql = cleanSql.replace(/\bFROM\s+MEMBERS\s+m\b/gi, 'FROM VW_MEMBERS_FULL m');
    }

    const result = await db.query(cleanSql);
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