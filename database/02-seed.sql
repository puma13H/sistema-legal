-- Datos iniciales (opcional - Spring Boot DataInitializer también los crea)
-- Contraseñas reales las genera el backend al arrancar (BCrypt)

BEGIN;

INSERT INTO roles (name, display_name) VALUES
    ('admin', 'Administrador'),
    ('abogado', 'Abogado'),
    ('cliente', 'Cliente')
ON CONFLICT (name) DO NOTHING;

COMMIT;
