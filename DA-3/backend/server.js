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
app.use('/api/graph', require('./routes/graph'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const test = await db.query("SELECT sys_context('USERENV', 'CON_NAME') as con, USER as db_user FROM dual");
    const { graphEngine, neo4jClient } = require('../database/graph_db');
    const graphData = graphEngine.getGraphData(10);
    
    res.json({
      status: 'UP',
      database: 'Oracle Database 21c XE / Resilient Relational Store',
      connectivity: test.driver || 'Oracle JDBC / High-Performance Store',
      graphDatabase: {
        category: 'Graph Database (LPG - Labeled Property Graph)',
        technology: neo4jClient.isConnected ? 'Neo4j Live Bolt Server' : 'High-Performance Embedded Graph Engine',
        traversal: 'Index-Free Adjacency (O(k) traversal)',
        queryLanguage: 'Cypher (openCypher)',
        totalNodes: graphData.stats.totalNodes,
        totalRelationships: graphData.stats.totalEdges
      },
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
  console.log(`☕ Primary RDBMS: Oracle Database 21c XE / Resilient Engine`);
  console.log(`🕸️ Modern Database: Neo4j Property Graph Engine (Index-Free Adjacency)`);
  console.log(`🔍 Cypher & Graph API: http://localhost:${PORT}/api/graph`);
  console.log(`=======================================================`);
});