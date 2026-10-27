const { queryJdbc, queryNative } = require('./db');

async function run() {
  const statements = [
    // Drop table 1
    `BEGIN EXECUTE IMMEDIATE 'DROP TABLE DEMO_1NF_PARTIAL_DEP CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;`,
    // Drop table 2
    `BEGIN EXECUTE IMMEDIATE 'DROP TABLE DEMO_2NF_TRANSITIVE_DEP CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;`,
    // Create DEMO_1NF_PARTIAL_DEP
    `CREATE TABLE DEMO_1NF_PARTIAL_DEP (
        room_id NUMBER NOT NULL,
        facility_id NUMBER NOT NULL,
        room_name VARCHAR2(100) NOT NULL,
        hourly_rate NUMBER(8,2) NOT NULL,
        facility_name VARCHAR2(100) NOT NULL,
        quantity NUMBER(3) DEFAULT 1,
        CONSTRAINT pk_demo_partial PRIMARY KEY (room_id, facility_id)
    )`,
    // Insert into DEMO_1NF_PARTIAL_DEP
    `INSERT INTO DEMO_1NF_PARTIAL_DEP VALUES (301, 401, 'Executive Boardroom Alpha', 1200.00, '4K UltraHD Video Bar', 1)`,
    `INSERT INTO DEMO_1NF_PARTIAL_DEP VALUES (301, 402, 'Executive Boardroom Alpha', 1200.00, 'Dual Wireless Mics', 2)`,
    `INSERT INTO DEMO_1NF_PARTIAL_DEP VALUES (301, 403, 'Executive Boardroom Alpha', 1200.00, 'Motorized Smart Projector', 1)`,
    `INSERT INTO DEMO_1NF_PARTIAL_DEP VALUES (302, 404, 'Guindy Acoustic Pod A', 250.00, 'Soundproofing Baffles', 4)`,
    `INSERT INTO DEMO_1NF_PARTIAL_DEP VALUES (302, 405, 'Guindy Acoustic Pod A', 250.00, 'USB-C Fast Charging Hub', 1)`,
    `INSERT INTO DEMO_1NF_PARTIAL_DEP VALUES (303, 406, 'OMR Tech Conference Hall', 2500.00, 'JBL Line Array Speakers', 4)`,
    `INSERT INTO DEMO_1NF_PARTIAL_DEP VALUES (303, 407, 'OMR Tech Conference Hall', 2500.00, 'Digital Smart Board 85-inch', 2)`,
    `INSERT INTO DEMO_1NF_PARTIAL_DEP VALUES (304, 408, 'Anna Nagar Focus Pod 1', 300.00, 'Ergonomic Mesh Chair', 2)`,
    `INSERT INTO DEMO_1NF_PARTIAL_DEP VALUES (305, 409, 'T. Nagar Elite Boardroom', 1800.00, 'Cisco Telepresence Unit', 1)`,
    // Create DEMO_2NF_TRANSITIVE_DEP
    `CREATE TABLE DEMO_2NF_TRANSITIVE_DEP (
        member_id NUMBER PRIMARY KEY,
        member_name VARCHAR2(100) NOT NULL,
        email VARCHAR2(100) NOT NULL,
        plan_id NUMBER NOT NULL,
        plan_name VARCHAR2(50) NOT NULL,
        monthly_fee NUMBER(10,2) NOT NULL,
        duration_months NUMBER(3) NOT NULL
    )`,
    // Insert into DEMO_2NF_TRANSITIVE_DEP
    `INSERT INTO DEMO_2NF_TRANSITIVE_DEP VALUES (1001, 'Aarav Sharma', 'aarav.sharma@techcorp.in', 203, 'Corporate Enterprise Unlimited', 35000.00, 12)`,
    `INSERT INTO DEMO_2NF_TRANSITIVE_DEP VALUES (1002, 'Priya Ramanathan', 'priya.r@chennaistartup.io', 202, 'Team Collaborative Pro', 18000.00, 6)`,
    `INSERT INTO DEMO_2NF_TRANSITIVE_DEP VALUES (1003, 'Karthik Subramanian', 'karthik.sub@freelance.dev', 201, 'Flexible Desk Starter', 8500.00, 1)`,
    `INSERT INTO DEMO_2NF_TRANSITIVE_DEP VALUES (1004, 'Deepa Venkatesh', 'deepa.v@fintechsol.com', 203, 'Corporate Enterprise Unlimited', 35000.00, 12)`,
    `INSERT INTO DEMO_2NF_TRANSITIVE_DEP VALUES (1005, 'Vikram Chandran', 'vikram.c@datasystems.co', 202, 'Team Collaborative Pro', 18000.00, 6)`,
    `INSERT INTO DEMO_2NF_TRANSITIVE_DEP VALUES (1006, 'Sneha Balaji', 'sneha.b@designstudio.in', 201, 'Flexible Desk Starter', 8500.00, 1)`,
    `COMMIT`
  ];

  for (const sql of statements) {
    try {
      await queryJdbc(sql);
      console.log('SUCCESS:', sql.substring(0, 45) + '...');
    } catch (err) {
      console.error('ERROR executing:', sql.substring(0, 45), err.message);
    }
  }

  // Verify counts
  const r1 = await queryJdbc('SELECT COUNT(*) as cnt FROM DEMO_1NF_PARTIAL_DEP');
  const r2 = await queryJdbc('SELECT COUNT(*) as cnt FROM DEMO_2NF_TRANSITIVE_DEP');
  console.log('DEMO_1NF_PARTIAL_DEP count:', r1.rows[0].CNT);
  console.log('DEMO_2NF_TRANSITIVE_DEP count:', r2.rows[0].CNT);
}

run();
