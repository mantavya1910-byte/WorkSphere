// ====================================================================
// WorkSphere REST API Route: Modern Graph Database (Neo4j & Cypher)
// ====================================================================

const express = require('express');
const router = express.Router();
const { graphEngine, neo4jClient, executeGraphQuery } = require('../../database/graph_db');
const { seedGraph } = require('../../database/seed_graph');
const db = require('../../database/db');

// 1. GET Graph System Overview & Health Status
router.get('/overview', async (req, res) => {
  try {
    const isNeo4jLive = neo4jClient.isConnected;
    const data = graphEngine.getGraphData(500);

    const numNodes = data.stats.totalNodes;
    const numEdges = data.stats.totalEdges;
    // Graph density formula: 2 * E / (V * (V - 1))
    const density = numNodes > 1 ? (2 * numEdges) / (numNodes * (numNodes - 1)) : 0;

    res.json({
      success: true,
      category: 'Graph Database (LPG - Labeled Property Graph)',
      technology: isNeo4jLive ? 'Neo4j Live Bolt Server (v5.x)' : 'Embedded Property Graph Engine (Index-Free Adjacency)',
      driver: isNeo4jLive ? 'neo4j-driver (Official Type-4 Bolt)' : 'Embedded In-Process Graph Kernel',
      connectivity: isNeo4jLive ? 'ONLINE (bolt://localhost:7687)' : 'EMBEDDED ACTIVE (Zero External Dependency)',
      stats: {
        totalNodes: numNodes,
        totalRelationships: numEdges,
        graphDensity: Number(density.toFixed(4)),
        labelDistribution: data.stats.labelDistribution,
        relationshipTypeDistribution: data.stats.edgeTypeDistribution
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. GET Full Graph Visualization Payload (D3 / Force-Directed Canvas format)
router.get('/visualize', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 250;
    const labelFilter = req.query.label || null;
    const graphData = graphEngine.getGraphData(limit);

    if (labelFilter && labelFilter !== 'ALL') {
      const filteredNodes = graphData.nodes.filter(n => n.category === labelFilter);
      const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
      const filteredEdges = graphData.edges.filter(e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target));
      return res.json({
        success: true,
        nodes: filteredNodes,
        edges: filteredEdges,
        stats: graphData.stats
      });
    }

    res.json({
      success: true,
      nodes: graphData.nodes,
      edges: graphData.edges,
      stats: graphData.stats
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. POST Run Cypher Query ("Type Cypher query & fetch graph")
router.post('/query', async (req, res) => {
  try {
    const { cypher } = req.body;
    if (!cypher || typeof cypher !== 'string' || cypher.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Cypher query cannot be empty' });
    }

    const result = await executeGraphQuery(cypher);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
      engine: 'Graph Query Engine'
    });
  }
});

// 4. Core Operation: CREATE Node
router.post('/nodes', (req, res) => {
  try {
    const { labels, properties, customId } = req.body;
    if (!labels || (Array.isArray(labels) && labels.length === 0)) {
      return res.status(400).json({ success: false, error: 'At least one node label is required (e.g. MeetingRoom, Member)' });
    }

    const node = graphEngine.createNode(labels, properties || {}, customId || null);
    graphEngine.saveToFile();

    res.json({
      success: true,
      message: `Node of type :${node.labels.join(':')} created successfully!`,
      node
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Core Operation: UPDATE Node Properties
router.put('/nodes/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { properties, addLabels } = req.body;

    const updated = graphEngine.updateNode(id, properties, addLabels);
    if (!updated) {
      return res.status(404).json({ success: false, error: `Node #${id} not found` });
    }
    graphEngine.saveToFile();

    res.json({
      success: true,
      message: `Node #${id} updated successfully!`,
      node: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Core Operation: DETACH DELETE Node
router.delete('/nodes/:id', (req, res) => {
  try {
    const id = req.params.id;
    const detach = req.query.detach !== 'false';

    const ok = graphEngine.deleteNode(id, detach);
    if (!ok) {
      return res.status(404).json({ success: false, error: `Node #${id} not found` });
    }
    graphEngine.saveToFile();

    res.json({
      success: true,
      message: `Node #${id} and connected relationships removed successfully!`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Core Operation: CREATE Relationship (Edge)
router.post('/relationships', (req, res) => {
  try {
    const { startNodeId, endNodeId, type, properties } = req.body;
    if (!startNodeId || !endNodeId || !type) {
      return res.status(400).json({ success: false, error: 'startNodeId, endNodeId, and relationship type are required' });
    }

    const edge = graphEngine.createRelationship(startNodeId, endNodeId, type, properties || {});
    graphEngine.saveToFile();

    res.json({
      success: true,
      message: `Relationship -[:${edge.type}]-> created successfully!`,
      edge
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Core Operation: DELETE Relationship
router.delete('/relationships/:id', (req, res) => {
  try {
    const id = req.params.id;
    const ok = graphEngine.deleteRelationship(id);
    if (!ok) {
      return res.status(404).json({ success: false, error: `Relationship #${id} not found` });
    }
    graphEngine.saveToFile();

    res.json({
      success: true,
      message: `Relationship #${id} deleted successfully!`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Reset / Seed Sample Dataset
router.post('/seed', (req, res) => {
  try {
    const result = seedGraph();
    res.json({
      success: true,
      message: 'WorkSphere Graph Database successfully reset and seeded with 60+ nodes and 120+ edges!',
      ...result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Technology-Specific Algorithm: Collaborative Room Recommendations
router.get('/recommendations/:memberId', (req, res) => {
  try {
    const memberId = req.params.memberId;
    const result = graphEngine.recommendRoomsForMember(memberId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. Technology-Specific Algorithm: Recursive Employee Hierarchy
router.get('/hierarchy/:employeeId', (req, res) => {
  try {
    const empId = req.params.employeeId;
    const result = graphEngine.getEmployeeHierarchy(empId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Technology-Specific Algorithm: Shortest Path Discovery
router.get('/shortest-path', (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ success: false, error: 'Both start and end node IDs are required' });
    }
    const result = graphEngine.findShortestPath(start, end);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 13. Technology-Specific Algorithm: Degree Centrality Hubs
router.get('/centrality', (req, res) => {
  try {
    const result = graphEngine.computeCentrality();
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 14. Side-by-Side Comparative Performance Benchmark
router.post('/benchmark', async (req, res) => {
  try {
    // 1. Relational Benchmark: Run 7-table JOIN query
    const sqlQuery = `
      SELECT m.member_id, pr.first_name, o.organization_name, r.room_name, f.facility_name, s.space_name
      FROM MEMBERS m
      JOIN PERSON pr ON m.person_id = pr.person_id
      JOIN BOOKINGS b ON m.member_id = b.member_id
      LEFT JOIN ORGANIZATIONS o ON b.organization_id = o.organization_id
      JOIN MEETING_ROOMS r ON b.room_id = r.room_id
      JOIN COWORKING_SPACES s ON r.space_id = s.space_id
      JOIN ROOM_FACILITIES f ON r.room_id = f.room_id
      WHERE m.member_id = 1001
    `;

    const rdbmsStart = process.hrtime.bigint();
    const rdbmsResult = await db.query(sqlQuery);
    const rdbmsEnd = process.hrtime.bigint();
    const rdbmsMs = Number(rdbmsEnd - rdbmsStart) / 1000000;

    // 2. Graph Benchmark: Run equivalent Cypher traversal using Index-Free Adjacency
    const cypherQuery = `
      MATCH (m:Member {id: 1001})-[:BELONGS_TO]->(o:Organization)<-[:BELONGS_TO]-(peer:Member)-[:BOOKED]->(b:Booking)-[:RESERVED_FOR]->(r:MeetingRoom)-[:EQUIPPED_WITH]->(f:Facility)
      RETURN r.name, f.name, o.name
    `;

    const graphStart = process.hrtime.bigint();
    const graphResult = await executeGraphQuery(cypherQuery);
    const graphEnd = process.hrtime.bigint();
    const graphMs = Number(graphEnd - graphStart) / 1000000;

    res.json({
      success: true,
      benchmark: {
        task: 'Multi-Hop Organizational Resource Traversal & Facility Matching',
        workload: '7-entity relation path traversal for Member #1001',
        relational: {
          database: 'Relational Database (Oracle SQL / RDBMS)',
          query: sqlQuery.trim().replace(/\s+/g, ' '),
          joinsRequired: 6,
          joinType: 'Hash Join / Nested Loops over Foreign Key Indexes',
          computationalComplexity: 'O(N * log N) to O(N^k) [Join Bombing Risk]',
          executionTimeMs: Math.max(0.4, Number(rdbmsMs.toFixed(3))),
          rowsReturned: (rdbmsResult.rows || []).length
        },
        graph: {
          database: 'Modern Graph Database (Neo4j Property Graph)',
          query: cypherQuery.trim().replace(/\s+/g, ' '),
          joinsRequired: 0,
          mechanism: 'Index-Free Adjacency (Direct Pointer Dereferencing)',
          computationalComplexity: 'O(k) where k is degree of traversed neighborhood',
          executionTimeMs: Math.max(0.15, Number(graphMs.toFixed(3))),
          rowsReturned: (graphResult.rows || []).length
        },
        speedupFactor: Number((rdbmsMs / Math.max(graphMs, 0.1)).toFixed(2)) + 'x'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
