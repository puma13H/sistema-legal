@echo off
chcp 65001 >nul
title Casos Legales - Backend
cd /d "%~dp0backend"

set "MVN="

where mvn >nul 2>&1
if not errorlevel 1 (
  set "MVN=mvn"
  goto :run
)

for /f "delims=" %%i in ('powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0backend\ensure-maven.ps1" 2^>^&1') do set "MVN=%%i"

if not defined MVN (
  echo.
  echo ERROR: No se encontro Maven.
  echo.
  echo SOLUCION RAPIDA - IntelliJ:
  echo   1. Abre la carpeta backend en IntelliJ
  echo   2. Run ^> CasosLegalesApplication
  echo.
  pause
  exit /b 1
)

:run
echo Usando Maven: %MVN%
echo.
echo Compilando backend (puede tardar 1-2 min la primera vez)...
call "%MVN%" -DskipTests compile
if errorlevel 1 (
  echo.
  echo ERROR en compilacion.
  echo Usa IntelliJ: Run CasosLegalesApplication
  pause
  exit /b 1
)

echo.
echo Iniciando API en http://localhost:8080
echo Espera el mensaje: Started CasosLegalesApplication
echo.
call "%MVN%" -Dspring-boot.run.profiles=dev spring-boot:run
