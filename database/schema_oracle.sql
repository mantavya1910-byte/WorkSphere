SET DEFINE OFF;
-- ====================================================================
-- WORKSPHERE - ENHANCED ENTITY-RELATIONSHIP (EER) DATABASE SCHEMA
-- Relational Mapping of Mantavya Sharma (25BCE5583) DA-II EER Diagram
-- ====================================================================

-- 1. Drop all existing tables cleanly
BEGIN
   FOR c IN (SELECT table_name FROM all_tables WHERE owner = 'COWORKING_ADMIN') LOOP
      BEGIN
         EXECUTE IMMEDIATE 'DROP TABLE COWORKING_ADMIN."' || c.table_name || '" CASCADE CONSTRAINTS';
      EXCEPTION WHEN OTHERS THEN NULL;
      END;
   END LOOP;
END;
/

-- 2. Drop all existing sequences cleanly
BEGIN
   FOR s IN (SELECT sequence_name FROM all_sequences WHERE sequence_owner = 'COWORKING_ADMIN') LOOP
      BEGIN
         EXECUTE IMMEDIATE 'DROP SEQUENCE COWORKING_ADMIN."' || s.sequence_name || '"';
      EXCEPTION WHEN OTHERS THEN NULL;
      END;
   END LOOP;
END;
/

-- 3. Sequences for Auto-Incrementing Primary Keys
CREATE SEQUENCE SEQ_PERSON START WITH 7001 INCREMENT BY 1;
CREATE SEQUENCE SEQ_EMPLOYEES START WITH 9001 INCREMENT BY 1;
CREATE SEQUENCE SEQ_SPACES START WITH 101 INCREMENT BY 1;
CREATE SEQUENCE SEQ_PLANS START WITH 201 INCREMENT BY 1;
CREATE SEQUENCE SEQ_MEMBERS START WITH 1001 INCREMENT BY 1;
CREATE SEQUENCE SEQ_ROOMS START WITH 301 INCREMENT BY 1;
CREATE SEQUENCE SEQ_FACILITIES START WITH 401 INCREMENT BY 1;
CREATE SEQUENCE SEQ_ORGS START WITH 501 INCREMENT BY 1;
CREATE SEQUENCE SEQ_BOOKINGS START WITH 5001 INCREMENT BY 1;
CREATE SEQUENCE SEQ_PAYMENTS START WITH 8001 INCREMENT BY 1;

-- ====================================================================
-- 4. EER SUPERCLASS ENTITY: PERSON
-- Composite Attributes: Name (First, Middle, Last), Address (Street, City, State, PIN)
-- ====================================================================
CREATE TABLE PERSON (
    person_id NUMBER PRIMARY KEY,
    first_name VARCHAR2(50) NOT NULL,
    middle_name VARCHAR2(50),
    last_name VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    street VARCHAR2(150),
    city VARCHAR2(50),
    state VARCHAR2(50) DEFAULT 'Tamil Nadu',
    pin VARCHAR2(10),
    phone VARCHAR2(20),
    created_at DATE DEFAULT SYSDATE
);

-- ====================================================================
-- 5. MEMBERSHIP_PLANS ENTITY
-- ====================================================================
CREATE TABLE MEMBERSHIP_PLANS (
    plan_id NUMBER PRIMARY KEY,
    plan_name VARCHAR2(50) NOT NULL,
    monthly_fee NUMBER(10,2) NOT NULL,
    duration_months NUMBER(3) NOT NULL,
    CONSTRAINT chk_plan_fee CHECK (monthly_fee >= 0),
    CONSTRAINT chk_plan_duration CHECK (duration_months > 0)
);

-- ====================================================================
-- 6. EER SUBCLASS ENTITY: MEMBERS (Disjoint Specialization from PERSON)
-- Connects to: MEMBERSHIP_PLANS (Has relationship, N:1)
-- ====================================================================
CREATE TABLE MEMBERS (
    member_id NUMBER PRIMARY KEY,
    person_id NUMBER UNIQUE NOT NULL,
    plan_id NUMBER,
    join_date DATE DEFAULT SYSDATE,
    status VARCHAR2(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    CONSTRAINT fk_member_person FOREIGN KEY (person_id) REFERENCES PERSON(person_id) ON DELETE CASCADE,
    CONSTRAINT fk_member_plan FOREIGN KEY (plan_id) REFERENCES MEMBERSHIP_PLANS(plan_id) ON DELETE SET NULL
);

-- ====================================================================
-- 7. EER SUBCLASS ENTITY: EMPLOYEES (Disjoint Specialization from PERSON)
-- Recursive Relationship: Supervises (1:N, supervisor_id -> employee_id)
-- ====================================================================
CREATE TABLE EMPLOYEES (
    employee_id NUMBER PRIMARY KEY,
    person_id NUMBER UNIQUE NOT NULL,
    job_title VARCHAR2(100) NOT NULL,
    salary NUMBER(10,2) NOT NULL,
    supervisor_id NUMBER,
    CONSTRAINT chk_emp_salary CHECK (salary >= 0),
    CONSTRAINT fk_employee_person FOREIGN KEY (person_id) REFERENCES PERSON(person_id) ON DELETE CASCADE,
    CONSTRAINT fk_employee_supervisor FOREIGN KEY (supervisor_id) REFERENCES EMPLOYEES(employee_id) ON DELETE SET NULL
);

-- ====================================================================
-- 8. COWORKING_SPACES ENTITY
-- Contains Relationship with MEETING_ROOMS (1:N)
-- Attributes in EER: Space_ID, Space_Name, Address, City
-- ====================================================================
CREATE TABLE COWORKING_SPACES (
    space_id NUMBER PRIMARY KEY,
    space_name VARCHAR2(100) NOT NULL,
    address VARCHAR2(150),
    city VARCHAR2(50) NOT NULL,
    state VARCHAR2(50) DEFAULT 'Tamil Nadu',
    pin VARCHAR2(10),
    created_at DATE DEFAULT SYSDATE
);

-- ====================================================================
-- 9. MEETING_ROOMS ENTITY
-- ====================================================================
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

-- ====================================================================
-- 10. ROOM_FACILITIES WEAK ENTITY (Identifying Relationship: Has_Facility)
-- ====================================================================
CREATE TABLE ROOM_FACILITIES (
    facility_id NUMBER PRIMARY KEY,
    room_id NUMBER NOT NULL,
    facility_name VARCHAR2(100) NOT NULL,
    quantity NUMBER(3) DEFAULT 1,
    CONSTRAINT chk_facility_qty CHECK (quantity > 0),
    CONSTRAINT fk_facility_room FOREIGN KEY (room_id) REFERENCES MEETING_ROOMS(room_id) ON DELETE CASCADE
);

-- ====================================================================
-- 11. ORGANIZATIONS ENTITY
-- Attributes in EER: Organization_ID, Organization_Name
-- ====================================================================
CREATE TABLE ORGANIZATIONS (
    organization_id NUMBER PRIMARY KEY,
    organization_name VARCHAR2(100) NOT NULL,
    industry VARCHAR2(50)
);

-- ====================================================================
-- 12. BOOKINGS ENTITY (Relationship: Member makes Booking for Room & Org)
-- ====================================================================
CREATE TABLE BOOKINGS (
    booking_id NUMBER PRIMARY KEY,
    member_id NUMBER NOT NULL,
    room_id NUMBER NOT NULL,
    organization_id NUMBER,
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
    CONSTRAINT fk_booking_org FOREIGN KEY (organization_id) REFERENCES ORGANIZATIONS(organization_id) ON DELETE SET NULL
);

-- ====================================================================
-- 13. PAYMENTS ENTITY (Relationship: Booking pays Payment)
-- Attributes in EER: Payment_ID, Booking_ID, Amount, Payment_Date, Method
-- ====================================================================
CREATE TABLE PAYMENTS (
    payment_id NUMBER PRIMARY KEY,
    booking_id NUMBER NOT NULL,
    amount NUMBER(10,2) NOT NULL,
    payment_date DATE DEFAULT SYSDATE,
    method VARCHAR2(30) NOT NULL,
    status VARCHAR2(20) DEFAULT 'COMPLETED',
    CONSTRAINT chk_payment_amount CHECK (amount > 0),
    CONSTRAINT chk_payment_method CHECK (method IN ('UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Corporate Account', 'Cash')),
    CONSTRAINT chk_payment_status CHECK (status IN ('COMPLETED', 'PENDING', 'FAILED')),
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES BOOKINGS(booking_id) ON DELETE CASCADE
);

-- ====================================================================
-- 14. COMPATIBILITY VIEWS (Supports both short & EER column names)
-- ====================================================================
CREATE OR REPLACE VIEW VW_COWORKING_SPACES AS 
SELECT space_id, space_name, space_name AS name, address, address AS street, city, state, pin, created_at FROM COWORKING_SPACES;

CREATE OR REPLACE VIEW VW_ORGANIZATIONS AS 
SELECT organization_id, organization_name, organization_id AS org_id, organization_name AS org_name, industry FROM ORGANIZATIONS;

CREATE OR REPLACE VIEW VW_PAYMENTS AS 
SELECT payment_id, booking_id, amount, payment_date, method, method AS payment_method, status FROM PAYMENTS;

CREATE OR REPLACE VIEW VW_MEMBERS_FULL AS
SELECT m.member_id, m.person_id, p.first_name, p.middle_name, p.last_name, p.email, p.phone, p.street, p.city, p.state, p.pin,
       m.plan_id, pl.plan_name, pl.monthly_fee, m.join_date, m.status
FROM MEMBERS m
JOIN PERSON p ON m.person_id = p.person_id
LEFT JOIN MEMBERSHIP_PLANS pl ON m.plan_id = pl.plan_id;

CREATE OR REPLACE VIEW VW_EMPLOYEES_FULL AS
SELECT e.employee_id, e.person_id, p.first_name || ' ' || p.last_name AS employee_name,
       p.email, p.phone, e.job_title, e.salary, e.supervisor_id,
       sp.first_name || ' ' || sp.last_name AS supervisor_name
FROM EMPLOYEES e
JOIN PERSON p ON e.person_id = p.person_id
LEFT JOIN EMPLOYEES s ON e.supervisor_id = s.employee_id
LEFT JOIN PERSON sp ON s.person_id = sp.person_id;

COMMIT;
