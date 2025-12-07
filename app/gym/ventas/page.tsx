'use client'

import { useState } from 'react'
import { DollarSign, Plus, TrendingUp, BarChart3, ShoppingCart, Calendar, Filter } from 'lucide-react'

export default function VentasPage() {
  const [periodo, setPeriodo] = useState<'dia' | 'semana' | 'mes'>('mes')
  const [mostrarModalVenta, setMostrarModalVenta] = useState(false)

  const ventas: any[] = []

  const canalesVenta: any[] = []

  const kpis = {
    ingresosTotales: 0,
    ventasTotales: 0,
    promedioVenta: 0,
    crecimiento: 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-1">Ventas del Gimnasio</h1>
          <p className="text-gray-500 dark:text-zinc-500">Gestiona y monitorea todas las ventas</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMostrarModalVenta(true)}
            className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Registrar Venta
          </button>
          <div className="flex gap-2">
            {(['dia', 'semana', 'mes'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  periodo === p
                    ? 'bg-black dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-800'
                }`}
              >
                {p === 'dia' ? 'Día' : p === 'semana' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500/10 dark:bg-green-500/20 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Ingresos Totales</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-100">
                ${kpis.ingresosTotales.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/10 dark:bg-blue-500/20 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Ventas Totales</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-100">{kpis.ventasTotales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/10 dark:bg-purple-500/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Promedio por Venta</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-100">
                ${kpis.promedioVenta.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-500/10 dark:bg-orange-500/20 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Crecimiento</p>
              <p className="text-2xl font-bold text-gray-600 dark:text-zinc-400">{kpis.crecimiento}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rendimiento por Canal */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Rendimiento por Canal de Venta</h2>
        {canalesVenta.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-zinc-500">No hay datos de canales de venta</p>
          </div>
        ) : (
          <div className="space-y-4">
            {canalesVenta.map((canal, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-black dark:text-zinc-100 font-medium">{canal.nombre}</span>
                    <span className="text-sm text-gray-500 dark:text-zinc-500">
                      {canal.ventas} ventas • ${canal.ingresos.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-black dark:text-zinc-100">{canal.porcentaje}%</span>
                </div>
                <div className="bg-gray-200 dark:bg-zinc-800 rounded-full h-3">
                  <div 
                    className="bg-black dark:bg-zinc-100 h-3 rounded-full transition-all"
                    style={{ width: `${canal.porcentaje}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista de Ventas Recientes */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Ventas Recientes</h2>
        {ventas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-zinc-500">No hay ventas registradas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ventas.map((venta) => (
            <div key={venta.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-4">
                <div className="bg-green-500/10 dark:bg-green-500/20 p-3 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-black dark:text-zinc-100 font-medium">{venta.atleta}</p>
                  <p className="text-sm text-gray-500 dark:text-zinc-500">
                    {venta.tipo} • {venta.canal} • {venta.fecha}
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                ${venta.monto.toLocaleString()}
              </p>
            </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Registrar Venta */}
      {mostrarModalVenta && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full mx-4 border-2 border-gray-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-black dark:text-zinc-100 mb-4">Registrar Nueva Venta</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Atleta</label>
                <input
                  type="text"
                  placeholder="Nombre del atleta"
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Tipo</label>
                <select className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100">
                  <option>Suscripción</option>
                  <option>Venta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Canal</label>
                <select className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100">
                  <option>Presencial</option>
                  <option>Online</option>
                  <option>Marketplace</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Monto</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setMostrarModalVenta(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setMostrarModalVenta(false)}
                  className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

