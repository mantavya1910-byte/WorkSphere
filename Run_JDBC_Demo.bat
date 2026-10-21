@echo off
title WorkSphere - Oracle JDBC Demo
color 0A
echo ==========================================================================
echo          WORKSPHERE - ORACLE JDBC DATABASE CONNECTIVITY DEMO
echo ==========================================================================
echo.
echo Compiling WorkSphereJDBC.java with Oracle JDBC Thin Driver (ojdbc11.jar)...
javac -cp ".;database/jdbc/ojdbc11.jar" database/jdbc/WorkSphereJDBC.java
if %errorlevel% neq 0 (
    echo [ERROR] Java compilation failed! Please ensure JDK is installed.
    pause
    exit /b %errorlevel%
)

echo Compilation successful! Running JDBC Demonstration...
echo.
java -cp ".;database/jdbc/ojdbc11.jar" database.jdbc.WorkSphereJDBC
echo.
pause
