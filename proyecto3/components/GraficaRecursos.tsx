// components/GraficaRecursos.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type RecursoData = {
  nombre: string;
  total_usado: string;
  promedio_uso: string;
};

export default function GraficaRecursos({ data }: { data: RecursoData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="nombre" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_usado" fill="#8884d8" name="Total Usado" />
        <Bar dataKey="promedio_uso" fill="#82ca9d" name="Promedio Uso" />
      </BarChart>
    </ResponsiveContainer>
  );
}