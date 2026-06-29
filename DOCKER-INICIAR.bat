@echo off
chcp 65001 >nul
title Docker - Casos Legales
cd /d "%~dp0"

where docker >nul 2>&1
if errorlevel 1 (
  echo ERROR: Docker no esta instalado.
  echo Descarga Docker Desktop: https://www.docker.com/products/docker-desktop/
  pause
  exit /b 1
)

echo ========================================
echo   DOCKER - Casos Legales
echo ========================================
echo.
echo Construyendo e iniciando contenedores...
echo (La primera vez puede tardar varios minutos)
echo.

docker compose up --build -d

if errorlevel 1 (
  echo ERROR al iniciar Docker Compose.
  pause
  exit /b 1
)

echo.
echo ========================================
echo   SERVICIOS
echo ========================================
echo   Frontend:  http://localhost:4200
echo   Backend:   http://localhost:8080
echo   Postgres:  localhost:5432
echo   DB:        casos_legales / postgres / postgres
echo.
echo Login: admin@casoslegales.com / admin123
echo.
echo Ver logs:  docker compose logs -f
echo Detener:   docker compose down
echo.
pause
