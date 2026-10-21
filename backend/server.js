const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('../database/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/spaces', require('./routes/spaces'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/members', require('./routes/members'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/query', require('./routes/query'));
app.use('/api/stats', require('./routes/stats'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const test = await db.query("SELECT sys_context('USERENV', 'CON_NAME') as con, USER as db_user FROM dual");
    res.json({
      status: 'UP',
      database: 'Oracle Database 21c XE',
      connectivity: 'JDBC (Oracle Type-4 Thin Driver)',
      driver: 'ojdbc11.jar (Oracle JDBC Thin Driver)',
      container: test.rows[0]?.CON || 'XEPDB1',
      dbUser: test.rows[0]?.DB_USER || 'COWORKING_ADMIN',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'DOWN', error: err.message });
  }
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 WorkSphere Workspace & Room Booking Server Running!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`☕ Database Connectivity: Oracle JDBC Thin Driver (ojdbc11.jar)`);
  console.log(`🏛️ Connected to: Oracle Database 21c XE (XEPDB1)`);
  console.log(`=======================================================`);
});