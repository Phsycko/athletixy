'use client'

import { useState } from 'react'
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react'

export default function GymDashboardPage() {
  const [periodo, setPeriodo] = useState<'dia' | 'semana' | 'mes'>('mes')

  // Datos vacíos - en producción vendrían de una API
  const metricas = {
    ingresosMes: 0,
    ingresosDia: 0,
    nuevasSuscripciones: 0,
    suscripcionesActivas: 0,
    suscripcionesPorVencer: 0,
    retencion: 0,
    numeroAtletas: 0,
    crecimiento: 0
  }

  const ingresosRecientes: any[] = []

  const suscripcionesProximas: any[] = []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-1">Dashboard del Gimnasio</h1>
          <p className="text-gray-500 dark:text-zinc-500">Resumen general de tu gimnasio</p>
        </div>
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

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/10 dark:bg-green-500/20 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium">
              0%
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-zinc-400 text-sm font-medium mb-1">Ingresos del Mes</h3>
          <p className="text-2xl font-bold text-black dark:text-zinc-100">
            ${metricas.ingresosMes.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500/10 dark:bg-blue-500/20 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium">
              0
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-zinc-400 text-sm font-medium mb-1">Atletas Activos</h3>
          <p className="text-2xl font-bold text-black dark:text-zinc-100">{metricas.numeroAtletas}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500/10 dark:bg-purple-500/20 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium">
              0
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-zinc-400 text-sm font-medium mb-1">Suscripciones Activas</h3>
          <p className="text-2xl font-bold text-black dark:text-zinc-100">{metricas.suscripcionesActivas}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500/10 dark:bg-orange-500/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium">
              0%
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-zinc-400 text-sm font-medium mb-1">Retención</h3>
          <p className="text-2xl font-bold text-black dark:text-zinc-100">{metricas.retencion}%</p>
        </div>
      </div>

      {/* Métricas Secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500/10 dark:bg-green-500/20 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-gray-600 dark:text-zinc-400 text-sm font-medium">Ingresos Diarios</h3>
          </div>
          <p className="text-3xl font-bold text-black dark:text-zinc-100">
            ${metricas.ingresosDia.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/10 dark:bg-blue-500/20 p-2 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-gray-600 dark:text-zinc-400 text-sm font-medium">Nuevas Suscripciones</h3>
          </div>
          <p className="text-3xl font-bold text-black dark:text-zinc-100">{metricas.nuevasSuscripciones}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-500/10 dark:bg-yellow-500/20 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-gray-600 dark:text-zinc-400 text-sm font-medium">Por Vencer</h3>
          </div>
          <p className="text-3xl font-bold text-black dark:text-zinc-100">{metricas.suscripcionesPorVencer}</p>
        </div>
      </div>

      {/* Gráfico de Crecimiento y Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Crecimiento */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Crecimiento de Suscripciones</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7].map((index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-xs text-gray-500 dark:text-zinc-500 w-12">Sem {index}</span>
                <div className="flex-1 bg-gray-200 dark:bg-zinc-800 rounded-full h-4 relative overflow-hidden">
                  <div 
                    className="bg-black dark:bg-zinc-100 h-full rounded-full transition-all"
                    style={{ width: '0%' }}
                  />
                </div>
                <span className="text-xs font-medium text-black dark:text-zinc-100 w-12 text-right">0%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ingresos Recientes */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Ingresos Recientes</h2>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-zinc-500">No hay ingresos recientes</p>
          </div>
        </div>
      </div>

      {/* Suscripciones Próximas a Vencer */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100">Suscripciones Próximas a Vencer</h2>
          <button className="text-sm text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-100">
            Ver todas
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-zinc-500">No hay suscripciones próximas a vencer</p>
        </div>
      </div>
    </div>
  )
}

