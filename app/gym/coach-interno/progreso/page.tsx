'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, BarChart3, Target, Dumbbell, ClipboardList } from 'lucide-react'

export default function CoachInternoProgresoPage() {
  const [atletasAsignados, setAtletasAsignados] = useState<any[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const session = localStorage.getItem('athletixy_session')
      if (!session) return
      
      const sessionData = JSON.parse(session)
      if (!sessionData.coachId) return

      const coachesInternos = localStorage.getItem('gym_coaches_internos')
      if (coachesInternos) {
        const coaches = JSON.parse(coachesInternos)
        const coach = coaches.find((c: any) => c.id === sessionData.coachId)
        if (coach) {
          setAtletasAsignados(coach.atletas || [])
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }, [])

  const progresoPromedio = atletasAsignados.length > 0
    ? Math.round(atletasAsignados.reduce((sum: number, a: any) => sum + (a.progreso || 0), 0) / atletasAsignados.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-1">Progreso de Mis Atletas</h1>
        <p className="text-gray-500 dark:text-zinc-500">Seguimiento del progreso de tus atletas asignados</p>
      </div>

      {/* Métricas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/10 dark:bg-blue-500/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Progreso Promedio</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-100">{progresoPromedio}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500/10 dark:bg-green-500/20 p-3 rounded-lg">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Total Rutinas</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-100">
                {atletasAsignados.reduce((sum: number, a: any) => sum + (a.rutinasCompletadas || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/10 dark:bg-purple-500/20 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Atletas Activos</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-100">
                {atletasAsignados.filter((a: any) => a.activo).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progreso Individual */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Progreso Individual por Categorías</h2>
        {atletasAsignados.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-zinc-500 text-lg">No hay atletas asignados</p>
          </div>
        ) : (
          <div className="space-y-6">
            {atletasAsignados.map((atleta: any) => (
              <div key={atleta.id} className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-bold text-black dark:text-zinc-100">{atleta.nombre}</p>
                    <p className="text-sm text-gray-500 dark:text-zinc-500">{atleta.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-zinc-500">Progreso Total</p>
                    <p className="text-2xl font-bold text-black dark:text-zinc-100">{atleta.progreso || 0}%</p>
                  </div>
                </div>
                
                {/* Barra de progreso total */}
                <div className="bg-gray-200 dark:bg-zinc-700 rounded-full h-3 mb-6">
                  <div 
                    className="bg-black dark:bg-zinc-100 h-3 rounded-full transition-all"
                    style={{ width: `${atleta.progreso || 0}%` }}
                  />
                </div>

                {/* Progreso por categorías */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-100">Composición</p>
                    </div>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {Math.round(atleta.progresoDetallado?.composicion || 0)}%
                    </p>
                    <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 dark:bg-blue-400 h-1.5 rounded-full"
                        style={{ width: `${atleta.progresoDetallado?.composicion || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Dumbbell className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <p className="text-xs font-medium text-green-900 dark:text-green-100">Aumentar Pesos</p>
                    </div>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {Math.round(atleta.progresoDetallado?.pesos || 0)}%
                    </p>
                    <div className="mt-2 bg-green-200 dark:bg-green-800 rounded-full h-1.5">
                      <div 
                        className="bg-green-600 dark:bg-green-400 h-1.5 rounded-full"
                        style={{ width: `${atleta.progresoDetallado?.pesos || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardList className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <p className="text-xs font-medium text-purple-900 dark:text-purple-100">Dominio Ejercicios</p>
                    </div>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {Math.round(atleta.progresoDetallado?.ejercicios || 0)}%
                    </p>
                    <div className="mt-2 bg-purple-200 dark:bg-purple-800 rounded-full h-1.5">
                      <div 
                        className="bg-purple-600 dark:bg-purple-400 h-1.5 rounded-full"
                        style={{ width: `${atleta.progresoDetallado?.ejercicios || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-600 dark:text-zinc-400 mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                  <span>Rutinas completadas: {atleta.rutinasCompletadas || 0}</span>
                  <span>Última actividad: {atleta.ultimaActividad || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

