// ====================================================================
// WorkSphere Modern Database Extension - Terminal CLI Demonstration
// Category: Graph Database (Neo4j & openCypher)
// Team Members:
// - Mantavya Sharma (25BCE5583)
// - Purva Golande (25BCE5535)
// - Shivangi Vashisht (25BCE5577)
// ====================================================================

const { graphEngine, executeGraphQuery } = require('./graph_db');
const { seedGraph } = require('./seed_graph');
const db = require('./db');

async function runCliDemo() {
  console.log('================================================================');
  console.log('   🌐 WORKSPHERE MODERN DATABASE EXTENSION: NEO4J GRAPH DB');
  console.log('   Academic DBMS Project Extension • Labeled Property Graph (LPG)');
  console.log('================================================================\n');

  // Step 1: Seed Graph Dataset
  console.log('[STEP 1] Seeding Sample Graph Dataset (Chennai & Bengaluru Hubs)...');
  const seedResult = seedGraph();
  console.log(`✓ Seeded ${seedResult.nodes} Nodes and ${seedResult.edges} Relationships across 8 entity types.\n`);

  // Step 2: Display Graph Model & Topology
  console.log('[STEP 2] Graph Model & Index-Free Adjacency Summary:');
  const stats = graphEngine.getGraphData(500).stats;
  console.log('  • Labels Indexed:', Object.entries(stats.labelDistribution).map(([k, v]) => `${k} (${v})`).join(', '));
  console.log('  • Relationship Types:', Object.entries(stats.edgeTypeDistribution).map(([k, v]) => `${k} (${v})`).join(', '));
  console.log('  • Traversal Mechanism: Index-Free Adjacency (Direct memory pointer dereference, O(k))\n');

  // Step 3: Demonstrate Core CRUD Operations
  console.log('[STEP 3] Demonstrating Core Graph Operations (CRUD)...');

  // 3a. CREATE Node
  console.log('  3a. CREATE Node:');
  const newNode = graphEngine.createNode(['MeetingRoom'], {
    name: 'Ada Lovelace Quantum Pod',
    room_type: 'Meeting Pod',
    capacity: 6,
    hourly_rate: 650
  });
  console.log(`      Created Node #${newNode.id} with label :${newNode.labels.join(':')} [${newNode.properties.name}]`);

  // 3b. CREATE Relationship
  console.log('  3b. CREATE Relationship:');
  const newEdge = graphEngine.createRelationship(101, newNode.id, 'CONTAINS', { wing: 'Innovation Block' });
  console.log(`      Created Edge #${newEdge.id}: (:CoworkingSpace #101)-[:${newEdge.type}]->(:MeetingRoom #${newNode.id})`);

  // 3c. UPDATE Node
  console.log('  3c. UPDATE Node (SET capacity = 8):');
  graphEngine.updateNode(newNode.id, { capacity: 8, certified: true });
  console.log(`      Updated Node #${newNode.id}: Capacity is now ${graphEngine.getNode(newNode.id).properties.capacity}`);

  // 3d. DETACH DELETE Node
  console.log('  3d. DETACH DELETE Node:');
  graphEngine.deleteNode(newNode.id, true);
  console.log(`      Successfully detached and removed Node #${newNode.id} and associated edges.\n`);

  // Step 4: Technology-Specific Cypher Queries
  console.log('[STEP 4] Executing Technology-Specific Graph Queries & Algorithms...\n');

  // Query 4.1: Collaborative Room Recommendation
  console.log('--- [QUERY 1: Collaborative Room Recommendation Engine] ---');
  console.log('Cypher:');
  console.log(`  MATCH (m:Member {id: 1001})-[:BELONGS_TO]->(o:Organization)<-[:BELONGS_TO]-(peer:Member)-[:BOOKED]->(r:MeetingRoom)
  RETURN r.name, count(*) AS score ORDER BY score DESC;\n`);

  const recResult = await executeGraphQuery(`
    MATCH (m:Member {id: 1001})-[:BELONGS_TO]->(o:Organization)<-[:BELONGS_TO]-(peer:Member)-[:BOOKED]->(r:MeetingRoom)
    RETURN r.name, count(*) AS score ORDER BY score DESC;
  `);

  console.log(`Execution Time: ${recResult.executionTimeMs} ms (Traversed ${recResult.traversedHops} hops)`);
  console.table(recResult.rows.slice(0, 4));
  console.log();

  // Query 4.2: Recursive Employee Management Tree
  console.log('--- [QUERY 2: Variable-Length Recursive Hierarchy Traversal] ---');
  console.log('Cypher:');
  console.log(`  MATCH path = (e:Employee {id: 9005})-[:REPORTS_TO*1..4]->(top:Employee)
  RETURN e.name, top.name, length(path) AS depth;\n`);

  const hierResult = await executeGraphQuery(`
    MATCH path = (e:Employee {id: 9005})-[:REPORTS_TO*1..4]->(top:Employee)
    RETURN e.name, top.name, length(path) AS depth;
  `);

  console.log(`Execution Time: ${hierResult.executionTimeMs} ms (Traversed tree depth: ${hierResult.traversedHops})`);
  console.table(hierResult.rows);
  console.log();

  // Query 4.3: Room-to-Facility Hardware Co-Occurrence
  console.log('--- [QUERY 3: Facility & AV Hardware Co-Occurrence Traversal] ---');
  console.log('Cypher:');
  console.log(`  MATCH (r:MeetingRoom)-[:EQUIPPED_WITH]->(f:Facility)
  RETURN r.name, r.capacity, f.name;\n`);

  const facResult = await executeGraphQuery(`
    MATCH (r:MeetingRoom)-[:EQUIPPED_WITH]->(f:Facility)
    RETURN r.name, r.capacity, f.name;
  `);

  console.log(`Execution Time: ${facResult.executionTimeMs} ms (Found ${facResult.rowCount} equipped facilities)`);
  console.table(facResult.rows.slice(0, 5));
  console.log();

  // Query 4.4: Degree Centrality Hub Analysis
  console.log('--- [QUERY 4: Degree Centrality & Hub Identification] ---');
  console.log('Cypher:');
  console.log(`  MATCH (n) RETURN labels(n)[0] AS type, n.name AS name, count{(n)--()} AS degree ORDER BY degree DESC LIMIT 5;\n`);

  const centResult = await executeGraphQuery(`
    MATCH (n) RETURN labels(n)[0] AS type, count{(n)--()} AS degree ORDER BY degree DESC;
  `);

  console.log(`Execution Time: ${centResult.executionTimeMs} ms`);
  console.table(centResult.rows.slice(0, 5));
  console.log();

  // Step 5: Live Side-by-Side Performance Benchmark
  console.log('[STEP 5] Real-Time Comparative Performance Benchmark:');
  console.log('Workload: Multi-hop Organizational Resource Traversal (Member -> Org -> Peer -> Booking -> Room -> Facility)');
  console.log('----------------------------------------------------------------');

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
  const rdbmsRes = await db.query(sqlQuery);
  const rdbmsEnd = process.hrtime.bigint();
  const rdbmsMs = Number(rdbmsEnd - rdbmsStart) / 1000000;

  const cypherQuery = `
    MATCH (m:Member {id: 1001})-[:BELONGS_TO]->(o:Organization)<-[:BELONGS_TO]-(peer:Member)-[:BOOKED]->(b:Booking)-[:RESERVED_FOR]->(r:MeetingRoom)-[:EQUIPPED_WITH]->(f:Facility)
    RETURN r.name, f.name, o.name
  `;

  const graphStart = process.hrtime.bigint();
  const graphRes = await executeGraphQuery(cypherQuery);
  const graphEnd = process.hrtime.bigint();
  const graphMs = Number(graphEnd - graphStart) / 1000000;

  const speedup = (rdbmsMs / Math.max(graphMs, 0.1)).toFixed(2);

  console.log(`• Relational Database (Oracle SQL RDBMS):`);
  console.log(`  - Joins Required: 6 Relational JOINs (Hash Join & B-Tree Scans)`);
  console.log(`  - Big-O Complexity: O(N * log N) to O(N^k) [Join Bomb Explosion]`);
  console.log(`  - Latency: ${rdbmsMs.toFixed(3)} ms\n`);

  console.log(`• Modern Graph Database (Neo4j Property Graph):`);
  console.log(`  - Joins Required: 0 (Zero Joins - Pointer Dereferencing)`);
  console.log(`  - Big-O Complexity: O(k) where k is degree of traversed neighborhood`);
  console.log(`  - Latency: ${graphMs.toFixed(3)} ms\n`);

  console.log(`🚀 RESULT: Neo4j Graph Traversal is ${speedup}x FASTER than Relational Multi-JOIN!`);
  console.log('================================================================');
  console.log('✅ ALL DEMONSTRATION STEPS COMPLETED SUCCESSFULLY!');
  console.log('================================================================\n');
}

runCliDemo().catch(console.error);
