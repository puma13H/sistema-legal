@echo off
chcp 65001 >nul
title Backend + PostgreSQL
cd /d "%~dp0backend"

set "MVN="
where mvn >nul 2>&1
if not errorlevel 1 (set "MVN=mvn") else (
  for /f "delims=" %%i in ('powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0backend\ensure-maven.ps1" 2^>^&1') do set "MVN=%%i"
)

if not defined MVN (
  echo ERROR: Maven no encontrado. Usa IntelliJ con perfil postgres.
  pause
  exit /b 1
)

echo Perfil: postgres
echo Base:   jdbc:postgresql://localhost:5432/casos_legales
echo.

call "%MVN%" -DskipTests compile
if errorlevel 1 ( pause & exit /b 1 )

call "%MVN%" spring-boot:run -Dspring-boot.run.profiles=postgres
