@echo off
chcp 65001 >nul
title Solo Backend
start "Casos Legales - BACKEND" cmd /k "%~dp0start-backend.bat"
echo Ventana BACKEND abierta.
echo Cuando veas "Started CasosLegalesApplication", abre:
echo http://localhost:8080/api/auth/health
pause
