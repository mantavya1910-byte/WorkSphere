SET DEFINE OFF;
-- ====================================================================
-- CO-WORKING SPACE & MEETING ROOM BOOKING SYSTEM
-- Oracle 21c Database Schema Definition (DDL)
-- ====================================================================

-- Drop existing tables safely (reverse dependency order)
BEGIN
   FOR cur_rec IN (SELECT table_name FROM user_tables WHERE table_name IN 
     ('PAYMENTS', 'BOOKINGS', 'ROOM_FACILITIES', 'MEETING_ROOMS', 'ORGANIZATIONS', 'MEMBERS', 'MEMBERSHIP_PLANS', 'COWORKING_SPACES')) LOOP
      EXECUTE IMMEDIATE 'DROP TABLE ' || cur_rec.table_name || ' CASCADE CONSTRAINTS';
   END LOOP;
END;
/

-- Drop existing sequences
BEGIN
   FOR cur_seq IN (SELECT sequence_name FROM user_sequences WHERE sequence_name IN 
     ('SEQ_SPACES', 'SEQ_PLANS', 'SEQ_MEMBERS', 'SEQ_ROOMS', 'SEQ_FACILITIES', 'SEQ_ORGS', 'SEQ_BOOKINGS', 'SEQ_PAYMENTS')) LOOP
      EXECUTE IMMEDIATE 'DROP SEQUENCE ' || cur_seq.sequence_name;
   END LOOP;
END;
/

-- 1. Sequences for Auto-Incrementing Primary Keys
CREATE SEQUENCE SEQ_SPACES START WITH 101 INCREMENT BY 1;
CREATE SEQUENCE SEQ_PLANS START WITH 201 INCREMENT BY 1;
CREATE SEQUENCE SEQ_MEMBERS START WITH 1001 INCREMENT BY 1;
CREATE SEQUENCE SEQ_ROOMS START WITH 301 INCREMENT BY 1;
CREATE SEQUENCE SEQ_FACILITIES START WITH 401 INCREMENT BY 1;
CREATE SEQUENCE SEQ_ORGS START WITH 501 INCREMENT BY 1;
CREATE SEQUENCE SEQ_BOOKINGS START WITH 5001 INCREMENT BY 1;
CREATE SEQUENCE SEQ_PAYMENTS START WITH 8001 INCREMENT BY 1;

-- 2. Coworking Spaces Table
CREATE TABLE COWORKING_SPACES (
    space_id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    street VARCHAR2(150),
    city VARCHAR2(50) NOT NULL,
    state VARCHAR2(50) DEFAULT 'Tamil Nadu',
    pin VARCHAR2(10),
    created_at DATE DEFAULT SYSDATE
);

-- 3. Membership Plans Table
CREATE TABLE MEMBERSHIP_PLANS (
    plan_id NUMBER PRIMARY KEY,
    plan_name VARCHAR2(50) NOT NULL,
    monthly_fee NUMBER(10,2) NOT NULL,
    duration_months NUMBER(3) NOT NULL,
    CONSTRAINT chk_plan_fee CHECK (monthly_fee >= 0),
    CONSTRAINT chk_plan_duration CHECK (duration_months > 0)
);

-- 4. Members Table
CREATE TABLE MEMBERS (
    member_id NUMBER PRIMARY KEY,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    phone VARCHAR2(20),
    plan_id NUMBER,
    join_date DATE DEFAULT SYSDATE,
    status VARCHAR2(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    CONSTRAINT fk_member_plan FOREIGN KEY (plan_id) REFERENCES MEMBERSHIP_PLANS(plan_id) ON DELETE SET NULL
);

-- 5. Organizations Table
CREATE TABLE ORGANIZATIONS (
    org_id NUMBER PRIMARY KEY,
    org_name VARCHAR2(100) NOT NULL,
    industry VARCHAR2(50)
);

-- 6. Meeting Rooms Table
CREATE TABLE MEETING_ROOMS (
    room_id NUMBER PRIMARY KEY,
    space_id NUMBER NOT NULL,
    room_name VARCHAR2(100) NOT NULL,
    room_type VARCHAR2(50) NOT NULL,
    capacity NUMBER(4) NOT NULL,
    hourly_rate NUMBER(8,2) NOT NULL,
    status VARCHAR2(20) DEFAULT 'AVAILABLE',
    CONSTRAINT chk_room_type CHECK (room_type IN ('Conference Room', 'Meeting Pod', 'Boardroom Elite', 'Hot Desk Lounge', 'Training Hall')),
    CONSTRAINT chk_room_capacity CHECK (capacity > 0),
    CONSTRAINT chk_room_rate CHECK (hourly_rate > 0),
    CONSTRAINT chk_room_status CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE')),
    CONSTRAINT fk_room_space FOREIGN KEY (space_id) REFERENCES COWORKING_SPACES(space_id) ON DELETE CASCADE
);

-- 7. Room Facilities Table
CREATE TABLE ROOM_FACILITIES (
    facility_id NUMBER PRIMARY KEY,
    room_id NUMBER NOT NULL,
    facility_name VARCHAR2(100) NOT NULL,
    quantity NUMBER(3) DEFAULT 1,
    CONSTRAINT chk_facility_qty CHECK (quantity > 0),
    CONSTRAINT fk_facility_room FOREIGN KEY (room_id) REFERENCES MEETING_ROOMS(room_id) ON DELETE CASCADE
);

-- 8. Bookings Table
CREATE TABLE BOOKINGS (
    booking_id NUMBER PRIMARY KEY,
    member_id NUMBER NOT NULL,
    room_id NUMBER NOT NULL,
    org_id NUMBER,
    booking_date VARCHAR2(20) NOT NULL,
    start_time VARCHAR2(10) NOT NULL,
    end_time VARCHAR2(10) NOT NULL,
    total_amount NUMBER(10,2) NOT NULL,
    status VARCHAR2(20) DEFAULT 'CONFIRMED',
    created_at DATE DEFAULT SYSDATE,
    CONSTRAINT chk_booking_amount CHECK (total_amount >= 0),
    CONSTRAINT chk_booking_status CHECK (status IN ('CONFIRMED', 'CANCELLED', 'COMPLETED')),
    CONSTRAINT fk_booking_member FOREIGN KEY (member_id) REFERENCES MEMBERS(member_id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_room FOREIGN KEY (room_id) REFERENCES MEETING_ROOMS(room_id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_org FOREIGN KEY (org_id) REFERENCES ORGANIZATIONS(org_id) ON DELETE SET NULL
);

-- 9. Payments Table
CREATE TABLE PAYMENTS (
    payment_id NUMBER PRIMARY KEY,
    booking_id NUMBER NOT NULL,
    amount NUMBER(10,2) NOT NULL,
    payment_date DATE DEFAULT SYSDATE,
    payment_method VARCHAR2(30) NOT NULL,
    status VARCHAR2(20) DEFAULT 'COMPLETED',
    CONSTRAINT chk_payment_amount CHECK (amount > 0),
    CONSTRAINT chk_payment_method CHECK (payment_method IN ('UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Corporate Account', 'Cash')),
    CONSTRAINT chk_payment_status CHECK (status IN ('COMPLETED', 'PENDING', 'FAILED')),
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES BOOKINGS(booking_id) ON DELETE CASCADE
);

COMMIT;