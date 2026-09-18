SET DEFINE OFF;
-- ====================================================================
-- CO-WORKING SPACE & MEETING ROOM BOOKING SYSTEM
-- Seed Data (Chennai Spaces, Plans, Rooms, Amenities, Members)
-- ====================================================================

-- 1. Insert Coworking Spaces
INSERT INTO COWORKING_SPACES (space_id, name, street, city, state, pin) 
VALUES (SEQ_SPACES.NEXTVAL, 'Nexus WorkHub - Guindy', 'No 45, Guindy Industrial Estate, Mount Road', 'Chennai', 'Tamil Nadu', '600032');

INSERT INTO COWORKING_SPACES (space_id, name, street, city, state, pin) 
VALUES (SEQ_SPACES.NEXTVAL, 'Innovate Hub - OMR IT Expressway', 'Plot 12, Rajiv Gandhi Salai, Sholinganallur', 'Chennai', 'Tamil Nadu', '600119');

INSERT INTO COWORKING_SPACES (space_id, name, street, city, state, pin) 
VALUES (SEQ_SPACES.NEXTVAL, 'Synergy Spaces - Anna Nagar', '2nd Avenue, Block AB, Anna Nagar West', 'Chennai', 'Tamil Nadu', '600040');

INSERT INTO COWORKING_SPACES (space_id, name, street, city, state, pin) 
VALUES (SEQ_SPACES.NEXTVAL, 'Venture Loft - T. Nagar', '77 Venkatanarayana Road, T. Nagar', 'Chennai', 'Tamil Nadu', '600017');

-- 2. Insert Membership Plans
INSERT INTO MEMBERSHIP_PLANS (plan_id, plan_name, monthly_fee, duration_months)
VALUES (SEQ_PLANS.NEXTVAL, 'Day Pass / Flexible', 2500.00, 1);

INSERT INTO MEMBERSHIP_PLANS (plan_id, plan_name, monthly_fee, duration_months)
VALUES (SEQ_PLANS.NEXTVAL, 'Dedicated Resident Desk', 8500.00, 3);

INSERT INTO MEMBERSHIP_PLANS (plan_id, plan_name, monthly_fee, duration_months)
VALUES (SEQ_PLANS.NEXTVAL, 'Startup Team Pod', 22000.00, 6);

INSERT INTO MEMBERSHIP_PLANS (plan_id, plan_name, monthly_fee, duration_months)
VALUES (SEQ_PLANS.NEXTVAL, 'Enterprise Executive Plan', 45000.00, 12);

-- 3. Insert Organizations
INSERT INTO ORGANIZATIONS (org_id, org_name, industry)
VALUES (SEQ_ORGS.NEXTVAL, 'Quantix AI Labs', 'Artificial Intelligence');

INSERT INTO ORGANIZATIONS (org_id, org_name, industry)
VALUES (SEQ_ORGS.NEXTVAL, 'FinTech Matrix India', 'Banking and Finance');

INSERT INTO ORGANIZATIONS (org_id, org_name, industry)
VALUES (SEQ_ORGS.NEXTVAL, 'CloudScale Solutions', 'Cloud Infrastructure');

INSERT INTO ORGANIZATIONS (org_id, org_name, industry)
VALUES (SEQ_ORGS.NEXTVAL, 'BioGenix Diagnostics', 'Healthcare and Biotech');

-- 4. Insert Members
INSERT INTO MEMBERS (member_id, first_name, last_name, email, phone, plan_id, join_date, status)
VALUES (SEQ_MEMBERS.NEXTVAL, 'Mantavya', 'Sharma', 'mantavya.sharma2026@vitstudent.ac.in', '+91 9876543210', 202, SYSDATE - 60, 'ACTIVE');

INSERT INTO MEMBERS (member_id, first_name, last_name, email, phone, plan_id, join_date, status)
VALUES (SEQ_MEMBERS.NEXTVAL, 'Aditya', 'Rao', 'aditya.rao@quantixai.com', '+91 9840123456', 203, SYSDATE - 45, 'ACTIVE');

INSERT INTO MEMBERS (member_id, first_name, last_name, email, phone, plan_id, join_date, status)
VALUES (SEQ_MEMBERS.NEXTVAL, 'Sneha', 'Iyer', 'sneha.iyer@fintechmatrix.in', '+91 9884112233', 204, SYSDATE - 30, 'ACTIVE');

INSERT INTO MEMBERS (member_id, first_name, last_name, email, phone, plan_id, join_date, status)
VALUES (SEQ_MEMBERS.NEXTVAL, 'Rahul', 'Verma', 'rahul.verma@cloudscale.io', '+91 9791098765', 201, SYSDATE - 15, 'ACTIVE');

INSERT INTO MEMBERS (member_id, first_name, last_name, email, phone, plan_id, join_date, status)
VALUES (SEQ_MEMBERS.NEXTVAL, 'Pooja', 'Nair', 'pooja.nair@biogenix.org', '+91 9444055667', 203, SYSDATE - 10, 'ACTIVE');

-- 5. Insert Meeting Rooms
INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (SEQ_ROOMS.NEXTVAL, 101, 'Kaveri Conference Suite', 'Conference Room', 16, 1200.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (SEQ_ROOMS.NEXTVAL, 101, 'Vaigai Brainstorm Pod', 'Meeting Pod', 4, 450.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (SEQ_ROOMS.NEXTVAL, 102, 'Silicon Boardroom Elite', 'Boardroom Elite', 24, 2500.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (SEQ_ROOMS.NEXTVAL, 102, 'Innovation Lounge Desks', 'Hot Desk Lounge', 10, 300.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (SEQ_ROOMS.NEXTVAL, 103, 'Marina Training Hall', 'Training Hall', 40, 3500.00, 'AVAILABLE');

INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status)
VALUES (SEQ_ROOMS.NEXTVAL, 104, 'Zenith Discussion Room', 'Conference Room', 8, 850.00, 'AVAILABLE');

-- 6. Insert Room Facilities
INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (SEQ_FACILITIES.NEXTVAL, 301, 'Sony 4K HDR Smart Display 75-inch', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (SEQ_FACILITIES.NEXTVAL, 301, 'Polycom Studio Video Bar and Mic Array', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (SEQ_FACILITIES.NEXTVAL, 301, 'Magnetic Glass Whiteboard', 2);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (SEQ_FACILITIES.NEXTVAL, 302, 'Ultra-wide Curved Monitor 34-inch', 2);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (SEQ_FACILITIES.NEXTVAL, 303, 'Dual 85-inch Touch Collaboration Screens', 2);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (SEQ_FACILITIES.NEXTVAL, 303, 'Cisco TelePresence Dual Camera System', 1);

INSERT INTO ROOM_FACILITIES (facility_id, room_id, facility_name, quantity)
VALUES (SEQ_FACILITIES.NEXTVAL, 305, 'Laser Projector with 150-inch Motorized Screen', 1);

-- 7. Insert Bookings
INSERT INTO BOOKINGS (booking_id, member_id, room_id, org_id, booking_date, start_time, end_time, total_amount, status)
VALUES (SEQ_BOOKINGS.NEXTVAL, 1001, 301, 501, '2026-09-20', '10:00', '12:00', 2400.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, org_id, booking_date, start_time, end_time, total_amount, status)
VALUES (SEQ_BOOKINGS.NEXTVAL, 1002, 303, 501, '2026-09-21', '14:00', '17:00', 7500.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, org_id, booking_date, start_time, end_time, total_amount, status)
VALUES (SEQ_BOOKINGS.NEXTVAL, 1003, 302, 502, '2026-09-22', '09:00', '11:00', 900.00, 'CONFIRMED');

INSERT INTO BOOKINGS (booking_id, member_id, room_id, org_id, booking_date, start_time, end_time, total_amount, status)
VALUES (SEQ_BOOKINGS.NEXTVAL, 1004, 306, 503, '2026-09-23', '15:00', '18:00', 2550.00, 'CONFIRMED');

-- 8. Insert Payments
INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, payment_method, status)
VALUES (SEQ_PAYMENTS.NEXTVAL, 5001, 2400.00, SYSDATE - 2, 'UPI', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, payment_method, status)
VALUES (SEQ_PAYMENTS.NEXTVAL, 5002, 7500.00, SYSDATE - 1, 'Corporate Account', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, payment_method, status)
VALUES (SEQ_PAYMENTS.NEXTVAL, 5003, 900.00, SYSDATE - 1, 'Credit Card', 'COMPLETED');

INSERT INTO PAYMENTS (payment_id, booking_id, amount, payment_date, payment_method, status)
VALUES (SEQ_PAYMENTS.NEXTVAL, 5004, 2550.00, SYSDATE, 'Net Banking', 'COMPLETED');

COMMIT;