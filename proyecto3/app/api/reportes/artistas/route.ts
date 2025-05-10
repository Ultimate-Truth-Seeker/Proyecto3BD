// app/api/reportes/artistas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  const {
    tipoArte,
    tipoActividad,
    desde,
    hasta,
    estado,
    minActividades,
  } = await req.json();

  try {
    const result = await pool.query(`
      SELECT
        ar.id_artista,
        ar.nombre,
        COUNT(aa.id_actividad)     AS actividades_realizadas,
        MIN(act.hora_inicio)       AS primera_actividad,
        MAX(act.hora_inicio)       AS ultima_actividad
      FROM artistas ar
      LEFT JOIN actividad_artista aa
        ON ar.id_artista = aa.id_artista
      LEFT JOIN actividades act
        ON aa.id_actividad = act.id_actividad
      WHERE
        ar.tipo_arte = $1
        AND act.tipo_actividad = $2
        AND act.hora_inicio BETWEEN $3 AND $4
        AND aa.estado = $5
      GROUP BY ar.id_artista, ar.nombre
      HAVING
        COUNT(aa.id_actividad) >= $6
    `, [tipoArte, tipoActividad, desde, hasta, estado, minActividades]);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error en reporte de artistas:', err);
    return NextResponse.json({ error: 'Error ejecutando el reporte' }, { status: 500 });
  }
}