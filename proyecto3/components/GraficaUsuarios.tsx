// components/GraficaUsuarios.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type UsuarioData = {
  nombre: string;
  edad: number;
  eventos_asistidos: string;
};

export default function GraficaUsuarios({ data }: { data: UsuarioData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="nombre" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="eventos_asistidos" fill="#82ca9d" name="Eventos Asistidos" />
      </BarChart>
    </ResponsiveContainer>
  );
}