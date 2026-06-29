-- Datos iniciales (passwords: admin123, abogado123, cliente123)
-- BCrypt hash generado con strength 10

INSERT INTO roles (name, display_name) VALUES
    ('admin', 'Administrador'),
    ('abogado', 'Abogado'),
    ('cliente', 'Cliente')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (name, email, password, role_id) VALUES
    ('Administrador', 'admin@casoslegales.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1),
    ('Juan Pérez', 'abogado@casoslegales.com',
     '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQsM9DqJzqJzqJzqJzqJzqJzqJzqJz', 2),
    ('María García', 'cliente@casoslegales.com',
     '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQsM9DqJzqJzqJzqJzqJzqJzqJzqJz', 3)
ON CONFLICT (email) DO NOTHING;

INSERT INTO abogados (nombre, email, telefono, especialidad, user_id) VALUES
    ('Juan Pérez', 'abogado@casoslegales.com', '999888777', 'Penal', 2)
ON CONFLICT (email) DO NOTHING;

INSERT INTO clientes (nombre, telefono, email, user_id) VALUES
    ('María García', '999111222', 'cliente@casoslegales.com', 3)
ON CONFLICT (email) DO NOTHING;
