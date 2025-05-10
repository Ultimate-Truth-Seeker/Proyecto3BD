'use client';

import { useState, useEffect } from 'react'; 
import GraficaArtistas from '@/components/GraficaArtistas';
import { exportToPDF, exportToExcel } from '@/lib/exportUtils';

export default function ReporteArtistas() {
  const [filtros, setFiltros] = useState({
    tipoArte: '',
    tipoActividad: 'Conferencia',
    desde: '2024-01-01',
    hasta: '2024-12-31',
    estado: 'Confirmado',
    minActividades: 2,
  });

  const [tipos, setTipos] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/artistas')
      .then(res => res.json())
      .then(setTipos);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: name === 'minActividades' ? Number(value) : value,
    }));
  };

  const obtenerReporte = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/reportes/artistas', {
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
      <h1 className="text-2xl font-bold mb-4">Reporte de Actividades por Artista</h1>

      <form onSubmit={obtenerReporte} className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label>Tipo de arte</label>
          <select name="tipoArte" value={filtros.tipoArte} onChange={handleChange} className="border p-2 w-full">
            <option value="">Seleccione...</option>
              {tipos.map(c => (
                <option key={c.tipo_arte} value={c.tipo_arte}>
                  {c.tipo_arte}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label>Tipo de actividad</label>
          <select name="tipoActividad" value={filtros.tipoActividad} onChange={handleChange} className="border p-2 w-full">
            <option value="Conferencia">Conferencia</option>
            <option value="Taller">Taller</option>
            <option value="Exposición">Exposición</option>
            <option value="Concierto">Concierto</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div>
          <label>Fecha de inicio entre</label>
          <input type="date" name="desde" value={filtros.desde} onChange={handleChange} className="border p-2 w-full" />
          <input type="date" name="hasta" value={filtros.hasta} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label>Estado de actividad del artista</label>
          <select name="estado" value={filtros.estado} onChange={handleChange} className="border p-2 w-full">
            <option value="Confirmado">Confirmado</option>
            <option value="Tentativo">Tentativo</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
        <div>
          <label>Mínimo de actividades</label>
          <input type="number" name="minActividades" value={filtros.minActividades} onChange={handleChange} placeholder="Mín. actividades" className="border p-2 w-full" />
        </div>

        <div className="col-span-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Generar Reporte</button>
          {data.length > 0 && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => exportToPDF(
                  ['nombre_artista', 'actividades_realizadas', 'primera_actividad', 'ultima_actividad'],
                  data,
                  'Reporte_Artistas'
                )}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Exportar PDF
              </button>
              <button
                onClick={() => exportToExcel(
                  ['nombre_artista', 'actividades_realizadas', 'primera_actividad', 'ultima_actividad'],
                  data,
                  'Reporte_Artistas'
                )}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Exportar Excel
              </button>
            </div>
          )}
        </div>
      </form>

      {loading ? <p>Cargando reporte...</p> : <GraficaArtistas data={data} />}
    </div>
  );
}