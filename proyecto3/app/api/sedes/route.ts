import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  const result = await pool.query('SELECT id_sede, nombre FROM sedes;');
  return NextResponse.json(result.rows);
}