# PostgreSQL - Casos Legales

## Instalacion rapida (Windows)

1. Instala PostgreSQL: https://www.postgresql.org/download/windows/
2. Doble clic en:
   ```
   INSTALAR-BD-POSTGRES.bat
   ```
3. Arranca backend:
   ```
   INICIAR-BACKEND-POSTGRES.bat
   ```
   O en IntelliJ: Run `CasosLegalesApplication` (perfil `postgres`)

## Conexion IntelliJ IDEA (Database tool)

| Campo    | Valor           |
|----------|-----------------|
| Host     | localhost       |
| Port     | 5432            |
| Database | casos_legales   |
| User     | postgres        |
| Password | postgres        |

URL JDBC: `jdbc:postgresql://localhost:5432/casos_legales`

## Scripts SQL (orden)

1. `00-create-database.sql` - crear base
2. `01-schema.sql` - tablas e indices
3. `02-seed.sql` - roles base (opcional)

Manual:
```bash
psql -U postgres -c "CREATE DATABASE casos_legales;"
psql -U postgres -d casos_legales -f database/01-schema.sql
psql -U postgres -d casos_legales -f database/02-seed.sql
```

## Tablas

- roles, users
- clientes, abogados
- casos, documentos, mensajes
- agendas, notificaciones, settings

Al arrancar Spring Boot se insertan usuarios de prueba (admin, abogado, cliente).

## Docker (todo en contenedores)

Requisito: **Docker Desktop** instalado.

Doble clic en **`DOCKER-INICIAR.bat`** o:

```bash
docker compose up --build -d
```

| Servicio | URL |
|----------|-----|
| App web | http://localhost:4200 |
| API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

Detalles: ver **`DOCKER.md`**

## Perfiles Spring

| Perfil     | Base de datos        |
|------------|----------------------|
| postgres   | PostgreSQL local     |
| docker     | PostgreSQL contenedor|
| dev        | H2 embebida          |

Cambiar en `application.yml`: `spring.profiles.active`
