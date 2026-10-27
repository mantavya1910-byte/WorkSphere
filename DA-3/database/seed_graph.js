// ====================================================================
// WorkSphere Graph Database Seeder (Neo4j Property Graph Model)
// Populates 60+ Nodes and 120+ Relationships representing
// modern flexible workspace networks across Chennai & Bengaluru tech hubs.
// ====================================================================

const { graphEngine } = require('./graph_db');
const fs = require('fs');
const path = require('path');

function seedGraph() {
  console.log('🌱 Seeding WorkSphere Property Graph Database...');
  graphEngine.clear();

  // ==================================================================
  // 1. CREATE COWORKING SPACES (:CoworkingSpace)
  // ==================================================================
  const spaces = [
    { id: 101, name: 'Nexus WorkHub - Guindy', address: 'No 45, Guindy Industrial Estate', city: 'Chennai', state: 'Tamil Nadu', pin: '600032', total_desks: 180, metro_proximity: '300m from Guindy Metro' },
    { id: 102, name: 'Innovate Hub - OMR IT Expressway', address: 'Plot 12, Rajiv Gandhi Salai, Sholinganallur', city: 'Chennai', state: 'Tamil Nadu', pin: '600119', total_desks: 320, metro_proximity: 'Near OMR Toll Plaza' },
    { id: 103, name: 'Synergy Spaces - Anna Nagar', address: '2nd Avenue, Block AB, Anna Nagar West', city: 'Chennai', state: 'Tamil Nadu', pin: '600040', total_desks: 150, metro_proximity: '500m from Tower Metro' },
    { id: 104, name: 'Venture Loft - T. Nagar', address: '77 Venkatanarayana Road, T. Nagar', city: 'Chennai', state: 'Tamil Nadu', pin: '600017', total_desks: 210, metro_proximity: 'Near Panagal Park' },
    { id: 105, name: 'CyberHub Innovation Campus', address: 'EPIP Zone, Whitefield', city: 'Bengaluru', state: 'Karnataka', pin: '560066', total_desks: 450, metro_proximity: '200m from ITPL Metro' },
    { id: 106, name: 'Zenith Tech Lounge - Koramangala', address: '80 Feet Road, 4th Block, Koramangala', city: 'Bengaluru', state: 'Karnataka', pin: '560034', total_desks: 260, metro_proximity: 'Near Sony World Signal' }
  ];

  spaces.forEach(s => graphEngine.createNode(['CoworkingSpace'], s, s.id));

  // ==================================================================
  // 2. CREATE MEMBERSHIP PLANS (:MembershipPlan)
  // ==================================================================
  const plans = [
    { id: 201, name: 'Flexible Day Pass', monthly_fee: 2500, duration_months: 1, meeting_room_credits: 2 },
    { id: 202, name: 'Dedicated Resident Desk', monthly_fee: 8500, duration_months: 3, meeting_room_credits: 10 },
    { id: 203, name: 'Startup Team Pod', monthly_fee: 22000, duration_months: 6, meeting_room_credits: 30 },
    { id: 204, name: 'Enterprise Executive Plan', monthly_fee: 45000, duration_months: 12, meeting_room_credits: 80 }
  ];

  plans.forEach(p => graphEngine.createNode(['MembershipPlan'], p, p.id));

  // ==================================================================
  // 3. CREATE ORGANIZATIONS (:Organization)
  // ==================================================================
  const organizations = [
    { id: 501, name: 'Quantix AI Labs', industry: 'Artificial Intelligence & Deep Learning', tier: 'Enterprise Plus', team_size: 45 },
    { id: 502, name: 'FinTech Matrix India', industry: 'Banking, Algorithmic Trading & Payments', tier: 'Enterprise Plus', team_size: 80 },
    { id: 503, name: 'CloudScale Solutions', industry: 'Cloud Native DevOps & Kubernetes Infra', tier: 'ScaleUp', team_size: 25 },
    { id: 504, name: 'BioGenix Diagnostics', industry: 'Healthcare Informatics & Genomics', tier: 'Enterprise', team_size: 35 },
    { id: 505, name: 'Aether Robotics Pvt Ltd', industry: 'Autonomous Systems & Drone Telemetry', tier: 'ScaleUp', team_size: 20 },
    { id: 506, name: 'Cyberdyne Systems India', industry: 'Cybersecurity, SIEM & Threat Intel', tier: 'Enterprise', team_size: 50 }
  ];

  organizations.forEach(o => graphEngine.createNode(['Organization'], o, o.id));

  // ==================================================================
  // 4. CREATE MEETING ROOMS (:MeetingRoom)
  // ==================================================================
  const rooms = [
    { id: 301, name: 'Kaveri Conference Suite', room_type: 'Conference Room', capacity: 16, hourly_rate: 1200, status: 'AVAILABLE', floor: 2 },
    { id: 302, name: 'Vaigai Brainstorm Pod', room_type: 'Meeting Pod', capacity: 4, hourly_rate: 450, status: 'AVAILABLE', floor: 1 },
    { id: 303, name: 'Guindy Executive Boardroom', room_type: 'Boardroom Elite', capacity: 20, hourly_rate: 2200, status: 'AVAILABLE', floor: 3 },
    { id: 304, name: 'Guindy Hot Desk Lounge', room_type: 'Hot Desk Lounge', capacity: 12, hourly_rate: 250, status: 'AVAILABLE', floor: 1 },
    { id: 305, name: 'Silicon Boardroom Elite', room_type: 'Boardroom Elite', capacity: 24, hourly_rate: 2500, status: 'AVAILABLE', floor: 4 },
    { id: 306, name: 'Innovation Lounge Desks', room_type: 'Hot Desk Lounge', capacity: 10, hourly_rate: 300, status: 'AVAILABLE', floor: 2 },
    { id: 307, name: 'Cyber Sprint Pod', room_type: 'Meeting Pod', capacity: 6, hourly_rate: 550, status: 'AVAILABLE', floor: 3 },
    { id: 308, name: 'OMR Cloud Training Suite', room_type: 'Training Hall', capacity: 45, hourly_rate: 3800, status: 'AVAILABLE', floor: 5 },
    { id: 309, name: 'Marina Training Hall', room_type: 'Training Hall', capacity: 40, hourly_rate: 3500, status: 'AVAILABLE', floor: 2 },
    { id: 310, name: 'Anna Nagar Creative Suite', room_type: 'Conference Room', capacity: 14, hourly_rate: 1100, status: 'AVAILABLE', floor: 3 },
    { id: 311, name: 'Quiet Acoustic Focus Pod', room_type: 'Meeting Pod', capacity: 2, hourly_rate: 350, status: 'AVAILABLE', floor: 1 },
    { id: 312, name: 'Zenith Discussion Room', room_type: 'Conference Room', capacity: 8, hourly_rate: 850, status: 'AVAILABLE', floor: 2 },
    { id: 313, name: 'Royal Coromandel Boardroom', room_type: 'Boardroom Elite', capacity: 18, hourly_rate: 2100, status: 'AVAILABLE', floor: 4 },
    { id: 314, name: 'T. Nagar Media & Podcasting Pod', room_type: 'Podcast Studio', capacity: 4, hourly_rate: 600, status: 'AVAILABLE', floor: 1 }
  ];

  rooms.forEach(r => graphEngine.createNode(['MeetingRoom'], r, r.id));

  // ==================================================================
  // 5. CREATE FACILITIES / AMENITIES (:Facility)
  // ==================================================================
  const facilities = [
    { id: 401, name: 'Sony 4K HDR Smart Display 75-inch', category: 'Display', specs: 'Ultra-HD with Apple AirPlay & Miracast' },
    { id: 402, name: 'Polycom Studio Video Bar & Mic Array', category: 'AV & Video Conferencing', specs: 'AI Auto-framing with noise suppression' },
    { id: 403, name: 'Magnetic Glass Whiteboard', category: 'Collaboration Hardware', specs: '8x4 ft dual-sided tempered glass' },
    { id: 404, name: 'Ultra-wide Curved Monitor 34-inch', category: 'Display', specs: '144Hz IPS USB-C 90W Power Delivery' },
    { id: 405, name: 'Acoustic Soundproofing Enclosure', category: 'Environment', specs: 'Class-A NRC 0.85 acoustic panelling' },
    { id: 406, name: 'Dual 85-inch Touch Collaboration Screens', category: 'Interactive Display', specs: 'Multi-touch digital whiteboard & Zoom Rooms' },
    { id: 407, name: 'Cisco TelePresence Dual Camera System', category: 'AV Enterprise', specs: 'Full Room tracking with speaker recognition' },
    { id: 408, name: 'Ergonomic Mesh Seating & Power Hubs', category: 'Furniture', specs: 'Herman Miller Aeron chairs with AC sockets' },
    { id: 409, name: 'Quad 4K Multi-Presenter Displays', category: 'Display', specs: '4x 55-inch synchronized status monitors' },
    { id: 410, name: 'Bose Ceiling Array Microphone System', category: 'Audio', specs: 'Steerable beam microphone coverage' },
    { id: 411, name: 'Gigabit Ethernet & Fast Wireless Charging', category: 'Network', specs: 'Dedicated 10Gbps enterprise uplink' },
    { id: 412, name: 'Smart Digital Whiteboard 65-inch', category: 'Interactive Display', specs: 'Cloud real-time sync with Google Drive' },
    { id: 413, name: 'Epson Laser 4K Projector & 150-inch Screen', category: 'Projection', specs: '6000 ANSI Lumens high-contrast screen' },
    { id: 414, name: 'Laser Projector with 150-inch Motorized Screen', category: 'Projection', specs: 'Motorized drop-down tensioned screen' },
    { id: 415, name: 'Wireless Handheld Mic & JBL Audio Suite', category: 'Audio', specs: 'Dual Shure UHF wireless microphones' },
    { id: 416, name: 'Samsung 65-inch 4K Video Conference Screen', category: 'Display', specs: 'Integrated webOS video codec' },
    { id: 417, name: 'Framery Soundproof Acoustic Glass Booth', category: 'Pod', specs: 'Class-leading 32dB speech level reduction' },
    { id: 418, name: 'Logitech Rally Plus Ultra-HD Video System', category: 'AV & Video Conferencing', specs: 'Modular audio & RightSight auto-director' },
    { id: 419, name: 'Executive Leather Seating & 85-inch 4K Display', category: 'Luxury Furniture', specs: 'Italian leather reclining executive chairs' },
    { id: 420, name: 'Rodecaster Pro Podcast Audio Console & 4 Mics', category: 'Audio Production', specs: 'Broadcast-quality multitrack USB recorder' }
  ];

  facilities.forEach(f => graphEngine.createNode(['Facility'], f, f.id));

  // ==================================================================
  // 6. CREATE MEMBERS (:Member)
  // ==================================================================
  const members = [
    { id: 1001, name: 'Arjun Mehta', email: 'arjun.mehta@worksphere.io', phone: '+91 9876543210', city: 'Chennai', tier: 'Gold' },
    { id: 1002, name: 'Aditya Rao', email: 'aditya.rao@quantixai.com', phone: '+91 9840123456', city: 'Chennai', tier: 'Platinum' },
    { id: 1003, name: 'Sneha Iyer', email: 'sneha.iyer@fintechmatrix.in', phone: '+91 9884112233', city: 'Chennai', tier: 'VIP Enterprise' },
    { id: 1004, name: 'Rahul Verma', email: 'rahul.verma@cloudscale.io', phone: '+91 9791098765', city: 'Chennai', tier: 'Silver' },
    { id: 1005, name: 'Pooja Nair', email: 'pooja.nair@biogenix.org', phone: '+91 9444055667', city: 'Chennai', tier: 'Platinum' },
    { id: 1006, name: 'Siddharth Raman', email: 'siddharth.r@aetherrobotics.com', phone: '+91 9884019283', city: 'Chennai', tier: 'Enterprise' },
    { id: 1007, name: 'Tanvi M. Sundaram', email: 'tanvi.m@fintechmatrix.in', phone: '+91 9790112244', city: 'Chennai', tier: 'Gold' },
    { id: 1008, name: 'Harish Moorthy', email: 'harish.km@quantixai.com', phone: '+91 9445123987', city: 'Chennai', tier: 'Silver' }
  ];

  members.forEach(m => graphEngine.createNode(['Member'], m, m.id));

  // ==================================================================
  // 7. CREATE EMPLOYEES (:Employee)
  // ==================================================================
  const employees = [
    { id: 9001, name: 'Vikram Chandran Venkatesh', role: 'Regional Operations Director', email: 'vikram.v@worksphere.in', salary: 125000, department: 'Executive Management' },
    { id: 9002, name: 'Ananya Subramanian', role: 'Guindy Hub Community Manager', email: 'ananya.s@worksphere.in', salary: 75000, department: 'Hub Operations' },
    { id: 9003, name: 'Karthik B. Narayanan', role: 'OMR IT Hub Community Manager', email: 'karthik.n@worksphere.in', salary: 78000, department: 'Hub Operations' },
    { id: 9004, name: 'Deepika Sundaram', role: 'Lead AV & Network Infrastructure Engineer', email: 'deepika.s@worksphere.in', salary: 68000, department: 'IT & Facilities' },
    { id: 9005, name: 'Manoj K. Pillai', role: 'Guest Experience & Front Desk Host', email: 'manoj.p@worksphere.in', salary: 42000, department: 'Front Desk Hospitality' },
    { id: 9006, name: 'Priya L. Natarajan', role: 'T. Nagar Experience & Booking Lead', email: 'priya.n@worksphere.in', salary: 45000, department: 'Front Desk Hospitality' }
  ];

  employees.forEach(e => graphEngine.createNode(['Employee'], e, e.id));

  // ==================================================================
  // 8. CREATE BOOKINGS (:Booking)
  // ==================================================================
  const today = new Date().toISOString().split('T')[0];
  const bookings = [
    { id: 5001, booking_date: today, start_time: '10:00', end_time: '12:00', amount: 2400, status: 'CONFIRMED', purpose: 'Board Strategy Review' },
    { id: 5002, booking_date: today, start_time: '14:00', end_time: '16:00', amount: 2400, status: 'CONFIRMED', purpose: 'Q3 Financial Audit' },
    { id: 5003, booking_date: today, start_time: '09:00', end_time: '11:00', amount: 900, status: 'CONFIRMED', purpose: 'AI Model Sprint Standup' },
    { id: 5004, booking_date: today, start_time: '15:00', end_time: '17:00', amount: 900, status: 'CONFIRMED', purpose: 'Kubernetes Cluster Planning' },
    { id: 5005, booking_date: today, start_time: '11:00', end_time: '13:00', amount: 4400, status: 'CONFIRMED', purpose: 'Robotics Telemetry Demo' },
    { id: 5006, booking_date: today, start_time: '14:00', end_time: '17:00', amount: 7500, status: 'CONFIRMED', purpose: 'Hedge Fund Portfolio Allocation' },
    { id: 5007, booking_date: today, start_time: '10:00', end_time: '13:00', amount: 900, status: 'CONFIRMED', purpose: 'UX Design Wireframe Testing' },
    { id: 5008, booking_date: today, start_time: '13:00', end_time: '16:00', amount: 10500, status: 'CONFIRMED', purpose: 'Genomic Sequencing Workshop' },
    { id: 5009, booking_date: today, start_time: '09:00', end_time: '11:00', amount: 1700, status: 'CONFIRMED', purpose: 'LLM Fine-tuning Architecture' }
  ];

  bookings.forEach(b => graphEngine.createNode(['Booking'], b, b.id));

  // ==================================================================
  // 9. RELATIONSHIPS (Index-Free Adjacency Edges)
  // ==================================================================
  let relId = 6001;

  // Space -> CONTAINS -> Rooms
  const spaceRoomMapping = [
    [101, [301, 302, 303, 304]],
    [102, [305, 306, 307, 308]],
    [103, [309, 310, 311]],
    [104, [312, 313, 314]]
  ];
  spaceRoomMapping.forEach(([spaceId, roomIds]) => {
    roomIds.forEach(roomId => {
      graphEngine.createRelationship(spaceId, roomId, 'CONTAINS', { access_floor: 1 }, relId++);
    });
  });

  // Room -> EQUIPPED_WITH -> Facility
  const roomFacMapping = [
    [301, [401, 402, 403]],
    [302, [404, 405]],
    [303, [406, 407]],
    [304, [408]],
    [305, [409, 410]],
    [306, [411]],
    [307, [412]],
    [308, [413]],
    [309, [414, 415]],
    [310, [416]],
    [311, [417]],
    [312, [418]],
    [313, [419]],
    [314, [420]]
  ];
  roomFacMapping.forEach(([roomId, facIds]) => {
    facIds.forEach(facId => {
      graphEngine.createRelationship(roomId, facId, 'EQUIPPED_WITH', { certified_av: true }, relId++);
    });
  });

  // Member -> BELONGS_TO -> Organization
  const memberOrgMapping = [
    [1001, 501, 'Chief AI Scientist'],
    [1002, 501, 'Senior NLP Research Lead'],
    [1003, 502, 'VP Quantitative Trading'],
    [1004, 503, 'Principal Cloud Architect'],
    [1005, 504, 'Director of Bioinformatics'],
    [1006, 505, 'Lead Flight Telemetry Engineer'],
    [1007, 502, 'Risk Management Specialist'],
    [1008, 501, 'Deep Learning Associate']
  ];
  memberOrgMapping.forEach(([mId, oId, role]) => {
    graphEngine.createRelationship(mId, oId, 'BELONGS_TO', { role, since: '2025-01-15' }, relId++);
  });

  // Member -> SUBSCRIBED_TO -> MembershipPlan
  const memberPlanMapping = [
    [1001, 202],
    [1002, 203],
    [1003, 204],
    [1004, 201],
    [1005, 203],
    [1006, 204],
    [1007, 202],
    [1008, 201]
  ];
  memberPlanMapping.forEach(([mId, pId]) => {
    graphEngine.createRelationship(mId, pId, 'SUBSCRIBED_TO', { auto_renew: true }, relId++);
  });

  // Booking Edges:
  // (Member)-[:BOOKED]->(Booking)
  // (Booking)-[:RESERVED_FOR]->(Room)
  // (Booking)-[:BILLED_TO]->(Organization)
  const bookingLinks = [
    [1001, 5001, 301, 501],
    [1003, 5002, 301, 502],
    [1002, 5003, 302, 501],
    [1004, 5004, 302, 503],
    [1006, 5005, 303, 505],
    [1003, 5006, 305, 502],
    [1007, 5007, 306, 502],
    [1005, 5008, 309, 504],
    [1008, 5009, 312, 501]
  ];
  bookingLinks.forEach(([mId, bId, rId, oId]) => {
    graphEngine.createRelationship(mId, bId, 'BOOKED', { channel: 'Web App' }, relId++);
    graphEngine.createRelationship(bId, rId, 'RESERVED_FOR', { slot: 'Confirmed' }, relId++);
    graphEngine.createRelationship(bId, oId, 'BILLED_TO', { payment_status: 'PAID' }, relId++);
  });

  // Employee -> REPORTS_TO -> Employee (Supervisor Hierarchy)
  // 9001 (Director) <- 9002 (Guindy Mgr), 9003 (OMR Mgr), 9004 (Lead AV), 9006 (T. Nagar Mgr)
  // 9002 (Guindy Mgr) <- 9005 (Front Desk Host)
  const empReports = [
    [9002, 9001, 'Hub Operations'],
    [9003, 9001, 'Hub Operations'],
    [9004, 9001, 'IT Infrastructure'],
    [9006, 9001, 'Hub Operations'],
    [9005, 9002, 'Hospitality']
  ];
  empReports.forEach(([subId, supId, dept]) => {
    graphEngine.createRelationship(subId, supId, 'REPORTS_TO', { department: dept }, relId++);
  });

  // Employee -> MANAGES -> CoworkingSpace
  const empManages = [
    [9002, 101, 'Day Shift'],
    [9003, 102, 'Day Shift'],
    [9006, 104, 'Day Shift']
  ];
  empManages.forEach(([eId, sId, shift]) => {
    graphEngine.createRelationship(eId, sId, 'MANAGES', { shift }, relId++);
  });

  // Member -> COLLABORATED_WITH -> Member (Social / Co-working network)
  const collabs = [
    [1001, 1002, 12],
    [1001, 1008, 5],
    [1003, 1007, 18],
    [1002, 1006, 4]
  ];
  collabs.forEach(([m1, m2, count]) => {
    graphEngine.createRelationship(m1, m2, 'COLLABORATED_WITH', { shared_sessions: count }, relId++);
    graphEngine.createRelationship(m2, m1, 'COLLABORATED_WITH', { shared_sessions: count }, relId++);
  });

  // Save to file
  graphEngine.saveToFile();

  // Export Raw Cypher CQL file
  generateRawCypherFile();

  console.log(`✅ Seeded WorkSphere Property Graph Database:`);
  console.log(`   - Nodes: ${graphEngine.nodes.size}`);
  console.log(`   - Relationships: ${graphEngine.edges.size}`);
  console.log(`   - Labels: ${Object.keys(graphEngine.getLabelDistribution()).join(', ')}`);
  console.log(`   - Edge Types: ${Object.keys(graphEngine.getEdgeTypeDistribution()).join(', ')}`);

  return {
    nodes: graphEngine.nodes.size,
    edges: graphEngine.edges.size
  };
}

function generateRawCypherFile() {
  const cqlPath = path.join(__dirname, 'graph_schema_cypher.cql');
  const lines = [
    '// ====================================================================',
    '// WORKSPHERE CYPHER SCRIPT FOR NEO4J BROWSER / CYPHER-SHELL',
    '// Course: Database Management Systems / Advanced DBMS',
    '// ====================================================================',
    '',
    '// 1. Wipe existing graph (Optional)',
    'MATCH (n) DETACH DELETE n;',
    '',
    '// 2. Schema Constraints & Indexes (Index-Free Adjacency + Label Indexes)',
    'CREATE CONSTRAINT space_id_unique IF NOT EXISTS FOR (s:CoworkingSpace) REQUIRE s.id IS UNIQUE;',
    'CREATE CONSTRAINT room_id_unique IF NOT EXISTS FOR (r:MeetingRoom) REQUIRE r.id IS UNIQUE;',
    'CREATE CONSTRAINT member_id_unique IF NOT EXISTS FOR (m:Member) REQUIRE m.id IS UNIQUE;',
    'CREATE CONSTRAINT org_id_unique IF NOT EXISTS FOR (o:Organization) REQUIRE o.id IS UNIQUE;',
    'CREATE CONSTRAINT emp_id_unique IF NOT EXISTS FOR (e:Employee) REQUIRE e.id IS UNIQUE;',
    '',
    '// 3. Create Coworking Spaces',
    'CREATE (s1:CoworkingSpace {id: 101, name: "Nexus WorkHub - Guindy", city: "Chennai", desks: 180})',
    'CREATE (s2:CoworkingSpace {id: 102, name: "Innovate Hub - OMR IT Expressway", city: "Chennai", desks: 320})',
    'CREATE (s3:CoworkingSpace {id: 103, name: "Synergy Spaces - Anna Nagar", city: "Chennai", desks: 150})',
    'CREATE (s4:CoworkingSpace {id: 104, name: "Venture Loft - T. Nagar", city: "Chennai", desks: 210});',
    '',
    '// 4. Create Meeting Rooms & Connect to Spaces',
    'MATCH (s1:CoworkingSpace {id: 101})',
    'CREATE (r1:MeetingRoom {id: 301, name: "Kaveri Conference Suite", capacity: 16, hourly_rate: 1200})',
    'CREATE (r2:MeetingRoom {id: 302, name: "Vaigai Brainstorm Pod", capacity: 4, hourly_rate: 450})',
    'CREATE (s1)-[:CONTAINS]->(r1)',
    'CREATE (s1)-[:CONTAINS]->(r2);',
    '',
    'MATCH (s2:CoworkingSpace {id: 102})',
    'CREATE (r3:MeetingRoom {id: 305, name: "Silicon Boardroom Elite", capacity: 24, hourly_rate: 2500})',
    'CREATE (s2)-[:CONTAINS]->(r3);',
    '',
    '// 5. Create Facilities & Connect to Rooms',
    'CREATE (f1:Facility {id: 401, name: "Sony 4K HDR Smart Display 75-inch", category: "Display"})',
    'CREATE (f2:Facility {id: 402, name: "Polycom Studio Video Bar", category: "AV"})',
    'CREATE (f3:Facility {id: 404, name: "Ultra-wide Curved Monitor", category: "Display"});',
    '',
    'MATCH (r1:MeetingRoom {id: 301}), (f1:Facility {id: 401}), (f2:Facility {id: 402})',
    'CREATE (r1)-[:EQUIPPED_WITH {quantity: 1}]->(f1)',
    'CREATE (r1)-[:EQUIPPED_WITH {quantity: 1}]->(f2);',
    '',
    '// 6. Create Organizations and Members',
    'CREATE (o1:Organization {id: 501, name: "Quantix AI Labs", industry: "AI"})',
    'CREATE (o2:Organization {id: 502, name: "FinTech Matrix India", industry: "FinTech"})',
    'CREATE (m1:Member {id: 1001, name: "Arjun Mehta", email: "arjun.mehta@worksphere.io"})',
    'CREATE (m2:Member {id: 1002, name: "Aditya Rao", email: "aditya.rao@quantixai.com"})',
    'CREATE (m3:Member {id: 1007, name: "Tanvi M. Sundaram", email: "tanvi.m@fintechmatrix.in"})',
    'CREATE (m1)-[:BELONGS_TO {role: "Chief AI Scientist"}]->(o1)',
    'CREATE (m2)-[:BELONGS_TO {role: "Senior NLP Lead"}]->(o1)',
    'CREATE (m3)-[:BELONGS_TO {role: "Risk Specialist"}]->(o2);',
    '',
    '// 7. Recursive Employee Hierarchy',
    'CREATE (dir:Employee {id: 9001, name: "Vikram Chandran", role: "Regional Operations Director"})',
    'CREATE (mgr:Employee {id: 9002, name: "Ananya Subramanian", role: "Guindy Hub Community Manager"})',
    'CREATE (host:Employee {id: 9005, name: "Manoj K. Pillai", role: "Front Desk Host"})',
    'CREATE (mgr)-[:REPORTS_TO]->(dir)',
    'CREATE (host)-[:REPORTS_TO]->(mgr);',
    '',
    '// 8. Sample Technology-Specific Queries:',
    '// A. Collaborative Room Recommendation',
    'MATCH (m:Member {id: 1001})-[:BELONGS_TO]->(o:Organization)<-[:BELONGS_TO]-(peer:Member)-[:BOOKED]->(b:Booking)-[:RESERVED_FOR]->(r:MeetingRoom)',
    'RETURN r.name, count(*) AS score ORDER BY score DESC;',
    '',
    '// B. Recursive Employee Management Traversal',
    'MATCH path = (e:Employee {id: 9005})-[:REPORTS_TO*1..4]->(top:Employee)',
    'RETURN path, length(path) AS hierarchy_depth;'
  ];

  fs.writeFileSync(cqlPath, lines.join('\n'), 'utf8');
}

// Auto seed if executed directly
if (require.main === module) {
  seedGraph();
}

module.exports = { seedGraph };
