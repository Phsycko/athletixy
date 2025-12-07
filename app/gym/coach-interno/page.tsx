'use client'

import { useState, useEffect } from 'react'
import { Users, TrendingUp, Activity, Target, Award, Dumbbell, ClipboardList } from 'lucide-react'

export default function CoachInternoDashboardPage() {
  const [coachData, setCoachData] = useState<any>(null)
  const [atletasAsignados, setAtletasAsignados] = useState<any[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const session = localStorage.getItem('athletixy_session')
      if (!session) return
      
      const sessionData = JSON.parse(session)
      if (!sessionData.coachId) return

      // Obtener datos del coach
      const coachesInternos = localStorage.getItem('gym_coaches_internos')
      if (coachesInternos) {
        const coaches = JSON.parse(coachesInternos)
        const coach = coaches.find((c: any) => c.id === sessionData.coachId)
        if (coach) {
          setCoachData(coach)
          setAtletasAsignados(coach.atletas || [])
        }
      }
    } catch (error) {
      console.error('Error loading coach data:', error)
    }
  }, [])

  const metricas = {
    totalAtletas: atletasAsignados.length,
    atletasActivos: atletasAsignados.filter((a: any) => a.activo).length,
    progresoPromedio: atletasAsignados.length > 0
      ? Math.round(atletasAsignados.reduce((sum: number, a: any) => sum + (a.progreso || 0), 0) / atletasAsignados.length)
      : 0,
    rutinasCompletadas: atletasAsignados.reduce((sum: number, a: any) => sum + (a.rutinasCompletadas || 0), 0),
    progresoPesosPromedio: atletasAsignados.length > 0
      ? Math.round(atletasAsignados.reduce((sum: number, a: any) => sum + (a.progresoDetallado?.pesos || 0), 0) / atletasAsignados.length)
      : 0,
    progresoEjerciciosPromedio: atletasAsignados.length > 0
      ? Math.round(atletasAsignados.reduce((sum: number, a: any) => sum + (a.progresoDetallado?.ejercicios || 0), 0) / atletasAsignados.length)
      : 0
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-1">Mi Panel Personal</h1>
        <p className="text-gray-500 dark:text-zinc-500">
          Bienvenido, {coachData?.nombre || 'Coach'}
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/10 dark:bg-blue-500/20 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Total Atletas</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-100">{metricas.totalAtletas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500/10 dark:bg-green-500/20 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Atletas Activos</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-100">{metricas.atletasActivos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/10 dark:bg-purple-500/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Progreso Promedio</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-100">{metricas.progresoPromedio}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-500/10 dark:bg-orange-500/20 p-3 rounded-lg">
              <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Rutinas Completadas</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-100">{metricas.rutinasCompletadas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progreso Detallado por Categorías - Personal por Atleta */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Progreso por Categorías</h2>
        {atletasAsignados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-zinc-500 text-lg mb-2">No hay atletas asignados</p>
            <p className="text-sm text-gray-400 dark:text-zinc-600">El gimnasio te asignará atletas próximamente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {atletasAsignados.map((atleta: any) => (
              <div key={atleta.id} className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-base font-bold text-black dark:text-zinc-100">{atleta.nombre}</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">{atleta.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-zinc-500">Progreso Total</p>
                    <p className="text-xl font-bold text-black dark:text-zinc-100">{atleta.progreso || 0}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-500/20 dark:bg-blue-500/30 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Composición Corporal</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {Math.round(atleta.progresoDetallado?.composicion || 0)}%
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Peso, grasa, masa muscular y medidas</p>
                    <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 dark:bg-blue-400 h-1.5 rounded-full"
                        style={{ width: `${atleta.progresoDetallado?.composicion || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-500/20 dark:bg-green-500/30 p-2 rounded-lg">
                        <Dumbbell className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">Aumentar Pesos</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.round(atleta.progresoDetallado?.pesos || 0)}%
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">Mejora en pesos levantados</p>
                    <div className="mt-2 bg-green-200 dark:bg-green-800 rounded-full h-1.5">
                      <div 
                        className="bg-green-600 dark:bg-green-400 h-1.5 rounded-full"
                        style={{ width: `${atleta.progresoDetallado?.pesos || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-purple-500/20 dark:bg-purple-500/30 p-2 rounded-lg">
                        <ClipboardList className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Dominio de Ejercicios</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {Math.round(atleta.progresoDetallado?.ejercicios || 0)}%
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Variedad y frecuencia de ejercicios</p>
                    <div className="mt-2 bg-purple-200 dark:bg-purple-800 rounded-full h-1.5">
                      <div 
                        className="bg-purple-600 dark:bg-purple-400 h-1.5 rounded-full"
                        style={{ width: `${atleta.progresoDetallado?.ejercicios || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Atletas Asignados */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Mis Atletas Asignados</h2>
        {atletasAsignados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-zinc-500 text-lg mb-2">No tienes atletas asignados</p>
            <p className="text-sm text-gray-400 dark:text-zinc-600">El gimnasio te asignará atletas próximamente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {atletasAsignados.map((atleta: any) => (
              <div key={atleta.id} className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-black dark:bg-zinc-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white dark:text-zinc-900" />
                  </div>
                  <div className="flex-1">
                    <p className="text-black dark:text-zinc-100 font-semibold">{atleta.nombre}</p>
                    <p className="text-sm text-gray-500 dark:text-zinc-500">{atleta.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Progreso</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                        <div 
                          className="bg-black dark:bg-zinc-100 h-2 rounded-full"
                          style={{ width: `${atleta.progreso || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-black dark:text-zinc-100">{atleta.progreso || 0}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-zinc-500">Rutinas:</span>
                    <span className="text-black dark:text-zinc-100 font-medium">{atleta.rutinasCompletadas || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

