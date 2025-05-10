// app/api/reportes/usuarios/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  const {
    desde,
    hasta,
    interes,
    minEventos,
    edadMin,
    edadMax,
    genero,
  } = await req.json();

  try {
    const result = await pool.query(`
      SELECT * 
      FROM (
        SELECT
          u.id_usuario,
          u.nombre,
          u.genero,
          COUNT(ie.id_inscripcion) AS eventos_asistidos,
          EXTRACT(YEAR FROM AGE(current_date, u.fecha_nacimiento)) AS edad
        FROM usuarios u
        LEFT JOIN inscripcion_evento ie
          ON u.id_usuario = ie.id_usuario
          AND ie.asistio = TRUE
        WHERE
          ie.fecha_inscripcion BETWEEN $1 AND $2
          AND u.intereses ILIKE '%' || $3 || '%'
        GROUP BY u.id_usuario, u.nombre, u.genero, u.fecha_nacimiento
      ) sub
      WHERE
        sub.eventos_asistidos >= $4
        AND sub.edad BETWEEN $5 AND $6
        AND sub.genero = $7
    `, [desde, hasta, interes, minEventos, edadMin, edadMax, genero]);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error en consulta de usuarios:', err);
    return NextResponse.json({ error: 'Error ejecutando el reporte' }, { status: 500 });
  }
}