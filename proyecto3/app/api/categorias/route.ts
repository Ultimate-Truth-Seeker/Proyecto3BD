import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  const result = await pool.query('SELECT id_categoria, nombre FROM categorias_evento');
  return NextResponse.json(result.rows);
}