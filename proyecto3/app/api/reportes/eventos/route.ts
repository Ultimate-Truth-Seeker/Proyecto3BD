// app/api/reportes/eventos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { minAsistentes, minRecursos, categoriaId, sedeId, desde, hasta } = await req.json();

  try {
    const result = await pool.query(`
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
      WHERE e.id_categoria = $3
        AND e.id_sede = $4
        AND e.fecha_inicio BETWEEN $5 AND $6
      GROUP BY e.id_evento, e.titulo
      HAVING
        COUNT(ie.id_inscripcion) >= $1
        AND COUNT(re.id_recurso) >= $2
    `, [minAsistentes, minRecursos, categoriaId, sedeId, desde, hasta]);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error en consulta:', err);
    return NextResponse.json({ error: 'Error ejecutando el reporte' }, { status: 500 });
  }
}