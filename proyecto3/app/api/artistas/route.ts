import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  const result = await pool.query('SELECT DISTINCT tipo_arte FROM artistas;');
  return NextResponse.json(result.rows);
}