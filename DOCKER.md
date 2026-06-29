# Docker - Casos Legales

Stack completo con **PostgreSQL + Spring Boot + Angular (nginx)**.

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución

## Inicio rapido (Windows)

Doble clic en:

```
DOCKER-INICIAR.bat
```

O en terminal:

```bash
cd "C:\Users\hp\Downloads\nuevo 3"
docker compose up --build -d
```

## URLs

| Servicio   | URL                        |
|------------|----------------------------|
| Frontend   | http://localhost:4200      |
| Backend API| http://localhost:8080      |
| PostgreSQL | localhost:5432             |

**Login:** `admin@casoslegales.com` / `admin123`

## Contenedores

| Nombre              | Imagen base        | Puerto |
|---------------------|--------------------|--------|
| casos-legales-db    | postgres:16-alpine | 5432   |
| casos-legales-api   | Java 17 (Spring)   | 8080   |
| casos-legales-web   | nginx + Angular    | 4200→80|

## Base de datos

- **Database:** `casos_legales`
- **User:** `postgres`
- **Password:** `postgres`
- Scripts init: `database/01-schema.sql`, `database/02-seed.sql`
- Volumen persistente: `postgres_data`

Conectar desde IntelliJ / DBeaver:
```
jdbc:postgresql://localhost:5432/casos_legales
```

## Comandos utiles

```bash
# Ver logs
docker compose logs -f

# Solo backend
docker compose logs -f backend

# Reiniciar todo
docker compose down
docker compose up --build -d

# Borrar base de datos (volumen)
docker compose down -v
```

## Arquitectura

```
Navegador → frontend:4200 (nginx)
                ↓ /api/*
            backend:8080 (Spring Boot)
                ↓
            postgres:5432
```

El frontend en Docker usa `/api` (mismo origen) y nginx redirige al backend.

## Perfil Spring

En Docker el backend usa `application-docker.yml` (host `postgres`).

Para desarrollo local sin Docker sigue valiendo `application-postgres.yml` (host `localhost`).
