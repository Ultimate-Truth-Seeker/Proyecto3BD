// components/GraficaArtistas.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type ArtistaData = {
  nombre: string;
  actividades_realizadas: string;
}; 

export default function GraficaArtistas({ data }: { data: ArtistaData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="nombre" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="actividades_realizadas" fill="#8884d8" name="Actividades Realizadas" />
      </BarChart>
    </ResponsiveContainer>
  );
}