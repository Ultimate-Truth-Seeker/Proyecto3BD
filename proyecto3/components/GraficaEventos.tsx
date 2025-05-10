// components/GraficaEventos.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type EventoData = {
  titulo: string;
  total_asistentes: string;
  recursos_utilizados: string;
};

export default function GraficaEventos({ data }: { data: EventoData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="titulo" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_asistentes" fill="#8884d8" name="Asistentes" />
        <Bar dataKey="recursos_utilizados" fill="#82ca9d" name="Recursos" />
      </BarChart>
    </ResponsiveContainer>
  );
}