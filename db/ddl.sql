-- Creación de tipos enumerados
CREATE TYPE estado_categoria AS ENUM ('Activa', 'Inactiva');
CREATE TYPE estado_sede AS ENUM ('Activa', 'En Mantenimiento', 'Inactiva');
CREATE TYPE genero_tipo AS ENUM ('Masculino', 'Femenino', 'Otro', 'Prefiero no decir');
CREATE TYPE estado_usuario AS ENUM ('Activo', 'Inactivo', 'Bloqueado');
CREATE TYPE estado_evento AS ENUM ('Planificado', 'Abierto', 'En Curso', 'Finalizado', 'Cancelado');
CREATE TYPE tipo_recurso AS ENUM ('Técnico', 'Mobiliario', 'Audiovisual', 'Decoración', 'Otro');
CREATE TYPE estado_recurso AS ENUM ('Disponible', 'En Uso', 'En Mantenimiento', 'Inactivo');
CREATE TYPE clasificacion_patrocinador AS ENUM ('Platino', 'Oro', 'Plata', 'Bronce');
CREATE TYPE estado_patrocinador AS ENUM ('Activo', 'Inactivo');
CREATE TYPE estado_artista AS ENUM ('Activo', 'Inactivo');
CREATE TYPE estado_actividad AS ENUM ('Planificada', 'En Curso', 'Finalizada', 'Cancelada');
CREATE TYPE tipo_actividad AS ENUM ('Conferencia', 'Taller', 'Exposición', 'Concierto', 'Otro');
CREATE TYPE estado_pago AS ENUM ('Pendiente', 'Completado', 'Cancelado', 'Reembolsado');
CREATE TYPE tipo_aporte AS ENUM ('Económico', 'Especies', 'Servicios', 'Mixto');
CREATE TYPE estado_patrocinio AS ENUM ('Propuesto', 'Confirmado', 'Entregado', 'Cancelado');
CREATE TYPE estado_asignacion AS ENUM ('Solicitado', 'Asignado', 'En Uso', 'Devuelto', 'Cancelado');
CREATE TYPE estado_artista_actividad AS ENUM ('Confirmado', 'Tentativo', 'Cancelado');

-- Tabla de categorías de eventos
CREATE TABLE categorias_evento (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    estado estado_categoria DEFAULT 'Activa',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_categoria_nombre UNIQUE (nombre)
);

-- Tabla de sedes
CREATE TABLE sedes (
    id_sede SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    capacidad_maxima INT NOT NULL CHECK (capacidad_maxima > 0),
    contacto_principal VARCHAR(100),
    telefono VARCHAR(15),
    email VARCHAR(100),
    coordenadas_gps VARCHAR(100),
    accesibilidad_discapacitados BOOLEAN DEFAULT FALSE,
    estado estado_sede DEFAULT 'Activa',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_sede_nombre UNIQUE (nombre)
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    fecha_nacimiento DATE NOT NULL CHECK (fecha_nacimiento <= CURRENT_DATE),
    genero genero_tipo DEFAULT 'Prefiero no decir',
    direccion VARCHAR(255),
    intereses TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP,
    es_admin BOOLEAN DEFAULT FALSE,
    estado estado_usuario DEFAULT 'Activo',
    CONSTRAINT uk_usuario_email UNIQUE (email)
);

-- Tabla de eventos
CREATE TABLE eventos (
    id_evento SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    id_categoria INT NOT NULL,
    id_sede INT NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    descripcion TEXT,
    cupo_maximo INT CHECK (cupo_maximo > 0),
    precio_entrada DECIMAL(10,2) DEFAULT 0.00 CHECK (precio_entrada >= 0),
    id_coordinador INT,
    estado estado_evento DEFAULT 'Planificado',
    imagen_promocional VARCHAR(255),
    requiere_inscripcion BOOLEAN DEFAULT FALSE,
    es_privado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evento_categoria FOREIGN KEY (id_categoria) REFERENCES categorias_evento(id_categoria),
    CONSTRAINT fk_evento_sede FOREIGN KEY (id_sede) REFERENCES sedes(id_sede),
    CONSTRAINT fk_evento_coordinador FOREIGN KEY (id_coordinador) REFERENCES usuarios(id_usuario),
    CONSTRAINT chk_fecha_evento CHECK (fecha_fin > fecha_inicio)
);

-- Tabla de recursos
CREATE TABLE recursos (
    id_recurso SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo tipo_recurso NOT NULL,
    descripcion VARCHAR(255),
    cantidad_disponible INT NOT NULL CHECK (cantidad_disponible >= 0),
    costo_unitario DECIMAL(10,2) DEFAULT 0.00 CHECK (costo_unitario >= 0),
    requiere_tecnico BOOLEAN DEFAULT FALSE,
    estado estado_recurso DEFAULT 'Disponible',
    fecha_adquisicion DATE,
    CONSTRAINT uk_recurso_nombre UNIQUE (nombre)
);

-- Tabla de patrocinadores
CREATE TABLE patrocinadores (
    id_patrocinador SERIAL PRIMARY KEY,
    nombre_empresa VARCHAR(100) NOT NULL,
    tipo_empresa VARCHAR(50),
    persona_contacto VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    logo_empresa VARCHAR(255),
    sitio_web VARCHAR(100),
    descripcion TEXT,
    fecha_inicio_relacion DATE NOT NULL,
    clasificacion clasificacion_patrocinador DEFAULT 'Bronce',
    estado estado_patrocinador DEFAULT 'Activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_patrocinador_nombre UNIQUE (nombre_empresa),
    CONSTRAINT uk_patrocinador_email UNIQUE (email)
);

-- Tabla de artistas
CREATE TABLE artistas (
    id_artista SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo_arte VARCHAR(50) NOT NULL,
    biografia TEXT,
    pais_origen VARCHAR(50),
    email VARCHAR(100),
    telefono VARCHAR(15),
    sitio_web VARCHAR(100),
    redes_sociales TEXT,
    imagen VARCHAR(255),
    cache_estimado DECIMAL(10,2) CHECK (cache_estimado >= 0),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado estado_artista DEFAULT 'Activo',
    CONSTRAINT uk_artista_email UNIQUE (email)
);

-- Tabla de actividades
CREATE TABLE actividades (
    id_actividad SERIAL PRIMARY KEY,
    id_evento INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    hora_inicio TIMESTAMP NOT NULL,
    hora_fin TIMESTAMP NOT NULL,
    ubicacion_especifica VARCHAR(100),
    responsable VARCHAR(100),
    cupo_limite INT CHECK (cupo_limite > 0),
    estado estado_actividad DEFAULT 'Planificada',
    tipo_actividad tipo_actividad NOT NULL,
    es_destacada BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_actividad_evento FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE,
    CONSTRAINT chk_hora_actividad CHECK (hora_fin > hora_inicio)
);

-- Tabla de inscripción a eventos
CREATE TABLE inscripcion_evento (
    id_inscripcion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_evento INT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_pago estado_pago DEFAULT 'Pendiente',
    metodo_pago VARCHAR(50),
    monto_pagado DECIMAL(10,2) DEFAULT 0.00 CHECK (monto_pagado >= 0),
    fecha_pago TIMESTAMP,
    codigo_entrada VARCHAR(20),
    asistio BOOLEAN DEFAULT FALSE,
    comentarios TEXT,
    calificacion INT CHECK (calificacion IS NULL OR (calificacion >= 1 AND calificacion <= 5)),
    CONSTRAINT uk_inscripcion_usuario_evento UNIQUE (id_usuario, id_evento),
    CONSTRAINT fk_inscripcion_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_inscripcion_evento FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE
);

-- Tabla de patrocinio de eventos
CREATE TABLE patrocinio_evento (
    id_patrocinio SERIAL PRIMARY KEY,
    id_patrocinador INT NOT NULL,
    id_evento INT NOT NULL,
    tipo_aporte tipo_aporte NOT NULL,
    monto_aportado DECIMAL(10,2) CHECK (monto_aportado >= 0),
    descripcion_aporte TEXT,
    fecha_acuerdo DATE NOT NULL,
    beneficios_ofrecidos TEXT,
    estado estado_patrocinio DEFAULT 'Propuesto',
    documento_acuerdo VARCHAR(255),
    CONSTRAINT uk_patrocinio_patrocinador_evento UNIQUE (id_patrocinador, id_evento),
    CONSTRAINT fk_patrocinio_patrocinador FOREIGN KEY (id_patrocinador) REFERENCES patrocinadores(id_patrocinador),
    CONSTRAINT fk_patrocinio_evento FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE
);

-- Tabla de recursos asignados a eventos
CREATE TABLE recursos_evento (
    id_asignacion SERIAL PRIMARY KEY,
    id_evento INT NOT NULL,
    id_recurso INT NOT NULL,
    cantidad_asignada INT NOT NULL CHECK (cantidad_asignada > 0),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_asignacion TIMESTAMP,
    fecha_devolucion TIMESTAMP,
    estado estado_asignacion DEFAULT 'Solicitado',
    notas_uso TEXT,
    responsable_asignacion VARCHAR(100),
    CONSTRAINT fk_recursos_evento_evento FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE,
    CONSTRAINT fk_recursos_evento_recurso FOREIGN KEY (id_recurso) REFERENCES recursos(id_recurso),
    CONSTRAINT chk_fechas_recursos CHECK (
        (fecha_devolucion IS NULL) OR 
        (fecha_asignacion IS NOT NULL AND fecha_devolucion > fecha_asignacion)
    )
);

-- Tabla de relación entre actividades y artistas
CREATE TABLE actividad_artista (
    id_actividad INT NOT NULL,
    id_artista INT NOT NULL,
    rol VARCHAR(50) NOT NULL,
    hora_presentacion TIMESTAMP,
    duracion INT, -- en minutos
    cache_acordado DECIMAL(10,2) CHECK (cache_acordado >= 0),
    estado estado_artista_actividad DEFAULT 'Tentativo',
    notas TEXT,
    PRIMARY KEY (id_actividad, id_artista),
    CONSTRAINT fk_actividad_artista_actividad FOREIGN KEY (id_actividad) REFERENCES actividades(id_actividad) ON DELETE CASCADE,
    CONSTRAINT fk_actividad_artista_artista FOREIGN KEY (id_artista) REFERENCES artistas(id_artista)
);

-- Tabla de asistencia a actividades
CREATE TABLE asistencia_actividad (
    id_asistencia SERIAL PRIMARY KEY,
    id_inscripcion INT NOT NULL,
    id_actividad INT NOT NULL,
    hora_entrada TIMESTAMP,
    hora_salida TIMESTAMP,
    valoracion INT CHECK (valoracion IS NULL OR (valoracion >= 1 AND valoracion <= 5)),
    comentario TEXT,
    CONSTRAINT uk_asistencia_inscripcion_actividad UNIQUE (id_inscripcion, id_actividad),
    CONSTRAINT fk_asistencia_inscripcion FOREIGN KEY (id_inscripcion) REFERENCES inscripcion_evento(id_inscripcion) ON DELETE CASCADE,
    CONSTRAINT fk_asistencia_actividad FOREIGN KEY (id_actividad) REFERENCES actividades(id_actividad) ON DELETE CASCADE,
    CONSTRAINT chk_horas_asistencia CHECK (
        (hora_salida IS NULL) OR 
        (hora_entrada IS NOT NULL AND hora_salida > hora_entrada)
    )
);

-- Función actualizar timestamp de modificación automáticamente
CREATE OR REPLACE FUNCTION update_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger actualizar fecha de modificación
CREATE TRIGGER tr_update_fecha_modificacion
BEFORE UPDATE ON eventos
FOR EACH ROW
EXECUTE FUNCTION update_fecha_modificacion();

-- Función actualizar disponibilidad de recursos cuando se asignan a un evento
CREATE OR REPLACE FUNCTION actualizar_disponibilidad_recursos()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE recursos
    SET cantidad_disponible = cantidad_disponible - NEW.cantidad_asignada,
        estado = CASE 
                   WHEN (cantidad_disponible - NEW.cantidad_asignada) = 0 THEN 'En Uso'::estado_recurso
                   ELSE estado
                 END
    WHERE id_recurso = NEW.id_recurso;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger actualizar disponibilidad de recursos
CREATE TRIGGER trg_actualizar_disponibilidad_recursos
AFTER INSERT ON recursos_evento
FOR EACH ROW
EXECUTE FUNCTION actualizar_disponibilidad_recursos();

-- Función restaurar disponibilidad de recursos cuando se devuelven
CREATE OR REPLACE FUNCTION restaurar_disponibilidad_recursos()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado = 'Devuelto' AND OLD.estado != 'Devuelto' THEN
        UPDATE recursos
        SET cantidad_disponible = cantidad_disponible + NEW.cantidad_asignada,
            estado = CASE 
                       WHEN (cantidad_disponible + NEW.cantidad_asignada) > 0 THEN 'Disponible'::estado_recurso
                       ELSE estado
                     END
        WHERE id_recurso = NEW.id_recurso;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger restaurar disponibilidad de recursos
CREATE TRIGGER trg_restaurar_disponibilidad_recursos
AFTER UPDATE ON recursos_evento
FOR EACH ROW
EXECUTE FUNCTION restaurar_disponibilidad_recursos();

-- Función verificar cupo disponible antes de permitir una nueva inscripción
CREATE OR REPLACE FUNCTION verificar_cupo_evento()
RETURNS TRIGGER AS $$
DECLARE
    cupo_actual INT;
    cupo_max INT;
BEGIN
    -- cupo máximo del evento
    SELECT cupo_maximo INTO cupo_max
    FROM eventos 
    WHERE id_evento = NEW.id_evento;
    
    -- Contar inscripciones actuales
    SELECT COUNT(*) INTO cupo_actual
    FROM inscripcion_evento
    WHERE id_evento = NEW.id_evento AND estado_pago != 'Cancelado';
    
    -- cupo disponible
    IF cupo_actual >= cupo_max THEN
        RAISE EXCEPTION 'No hay cupo disponible para este evento';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger verificar cupo disponible
CREATE TRIGGER trg_verificar_cupo_evento
BEFORE INSERT ON inscripcion_evento
FOR EACH ROW
EXECUTE FUNCTION verificar_cupo_evento();

-- Función actualizar automáticamente el estado del evento según las fechas
CREATE OR REPLACE FUNCTION actualizar_estado_evento()
RETURNS TRIGGER AS $$
DECLARE
    fecha_actual TIMESTAMP;
BEGIN
    fecha_actual := CURRENT_TIMESTAMP;
    
    IF OLD.estado != 'Cancelado' THEN
        IF fecha_actual < NEW.fecha_inicio THEN
            NEW.estado := 'Abierto';
        ELSIF fecha_actual >= NEW.fecha_inicio AND fecha_actual <= NEW.fecha_fin THEN
            NEW.estado := 'En Curso';
        ELSIF fecha_actual > NEW.fecha_fin THEN
            NEW.estado := 'Finalizado';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger actualizar estado del evento automáticamente
CREATE TRIGGER trg_actualizar_estado_evento
BEFORE UPDATE ON eventos
FOR EACH ROW
EXECUTE FUNCTION actualizar_estado_evento();

-- Función registrar automáticamente la asistencia al evento al registrarse en una actividad
CREATE OR REPLACE FUNCTION registrar_asistencia_evento()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE inscripcion_evento
    SET asistio = TRUE
    WHERE id_inscripcion = NEW.id_inscripcion AND asistio = FALSE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger registrar asistencia al evento
CREATE TRIGGER trg_registrar_asistencia_evento
AFTER INSERT ON asistencia_actividad
FOR EACH ROW
EXECUTE FUNCTION registrar_asistencia_evento();