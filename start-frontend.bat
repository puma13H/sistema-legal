@echo off
chcp 65001 >nul
title Casos Legales - Frontend
cd /d "%~dp0frontend"

set "NODE="
set "NPM="

if exist "C:\Program Files\nodejs\npm.cmd" (
  set "NODE=C:\Program Files\nodejs\node.exe"
  set "NPM=C:\Program Files\nodejs\npm.cmd"
)
if not defined NPM if exist "C:\Program Files\nodejs-docker\npm.cmd" (
  set "NODE=C:\Program Files\nodejs-docker\node.exe"
  set "NPM=C:\Program Files\nodejs-docker\npm.cmd"
)

if not defined NPM (
  echo ERROR: No se encontro npm. Reinstala Node.js desde https://nodejs.org
  pause
  exit /b 1
)

echo Node: %NODE%
echo npm:  %NPM%
echo.
echo Instalando dependencias...
call "%NPM%" install
if errorlevel 1 (
  echo ERROR en npm install
  pause
  exit /b 1
)

echo.
echo Iniciando Angular en http://localhost:4200
call "%NPM%" start
