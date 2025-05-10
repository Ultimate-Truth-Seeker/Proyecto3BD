SELECT
  e.id_evento,
  e.titulo,
  COUNT(ie.id_inscripcion)            AS total_asistentes,
  COUNT(re.id_recurso)                AS recursos_utilizados
FROM eventos e
LEFT JOIN inscripcion_evento ie
  ON e.id_evento = ie.id_evento
  AND ie.asistio = TRUE
LEFT JOIN recursos_evento re
  ON e.id_evento = re.id_evento
GROUP BY e.id_evento, e.titulo
HAVING
  COUNT(ie.id_inscripcion) >= $1    -- Filtro no trivial (umbral de asistentes)
  AND COUNT(re.id_recurso) >= $2       -- Filtro no trivial (umbral de recursos)
  AND e.id_categoria      = $3            -- Filtro por categoría de evento
  AND e.id_sede           = $4             -- Filtro por sede/ubicación
  AND e.fecha_inicio      BETWEEN $5 AND $6  -- Filtro por rango de fechas
;

SELECT * 
FROM (
	SELECT
	  u.id_usuario as id_usuario,
	  u.nombre as nombre,
	  u.genero as genero,
	  COUNT(ie.id_inscripcion)         AS eventos_asistidos,
	  EXTRACT(YEAR FROM AGE(current_date, u.fecha_nacimiento)) AS edad
	FROM usuarios u
	JOIN inscripcion_evento ie
	  ON u.id_usuario = ie.id_usuario
	  AND ie.asistio = TRUE
	WHERE
      ie.fecha_inscripcion BETWEEN $1 AND $2 -- Filtro por fecha de inscripción
      AND u.intereses LIKE '%' || $3 || '%' -- Filtro por palabra en intereses
	GROUP BY u.id_usuario, u.nombre, u.fecha_nacimiento
) sub
WHERE
  sub.eventos_asistidos >= $4   -- Filtro no trivial (umbral de eventos)
  AND sub.edad BETWEEN $5 AND $6 -- Filtro no trivial (rango de edad)
  AND sub.genero = $7                     -- Filtro por género
;

SELECT
  r.id_recurso,
  r.nombre,
  SUM(re.cantidad_asignada)          AS total_usado,
  ROUND(AVG(re.cantidad_asignada),2) AS promedio_uso
FROM recursos r
JOIN recursos_evento re
  ON r.id_recurso = re.id_recurso
GROUP BY r.id_recurso, r.nombre, re.fecha_asignacion
HAVING
  SUM(re.cantidad_asignada) >= $1     -- Filtro no trivial (suma mínima)
  AND AVG(re.cantidad_asignada) BETWEEN $2 AND $3  -- Filtro no trivial (promedio en rango)
  AND r.tipo = $4         -- Filtro por tipo de recurso
  AND re.fecha_asignacion BETWEEN $5 AND &6  -- Filtro por fecha de uso
  AND r.cantidad_disponible > &7      -- Filtro por disponibilidad positiva
;

SELECT
  ar.id_artista,
  ar.nombre,
  COUNT(aa.id_actividad)     AS actividades_realizadas,
  MIN(act.hora_inicio)       AS primera_actividad,
  MAX(act.hora_inicio)       AS ultima_actividad
FROM artistas ar
JOIN actividad_artista aa
  ON ar.id_artista = aa.id_artista
JOIN actividades act
  ON aa.id_actividad = act.id_actividad
WHERE
  ar.tipo_arte = $1                                  -- Filtro por tipo de arte presente
  AND act.tipo_actividad = $2                        -- Filtro por tipo de actividad presente
  AND act.hora_inicio BETWEEN $3
                        AND $4      -- Filtro por rango de fechas realista
  AND aa.estado = $5         -- Filtro multivalor válido
GROUP BY ar.id_artista, ar.nombre
HAVING
  COUNT(aa.id_actividad) >= $6                               -- Filtro no trivial por cantidad mínima
;

SELECT
  p.id_patrocinador,
  p.nombre_empresa,
  COUNT(pe.id_evento)       AS eventos_patrocinados,
  SUM(pe.monto_aportado)    AS total_invertido,
  AVG(pe.monto_aportado)    AS aporte_promedio
FROM patrocinadores p
JOIN patrocinio_evento pe
  ON p.id_patrocinador = pe.id_patrocinador
GROUP BY p.id_patrocinador, p.nombre_empresa, pe.tipo_aporte, pe.fecha_acuerdo
HAVING
  COUNT(pe.id_evento) >= $1    -- Filtro no trivial (umbral de patrocinios)
  AND SUM(pe.monto_aportado) BETWEEN $2 AND $3  -- Filtro no trivial (monto en rango)
  AND pe.tipo_aporte = $4               -- Filtro por tipo de patrocinio
  AND pe.fecha_acuerdo BETWEEN $5 AND $6  -- Filtro por fecha de aporte
  AND p.estado = $7                     -- Filtro por estado del patrocinador
;

