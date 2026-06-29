@echo off
chcp 65001 >nul
title Casos Legales
echo ========================================
echo   CASOS LEGALES - Iniciando todo
echo ========================================
echo.
echo PASO 1: Backend  (espera 1-3 min la primera vez)
echo PASO 2: Frontend
echo.
echo Login: admin@casoslegales.com / admin123
echo.

start "Casos Legales - BACKEND" cmd /k "%~dp0INICIAR-BACKEND-POSTGRES.bat"

echo Esperando backend en puerto 8080...
powershell -NoProfile -Command ^
  "$ok=$false; for($i=0;$i -lt 60;$i++){ if((Test-NetConnection localhost -Port 8080 -WarningAction SilentlyContinue).TcpTestSucceeded){$ok=$true; break}; Start-Sleep 3; Write-Host ('  intento ' + ($i+1) + '/60...') }; if(-not $ok){ Write-Host 'AVISO: backend aun no responde. Revisa la ventana BACKEND.' -ForegroundColor Yellow } else { Write-Host 'Backend OK!' -ForegroundColor Green }"

start "Casos Legales - FRONTEND" cmd /k "%~dp0start-frontend.bat"

echo.
echo Abre: http://localhost:4200
echo Verifica backend: http://localhost:8080/api/auth/health
echo.
pause
