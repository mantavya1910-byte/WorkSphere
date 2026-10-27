const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// ====================================================================
// WorkSphere Database Connectivity Layer: Oracle JDBC & Native Drivers
// ====================================================================

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result.map(s => s.trim());
}

// 1. Primary Driver: Oracle JDBC Thin Driver (Type 4) via WorkSphereJDBC
function queryJdbc(sql) {
  return new Promise((resolve, reject) => {
    const projectRoot = path.resolve(__dirname, '..');
    const cp = `.;database/jdbc/ojdbc11.jar`;
    const cmd = `java -cp "${cp}" database.jdbc.WorkSphereJDBC --stdin`;

    const child = exec(cmd, { cwd: projectRoot, maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
      if (err) {
        return reject(new Error(stderr || err.message));
      }

      const output = (stdout || '').trim();
      try {
        const cleanJson = output.replace(/\r?\n/g, ' ');
        const parsed = JSON.parse(cleanJson);
        if (parsed.success === false) {
          return reject(new Error(parsed.error || 'JDBC Query Execution Failed'));
        }
        return resolve({
          driver: 'JDBC (Oracle Type-4 Thin Driver)',
          columns: parsed.columns || [],
          rows: parsed.rows || [],
          rowCount: parsed.rowCount !== undefined ? parsed.rowCount : (parsed.affectedRows || 0),
          raw: output
        });
      } catch (parseErr) {
        return reject(new Error('JDBC parse error: ' + output));
      }
    });

    child.stdin.write(sql);
    child.stdin.end();
  });
}

// 2. Fallback Driver: Native SQL*Plus OCI Bridge
function queryNative(sql) {
  return new Promise((resolve, reject) => {
    const cleanSql = sql.trim().replace(/;+$/, '');
    const isSelect = /^\s*SELECT/i.test(cleanSql);
    const isDML = /^\s*(INSERT|UPDATE|DELETE)/i.test(cleanSql);

    const script = [
      'ALTER SESSION SET CONTAINER = XEPDB1;',
      'ALTER SESSION SET CURRENT_SCHEMA = COWORKING_ADMIN;',
      'SET DEFINE OFF;',
      'SET PAGESIZE 50000;',
      'SET FEEDBACK OFF;',
      cleanSql + ';',
      isDML ? 'COMMIT;' : '',
      'exit;'
    ].join('\n');

    const cmd = 'sqlplus -S -M "CSV ON" "/ as sysdba"';
    const child = exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
      if (err) {
        return reject(new Error(err.message));
      }

      const output = (stdout || '').trim();

      if (output.includes('ORA-') || output.includes('SP2-')) {
        const errMatch = output.match(/(?:ORA|SP2)-\d+:[^\r\n]+/);
        const errMsg = errMatch ? errMatch[0] : output;
        return reject(new Error(errMsg));
      }

      if (!isSelect) {
        return resolve({ driver: 'Native OCI', success: true, message: 'Command executed successfully', raw: output });
      }

      const rawLines = output.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      const csvLines = rawLines.filter(l => !l.startsWith('Session altered.') && !l.startsWith('Commit complete.'));

      if (csvLines.length === 0) {
        return resolve({ driver: 'Native OCI', columns: [], rows: [], rowCount: 0 });
      }

      const headers = parseCSVLine(csvLines[0]);
      const rows = [];

      for (let i = 1; i < csvLines.length; i++) {
        const values = parseCSVLine(csvLines[i]);
        if (values.length === headers.length) {
          const rowObj = {};
          headers.forEach((h, idx) => {
            rowObj[h] = values[idx];
          });
          rows.push(rowObj);
        }
      }

      resolve({
        driver: 'Native OCI',
        columns: headers,
        rows: rows,
        rowCount: rows.length
      });
    });

    child.stdin.write(script);
    child.stdin.end();
  });
}

// Export unified query function (defaults to JDBC with fallback)
async function query(sql) {
  try {
    return await queryJdbc(sql);
  } catch (jdbcErr) {
    console.warn('[DB Bridge] JDBC attempt failed, falling back to Native OCI:', jdbcErr.message);
    return await queryNative(sql);
  }
}

module.exports = { query, queryJdbc, queryNative };