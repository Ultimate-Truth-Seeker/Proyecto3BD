// components/GraficaPatrocinadores.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type PatrocinadorData = {
  nombre_empresa: string;
  total_invertido: string;
  aporte_promedio: string;
};

export default function GraficaPatrocinadores({ data }: { data: PatrocinadorData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="nombre_empresa" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_invertido" fill="#8884d8" name="Total Invertido" />
        <Bar dataKey="aporte_promedio" fill="#82ca9d" name="Aporte Promedio" />
      </BarChart>
    </ResponsiveContainer>
  );
}