# Co-working Space & Meeting Room Booking System
**Interdisciplinary Project (IDP) / DBMS Course Project (DA-II)**  
*Vellore Institute of Technology (VIT), Chennai*

---

## 📌 Project Overview
The **Co-working Space & Meeting Room Booking System** is an enterprise-grade database management application engineered to handle workspace locations, meeting rooms, amenities, memberships, reservations, and payment invoicing across urban co-working networks. 

Built with **Oracle Database 21c XE**, **SQL\*Plus**, **PL/SQL**, **Node.js (Express)**, and a modern **Vanilla JavaScript & Tailwind CSS** frontend GUI, the system enforces relational integrity, ACID transactional compliance, automated conflict-detection triggers, and live interactive SQL execution.

---

## 👨‍💻 Student Details
- **Student Name:** Mantavya Sharma
- **Registration Number:** 25BCE5583
- **Institution:** Vellore Institute of Technology (VIT), Chennai
- **Course:** Database Management Systems (DBMS) / Interdisciplinary Project (IDP)

---

## 🏗️ System Architecture & Separation of Concerns
The project strictly adheres to modular separation across three independent tiers:

```text
IDP proejct/
├── database/                   # Database Tier (Oracle DDL, PL/SQL, Seeds)
│   ├── schema_oracle.sql       # Relational Schema with PK, FK, and CHECK constraints
│   ├── triggers_and_procedures.sql # PL/SQL Triggers, Procedures, and Functions
│   ├── seed_oracle.sql         # Seed data (Chennai spaces, rooms, members, bookings)
│   └── db.js                   # SQL*Plus bridge & query execution engine
├── backend/                    # Application Server Tier (Node.js & Express)
│   ├── server.js               # Express server entry point & static file server
│   └── routes/
│       ├── spaces.js           # REST CRUD API for Coworking Spaces
│       ├── rooms.js            # REST CRUD API for Meeting Rooms
│       ├── members.js          # REST CRUD API for Members
│       ├── bookings.js         # REST CRUD API for Room Bookings
│       ├── payments.js         # REST CRUD API for Payments
│       ├── query.js            # Live SQL Query runner endpoint ("Type query & fetch it")
│       └── stats.js            # Dynamic statistical aggregation endpoint
├── frontend/                   # Presentation Tier (GUI with Zero Hardcoding)
│   ├── index.html              # Responsive dashboard, forms, tables & SQL terminal
│   ├── css/style.css           # Custom layout styles & transitions
│   └── js/app.js               # Dynamic DOM rendering, CRUD handlers & query console
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies
└── README.md                   # Project documentation & evaluation guide
```

---

## 🗄️ Relational Database Schema (Oracle 21c)

### 1. `COWORKING_SPACES`
Represents physical co-working hubs (e.g., Guindy, OMR, Anna Nagar, T. Nagar).
- `space_id` (NUMBER, PRIMARY KEY)
- `name` (VARCHAR2(100), NOT NULL)
- `street` (VARCHAR2(150))
- `city` (VARCHAR2(50), NOT NULL)
- `state` (VARCHAR2(50))
- `pin` (VARCHAR2(10))
- `created_at` (DATE)

### 2. `MEMBERSHIP_PLANS`
Subscription tiers for individuals and organizations.
- `plan_id` (NUMBER, PRIMARY KEY)
- `plan_name` (VARCHAR2(50), NOT NULL)
- `monthly_fee` (NUMBER(10,2), `CHECK (monthly_fee >= 0)`)
- `duration_months` (NUMBER(3), `CHECK (duration_months > 0)`)

### 3. `MEMBERS`
Registered platform users.
- `member_id` (NUMBER, PRIMARY KEY)
- `first_name` (VARCHAR2(50), NOT NULL)
- `last_name` (VARCHAR2(50), NOT NULL)
- `email` (VARCHAR2(100), UNIQUE, NOT NULL)
- `phone` (VARCHAR2(20))
- `plan_id` (NUMBER, FOREIGN KEY -> `MEMBERSHIP_PLANS(plan_id) ON DELETE SET NULL`)
- `join_date` (DATE)
- `status` (VARCHAR2(20), `CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))`)

### 4. `MEETING_ROOMS`
Individual bookable spaces within each hub.
- `room_id` (NUMBER, PRIMARY KEY)
- `space_id` (NUMBER, FOREIGN KEY -> `COWORKING_SPACES(space_id) ON DELETE CASCADE`)
- `room_name` (VARCHAR2(100), NOT NULL)
- `room_type` (VARCHAR2(50), `CHECK (room_type IN ('Conference Room', 'Meeting Pod', 'Boardroom Elite', 'Hot Desk Lounge', 'Training Hall'))`)
- `capacity` (NUMBER(4), `CHECK (capacity > 0)`)
- `hourly_rate` (NUMBER(8,2), `CHECK (hourly_rate > 0)`)
- `status` (VARCHAR2(20), `CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE'))`)

### 5. `ROOM_FACILITIES`
Hardware amenities present in rooms (Weak entity).
- `facility_id` (NUMBER, PRIMARY KEY)
- `room_id` (NUMBER, FOREIGN KEY -> `MEETING_ROOMS(room_id) ON DELETE CASCADE`)
- `facility_name` (VARCHAR2(100), NOT NULL)
- `quantity` (NUMBER(3), `CHECK (quantity > 0)`)

### 6. `ORGANIZATIONS`
Corporate clients booking for groups.
- `org_id` (NUMBER, PRIMARY KEY)
- `org_name` (VARCHAR2(100), NOT NULL)
- `industry` (VARCHAR2(50))

### 7. `BOOKINGS`
Meeting room reservations.
- `booking_id` (NUMBER, PRIMARY KEY)
- `member_id` (NUMBER, FOREIGN KEY -> `MEMBERS(member_id) ON DELETE CASCADE`)
- `room_id` (NUMBER, FOREIGN KEY -> `MEETING_ROOMS(room_id) ON DELETE CASCADE`)
- `org_id` (NUMBER, FOREIGN KEY -> `ORGANIZATIONS(org_id) ON DELETE SET NULL`)
- `booking_date` (VARCHAR2(20), NOT NULL)
- `start_time` (VARCHAR2(10), NOT NULL)
- `end_time` (VARCHAR2(10), NOT NULL)
- `total_amount` (NUMBER(10,2), `CHECK (total_amount >= 0)`)
- `status` (VARCHAR2(20), `CHECK (status IN ('CONFIRMED', 'CANCELLED', 'COMPLETED'))`)

### 8. `PAYMENTS`
Invoices and transaction settlement.
- `payment_id` (NUMBER, PRIMARY KEY)
- `booking_id` (NUMBER, FOREIGN KEY -> `BOOKINGS(booking_id) ON DELETE CASCADE`)
- `amount` (NUMBER(10,2), `CHECK (amount > 0)`)
- `payment_date` (DATE)
- `payment_method` (VARCHAR2(30), `CHECK (payment_method IN ('UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Corporate Account', 'Cash'))`)
- `status` (VARCHAR2(20), `CHECK (status IN ('COMPLETED', 'PENDING', 'FAILED'))`)

---

## ⚡ PL/SQL Implementation

### 1. Conflict Prevention Trigger (`TRG_CHECK_ROOM_OVERLAP`)
Enforces automated business logic at the database level: prevents double-booking a room on the same date and overlapping time window.
```sql
CREATE OR REPLACE TRIGGER TRG_CHECK_ROOM_OVERLAP
BEFORE INSERT OR UPDATE ON BOOKINGS
FOR EACH ROW
DECLARE
    v_overlap_count NUMBER := 0;
BEGIN
    IF :NEW.status = 'CONFIRMED' THEN
        SELECT COUNT(*)
        INTO v_overlap_count
        FROM BOOKINGS
        WHERE room_id = :NEW.room_id
          AND booking_date = :NEW.booking_date
          AND status = 'CONFIRMED'
          AND booking_id != NVL(:NEW.booking_id, -1)
          AND (
              (:NEW.start_time >= start_time AND :NEW.start_time < end_time) OR
              (:NEW.end_time > start_time AND :NEW.end_time <= end_time) OR
              (:NEW.start_time <= start_time AND :NEW.end_time >= end_time)
          );

        IF v_overlap_count > 0 THEN
            RAISE_APPLICATION_ERROR(-20001, 'DOUBLE BOOKING ERROR: This room is already booked during this time slot.');
        END IF;
    END IF;
END;
/
```

### 2. Atomic Stored Procedure (`SP_CREATE_BOOKING_AND_PAY`)
Wraps room booking and payment generation into an atomic database transaction.

### 3. PL/SQL Functions
- `FN_CALC_BOOKING_AMOUNT(p_room_id, p_hours)`: Returns calculated fee based on hourly rate.
- `FN_ROOM_TOTAL_REVENUE(p_room_id)`: Aggregates lifetime revenue for any given room.

---

## 🎯 DA-II Rubric Alignment

| Evaluation Module | Rubric Requirement | Project Implementation |
|---|---|---|
| **M-1: Backend & Constraints** | Key database operations & field constraints | 8 normalized tables, Primary Keys, Foreign Keys with Cascade rules, explicit `CHECK`, `UNIQUE`, and `NOT NULL` constraints. |
| **M-2: Frontend Input Forms** | Form input fields mapped dynamically | Form modals for Members, Rooms, and Bookings; zero hardcoding; dynamic dropdowns populated from Oracle DB. |
| **M-3: Database Connectivity & CRUD** | Connection via ODBC / JDBC / Driver with Insert, Update, and Delete action buttons | Node.js to Oracle 21c (SQL\*Plus bridge) with real-time **Insert (Add)**, **Update**, and **Delete** buttons that sync the database and UI instantly. |
| **Special Feature** | "Type query and fetch it" | Integrated **Interactive SQL Console** allowing arbitrary `SELECT`, `JOIN`, and `GROUP BY` execution with instant tabular rendering. |

---

## 🚀 How to Run the Project

### Prerequisites
1. **Node.js** (v18 or higher)
2. **Oracle Database 21c XE** with `sqlplus` installed

### 1. Initialize Oracle Database
Open your terminal in the project directory and run the SQL scripts in SQL\*Plus:
```powershell
sqlplus "/ as sysdba"
```
Inside SQL\*Plus:
```sql
ALTER SESSION SET CONTAINER = XEPDB1;
ALTER SESSION SET CURRENT_SCHEMA = COWORKING_ADMIN;
@database\schema_oracle.sql
@database\triggers_and_procedures.sql
@database\seed_oracle.sql
exit;
```

### 2. Start Application Server
```powershell
npm install
npm start
```
The server will start at:
```text
http://localhost:5000
```

### 3. Open GUI in Browser
Navigate to `http://localhost:5000` in Google Chrome or Microsoft Edge.

---

## 🧪 Sample Queries to Demonstrate to Faculty

### 1. Multi-Table JOIN (Rooms with Space & City)
```sql
SELECT r.room_id, r.room_name, r.room_type, r.capacity, r.hourly_rate, s.name as space_name, s.city
FROM MEETING_ROOMS r
JOIN COWORKING_SPACES s ON r.space_id = s.space_id
ORDER BY r.capacity DESC;
```

### 2. Aggregate Query (Revenue by Room)
```sql
SELECT r.room_id, r.room_name, COUNT(b.booking_id) as total_bookings, NVL(SUM(b.total_amount), 0) as total_revenue
FROM MEETING_ROOMS r
LEFT JOIN BOOKINGS b ON r.room_id = b.room_id AND b.status = 'CONFIRMED'
GROUP BY r.room_id, r.room_name
ORDER BY total_revenue DESC;
```

### 3. Active Bookings with Member Contact Details
```sql
SELECT b.booking_id, m.first_name || ' ' || m.last_name as member, m.email, r.room_name, b.booking_date, b.start_time || ' - ' || b.end_time as slot, b.total_amount
FROM BOOKINGS b
JOIN MEMBERS m ON b.member_id = m.member_id
JOIN MEETING_ROOMS r ON b.room_id = r.room_id
WHERE b.status = 'CONFIRMED'
ORDER BY b.booking_date ASC;
```

---

## 📄 License
Academic Coursework Project - Developed for **VIT Chennai**. All Rights Reserved.
