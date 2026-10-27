SET DEFINE OFF;
-- ====================================================================
-- WORKSPHERE - SEED DATA FOR EER SCHEMA (DA-II DBMS PROJECT)
-- Matches Mantavya Sharma (25BCE5583) DA-II EER Diagram
-- Includes rich meeting rooms across all Chennai campuses,
-- schedule slots for today & upcoming dates, and matching invoices.
-- ====================================================================

-- 1. Insert Coworking Spaces (4 Chennai Campus Hubs)
INSERT INTO COWORKING_SPACES (space_id, space_name, address, city, state, pin) 
VALUES (101, 'Nexus WorkHub - Guindy', 'No 45, Guindy Industrial Estate, Mount Road', 'Chennai', 'Tamil Nadu', '600032');

INSERT INTO COWORKING_SPACES (space_id, space_name, address, city, state, pin) 
VALUES (102, 'Innovate Hub - OMR IT Expressway', 'Plot 12, Rajiv Gandhi Salai, Sholinganallur', 'Chennai', 'Tamil Nadu', '600119');

INSERT INTO COWORKING_SPACES (space_id, space_name, address, city, state, pin) 
VALUES (103, 'Synergy Spaces - Anna Nagar', '2nd Avenue, Block AB, Anna Nagar West', 'Chennai', 'Tamil Nadu', '600040');

INSERT INTO COWORKING_SPACES (space_id, space_name, address, city, state, pin) 
VALUES (104, 'Venture Loft - T. Nagar', '77 Venkatanarayana Road, T. Nagar', 'Chennai', 'Tamil Nadu', '600017');

-- 2. Insert Membership Plans
INSERT INTO MEMBERSHIP_PLANS (plan_id, plan_name, monthly_fee, duration_months)
VALUES (201, 'Day Pass / Flexible', 2500.00, 1);

INSERT INTO MEMBERSHIP_PLANS (plan_id, plan_name, monthly_fee, duration_months)
VALUES (202, 'Dedicated Resident Desk', 8500.00, 3);

INSERT INTO MEMBERSHIP_PLANS (plan_id, plan_name, monthly_fee, duration_months)
VALUES (203, 'Startup Team Pod', 22000.00, 6);

INSERT INTO MEMBERSHIP_PLANS (plan_id, plan_name, monthly_fee, duration_months)
VALUES (204, 'Enterprise Executive Plan', 45000.00, 12);

-- 3. Insert Organizations
INSERT INTO ORGANIZATIONS (organization_id, organization_name, industry)
VALUES (501, 'Quantix AI Labs', 'Artificial Intelligence');

INSERT INTO ORGANIZATIONS (organization_id, organization_name, industry)
VALUES (502, 'FinTech Matrix India', 'Banking and Finance');

INSERT INTO ORGANIZATIONS (organization_id, organization_name, industry)
VALUES (503, 'CloudScale Solutions', 'Cloud Infrastructure');

INSERT INTO ORGANIZATIONS (organization_id, organization_name, industry)
VALUES (504, 'BioGenix Diagnostics', 'Healthcare and Biotech');

INSERT INTO ORGANIZATIONS (organization_id, organization_name, industry)
VALUES (505, 'Aether Robotics Pvt Ltd', 'Automation & Robotics');

-- ====================================================================
-- 4. Insert PERSON Superclass Records (Composite Name & Address)
-- ====================================================================
-- Member Persons (7001 to 7008)
INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7001, 'Arjun', 'Kumar', 'Mehta', 'arjun.mehta@worksphere.io', '12 Sardar Patel Rd', 'Chennai', 'Tamil Nadu', '600036', '+91 9876543210');

INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7002, 'Aditya', NULL, 'Rao', 'aditya.rao@quantixai.com', '45 OMR Tech Corridor', 'Chennai', 'Tamil Nadu', '600119', '+91 9840123456');

INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7003, 'Sneha', 'R.', 'Iyer', 'sneha.iyer@fintechmatrix.in', '88 Besant Avenue', 'Chennai', 'Tamil Nadu', '600020', '+91 9884112233');

INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7004, 'Rahul', NULL, 'Verma', 'rahul.verma@cloudscale.io', '24 Nelson Manickam Rd', 'Chennai', 'Tamil Nadu', '600029', '+91 9791098765');

INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7005, 'Pooja', 'S.', 'Nair', 'pooja.nair@biogenix.org', '67 1st Main Rd, Anna Nagar', 'Chennai', 'Tamil Nadu', '600040', '+91 9444055667');

INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7006, 'Siddharth', 'R.', 'Raman', 'siddharth.r@aetherrobotics.com', '15 Gandhi Mandapam Rd', 'Chennai', 'Tamil Nadu', '600025', '+91 9884019283');

INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7007, 'Tanvi', 'M.', 'Sundaram', 'tanvi.m@fintechmatrix.in', '92 Luz Church Rd, Mylapore', 'Chennai', 'Tamil Nadu', '600004', '+91 9790112244');

INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7008, 'Harish', 'K.', 'Moorthy', 'harish.km@quantixai.com', '31 Harrington Road, Chetpet', 'Chennai', 'Tamil Nadu', '600031', '+91 9445123987');

-- Employee Persons (7009 to 7014)
INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7009, 'Vikram', 'Chandran', 'Venkatesh', 'vikram.v@worksphere.in', '10 Cenotaph Road, Teynampet', 'Chennai', 'Tamil Nadu', '600018', '+91 9840011223');

INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7010, 'Ananya', NULL, 'Subramanian', 'ananya.s@worksphere.in', '33 Gandhi Nagar, Adyar', 'Chennai', 'Tamil Nadu', '600020', '+91 9884455667');

INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7011, 'Karthik', 'B.', 'Narayanan', 'karthik.n@worksphere.in', '52 GST Road, Chromepet', 'Chennai', 'Tamil Nadu', '600044', '+91 9790088990');

INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7012, 'Deepika', NULL, 'Sundaram', 'deepika.s@worksphere.in', '19 Velachery Bypass Rd', 'Chennai', 'Tamil Nadu', '600042', '+91 9445566778');

INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7013, 'Manoj', 'K.', 'Pillai', 'manoj.p@worksphere.in', '44 Mount-Poonamallee Rd', 'Chennai', 'Tamil Nadu', '600089', '+91 9176655443');

INSERT INTO PERSON (person_id, first_name, middle_name, last_name, email, street, city, state, pin, phone)
VALUES (7014, 'Priya', 'L.', 'Natarajan', 'priya.n@worksphere.in', '21 North Usman Road, T. Nagar', 'Chennai', 'Tamil Nadu', '600017', '+91 9841029384');

-- ====================================================================
-- 5. Insert MEMBERS Subclass Records (person_id -> 7001 to 7008)
-- ====================================================================
INSERT INTO MEMBERS (member_id, person_id, plan_id, join_date, status)
VALUES (1001, 7001, 202, SYSDATE - 60, 'ACTIVE');

INSERT INTO MEMBERS (member_id, person_id, plan_id, join_date, status)
VALUES (1002, 7002, 203, SYSDATE - 45, 'ACTIVE');

INSERT INTO MEMBERS (member_id, person_id, plan_id, join_date, status)
VALUES (1003, 7003, 204, SYSDATE - 30, 'ACTIVE');

INSERT INTO MEMBERS (member_id, person_id, plan_id, join_date, status)
VALUES (1004, 7004, 201, SYSDATE - 15, 'ACTIVE');

INSERT INTO MEMBERS (member_id, person_id, plan_id, join_date, status)
VALUES (1005, 7005, 203, SYSDATE - 10, 'ACTIVE');

INSERT INTO MEMBERS (member_id, person_id, plan_id, join_date, status)
VALUES (1006, 7006, 204, SYSDATE - 8, 'ACTIVE');

INSERT INTO MEMBERS (member_id, person_id, plan_id, join_date, status)
VALUES (1007, 7007, 202, SYSDATE - 5, 'ACTIVE');

INSERT INTO MEMBERS (member_id, person_id, plan_id, join_date, status)
VALUES (1008, 7008, 201, SYSDATE - 3, 'ACTIVE');

-- ====================================================================
-- 6. Insert EMPLOYEES Subclass Records (Recursive Supervises Hierarchy)
-- ====================================================================
-- 9001: Regional Operations Director (Top level supervisor, supervisor_id = NULL)
INSERT INTO EMPLOYEES (employee_id, person_id, job_title, salary, supervisor_id)
VALUES (9001, 7009, 'Regional Operations Director', 125000.00, NULL);

-- 9002: Guindy Hub Community Manager (Supervised by 9001)
INSERT INTO EMPLOYEES (employee_id, person_id, job_title, salary, supervisor_id)
VALUES (9002, 7010, 'Guindy Hub Community Manager', 75000.00, 9001);

-- 9003: OMR Hub Community Manager (Supervised by 9001)
INSERT INTO EMPLOYEES (employee_id, person_id, job_title, salary, supervisor_id)
VALUES (9003, 7011, 'OMR IT Hub Community Manager', 78000.00, 9001);

-- 9004: Senior Facilities & IT Engineer (Supervised by 9001)
INSERT INTO EMPLOYEES (employee_id, person_id, job_title, salary, supervisor_id)
VALUES (9004, 7012, 'Lead AV & Network Infrastructure Engineer', 68000.00, 9001);

-- 9005: Front Desk Concierge Host (Supervised by Guindy Manager 9002)
INSERT INTO EMPLOYEES (employee_id, person_id, job_title, salary, supervisor_id)
VALUES (9005, 7013, 'Guest Experience & Front Desk Host', 42000.00, 9002);

-- 9006: T. Nagar Concierge & Operations Host (Supervised by 9001)
INSERT INTO EMPLOYEES (employee_id, person_id, job_title, salary, supervisor_id)
VALUES (9006, 7014, 'T. Nagar Experience & Booking Lead', 45000.00, 9001);

-- ====================================================================
-- 7. Insert Meeting Rooms (14 Modern Spaces Across 4 Campuses)
-- ====================================================================
-- Campus 1: Nexus WorkHub - Guindy (101)
INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (301, 101, 'Kaveri Conference Suite', 'Conference Room', 16, 1200.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (302, 101, 'Vaigai Brainstorm Pod', 'Meeting Pod', 4, 450.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (303, 101, 'Guindy Executive Boardroom', 'Boardroom Elite', 20, 2200.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (304, 101, 'Guindy Hot Desk Lounge', 'Hot Desk Lounge', 12, 250.00, 'AVAILABLE');

-- Campus 2: Innovate Hub - OMR IT Expressway (102)
INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (305, 102, 'Silicon Boardroom Elite', 'Boardroom Elite', 24, 2500.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (306, 102, 'Innovation Lounge Desks', 'Hot Desk Lounge', 10, 300.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (307, 102, 'Cyber Sprint Pod', 'Meeting Pod', 6, 550.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (308, 102, 'OMR Cloud Training Suite', 'Training Hall', 45, 3800.00, 'AVAILABLE');

-- Campus 3: Synergy Spaces - Anna Nagar (103)
INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (309, 103, 'Marina Training Hall', 'Training Hall', 40, 3500.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (310, 103, 'Anna Nagar Creative Suite', 'Conference Room', 14, 1100.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (311, 103, 'Quiet Acoustic Focus Pod', 'Meeting Pod', 2, 350.00, 'AVAILABLE');

-- Campus 4: Venture Loft - T. Nagar (104)
INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (312, 104, 'Zenith Discussion Room', 'Conference Room', 8, 850.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (313, 104, 'Royal Coromandel Boardroom', 'Boardroom Elite', 18, 2100.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (314, 104, 'T. Nagar Media & Podcasting Pod', 'Meeting Pod', 4, 600.00, 'AVAILABLE');

-- ====================================================================
-- 8. Insert Room Facilities (Weak Entity ROOM_FACILITIES)
-- ====================================================================
INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (401, 301, 'Sony 4K HDR Smart Display 75-inch', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (402, 301, 'Polycom Studio Video Bar & Mic Array', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (403, 301, 'Magnetic Glass Whiteboard', 2);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (404, 302, 'Ultra-wide Curved Monitor 34-inch', 2);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (405, 302, 'Acoustic Soundproofing Enclosure', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (406, 303, 'Dual 85-inch Touch Collaboration Screens', 2);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (407, 303, 'Cisco TelePresence Dual Camera System', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (408, 304, 'Ergonomic Mesh Seating & Power Hubs', 12);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (409, 305, 'Quad 4K Multi-Presenter Displays', 4);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (410, 305, 'Bose Ceiling Array Microphone System', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (411, 306, 'Gigabit Ethernet & Fast Wireless Charging', 10);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (412, 307, 'Smart Digital Whiteboard 65-inch', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (413, 308, 'Epson Laser 4K Projector & 150-inch Screen', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (414, 309, 'Laser Projector with 150-inch Motorized Screen', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (415, 309, 'Wireless Handheld Mic & JBL Audio Suite', 2);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (416, 310, 'Samsung 65-inch 4K Video Conference Screen', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (417, 311, 'Framery Soundproof Acoustic Glass Booth', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (418, 312, 'Logitech Rally Plus Ultra-HD Video System', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (419, 313, 'Executive Leather Seating & 85-inch 4K Display', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (420, 314, 'Rodecaster Pro Podcast Audio Console & 4 Mics', 1);

-- ====================================================================
-- 9. Insert Bookings (Today, Tomorrow, Yesterday & Upcoming)
-- ====================================================================

-- TODAY'S ACTIVE BOOKINGS (Live on Schedule Timeline & Dashboard)
INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5001, 1001, 301, 501, TO_CHAR(SYSDATE, 'YYYY-MM-DD'), '10:00', '12:00', 2400.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5002, 1003, 301, 502, TO_CHAR(SYSDATE, 'YYYY-MM-DD'), '14:00', '16:00', 2400.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5003, 1002, 302, 501, TO_CHAR(SYSDATE, 'YYYY-MM-DD'), '09:00', '11:00', 900.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5004, 1004, 302, 503, TO_CHAR(SYSDATE, 'YYYY-MM-DD'), '15:00', '17:00', 900.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5005, 1006, 303, 505, TO_CHAR(SYSDATE, 'YYYY-MM-DD'), '11:00', '13:00', 4400.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5006, 1003, 305, 502, TO_CHAR(SYSDATE, 'YYYY-MM-DD'), '14:00', '17:00', 7500.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5007, 1007, 306, 502, TO_CHAR(SYSDATE, 'YYYY-MM-DD'), '10:00', '13:00', 900.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5008, 1005, 309, 504, TO_CHAR(SYSDATE, 'YYYY-MM-DD'), '13:00', '16:00', 10500.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5009, 1008, 312, 501, TO_CHAR(SYSDATE, 'YYYY-MM-DD'), '09:00', '11:00', 1700.00, 'CONFIRMED');

-- TOMORROW'S BOOKINGS
INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5010, 1005, 301, 504, TO_CHAR(SYSDATE + 1, 'YYYY-MM-DD'), '11:00', '13:00', 2400.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5011, 1002, 303, 501, TO_CHAR(SYSDATE + 1, 'YYYY-MM-DD'), '14:00', '17:00', 6600.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5012, 1001, 305, 501, TO_CHAR(SYSDATE + 1, 'YYYY-MM-DD'), '10:00', '12:00', 5000.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5013, 1004, 307, 503, TO_CHAR(SYSDATE + 1, 'YYYY-MM-DD'), '15:00', '18:00', 1650.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5014, 1003, 310, 502, TO_CHAR(SYSDATE + 1, 'YYYY-MM-DD'), '10:00', '12:00', 2200.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5015, 1006, 313, 505, TO_CHAR(SYSDATE + 1, 'YYYY-MM-DD'), '14:00', '16:00', 4200.00, 'CONFIRMED');

-- YESTERDAY'S SETTLED BOOKINGS
INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5016, 1001, 301, 501, TO_CHAR(SYSDATE - 1, 'YYYY-MM-DD'), '10:00', '12:00', 2400.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5017, 1002, 302, 501, TO_CHAR(SYSDATE - 1, 'YYYY-MM-DD'), '14:00', '16:00', 900.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5018, 1003, 305, 502, TO_CHAR(SYSDATE - 1, 'YYYY-MM-DD'), '11:00', '14:00', 7500.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5019, 1005, 312, 504, TO_CHAR(SYSDATE - 1, 'YYYY-MM-DD'), '15:00', '17:00', 1700.00, 'CONFIRMED');

-- UPCOMING DATES (Day + 2, Day + 3)
INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5020, 1007, 301, 502, TO_CHAR(SYSDATE + 2, 'YYYY-MM-DD'), '09:00', '11:00', 2400.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, organization_id, booking_date, start_time, end_time, total_amount, status)
VALUES (5021, 1006, 305, 505, TO_CHAR(SYSDATE + 3, 'YYYY-MM-DD'), '14:00', '18:00', 10000.00, 'CONFIRMED');

-- ====================================================================
-- 10. Insert Invoices & Payments (Matching Every Booking)
-- ====================================================================
INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8001, 5001, 2400.00, SYSDATE, 'UPI', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8002, 5002, 2400.00, SYSDATE, 'Corporate Account', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8003, 5003, 900.00, SYSDATE, 'UPI', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8004, 5004, 900.00, SYSDATE, 'Credit Card', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8005, 5005, 4400.00, SYSDATE, 'Corporate Account', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8006, 5006, 7500.00, SYSDATE, 'Net Banking', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8007, 5007, 900.00, SYSDATE, 'UPI', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8008, 5008, 10500.00, SYSDATE, 'Corporate Account', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8009, 5009, 1700.00, SYSDATE, 'Credit Card', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8010, 5010, 2400.00, SYSDATE, 'UPI', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8011, 5011, 6600.00, SYSDATE, 'Corporate Account', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8012, 5012, 5000.00, SYSDATE, 'Net Banking', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8013, 5013, 1650.00, SYSDATE, 'Credit Card', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8014, 5014, 2200.00, SYSDATE, 'UPI', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8015, 5015, 4200.00, SYSDATE, 'Corporate Account', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8016, 5016, 2400.00, SYSDATE - 1, 'UPI', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8017, 5017, 900.00, SYSDATE - 1, 'UPI', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8018, 5018, 7500.00, SYSDATE - 1, 'Corporate Account', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8019, 5019, 1700.00, SYSDATE - 1, 'Credit Card', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8020, 5020, 2400.00, SYSDATE, 'Net Banking', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, method, status)
VALUES (8021, 5021, 10000.00, SYSDATE, 'Corporate Account', 'COMPLETED');

-- Set sequences to start after the highest seeded IDs
ALTER SEQUENCE SEQ_SPACES RESTART WITH 105;
ALTER SEQUENCE SEQ_PLANS RESTART WITH 205;
ALTER SEQUENCE SEQ_ORGS RESTART WITH 506;
ALTER SEQUENCE SEQ_ROOMS RESTART WITH 315;
ALTER SEQUENCE SEQ_FACILITIES RESTART WITH 421;
ALTER SEQUENCE SEQ_PERSON RESTART WITH 7015;
ALTER SEQUENCE SEQ_MEMBERS RESTART WITH 1009;
ALTER SEQUENCE SEQ_EMPLOYEES RESTART WITH 9007;
ALTER SEQUENCE SEQ_BOOKINGS RESTART WITH 5022;
ALTER SEQUENCE SEQ_PAYMENTS RESTART WITH 8022;

COMMIT;
