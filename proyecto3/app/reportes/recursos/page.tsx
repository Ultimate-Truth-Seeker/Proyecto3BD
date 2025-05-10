'use client';

import { useState } from 'react';
import GraficaRecursos from '@/components/GraficaRecursos';
import { exportToPDF, exportToExcel } from '@/lib/exportUtils';

export default function ReporteRecursos() {
  const [filtros, setFiltros] = useState({
    sumaMinima: 5,
    promedioMin: 1,
    promedioMax: 10,
    tipo: 'Técnico',
    desde: '2024-01-01',
    hasta: '2024-12-31',
    disponibleMin: 0,
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: name.includes('Min') || name.includes('Max') ? Number(value) : value,
    }));
  };

  const obtenerReporte = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/reportes/recursos', {
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
      <h1 className="text-2xl font-bold mb-4">Reporte de Uso de Recursos</h1>
      <form onSubmit={obtenerReporte} className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label>Cantidad total mínima usada</label>
          <input type="number" name="sumaMinima" value={filtros.sumaMinima} onChange={handleChange} placeholder="Suma mínima" className="border p-2 w-full" />
        </div>
        <div>
          <label>Promedio de cantidad usada entre</label>
          <input type="number" name="promedioMin" value={filtros.promedioMin} onChange={handleChange} placeholder="Promedio mínimo" className="border p-2 w-full" />
          <input type="number" name="promedioMax" value={filtros.promedioMax} onChange={handleChange} placeholder="Promedio máximo" className="border p-2 w-full" />
        </div>
        <div>
          <label>Tipo de recurso</label>
          <select name="tipo" value={filtros.tipo} onChange={handleChange} className="border p-2 w-full">
            <option value="Técnico">Técnico</option>
            <option value="Mobiliario">Mobiliario</option>
            <option value="Audiovisual">Audiovisual</option>
            <option value="Decoración">Decoración</option>
            <option value="Otro">Otro</option> 
          </select>
        </div>
        <div>
          <label>Fecha de asignación entre</label>
          <input type="date" name="desde" value={filtros.desde} onChange={handleChange} className="border p-2 w-full" />
          <input type="date" name="hasta" value={filtros.hasta} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label>Cantidad mínima disponible</label>
          <input type="number" name="disponibleMin" value={filtros.disponibleMin} onChange={handleChange} placeholder="Disponibilidad mínima" className="border p-2 w-full" />
        </div>
        <div className="col-span-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Generar Reporte</button>
          {data.length > 0 && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => exportToPDF(
                  ['nombre_recurso', 'total_usado', 'promedio_uso'],
                  data,
                  'Reporte_Recursos'
                )}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Exportar PDF
              </button>
              <button
                onClick={() => exportToExcel(
                  ['nombre_recurso', 'total_usado', 'promedio_uso'],
                  data,
                  'Reporte_Recursos'
                )}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Exportar Excel
              </button>
            </div>
          )}
        </div>
      </form>

      {loading ? <p>Cargando reporte...</p> : <GraficaRecursos data={data} />}
    </div>
  );
}