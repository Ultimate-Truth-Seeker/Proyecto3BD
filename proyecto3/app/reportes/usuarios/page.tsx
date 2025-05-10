'use client';

import { useState, useEffect } from 'react';
import GraficaUsuarios from '@/components/GraficaUsuarios';
import { exportToPDF, exportToExcel } from '@/lib/exportUtils';

export default function ReporteUsuarios() {
  const [filtros, setFiltros] = useState({
    desde: '2024-01-01',
    hasta: '2024-12-31',
    interes: '',
    minEventos: 2,
    edadMin: 18,
    edadMax: 50,
    genero: 'Femenino',
  });

  const [intereses, setIntereses] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/usuarios')
      .then(res => res.json())
      .then(setIntereses);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: name.includes('min') || name.includes('max') || name === 'minEventos'
        ? Number(value)
        : value,
    }));
  };

  const obtenerReporte = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/reportes/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtros),
    });

    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reporte de Usuarios</h1>

      <form onSubmit={obtenerReporte} className="grid grid-cols-2 gap-4 mb-6">
        <div>
        <label>Fecha de Inscripción</label>
          <div>
            <label>Desde</label>
            <input type="date" name="desde" value={filtros.desde} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div>
            <label>Hasta</label>
            <input type="date" name="hasta" value={filtros.hasta} onChange={handleChange} className="border p-2 w-full" />
          </div>
        </div>
        <div>
          <label>Interés</label>
          <select name="interes" value={filtros.interes} onChange={handleChange} className="border p-2 w-full">
            <option value="">Seleccione...</option>
              {intereses.map(c => (
                <option key={c.intereses} value={c.intereses}>
                  {c.intereses}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label>Mín. Eventos</label>
          <input type="number" name="minEventos" placeholder="Mín. eventos" value={filtros.minEventos} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label>Edad mínima</label>
          <input type="number" name="edadMin" placeholder="Edad mínima" value={filtros.edadMin} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label>Edad máxima</label>
          <input type="number" name="edadMax" placeholder="Edad máxima" value={filtros.edadMax} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label>Género</label>
          <select name="genero" value={filtros.genero} onChange={handleChange} className="border p-2 w-full">
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decir">Prefiero no decir</option>
            <option value="Helicoptero">Helicoptero Apache de Ataque</option>
          </select>
        </div>
        
        <div className="col-span-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
            Generar Reporte
          </button>
          {data.length > 0 && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => exportToPDF(
                  ['nombre_usuario', 'genero', 'eventos_asistidos', 'edad'],
                  data,
                  'Reporte_Usuarios'
                )}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Exportar PDF
              </button>
              <button
                onClick={() => exportToExcel(
                  ['nombre_usuario', 'genero', 'eventos_asistidos', 'edad'],
                  data,
                  'Reporte_Usuarios'
                )}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Exportar Excel
              </button>
            </div>
          )}
        </div>
      </form>

      {loading ? <p>Cargando reporte...</p> : <GraficaUsuarios data={data} />}
    </div>
  );
}