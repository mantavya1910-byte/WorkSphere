// ====================================================================
// WORKSPHERE CYPHER SCRIPT FOR NEO4J BROWSER / CYPHER-SHELL
// Course: Database Management Systems / Advanced DBMS
// ====================================================================

// 1. Wipe existing graph (Optional)
MATCH (n) DETACH DELETE n;

// 2. Schema Constraints & Indexes (Index-Free Adjacency + Label Indexes)
CREATE CONSTRAINT space_id_unique IF NOT EXISTS FOR (s:CoworkingSpace) REQUIRE s.id IS UNIQUE;
CREATE CONSTRAINT room_id_unique IF NOT EXISTS FOR (r:MeetingRoom) REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT member_id_unique IF NOT EXISTS FOR (m:Member) REQUIRE m.id IS UNIQUE;
CREATE CONSTRAINT org_id_unique IF NOT EXISTS FOR (o:Organization) REQUIRE o.id IS UNIQUE;
CREATE CONSTRAINT emp_id_unique IF NOT EXISTS FOR (e:Employee) REQUIRE e.id IS UNIQUE;

// 3. Create Coworking Spaces
CREATE (s1:CoworkingSpace {id: 101, name: "Nexus WorkHub - Guindy", city: "Chennai", desks: 180})
CREATE (s2:CoworkingSpace {id: 102, name: "Innovate Hub - OMR IT Expressway", city: "Chennai", desks: 320})
CREATE (s3:CoworkingSpace {id: 103, name: "Synergy Spaces - Anna Nagar", city: "Chennai", desks: 150})
CREATE (s4:CoworkingSpace {id: 104, name: "Venture Loft - T. Nagar", city: "Chennai", desks: 210});

// 4. Create Meeting Rooms & Connect to Spaces
MATCH (s1:CoworkingSpace {id: 101})
CREATE (r1:MeetingRoom {id: 301, name: "Kaveri Conference Suite", capacity: 16, hourly_rate: 1200})
CREATE (r2:MeetingRoom {id: 302, name: "Vaigai Brainstorm Pod", capacity: 4, hourly_rate: 450})
CREATE (s1)-[:CONTAINS]->(r1)
CREATE (s1)-[:CONTAINS]->(r2);

MATCH (s2:CoworkingSpace {id: 102})
CREATE (r3:MeetingRoom {id: 305, name: "Silicon Boardroom Elite", capacity: 24, hourly_rate: 2500})
CREATE (s2)-[:CONTAINS]->(r3);

// 5. Create Facilities & Connect to Rooms
CREATE (f1:Facility {id: 401, name: "Sony 4K HDR Smart Display 75-inch", category: "Display"})
CREATE (f2:Facility {id: 402, name: "Polycom Studio Video Bar", category: "AV"})
CREATE (f3:Facility {id: 404, name: "Ultra-wide Curved Monitor", category: "Display"});

MATCH (r1:MeetingRoom {id: 301}), (f1:Facility {id: 401}), (f2:Facility {id: 402})
CREATE (r1)-[:EQUIPPED_WITH {quantity: 1}]->(f1)
CREATE (r1)-[:EQUIPPED_WITH {quantity: 1}]->(f2);

// 6. Create Organizations and Members
CREATE (o1:Organization {id: 501, name: "Quantix AI Labs", industry: "AI"})
CREATE (o2:Organization {id: 502, name: "FinTech Matrix India", industry: "FinTech"})
CREATE (m1:Member {id: 1001, name: "Arjun Mehta", email: "arjun.mehta@worksphere.io"})
CREATE (m2:Member {id: 1002, name: "Aditya Rao", email: "aditya.rao@quantixai.com"})
CREATE (m3:Member {id: 1007, name: "Tanvi M. Sundaram", email: "tanvi.m@fintechmatrix.in"})
CREATE (m1)-[:BELONGS_TO {role: "Chief AI Scientist"}]->(o1)
CREATE (m2)-[:BELONGS_TO {role: "Senior NLP Lead"}]->(o1)
CREATE (m3)-[:BELONGS_TO {role: "Risk Specialist"}]->(o2);

// 7. Recursive Employee Hierarchy
CREATE (dir:Employee {id: 9001, name: "Vikram Chandran", role: "Regional Operations Director"})
CREATE (mgr:Employee {id: 9002, name: "Ananya Subramanian", role: "Guindy Hub Community Manager"})
CREATE (host:Employee {id: 9005, name: "Manoj K. Pillai", role: "Front Desk Host"})
CREATE (mgr)-[:REPORTS_TO]->(dir)
CREATE (host)-[:REPORTS_TO]->(mgr);

// 8. Sample Technology-Specific Queries:
// A. Collaborative Room Recommendation
MATCH (m:Member {id: 1001})-[:BELONGS_TO]->(o:Organization)<-[:BELONGS_TO]-(peer:Member)-[:BOOKED]->(b:Booking)-[:RESERVED_FOR]->(r:MeetingRoom)
RETURN r.name, count(*) AS score ORDER BY score DESC;

// B. Recursive Employee Management Traversal
MATCH path = (e:Employee {id: 9005})-[:REPORTS_TO*1..4]->(top:Employee)
RETURN path, length(path) AS hierarchy_depth;