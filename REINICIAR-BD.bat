@echo off
chcp 65001 >nul
title Reiniciar base de datos
echo Borrando base H2 embebida...
if exist "%~dp0backend\data" (
  rmdir /s /q "%~dp0backend\data"
  echo Base borrada. Reinicia el backend.
) else (
  echo No habia base previa.
)
pause
