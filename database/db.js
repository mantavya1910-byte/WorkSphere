const { exec } = require('child_process');

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

function query(sql) {
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

      // Check for Oracle Errors
      if (output.includes('ORA-') || output.includes('SP2-')) {
        const errMatch = output.match(/(?:ORA|SP2)-\d+:[^\r\n]+/);
        const errMsg = errMatch ? errMatch[0] : output;
        return reject(new Error(errMsg));
      }

      if (!isSelect) {
        return resolve({ success: true, message: 'Command executed successfully', raw: output });
      }

      // Parse CSV output
      const rawLines = output.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      
      // Filter out session altered and blank lines
      const csvLines = rawLines.filter(l => {
        if (l.startsWith('Session altered.')) return false;
        if (l.startsWith('Commit complete.')) return false;
        return true;
      });

      if (csvLines.length === 0) {
        return resolve({ columns: [], rows: [], rowCount: 0 });
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
        columns: headers,
        rows: rows,
        rowCount: rows.length
      });
    });

    child.stdin.write(script);
    child.stdin.end();
  });
}

module.exports = { query };