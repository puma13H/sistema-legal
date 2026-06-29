@echo off
chcp 65001 >nul
title Instalar PostgreSQL - Casos Legales
echo ================================================
echo   INSTALAR BASE DE DATOS POSTGRESQL
echo   casos_legales
echo ================================================
echo.

set "PGUSER=postgres"
set /p PGPASSWORD=Clave de postgres (Enter si es "postgres"): 
if "%PGPASSWORD%"=="" set "PGPASSWORD=postgres"

where psql >nul 2>&1
if errorlevel 1 (
  echo.
  echo ERROR: psql no esta en PATH.
  echo.
  echo Instala PostgreSQL desde: https://www.postgresql.org/download/windows/
  echo O ejecuta manualmente en pgAdmin / IntelliJ Database:
  echo   CREATE DATABASE casos_legales;
  echo   Luego ejecuta: database\01-schema.sql
  echo.
  pause
  exit /b 1
)

echo.
echo [1/3] Creando base de datos casos_legales...
set PGPASSWORD=%PGPASSWORD%
psql -U %PGUSER% -h localhost -p 5432 -tc "SELECT 1 FROM pg_database WHERE datname='casos_legales'" | findstr /C:"1" >nul
if errorlevel 1 (
  psql -U %PGUSER% -h localhost -p 5432 -c "CREATE DATABASE casos_legales;"
  if errorlevel 1 (
    echo ERROR al crear la base. Verifica que PostgreSQL este corriendo.
    pause
    exit /b 1
  )
  echo Base creada OK.
) else (
  echo La base ya existe.
)

echo.
echo [2/3] Creando tablas...
psql -U %PGUSER% -h localhost -p 5432 -d casos_legales -f "%~dp0database\01-schema.sql"
if errorlevel 1 (
  echo ERROR al crear tablas.
  pause
  exit /b 1
)

echo.
echo [3/3] Datos base (roles)...
psql -U %PGUSER% -h localhost -p 5432 -d casos_legales -f "%~dp0database\02-seed.sql"

echo.
echo ================================================
echo   LISTO: base casos_legales en PostgreSQL
echo ================================================
echo.
echo Conexion IntelliJ / backend:
echo   Host:     localhost
echo   Puerto:   5432
echo   Base:     casos_legales
echo   Usuario:  postgres
echo.
echo Arranca el backend con perfil postgres:
echo   INICIAR-BACKEND-POSTGRES.bat
echo.
pause
