'use client';

import { useState, useEffect } from 'react';
import GraficaEventos from '@/components/GraficaEventos';
import { exportToPDF, exportToExcel } from '@/lib/exportUtils';

export default function ReporteEventos() {
  const [filtros, setFiltros] = useState({
    minAsistentes: 10,
    minRecursos: 2,
    categoriaId: "",
    sedeId: "",
    desde: '2024-01-01',
    hasta: '2024-12-31',
  });

  const [categorias, setCategorias] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/categorias')
      .then(res => res.json())
      .then(setCategorias);
    fetch('/api/sedes')
      .then(res => res.json())
      .then(setSedes);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const obtenerReporte = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/reportes/eventos', {
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
      <h1 className="text-2xl font-bold mb-4">Eventos con Filtros Personalizados</h1>

      <form onSubmit={obtenerReporte} className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label>Mín. Asistentes</label>
          <input
            type="number"
            name="minAsistentes"
            value={filtros.minAsistentes}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Mín. Recursos</label>
          <input
            type="number"
            name="minRecursos"
            value={filtros.minRecursos}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Categoría</label>
          <select name="categoriaId" value={filtros.categoriaId} onChange={handleChange} className="border p-2 w-full">
            <option value="">Seleccione...</option>
              {categorias.map(c => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nombre}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label>Sede</label>
          <select name="sedeId" value={filtros.sedeId} onChange={handleChange} className="border p-2 w-full">
          <option value="">Seleccione...</option>
            {sedes.map(s => (
              <option key={s.id_sede} value={s.id_sede}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Desde</label>
          <input
            type="date"
            name="desde"
            value={filtros.desde}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Hasta</label>
          <input
            type="date"
            name="hasta"
            value={filtros.hasta}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Generar Reporte
          </button>
          {data.length > 0 && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => exportToPDF(
                  ['titulo', 'total_asistentes', 'recursos_utilizados'],
                  data,
                  'Reporte_Eventos'
                )}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Exportar PDF
              </button>
              <button
                onClick={() => exportToExcel(
                  ['titulo_evento', 'total_asistentes', 'recursos_utilizados'],
                  data,
                  'Reporte_Eventos'
                )}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Exportar Excel
              </button>
            </div>
          )}
        </div>
      </form>

      {loading ? <p>Cargando reporte...</p> : <GraficaEventos data={data} />}
    </div>
  );
}