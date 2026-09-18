SET DEFINE OFF;
-- ====================================================================
-- CO-WORKING SPACE & MEETING ROOM BOOKING SYSTEM
-- Oracle PL/SQL Triggers, Stored Procedures, and Functions
-- ====================================================================

-- 1. PL/SQL Function: Calculate Booking Total Amount
CREATE OR REPLACE FUNCTION FN_CALC_BOOKING_AMOUNT (
    p_room_id IN NUMBER,
    p_hours IN NUMBER
) RETURN NUMBER IS
    v_rate NUMBER(8,2);
    v_total NUMBER(10,2);
BEGIN
    SELECT hourly_rate INTO v_rate 
    FROM MEETING_ROOMS 
    WHERE room_id = p_room_id;
    
    v_total := v_rate * p_hours;
    RETURN v_total;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
END;
/

-- 2. PL/SQL Trigger: Prevent Double Booking of the Same Room at the Same Date/Time
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

-- 3. PL/SQL Stored Procedure: Atomic Booking Creation & Payment
CREATE OR REPLACE PROCEDURE SP_CREATE_BOOKING_AND_PAY (
    p_member_id     IN NUMBER,
    p_room_id       IN NUMBER,
    p_org_id        IN NUMBER,
    p_booking_date  IN VARCHAR2,
    p_start_time    IN VARCHAR2,
    p_end_time      IN VARCHAR2,
    p_hours         IN NUMBER,
    p_payment_method IN VARCHAR2,
    o_booking_id    OUT NUMBER,
    o_payment_id    OUT NUMBER,
    o_amount        OUT NUMBER
) IS
    v_hourly_rate NUMBER(8,2);
    v_calc_amount NUMBER(10,2);
    v_b_id NUMBER;
    v_p_id NUMBER;
BEGIN
    -- Fetch hourly rate
    SELECT hourly_rate INTO v_hourly_rate FROM MEETING_ROOMS WHERE room_id = p_room_id;
    v_calc_amount := v_hourly_rate * p_hours;

    -- Generate IDs from sequences
    SELECT SEQ_BOOKINGS.NEXTVAL INTO v_b_id FROM dual;
    SELECT SEQ_PAYMENTS.NEXTVAL INTO v_p_id FROM dual;

    -- Insert Booking
    INSERT INTO BOOKINGS (
        booking_id, member_id, room_id, org_id, booking_date, start_time, end_time, total_amount, status
    ) VALUES (
        v_b_id, p_member_id, p_room_id, p_org_id, p_booking_date, p_start_time, p_end_time, v_calc_amount, 'CONFIRMED'
    );

    -- Insert Payment
    INSERT INTO PAYMENTS (
        payment_id, booking_id, amount, payment_date, payment_method, status
    ) VALUES (
        v_p_id, v_b_id, v_calc_amount, SYSDATE, p_payment_method, 'COMPLETED'
    );

    o_booking_id := v_b_id;
    o_payment_id := v_p_id;
    o_amount := v_calc_amount;

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/

-- 4. PL/SQL Function: Calculate Total Room Revenue
CREATE OR REPLACE FUNCTION FN_ROOM_TOTAL_REVENUE (
    p_room_id IN NUMBER
) RETURN NUMBER IS
    v_sum NUMBER(12,2) := 0;
BEGIN
    SELECT NVL(SUM(total_amount), 0)
    INTO v_sum
    FROM BOOKINGS
    WHERE room_id = p_room_id AND status = 'CONFIRMED';
    
    RETURN v_sum;
END;
/

COMMIT;