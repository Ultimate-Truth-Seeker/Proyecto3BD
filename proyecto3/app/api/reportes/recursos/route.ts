// app/api/reportes/recursos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  const {
    sumaMinima,
    promedioMin,
    promedioMax,
    tipo,
    desde,
    hasta,
    disponibleMin,
  } = await req.json();

  try {
    const result = await pool.query(`
      SELECT
        r.id_recurso,
        r.nombre,
        SUM(re.cantidad_asignada)          AS total_usado,
        ROUND(AVG(re.cantidad_asignada),2) AS promedio_uso
      FROM recursos r
      JOIN recursos_evento re
        ON r.id_recurso = re.id_recurso
      WHERE
        r.tipo = $4
        AND re.fecha_asignacion BETWEEN $5 AND $6
        AND r.cantidad_disponible > $7
      GROUP BY r.id_recurso, r.nombre, re.fecha_asignacion
      HAVING
        SUM(re.cantidad_asignada) >= $1
        AND AVG(re.cantidad_asignada) BETWEEN $2 AND $3
    `, [sumaMinima, promedioMin, promedioMax, tipo, desde, hasta, disponibleMin]);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error en reporte de recursos:', err);
    return NextResponse.json({ error: 'Error ejecutando el reporte' }, { status: 500 });
  }
}