'use client';

import { useState } from 'react';
import GraficaPatrocinadores from '@/components/GraficaPatrocinadores';
import { exportToPDF, exportToExcel } from '@/lib/exportUtils';

export default function ReportePatrocinadores() {
  const [filtros, setFiltros] = useState({
    minEventos: 1,
    montoMin: 1000,
    montoMax: 50000,
    tipoAporte: 'Económico',
    desde: '2024-01-01',
    hasta: '2024-12-31',
    estado: 'Activo',
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: name.includes('min') || name.includes('max') ? Number(value) : value,
    }));
  };

  const obtenerReporte = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/reportes/patrocinadores', {
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
      <h1 className="text-2xl font-bold mb-4">Reporte de Patrocinadores</h1>

      <form onSubmit={obtenerReporte} className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label>Mínimo de eventos</label>
          <input type="number" name="minEventos" value={filtros.minEventos} onChange={handleChange} placeholder="Mín. eventos" className="border p-2 w-full" />
        </div>
        <div>
          <label>Monto entre</label>
          <input type="number" name="montoMin" value={filtros.montoMin} onChange={handleChange} placeholder="Monto mínimo" className="border p-2 w-full" />
          <input type="number" name="montoMax" value={filtros.montoMax} onChange={handleChange} placeholder="Monto máximo" className="border p-2 w-full" />
        </div>
        <div>
          <label>Tipo de Aporte</label>
          <select name="tipoAporte" value={filtros.tipoAporte} onChange={handleChange} className="border p-2 w-full">
            <option value="Económico">Económico</option>
            <option value="Especies">Especies</option>
            <option value="Servicios">Servicios</option>
            <option value="Mixto">Mixto</option>
          </select>
        </div>
        <div>
          <label>Fecha de acuerdo entre</label>
          <input type="date" name="desde" value={filtros.desde} onChange={handleChange} className="border p-2 w-full" />
          <input type="date" name="hasta" value={filtros.hasta} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label>Estado del patrocinador</label>
          <select name="estado" value={filtros.estado} onChange={handleChange} className="border p-2 w-full">
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        <div className="col-span-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Generar Reporte</button>
          {data.length > 0 && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => exportToPDF(
                  ['nombre_empresa', 'eventos_patrocinados', 'total_invertido', 'aporte_promedio'],
                  data,
                  'Reporte_Patrocinadores'
                )}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Exportar PDF
              </button>
              <button
                onClick={() => exportToExcel(
                  ['nombre_empresa', 'eventos_patrocinados', 'total_invertido', 'aporte_promedio'],
                  data,
                  'Reporte_Patrocinadores'
                )}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Exportar Excel
              </button>
            </div>
          )}
        </div>
      </form>

      {loading ? <p>Cargando reporte...</p> : <GraficaPatrocinadores data={data} />}
      
    </div>
  );
}