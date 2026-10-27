@echo off
title WorkSphere - Modern Database (Neo4j Graph Database) Assessment Demo
cd /d "%~dp0"
cls
echo ====================================================================
echo   WORKSPHERE - MODERN DATABASE TECHNOLOGY ASSESSMENT DEMONSTRATION
echo   Category: Graph Database (Neo4j ^& openCypher)
echo   Team: Mantavya Sharma (25BCE5583), Purva Golande, Shivangi Vashisht
echo ====================================================================
echo.
echo [1/3] Running Terminal Cypher Query ^& Benchmark Demo...
node database/graph_demo_cli.js
echo.
echo ====================================================================
echo [2/3] Starting WorkSphere Server with Interactive Graph Visualizer...
echo ====================================================================
start "" cmd /k "title WorkSphere Server [Port 5000] && node backend/server.js"

echo Waiting 2 seconds for server initialization...
timeout /t 2 /nobreak >nul

echo [3/3] Opening Interactive Graph Database Console in Browser...
start http://localhost:5000/#graph

echo.
echo ====================================================================
echo  Interactive Web Dashboard: http://localhost:5000
echo  Direct Graph Console:      http://localhost:5000 (Click "Graph (Neo4j)" tab)
echo ====================================================================
pause
