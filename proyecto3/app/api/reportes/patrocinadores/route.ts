// app/api/reportes/patrocinadores/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  const {
    minEventos,
    montoMin,
    montoMax,
    tipoAporte,
    desde,
    hasta,
    estado,
  } = await req.json();

  try {
    const result = await pool.query(`
      SELECT
        p.id_patrocinador,
        p.nombre_empresa,
        COUNT(pe.id_evento)       AS eventos_patrocinados,
        SUM(pe.monto_aportado)    AS total_invertido,
        AVG(pe.monto_aportado)    AS aporte_promedio
      FROM patrocinadores p
      JOIN patrocinio_evento pe
        ON p.id_patrocinador = pe.id_patrocinador
      WHERE
        pe.tipo_aporte = $4
        AND pe.fecha_acuerdo BETWEEN $5 AND $6
        AND p.estado = $7
      GROUP BY p.id_patrocinador, p.nombre_empresa, pe.tipo_aporte, pe.fecha_acuerdo
      HAVING
        COUNT(pe.id_evento) >= $1
        AND SUM(pe.monto_aportado) BETWEEN $2 AND $3
    `, [minEventos, montoMin, montoMax, tipoAporte, desde, hasta, estado]);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error en reporte de patrocinadores:', err);
    return NextResponse.json({ error: 'Error ejecutando el reporte' }, { status: 500 });
  }
}