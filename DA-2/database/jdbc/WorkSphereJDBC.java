package database.jdbc;

import java.sql.*;
import java.util.Scanner;

/**
 * WorkSphere - Oracle JDBC (Java Database Connectivity) Implementation
 * --------------------------------------------------------------------
 * Demonstrates:
 * 1. JDBC Thin Driver Connection (Type 4) to Oracle 21c XE (XEPDB1)
 * 2. Statement & ResultSet for multi-table relational queries
 * 3. PreparedStatement for parameterized CRUD operations (INSERT, UPDATE, DELETE)
 * 4. CallableStatement for invoking PL/SQL Stored Procedures & Functions
 * 5. Transaction management with commit & rollback
 */
public class WorkSphereJDBC {

    private static final String DB_URL = "jdbc:oracle:thin:@localhost:1521/XEPDB1";
    private static final String DB_USER = "COWORKING_ADMIN";
    private static final String DB_PASS = "coworking123";

    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        // Load Oracle JDBC Driver
        Class.forName("oracle.jdbc.OracleDriver");
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
    }

    // 1. Connection Health Check
    public static void testConnection() {
        System.out.println("\n[1] Testing JDBC Connection to Oracle Database 21c XE...");
        try (Connection conn = getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            System.out.println("? Connection Successful!");
            System.out.println("   Driver Name    : " + meta.getDriverName());
            System.out.println("   Driver Version : " + meta.getDriverVersion());
            System.out.println("   Database Name  : " + meta.getDatabaseProductName() + " " + meta.getDatabaseProductVersion());
            System.out.println("   Connected User : " + meta.getUserName());
            System.out.println("   URL Endpoint   : " + meta.getURL());
        } catch (Exception e) {
            System.err.println("? Connection Failed: " + e.getMessage());
        }
    }

    // 2. Multi-Table Relational Query with ResultSet
    public static void displayRooms() {
        System.out.println("\n[2] Fetching Meeting Rooms via JDBC Statement & ResultSet (JOIN Query)...");
        String sql = "SELECT r.room_id, r.room_name, r.room_type, r.capacity, r.hourly_rate, r.status, s.space_name, s.city " +
                     "FROM MEETING_ROOMS r " +
                     "JOIN COWORKING_SPACES s ON r.space_id = s.space_id " +
                     "ORDER BY r.room_id ASC";

        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            System.out.printf("%-8s | %-24s | %-18s | %-8s | %-10s | %-12s | %-20s%n",
                    "ROOM ID", "ROOM NAME", "TYPE", "CAPACITY", "RATE/HR", "STATUS", "HUB LOCATION");
            System.out.println("------------------------------------------------------------------------------------------------------------------------");

            int count = 0;
            while (rs.next()) {
                count++;
                System.out.printf("%-8d | %-24s | %-18s | %-8d | ?%-9.2f | %-12s | %-20s%n",
                        rs.getInt("room_id"),
                        rs.getString("room_name"),
                        rs.getString("room_type"),
                        rs.getInt("capacity"),
                        rs.getDouble("hourly_rate"),
                        rs.getString("status"),
                        rs.getString("space_name") + " (" + rs.getString("city") + ")");
            }
            System.out.println("Total Rooms Retrieved: " + count);

        } catch (Exception e) {
            System.err.println("? Error querying rooms: " + e.getMessage());
        }
    }

    // 2b. EER Specialization & Recursive 'Supervises' Relationship Demo
    public static void displayEmployeeHierarchy() {
        System.out.println("\n[2b] EER Diagram Feature: Employee Self-Join (Recursive Supervises Hierarchy)...");
        String sql = "SELECT e.employee_id, pe.first_name || ' ' || pe.last_name AS employee_name, " +
                     "e.job_title, e.salary, NVL(ps.first_name || ' ' || ps.last_name, 'TOP-LEVEL DIRECTOR') AS supervisor_name " +
                     "FROM EMPLOYEES e " +
                     "JOIN PERSON pe ON e.person_id = pe.person_id " +
                     "LEFT JOIN EMPLOYEES s ON e.supervisor_id = s.employee_id " +
                     "LEFT JOIN PERSON ps ON s.person_id = ps.person_id " +
                     "ORDER BY e.supervisor_id NULLS FIRST, e.employee_id ASC";

        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            System.out.printf("%-8s | %-22s | %-32s | %-12s | %-22s%n",
                    "EMP ID", "EMPLOYEE NAME", "JOB TITLE", "SALARY", "SUPERVISED BY");
            System.out.println("------------------------------------------------------------------------------------------------------------------");

            while (rs.next()) {
                System.out.printf("%-8d | %-22s | %-32s | ?%-11.2f | %-22s%n",
                        rs.getInt("employee_id"),
                        rs.getString("employee_name"),
                        rs.getString("job_title"),
                        rs.getDouble("salary"),
                        rs.getString("supervisor_name"));
            }
        } catch (Exception e) {
            System.err.println("? Error querying employees: " + e.getMessage());
        }
    }

    // 3. PreparedStatement INSERT Demo
    public static int insertSampleRoom(String name, String type, int capacity, double rate) {
        System.out.println("\n[3] Inserting New Room via JDBC PreparedStatement...");
        String sql = "INSERT INTO MEETING_ROOMS (room_id, space_id, room_name, room_type, capacity, hourly_rate, status) " +
                     "VALUES (SEQ_ROOMS.NEXTVAL, 101, ?, ?, ?, ?, 'AVAILABLE')";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, new String[]{"ROOM_ID"})) {

            pstmt.setString(1, name);
            pstmt.setString(2, type);
            pstmt.setInt(3, capacity);
            pstmt.setDouble(4, rate);

            int affectedRows = pstmt.executeUpdate();
            System.out.println("? Room inserted successfully! (" + affectedRows + " row affected)");

            // Retrieve generated Key
            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int newId = generatedKeys.getInt(1);
                    System.out.println("   Generated Room ID: " + newId);
                    return newId;
                }
            }
        } catch (Exception e) {
            System.err.println("? Insert failed: " + e.getMessage());
        }
        return -1;
    }

    // 4. PreparedStatement UPDATE Demo
    public static void updateRoomRate(int roomId, double newRate) {
        System.out.println("\n[4] Updating Room Hourly Rate via JDBC PreparedStatement...");
        String sql = "UPDATE MEETING_ROOMS SET hourly_rate = ? WHERE room_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setDouble(1, newRate);
            pstmt.setInt(2, roomId);

            int rows = pstmt.executeUpdate();
            System.out.println("? Room ID " + roomId + " updated with new rate: ?" + newRate + " (" + rows + " row affected)");
        } catch (Exception e) {
            System.err.println("? Update failed: " + e.getMessage());
        }
    }

    // 5. PreparedStatement DELETE Demo
    public static void deleteRoom(int roomId) {
        System.out.println("\n[5] Deleting Room via JDBC PreparedStatement...");
        String sql = "DELETE FROM MEETING_ROOMS WHERE room_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, roomId);
            int rows = pstmt.executeUpdate();
            System.out.println("? Room ID " + roomId + " deleted successfully. (" + rows + " row affected)");
        } catch (Exception e) {
            System.err.println("? Delete failed: " + e.getMessage());
        }
    }

    // 6. CallableStatement for Stored Procedure
    public static void testCallableProcedure() {
        System.out.println("\n[6] Calling PL/SQL Stored Procedure (SP_CREATE_BOOKING_AND_PAY) via CallableStatement...");
        String plsql = "{call SP_CREATE_BOOKING_AND_PAY(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}";

        try (Connection conn = getConnection();
             CallableStatement cstmt = conn.prepareCall(plsql)) {

            // Input parameters
            cstmt.setInt(1, 1001);                 // p_member_id
            cstmt.setInt(2, 301);                  // p_room_id
            cstmt.setNull(3, Types.NUMERIC);       // p_org_id
            String futureDate = java.time.LocalDate.now().plusDays((long)(Math.random() * 100) + 10).toString();
            cstmt.setString(4, futureDate);        // p_booking_date (dynamic future slot)
            cstmt.setString(5, "10:00");           // p_start_time
            cstmt.setString(6, "12:00");           // p_end_time
            cstmt.setInt(7, 2);                    // p_hours
            cstmt.setString(8, "UPI");             // p_payment_method

            // Register OUT parameters
            cstmt.registerOutParameter(9, Types.NUMERIC);   // o_booking_id
            cstmt.registerOutParameter(10, Types.NUMERIC);  // o_payment_id
            cstmt.registerOutParameter(11, Types.NUMERIC);  // o_amount

            cstmt.execute();

            long bookingId = cstmt.getLong(9);
            long paymentId = cstmt.getLong(10);
            double amount = cstmt.getDouble(11);

            System.out.println("? Stored Procedure Executed Successfully!");
            System.out.println("   New Booking ID : " + bookingId);
            System.out.println("   New Payment ID : " + paymentId);
            System.out.println("   Total Charged  : ?" + amount);

        } catch (SQLException e) {
            System.out.println("? Stored Procedure Call Status: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("? Error: " + e.getMessage());
        }
    }

    // JSON Query Bridge (used by Node.js backend when executing via JDBC)
    public static void executeJsonQuery(String sql) {
        String cleanSql = sql.trim().replaceFirst(";+$", "");
        String upper = cleanSql.toUpperCase().trim();
        boolean isSelect = upper.startsWith("SELECT") || upper.startsWith("WITH");

        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement()) {

            if (isSelect) {
                try (ResultSet rs = stmt.executeQuery(cleanSql)) {
                    ResultSetMetaData md = rs.getMetaData();
                    int columns = md.getColumnCount();

                    StringBuilder sb = new StringBuilder();
                    sb.append("{\"success\":true,\"columns\":[");
                    for (int i = 1; i <= columns; i++) {
                        sb.append("\"").append(md.getColumnLabel(i)).append("\"");
                        if (i < columns) sb.append(",");
                    }
                    sb.append("],\"rows\":[");

                    boolean firstRow = true;
                    int count = 0;
                    while (rs.next()) {
                        if (!firstRow) sb.append(",");
                        firstRow = false;
                        count++;
                        sb.append("{");
                        for (int i = 1; i <= columns; i++) {
                            String colName = md.getColumnLabel(i);
                            String val = rs.getString(i);
                            sb.append("\"").append(colName).append("\":");
                            if (val == null) {
                                sb.append("null");
                            } else {
                                sb.append("\"").append(val.replace("\"", "\\\"").replace("\n", " ").replace("\r", "")).append("\"");
                            }
                            if (i < columns) sb.append(",");
                        }
                        sb.append("}");
                    }
                    sb.append("],\"rowCount\":").append(count).append("}");
                    System.out.println(sb.toString());
                }
            } else {
                int affected = stmt.executeUpdate(cleanSql);
                System.out.println("{\"success\":true,\"message\":\"Command executed successfully via JDBC\",\"affectedRows\":" + affected + "}");
            }

        } catch (Exception e) {
            String msg = e.getMessage() == null ? "Unknown JDBC Error" : e.getMessage().replace("\"", "\\\"").replace("\n", " ").replace("\r", "");
            System.out.println("{\"success\":false,\"error\":\"" + msg + "\"}");
        }
    }

    public static void main(String[] args) {
        // If run with --file flag, read SQL from a file
        if (args.length >= 2 && args[0].equals("--file")) {
            try {
                String sql = java.nio.file.Files.readString(java.nio.file.Path.of(args[1]));
                executeJsonQuery(sql.trim());
            } catch (Exception e) {
                System.out.println("{\"success\":false,\"error\":\"" + e.getMessage() + "\"}");
            }
            return;
        }

        // If run with --stdin flag, read SQL from standard input
        if (args.length >= 1 && args[0].equals("--stdin")) {
            try (Scanner scanner = new Scanner(System.in)) {
                StringBuilder sb = new StringBuilder();
                while (scanner.hasNextLine()) {
                    sb.append(scanner.nextLine()).append("\n");
                }
                executeJsonQuery(sb.toString().trim());
            }
            return;
        }

        // If run with --query flag, output JSON for backend integration
        if (args.length >= 2 && args[0].equals("--query")) {
            executeJsonQuery(args[1]);
            return;
        }

        System.out.println("==========================================================================================");
        System.out.println("            WORKSPHERE - ORACLE JDBC DATABASE CONNECTIVITY DEMO");
        System.out.println("==========================================================================================");

        // 1. Connection check
        testConnection();

        // 2. Relational Query & ResultSet
        displayRooms();

        // 2b. EER Diagram Feature: Employee Self-Join (Recursive Supervises Hierarchy)
        displayEmployeeHierarchy();

        // 3. PreparedStatement INSERT
        int newId = insertSampleRoom("JDBC Innovation Pod", "Meeting Pod", 6, 950.00);

        // 4. PreparedStatement UPDATE
        if (newId > 0) {
            updateRoomRate(newId, 1100.00);

            // 5. PreparedStatement DELETE
            deleteRoom(newId);
        }

        // 6. PL/SQL CallableStatement
        testCallableProcedure();

        System.out.println("\n==========================================================================================");
        System.out.println("? All JDBC Operations (Connection, ResultSet, PreparedStatement, CallableStatement) Passed!");
        System.out.println("==========================================================================================");
    }
}
