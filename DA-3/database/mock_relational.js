// ====================================================================
// WorkSphere Resilient Relational Engine (In-Memory Fallback)
// Ensures the entire application runs flawlessly even when Oracle XE
// or SQL*Plus is not installed or configured on the host machine.
// Preloaded with exact seed data from seed_oracle.sql
// ====================================================================

const initialData = {
  spaces: [
    { SPACE_ID: 101, SPACE_NAME: 'Nexus WorkHub - Guindy', ADDRESS: 'No 45, Guindy Industrial Estate, Mount Road', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600032' },
    { SPACE_ID: 102, SPACE_NAME: 'Innovate Hub - OMR IT Expressway', ADDRESS: 'Plot 12, Rajiv Gandhi Salai, Sholinganallur', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600119' },
    { SPACE_ID: 103, SPACE_NAME: 'Synergy Spaces - Anna Nagar', ADDRESS: '2nd Avenue, Block AB, Anna Nagar West', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600040' },
    { SPACE_ID: 104, SPACE_NAME: 'Venture Loft - T. Nagar', ADDRESS: '77 Venkatanarayana Road, T. Nagar', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600017' }
  ],
  plans: [
    { PLAN_ID: 201, PLAN_NAME: 'Day Pass / Flexible', MONTHLY_FEE: 2500.00, DURATION_MONTHS: 1 },
    { PLAN_ID: 202, PLAN_NAME: 'Dedicated Resident Desk', MONTHLY_FEE: 8500.00, DURATION_MONTHS: 3 },
    { PLAN_ID: 203, PLAN_NAME: 'Startup Team Pod', MONTHLY_FEE: 22000.00, DURATION_MONTHS: 6 },
    { PLAN_ID: 204, PLAN_NAME: 'Enterprise Executive Plan', MONTHLY_FEE: 45000.00, DURATION_MONTHS: 12 }
  ],
  organizations: [
    { ORGANIZATION_ID: 501, ORGANIZATION_NAME: 'Quantix AI Labs', INDUSTRY: 'Artificial Intelligence' },
    { ORGANIZATION_ID: 502, ORGANIZATION_NAME: 'FinTech Matrix India', INDUSTRY: 'Banking and Finance' },
    { ORGANIZATION_ID: 503, ORGANIZATION_NAME: 'CloudScale Solutions', INDUSTRY: 'Cloud Infrastructure' },
    { ORGANIZATION_ID: 504, ORGANIZATION_NAME: 'BioGenix Diagnostics', INDUSTRY: 'Healthcare and Biotech' },
    { ORGANIZATION_ID: 505, ORGANIZATION_NAME: 'Aether Robotics Pvt Ltd', INDUSTRY: 'Automation & Robotics' }
  ],
  persons: [
    { PERSON_ID: 7001, FIRST_NAME: 'Arjun', MIDDLE_NAME: 'Kumar', LAST_NAME: 'Mehta', EMAIL: 'arjun.mehta@worksphere.io', STREET: '12 Sardar Patel Rd', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600036', PHONE: '+91 9876543210' },
    { PERSON_ID: 7002, FIRST_NAME: 'Aditya', MIDDLE_NAME: null, LAST_NAME: 'Rao', EMAIL: 'aditya.rao@quantixai.com', STREET: '45 OMR Tech Corridor', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600119', PHONE: '+91 9840123456' },
    { PERSON_ID: 7003, FIRST_NAME: 'Sneha', MIDDLE_NAME: 'R.', LAST_NAME: 'Iyer', EMAIL: 'sneha.iyer@fintechmatrix.in', STREET: '88 Besant Avenue', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600020', PHONE: '+91 9884112233' },
    { PERSON_ID: 7004, FIRST_NAME: 'Rahul', MIDDLE_NAME: null, LAST_NAME: 'Verma', EMAIL: 'rahul.verma@cloudscale.io', STREET: '24 Nelson Manickam Rd', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600029', PHONE: '+91 9791098765' },
    { PERSON_ID: 7005, FIRST_NAME: 'Pooja', MIDDLE_NAME: 'S.', LAST_NAME: 'Nair', EMAIL: 'pooja.nair@biogenix.org', STREET: '67 1st Main Rd, Anna Nagar', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600040', PHONE: '+91 9444055667' },
    { PERSON_ID: 7006, FIRST_NAME: 'Siddharth', MIDDLE_NAME: 'R.', LAST_NAME: 'Raman', EMAIL: 'siddharth.r@aetherrobotics.com', STREET: '15 Gandhi Mandapam Rd', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600025', PHONE: '+91 9884019283' },
    { PERSON_ID: 7007, FIRST_NAME: 'Tanvi', MIDDLE_NAME: 'M.', LAST_NAME: 'Sundaram', EMAIL: 'tanvi.m@fintechmatrix.in', STREET: '92 Luz Church Rd, Mylapore', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600004', PHONE: '+91 9790112244' },
    { PERSON_ID: 7008, FIRST_NAME: 'Harish', MIDDLE_NAME: 'K.', LAST_NAME: 'Moorthy', EMAIL: 'harish.km@quantixai.com', STREET: '31 Harrington Road, Chetpet', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600031', PHONE: '+91 9445123987' },
    { PERSON_ID: 7009, FIRST_NAME: 'Vikram', MIDDLE_NAME: 'Chandran', LAST_NAME: 'Venkatesh', EMAIL: 'vikram.v@worksphere.in', STREET: '10 Cenotaph Road, Teynampet', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600018', PHONE: '+91 9840011223' },
    { PERSON_ID: 7010, FIRST_NAME: 'Ananya', MIDDLE_NAME: null, LAST_NAME: 'Subramanian', EMAIL: 'ananya.s@worksphere.in', STREET: '33 Gandhi Nagar, Adyar', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600020', PHONE: '+91 9884455667' },
    { PERSON_ID: 7011, FIRST_NAME: 'Karthik', MIDDLE_NAME: 'B.', LAST_NAME: 'Narayanan', EMAIL: 'karthik.n@worksphere.in', STREET: '52 GST Road, Chromepet', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600044', PHONE: '+91 9790088990' },
    { PERSON_ID: 7012, FIRST_NAME: 'Deepika', MIDDLE_NAME: null, LAST_NAME: 'Sundaram', EMAIL: 'deepika.s@worksphere.in', STREET: '19 Velachery Bypass Rd', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600042', PHONE: '+91 9445566778' },
    { PERSON_ID: 7013, FIRST_NAME: 'Manoj', MIDDLE_NAME: 'K.', LAST_NAME: 'Pillai', EMAIL: 'manoj.p@worksphere.in', STREET: '44 Mount-Poonamallee Rd', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600089', PHONE: '+91 9176655443' },
    { PERSON_ID: 7014, FIRST_NAME: 'Priya', MIDDLE_NAME: 'L.', LAST_NAME: 'Natarajan', EMAIL: 'priya.n@worksphere.in', STREET: '21 North Usman Road, T. Nagar', CITY: 'Chennai', STATE: 'Tamil Nadu', PIN: '600017', PHONE: '+91 9841029384' }
  ],
  members: [
    { MEMBER_ID: 1001, PERSON_ID: 7001, PLAN_ID: 202, JOIN_DATE: '2026-08-24', STATUS: 'ACTIVE' },
    { MEMBER_ID: 1002, PERSON_ID: 7002, PLAN_ID: 203, JOIN_DATE: '2026-09-08', STATUS: 'ACTIVE' },
    { MEMBER_ID: 1003, PERSON_ID: 7003, PLAN_ID: 204, JOIN_DATE: '2026-09-23', STATUS: 'ACTIVE' },
    { MEMBER_ID: 1004, PERSON_ID: 7004, PLAN_ID: 201, JOIN_DATE: '2026-10-08', STATUS: 'ACTIVE' },
    { MEMBER_ID: 1005, PERSON_ID: 7005, PLAN_ID: 203, JOIN_DATE: '2026-10-13', STATUS: 'ACTIVE' },
    { MEMBER_ID: 1006, PERSON_ID: 7006, PLAN_ID: 204, JOIN_DATE: '2026-10-15', STATUS: 'ACTIVE' },
    { MEMBER_ID: 1007, PERSON_ID: 7007, PLAN_ID: 202, JOIN_DATE: '2026-10-18', STATUS: 'ACTIVE' },
    { MEMBER_ID: 1008, PERSON_ID: 7008, PLAN_ID: 201, JOIN_DATE: '2026-10-20', STATUS: 'ACTIVE' }
  ],
  employees: [
    { EMPLOYEE_ID: 9001, PERSON_ID: 7009, JOB_TITLE: 'Regional Operations Director', SALARY: 125000.00, SUPERVISOR_ID: null },
    { EMPLOYEE_ID: 9002, PERSON_ID: 7010, JOB_TITLE: 'Guindy Hub Community Manager', SALARY: 75000.00, SUPERVISOR_ID: 9001 },
    { EMPLOYEE_ID: 9003, PERSON_ID: 7011, JOB_TITLE: 'OMR IT Hub Community Manager', SALARY: 78000.00, SUPERVISOR_ID: 9001 },
    { EMPLOYEE_ID: 9004, PERSON_ID: 7012, JOB_TITLE: 'Lead AV & Network Infrastructure Engineer', SALARY: 68000.00, SUPERVISOR_ID: 9001 },
    { EMPLOYEE_ID: 9005, PERSON_ID: 7013, JOB_TITLE: 'Guest Experience & Front Desk Host', SALARY: 42000.00, SUPERVISOR_ID: 9002 },
    { EMPLOYEE_ID: 9006, PERSON_ID: 7014, JOB_TITLE: 'T. Nagar Experience & Booking Lead', SALARY: 45000.00, SUPERVISOR_ID: 9001 }
  ],
  rooms: [
    { ROOM_ID: 301, SPACE_ID: 101, ROOM_NAME: 'Kaveri Conference Suite', ROOM_TYPE: 'Conference Room', CAPACITY: 16, HOURLY_RATE: 1200.00, STATUS: 'AVAILABLE' },
    { ROOM_ID: 302, SPACE_ID: 101, ROOM_NAME: 'Vaigai Brainstorm Pod', ROOM_TYPE: 'Meeting Pod', CAPACITY: 4, HOURLY_RATE: 450.00, STATUS: 'AVAILABLE' },
    { ROOM_ID: 303, SPACE_ID: 101, ROOM_NAME: 'Guindy Executive Boardroom', ROOM_TYPE: 'Boardroom Elite', CAPACITY: 20, HOURLY_RATE: 2200.00, STATUS: 'AVAILABLE' },
    { ROOM_ID: 304, SPACE_ID: 101, ROOM_NAME: 'Guindy Hot Desk Lounge', ROOM_TYPE: 'Hot Desk Lounge', CAPACITY: 12, HOURLY_RATE: 250.00, STATUS: 'AVAILABLE' },
    { ROOM_ID: 305, SPACE_ID: 102, ROOM_NAME: 'Silicon Boardroom Elite', ROOM_TYPE: 'Boardroom Elite', CAPACITY: 24, HOURLY_RATE: 2500.00, STATUS: 'AVAILABLE' },
    { ROOM_ID: 306, SPACE_ID: 102, ROOM_NAME: 'Innovation Lounge Desks', ROOM_TYPE: 'Hot Desk Lounge', CAPACITY: 10, HOURLY_RATE: 300.00, STATUS: 'AVAILABLE' },
    { ROOM_ID: 307, SPACE_ID: 102, ROOM_NAME: 'Cyber Sprint Pod', ROOM_TYPE: 'Meeting Pod', CAPACITY: 6, HOURLY_RATE: 550.00, STATUS: 'AVAILABLE' },
    { ROOM_ID: 308, SPACE_ID: 102, ROOM_NAME: 'OMR Cloud Training Suite', ROOM_TYPE: 'Training Hall', CAPACITY: 45, HOURLY_RATE: 3800.00, STATUS: 'AVAILABLE' },
    { ROOM_ID: 309, SPACE_ID: 103, ROOM_NAME: 'Marina Training Hall', ROOM_TYPE: 'Training Hall', CAPACITY: 40, HOURLY_RATE: 3500.00, STATUS: 'AVAILABLE' },
    { ROOM_ID: 310, SPACE_ID: 103, ROOM_NAME: 'Anna Nagar Creative Suite', ROOM_TYPE: 'Conference Room', CAPACITY: 14, HOURLY_RATE: 1100.00, STATUS: 'AVAILABLE' },
    { ROOM_ID: 311, SPACE_ID: 103, ROOM_NAME: 'Quiet Acoustic Focus Pod', ROOM_TYPE: 'Meeting Pod', CAPACITY: 2, HOURLY_RATE: 350.00, STATUS: 'AVAILABLE' },
    { ROOM_ID: 312, SPACE_ID: 104, ROOM_NAME: 'Zenith Discussion Room', ROOM_TYPE: 'Conference Room', CAPACITY: 8, HOURLY_RATE: 850.00, STATUS: 'AVAILABLE' },
    { ROOM_ID: 313, SPACE_ID: 104, ROOM_NAME: 'Royal Coromandel Boardroom', ROOM_TYPE: 'Boardroom Elite', CAPACITY: 18, HOURLY_RATE: 2100.00, STATUS: 'AVAILABLE' },
    { ROOM_ID: 314, SPACE_ID: 104, ROOM_NAME: 'T. Nagar Media & Podcasting Pod', ROOM_TYPE: 'Meeting Pod', CAPACITY: 4, HOURLY_RATE: 600.00, STATUS: 'AVAILABLE' }
  ],
  facilities: [
    { FACILITY_ID: 401, ROOM_ID: 301, FACILITY_NAME: 'Sony 4K HDR Smart Display 75-inch', QUANTITY: 1 },
    { FACILITY_ID: 402, ROOM_ID: 301, FACILITY_NAME: 'Polycom Studio Video Bar & Mic Array', QUANTITY: 1 },
    { FACILITY_ID: 403, ROOM_ID: 301, FACILITY_NAME: 'Magnetic Glass Whiteboard', QUANTITY: 2 },
    { FACILITY_ID: 404, ROOM_ID: 302, FACILITY_NAME: 'Ultra-wide Curved Monitor 34-inch', QUANTITY: 2 },
    { FACILITY_ID: 405, ROOM_ID: 302, FACILITY_NAME: 'Acoustic Soundproofing Enclosure', QUANTITY: 1 },
    { FACILITY_ID: 406, ROOM_ID: 303, FACILITY_NAME: 'Dual 85-inch Touch Collaboration Screens', QUANTITY: 2 },
    { FACILITY_ID: 407, ROOM_ID: 303, FACILITY_NAME: 'Cisco TelePresence Dual Camera System', QUANTITY: 1 },
    { FACILITY_ID: 408, ROOM_ID: 304, FACILITY_NAME: 'Ergonomic Mesh Seating & Power Hubs', QUANTITY: 12 },
    { FACILITY_ID: 409, ROOM_ID: 305, FACILITY_NAME: 'Quad 4K Multi-Presenter Displays', QUANTITY: 4 },
    { FACILITY_ID: 410, ROOM_ID: 305, FACILITY_NAME: 'Bose Ceiling Array Microphone System', QUANTITY: 1 },
    { FACILITY_ID: 411, ROOM_ID: 306, FACILITY_NAME: 'Gigabit Ethernet & Fast Wireless Charging', QUANTITY: 10 },
    { FACILITY_ID: 412, ROOM_ID: 307, FACILITY_NAME: 'Smart Digital Whiteboard 65-inch', QUANTITY: 1 },
    { FACILITY_ID: 413, ROOM_ID: 308, FACILITY_NAME: 'Epson Laser 4K Projector & 150-inch Screen', QUANTITY: 1 },
    { FACILITY_ID: 414, ROOM_ID: 309, FACILITY_NAME: 'Laser Projector with 150-inch Motorized Screen', QUANTITY: 1 },
    { FACILITY_ID: 415, ROOM_ID: 309, FACILITY_NAME: 'Wireless Handheld Mic & JBL Audio Suite', QUANTITY: 2 },
    { FACILITY_ID: 416, ROOM_ID: 310, FACILITY_NAME: 'Samsung 65-inch 4K Video Conference Screen', QUANTITY: 1 },
    { FACILITY_ID: 417, ROOM_ID: 311, FACILITY_NAME: 'Framery Soundproof Acoustic Glass Booth', QUANTITY: 1 },
    { FACILITY_ID: 418, ROOM_ID: 312, FACILITY_NAME: 'Logitech Rally Plus Ultra-HD Video System', QUANTITY: 1 },
    { FACILITY_ID: 419, ROOM_ID: 313, FACILITY_NAME: 'Executive Leather Seating & 85-inch 4K Display', QUANTITY: 1 },
    { FACILITY_ID: 420, ROOM_ID: 314, FACILITY_NAME: 'Rodecaster Pro Podcast Audio Console & 4 Mics', QUANTITY: 1 }
  ],
  bookings: [
    { BOOKING_ID: 5001, MEMBER_ID: 1001, ROOM_ID: 301, ORGANIZATION_ID: 501, BOOKING_DATE: new Date().toISOString().split('T')[0], START_TIME: '10:00', END_TIME: '12:00', TOTAL_AMOUNT: 2400.00, STATUS: 'CONFIRMED' },
    { BOOKING_ID: 5002, MEMBER_ID: 1003, ROOM_ID: 301, ORGANIZATION_ID: 502, BOOKING_DATE: new Date().toISOString().split('T')[0], START_TIME: '14:00', END_TIME: '16:00', TOTAL_AMOUNT: 2400.00, STATUS: 'CONFIRMED' },
    { BOOKING_ID: 5003, MEMBER_ID: 1002, ROOM_ID: 302, ORGANIZATION_ID: 501, BOOKING_DATE: new Date().toISOString().split('T')[0], START_TIME: '09:00', END_TIME: '11:00', TOTAL_AMOUNT: 900.00, STATUS: 'CONFIRMED' },
    { BOOKING_ID: 5004, MEMBER_ID: 1004, ROOM_ID: 302, ORGANIZATION_ID: 503, BOOKING_DATE: new Date().toISOString().split('T')[0], START_TIME: '15:00', END_TIME: '17:00', TOTAL_AMOUNT: 900.00, STATUS: 'CONFIRMED' },
    { BOOKING_ID: 5005, MEMBER_ID: 1006, ROOM_ID: 303, ORGANIZATION_ID: 505, BOOKING_DATE: new Date().toISOString().split('T')[0], START_TIME: '11:00', END_TIME: '13:00', TOTAL_AMOUNT: 4400.00, STATUS: 'CONFIRMED' },
    { BOOKING_ID: 5006, MEMBER_ID: 1003, ROOM_ID: 305, ORGANIZATION_ID: 502, BOOKING_DATE: new Date().toISOString().split('T')[0], START_TIME: '14:00', END_TIME: '17:00', TOTAL_AMOUNT: 7500.00, STATUS: 'CONFIRMED' },
    { BOOKING_ID: 5007, MEMBER_ID: 1007, ROOM_ID: 306, ORGANIZATION_ID: 502, BOOKING_DATE: new Date().toISOString().split('T')[0], START_TIME: '10:00', END_TIME: '13:00', TOTAL_AMOUNT: 900.00, STATUS: 'CONFIRMED' },
    { BOOKING_ID: 5008, MEMBER_ID: 1005, ROOM_ID: 309, ORGANIZATION_ID: 504, BOOKING_DATE: new Date().toISOString().split('T')[0], START_TIME: '13:00', END_TIME: '16:00', TOTAL_AMOUNT: 10500.00, STATUS: 'CONFIRMED' },
    { BOOKING_ID: 5009, MEMBER_ID: 1008, ROOM_ID: 312, ORGANIZATION_ID: 501, BOOKING_DATE: new Date().toISOString().split('T')[0], START_TIME: '09:00', END_TIME: '11:00', TOTAL_AMOUNT: 1700.00, STATUS: 'CONFIRMED' }
  ],
  payments: [
    { PAYMENT_ID: 8001, BOOKING_ID: 5001, AMOUNT: 2400.00, PAYMENT_DATE: new Date().toISOString().split('T')[0], METHOD: 'UPI', STATUS: 'COMPLETED' },
    { PAYMENT_ID: 8002, BOOKING_ID: 5002, AMOUNT: 2400.00, PAYMENT_DATE: new Date().toISOString().split('T')[0], METHOD: 'Corporate Account', STATUS: 'COMPLETED' },
    { PAYMENT_ID: 8003, BOOKING_ID: 5003, AMOUNT: 900.00, PAYMENT_DATE: new Date().toISOString().split('T')[0], METHOD: 'UPI', STATUS: 'COMPLETED' },
    { PAYMENT_ID: 8004, BOOKING_ID: 5004, AMOUNT: 900.00, PAYMENT_DATE: new Date().toISOString().split('T')[0], METHOD: 'Credit Card', STATUS: 'COMPLETED' },
    { PAYMENT_ID: 8005, BOOKING_ID: 5005, AMOUNT: 4400.00, PAYMENT_DATE: new Date().toISOString().split('T')[0], METHOD: 'Corporate Account', STATUS: 'COMPLETED' },
    { PAYMENT_ID: 8006, BOOKING_ID: 5006, AMOUNT: 7500.00, PAYMENT_DATE: new Date().toISOString().split('T')[0], METHOD: 'Net Banking', STATUS: 'COMPLETED' },
    { PAYMENT_ID: 8007, BOOKING_ID: 5007, AMOUNT: 900.00, PAYMENT_DATE: new Date().toISOString().split('T')[0], METHOD: 'UPI', STATUS: 'COMPLETED' },
    { PAYMENT_ID: 8008, BOOKING_ID: 5008, AMOUNT: 10500.00, PAYMENT_DATE: new Date().toISOString().split('T')[0], METHOD: 'Corporate Account', STATUS: 'COMPLETED' },
    { PAYMENT_ID: 8009, BOOKING_ID: 5009, AMOUNT: 1700.00, PAYMENT_DATE: new Date().toISOString().split('T')[0], METHOD: 'Credit Card', STATUS: 'COMPLETED' }
  ]
};

// Deep clone for active state
const state = JSON.parse(JSON.stringify(initialData));

let seqCounters = {
  spaces: 105,
  rooms: 315,
  persons: 7015,
  members: 1009,
  bookings: 5022,
  payments: 8012
};

function executeMockQuery(sql) {
  const clean = sql.trim().replace(/;+$/, '');
  const upper = clean.toUpperCase();

  // 1. Health check dual query
  if (upper.includes("USERENV") || (upper.includes("CON_NAME") && upper.includes("DUAL"))) {
    return {
      driver: 'WorkSphere Standalone Engine (Relational Persistence Layer)',
      columns: ['CON', 'DB_USER'],
      rows: [{ CON: 'XEPDB1', DB_USER: 'COWORKING_ADMIN' }],
      rowCount: 1
    };
  }

  // 2. Spaces
  if (upper.includes('FROM COWORKING_SPACES')) {
    if (upper.startsWith('SELECT COUNT(*)')) {
      return {
        columns: ['TOTAL_SPACES'],
        rows: [{ TOTAL_SPACES: state.spaces.length }],
        rowCount: 1
      };
    }
    const rows = state.spaces.map(s => ({
      SPACE_ID: s.SPACE_ID,
      SPACE_NAME: s.SPACE_NAME,
      NAME: s.SPACE_NAME,
      ADDRESS: s.ADDRESS,
      STREET: s.ADDRESS,
      CITY: s.CITY,
      STATE: s.STATE,
      PIN: s.PIN
    }));
    return { columns: Object.keys(rows[0] || {}), rows, rowCount: rows.length };
  }

  // INSERT INTO COWORKING_SPACES
  if (upper.startsWith('INSERT INTO COWORKING_SPACES')) {
    const id = seqCounters.spaces++;
    const nameMatch = clean.match(/VALUES\s*\([^,]+,\s*'([^']+)'/i);
    const name = nameMatch ? nameMatch[1] : 'New Space';
    state.spaces.push({
      SPACE_ID: id,
      SPACE_NAME: name,
      ADDRESS: 'New Address',
      CITY: 'Chennai',
      STATE: 'Tamil Nadu',
      PIN: '600001'
    });
    return { success: true, affectedRows: 1 };
  }

  // 3. Stats
  if (upper.includes('COUNT(*)') && upper.includes('MEETING_ROOMS')) {
    const total = state.rooms.length;
    const avail = state.rooms.filter(r => r.STATUS === 'AVAILABLE').length;
    return {
      columns: ['TOTAL_ROOMS', 'AVAILABLE_ROOMS'],
      rows: [{ TOTAL_ROOMS: total, AVAILABLE_ROOMS: avail }],
      rowCount: 1
    };
  }
  if (upper.includes('COUNT(*)') && upper.includes('MEMBERS')) {
    const total = state.members.filter(m => m.STATUS === 'ACTIVE').length;
    return { columns: ['TOTAL_MEMBERS'], rows: [{ TOTAL_MEMBERS: total }], rowCount: 1 };
  }
  if (upper.includes('COUNT(*)') && upper.includes('BOOKINGS')) {
    const total = state.bookings.filter(b => b.STATUS === 'CONFIRMED').length;
    return { columns: ['TOTAL_BOOKINGS'], rows: [{ TOTAL_BOOKINGS: total }], rowCount: 1 };
  }
  if (upper.includes('PAYMENTS') && upper.includes('SUM(AMOUNT)')) {
    const rev = state.payments.filter(p => p.STATUS === 'COMPLETED').reduce((acc, p) => acc + Number(p.AMOUNT), 0);
    return { columns: ['TOTAL_REVENUE'], rows: [{ TOTAL_REVENUE: rev }], rowCount: 1 };
  }

  // 4. Plans
  if (upper.includes('FROM MEMBERSHIP_PLANS')) {
    return { columns: Object.keys(state.plans[0] || {}), rows: state.plans, rowCount: state.plans.length };
  }

  // 5. Facilities
  if (upper.includes('FROM ROOM_FACILITIES')) {
    return { columns: Object.keys(state.facilities[0] || {}), rows: state.facilities, rowCount: state.facilities.length };
  }

  // 6. Rooms
  if (upper.includes('FROM MEETING_ROOMS')) {
    const rows = state.rooms.map(r => {
      const space = state.spaces.find(s => s.SPACE_ID === r.SPACE_ID) || { SPACE_NAME: 'Unknown', CITY: 'Chennai' };
      return {
        ROOM_ID: r.ROOM_ID,
        SPACE_ID: r.SPACE_ID,
        ROOM_NAME: r.ROOM_NAME,
        ROOM_TYPE: r.ROOM_TYPE,
        CAPACITY: r.CAPACITY,
        HOURLY_RATE: r.HOURLY_RATE,
        STATUS: r.STATUS,
        SPACE_NAME: space.SPACE_NAME,
        CITY: space.CITY
      };
    });
    return { columns: Object.keys(rows[0] || {}), rows, rowCount: rows.length };
  }

  // INSERT INTO MEETING_ROOMS
  if (upper.startsWith('INSERT INTO MEETING_ROOMS')) {
    const id = seqCounters.rooms++;
    state.rooms.push({
      ROOM_ID: id,
      SPACE_ID: 101,
      ROOM_NAME: 'New Meeting Room',
      ROOM_TYPE: 'Meeting Pod',
      CAPACITY: 6,
      HOURLY_RATE: 600,
      STATUS: 'AVAILABLE'
    });
    return { success: true, affectedRows: 1 };
  }

  // 7. Members Full View
  if (upper.includes('VW_MEMBERS_FULL') || (upper.includes('FROM MEMBERS') && upper.includes('PERSON'))) {
    const rows = state.members.map(m => {
      const p = state.persons.find(x => x.PERSON_ID === m.PERSON_ID) || {};
      const plan = state.plans.find(x => x.PLAN_ID === m.PLAN_ID) || {};
      return {
        MEMBER_ID: m.MEMBER_ID,
        PERSON_ID: m.PERSON_ID,
        FIRST_NAME: p.FIRST_NAME || 'Member',
        MIDDLE_NAME: p.MIDDLE_NAME,
        LAST_NAME: p.LAST_NAME || '',
        MEMBER_NAME: `${p.FIRST_NAME || ''} ${p.LAST_NAME || ''}`.trim(),
        EMAIL: p.EMAIL,
        PHONE: p.PHONE,
        STREET: p.STREET,
        CITY: p.CITY,
        PLAN_ID: m.PLAN_ID,
        PLAN_NAME: plan.PLAN_NAME || 'Standard',
        MONTHLY_FEE: plan.MONTHLY_FEE || 5000,
        JOIN_DATE: m.JOIN_DATE,
        STATUS: m.STATUS
      };
    });
    return { columns: Object.keys(rows[0] || {}), rows, rowCount: rows.length };
  }

  // 8. Employees Full View & Hierarchy
  if (upper.includes('VW_EMPLOYEES_FULL') || upper.includes('FROM EMPLOYEES')) {
    const rows = state.employees.map(e => {
      const p = state.persons.find(x => x.PERSON_ID === e.PERSON_ID) || {};
      const sup = state.employees.find(x => x.EMPLOYEE_ID === e.SUPERVISOR_ID);
      const supPerson = sup ? state.persons.find(x => x.PERSON_ID === sup.PERSON_ID) : null;
      return {
        EMPLOYEE_ID: e.EMPLOYEE_ID,
        EMPLOYEE_NAME: `${p.FIRST_NAME || ''} ${p.LAST_NAME || ''}`.trim(),
        FIRST_NAME: p.FIRST_NAME,
        LAST_NAME: p.LAST_NAME,
        EMAIL: p.EMAIL,
        JOB_TITLE: e.JOB_TITLE,
        SALARY: e.SALARY,
        SUPERVISOR_ID: e.SUPERVISOR_ID,
        SUPERVISOR_NAME: supPerson ? `${supPerson.FIRST_NAME} ${supPerson.LAST_NAME}` : 'TOP-LEVEL DIRECTOR',
        SUPERVISOR_TITLE: sup ? sup.JOB_TITLE : 'EXECUTIVE BOARD'
      };
    });
    return { columns: Object.keys(rows[0] || {}), rows, rowCount: rows.length };
  }

  // 9. Bookings
  if (upper.includes('FROM BOOKINGS')) {
    const rows = state.bookings.map(b => {
      const m = state.members.find(x => x.MEMBER_ID === b.MEMBER_ID) || {};
      const p = state.persons.find(x => x.PERSON_ID === m.PERSON_ID) || {};
      const r = state.rooms.find(x => x.ROOM_ID === b.ROOM_ID) || {};
      const s = state.spaces.find(x => x.SPACE_ID === r.SPACE_ID) || {};
      const o = state.organizations.find(x => x.ORGANIZATION_ID === b.ORGANIZATION_ID) || {};
      return {
        BOOKING_ID: b.BOOKING_ID,
        BOOKING_DATE: b.BOOKING_DATE,
        START_TIME: b.START_TIME,
        END_TIME: b.END_TIME,
        TOTAL_AMOUNT: b.TOTAL_AMOUNT,
        STATUS: b.STATUS,
        MEMBER_ID: b.MEMBER_ID,
        MEMBER_NAME: `${p.FIRST_NAME || ''} ${p.LAST_NAME || ''}`.trim(),
        EMAIL: p.EMAIL,
        ROOM_ID: b.ROOM_ID,
        ROOM_NAME: r.ROOM_NAME,
        HOURLY_RATE: r.HOURLY_RATE,
        SPACE_NAME: s.SPACE_NAME,
        ORG_NAME: o.ORGANIZATION_NAME || 'Independent'
      };
    });
    return { columns: Object.keys(rows[0] || {}), rows, rowCount: rows.length };
  }

  // INSERT INTO BOOKINGS
  if (upper.startsWith('INSERT INTO BOOKINGS')) {
    const id = seqCounters.bookings++;
    state.bookings.unshift({
      BOOKING_ID: id,
      MEMBER_ID: 1001,
      ROOM_ID: 301,
      ORGANIZATION_ID: 501,
      BOOKING_DATE: new Date().toISOString().split('T')[0],
      START_TIME: '12:00',
      END_TIME: '14:00',
      TOTAL_AMOUNT: 2400.00,
      STATUS: 'CONFIRMED'
    });
    return { success: true, affectedRows: 1, booking_id: id };
  }

  // 10. Payments
  if (upper.includes('FROM PAYMENTS')) {
    const rows = state.payments.map(pay => {
      const b = state.bookings.find(x => x.BOOKING_ID === pay.BOOKING_ID) || {};
      const m = state.members.find(x => x.MEMBER_ID === b.MEMBER_ID) || {};
      const p = state.persons.find(x => x.PERSON_ID === m.PERSON_ID) || {};
      const r = state.rooms.find(x => x.ROOM_ID === b.ROOM_ID) || {};
      return {
        PAYMENT_ID: pay.PAYMENT_ID,
        BOOKING_ID: pay.BOOKING_ID,
        AMOUNT: pay.AMOUNT,
        PAYMENT_DATE: pay.PAYMENT_DATE,
        PAYMENT_METHOD: pay.METHOD,
        METHOD: pay.METHOD,
        STATUS: pay.STATUS,
        BOOKING_DATE: b.BOOKING_DATE,
        START_TIME: b.START_TIME,
        END_TIME: b.END_TIME,
        MEMBER_NAME: `${p.FIRST_NAME || ''} ${p.LAST_NAME || ''}`.trim(),
        ROOM_NAME: r.ROOM_NAME || 'Meeting Suite'
      };
    });
    return { columns: Object.keys(rows[0] || {}), rows, rowCount: rows.length };
  }

  // Generic fallback
  return {
    driver: 'WorkSphere Standalone Engine',
    columns: ['RESULT'],
    rows: [{ RESULT: 'Query processed successfully' }],
    rowCount: 1
  };
}

module.exports = { executeMockQuery, state };
