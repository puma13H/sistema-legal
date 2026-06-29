# Casos Legales - Angular + Spring Boot

## INICIO RAPIDO (1 clic)

Doble clic en:

```
INICIAR-TODO.bat
```

Abre 2 ventanas (backend + frontend) y luego entra a:

**http://localhost:4200**

Login: `admin@casoslegales.com` / `admin123`

---

## Scripts

| Archivo | Que hace |
|---------|----------|
| `INICIAR-TODO.bat` | Backend + Frontend |
| `start-backend.bat` | Solo API (puerto 8080) |
| `start-frontend.bat` | Solo Angular (puerto 4200) |

## IntelliJ

**Backend:** Run `CasosLegalesApplication` (perfil `dev`, base H2, sin PostgreSQL)

**Frontend:** Run `Angular CLI Server`
- Settings → Node.js → interpreter: `C:\Program Files\nodejs\node.exe`
- Package manager: `C:\Program Files\nodejs\npm.cmd`

## PostgreSQL (opcional)

Para usar PostgreSQL en IntelliJ:
1. Crear base: `CREATE DATABASE casos_legales;`
2. Run con perfil `postgres` o editar Active profiles en Run Configuration

## Usuarios

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@casoslegales.com | admin123 |
| Abogado | abogado@casoslegales.com | abogado123 |
| Cliente | cliente@casoslegales.com | cliente123 |
