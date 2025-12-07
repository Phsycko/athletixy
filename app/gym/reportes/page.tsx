'use client'

import { useState } from 'react'
import { FileText, Download, Calendar, BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'

export default function ReportesPage() {
  const [tipoReporte, setTipoReporte] = useState<'mensual' | 'actividad' | 'retencion' | 'ingresos'>('mensual')
  const [periodo, setPeriodo] = useState('2025-12')

  const reportes: any[] = []

  const metricasReporte = {
    ingresosTotales: 0,
    nuevasSuscripciones: 0,
    atletasActivos: 0,
    retencion: 0,
    crecimiento: 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-1">Reportes</h1>
          <p className="text-gray-500 dark:text-zinc-500">Genera y descarga reportes detallados</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium">
          <FileText className="w-5 h-5" />
          Generar Nuevo Reporte
        </button>
      </div>

      {/* Selector de Tipo de Reporte */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-4">Tipo de Reporte</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {([
            { id: 'mensual', label: 'Mensual', icon: Calendar },
            { id: 'actividad', label: 'Actividad', icon: Users },
            { id: 'retencion', label: 'Retención', icon: TrendingUp },
            { id: 'ingresos', label: 'Ingresos', icon: DollarSign },
          ] as const).map((tipo) => {
            const Icon = tipo.icon
            return (
              <button
                key={tipo.id}
                onClick={() => setTipoReporte(tipo.id)}
                className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                  tipoReporte === tipo.id
                    ? 'border-black dark:border-zinc-100 bg-gray-100 dark:bg-zinc-800'
                    : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                }`}
              >
                <Icon className={`w-6 h-6 ${tipoReporte === tipo.id ? 'text-black dark:text-zinc-100' : 'text-gray-400'}`} />
                <span className={`font-medium text-sm ${tipoReporte === tipo.id ? 'text-black dark:text-zinc-100' : 'text-gray-600 dark:text-zinc-400'}`}>
                  {tipo.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Vista Previa del Reporte */}
      {tipoReporte === 'mensual' && (
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Vista Previa - Reporte Mensual</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Ingresos Totales</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-100">
                ${metricasReporte.ingresosTotales.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Nuevas Suscripciones</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-100">{metricasReporte.nuevasSuscripciones}</p>
            </div>
            <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Atletas Activos</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-100">{metricasReporte.atletasActivos}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium">
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium">
              <Download className="w-4 h-4" />
              Descargar Excel
            </button>
          </div>
        </div>
      )}

      {/* Reportes Generados */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Reportes Generados</h2>
        {reportes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-zinc-500">No hay reportes generados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reportes.map((reporte) => (
            <div key={reporte.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 dark:bg-blue-500/20 p-3 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-black dark:text-zinc-100 font-medium">{reporte.nombre}</p>
                  <p className="text-sm text-gray-500 dark:text-zinc-500">
                    Generado: {reporte.fecha} • {reporte.tamaño}
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium text-sm">
                <Download className="w-4 h-4" />
                Descargar
              </button>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

