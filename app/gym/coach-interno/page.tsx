'use client'

import { useState, useEffect } from 'react'
import { Users, TrendingUp, Activity, Target, Dumbbell, ClipboardList } from 'lucide-react'

export default function CoachInternoDashboardPage() {
  const [coachData, setCoachData] = useState<any>(null)
  const [atletasAsignados, setAtletasAsignados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const rawSession = localStorage.getItem('athletixy_session')
      if (!rawSession) {
        setLoading(false)
        return
      }

      const session = JSON.parse(rawSession)

      // 🔥 Ahora usamos el ID REAL del usuario
      const coachId = session.id
      if (!coachId) {
        console.warn("No se encontró ID del coach en la sesión.")
        setLoading(false)
        return
      }

      // Buscar en el almacenamiento local de coaches
      const rawCoaches = localStorage.getItem('gym_coaches_internos')
      if (rawCoaches) {
        const coaches = JSON.parse(rawCoaches)
        const coach = coaches.find((c: any) => c.id === coachId)

        if (coach) {
          setCoachData(coach)
          setAtletasAsignados(coach.atletas || [])
        }
      }

      setLoading(false)
    } catch (error) {
      console.error("Error cargando datos del coach interno:", error)
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Cargando panel...
      </div>
    )
  }

  const metricas = {
    totalAtletas: atletasAsignados.length,
    atletasActivos: atletasAsignados.filter((a: any) => a.activo).length,
    progresoPromedio:
      atletasAsignados.length > 0
        ? Math.round(
            atletasAsignados.reduce(
              (sum: number, a: any) => sum + (a.progreso || 0),
              0
            ) / atletasAsignados.length
          )
        : 0,
    rutinasCompletadas: atletasAsignados.reduce(
      (sum: number, a: any) => sum + (a.rutinasCompletadas || 0),
      0
    ),
    progresoPesosPromedio:
      atletasAsignados.length > 0
        ? Math.round(
            atletasAsignados.reduce(
              (sum: number, a: any) =>
                sum + (a.progresoDetallado?.pesos || 0),
              0
            ) / atletasAsignados.length
          )
        : 0,
    progresoEjerciciosPromedio:
      atletasAsignados.length > 0
        ? Math.round(
            atletasAsignados.reduce(
              (sum: number, a: any) =>
                sum + (a.progresoDetallado?.ejercicios || 0),
              0
            ) / atletasAsignados.length
          )
        : 0,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black mb-1">
          Mi Panel Personal
        </h1>
        <p className="text-gray-500">
          Bienvenido, {coachData?.nombre || 'Coach'}
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Atletas */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Atletas</p>
              <p className="text-2xl font-bold">{metricas.totalAtletas}</p>
            </div>
          </div>
        </div>

        {/* Atletas Activos */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500/10 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Atletas Activos</p>
              <p className="text-2xl font-bold">{metricas.atletasActivos}</p>
            </div>
          </div>
        </div>

        {/* Progreso Promedio */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Progreso Promedio</p>
              <p className="text-2xl font-bold">
                {metricas.progresoPromedio}%
              </p>
            </div>
          </div>
        </div>

        {/* Rutinas Completadas */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-500/10 p-3 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rutinas Completadas</p>
              <p className="text-2xl font-bold">
                {metricas.rutinasCompletadas}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progreso por Categorías */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6">
          Progreso por Categorías
        </h2>

        {atletasAsignados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              No hay atletas asignados
            </p>
            <p className="text-sm text-gray-400">
              El gimnasio te asignará atletas próximamente
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {atletasAsignados.map((atleta: any) => (
              <div
                key={atleta.id}
                className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-black">{atleta.nombre}</p>
                    <p className="text-xs text-gray-500">{atleta.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Progreso Total</p>
                    <p className="text-xl font-bold">
                      {atleta.progreso || 0}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Composición Corporal */}
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="font-medium text-blue-900">
                        Composición Corporal
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(
                        atleta.progresoDetallado?.composicion || 0
                      )}
                      %
                    </p>
                  </div>

                  {/* Aumento de Pesos */}
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-500/20 p-2 rounded-lg">
                        <Dumbbell className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="font-medium text-green-900">
                        Aumentar Pesos
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(
                        atleta.progresoDetallado?.pesos || 0
                      )}
                      %
                    </p>
                  </div>

                  {/* Dominio de Ejercicios */}
                  <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-purple-500/20 p-2 rounded-lg">
                        <ClipboardList className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="font-medium text-purple-900">
                        Dominio de Ejercicios
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(
                        atleta.progresoDetallado?.ejercicios || 0
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Atletas Asignados */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6">
          Mis Atletas Asignados
        </h2>

        {atletasAsignados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              No tienes atletas asignados
            </p>
            <p className="text-sm text-gray-400">
              El gimnasio te asignará atletas próximamente
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {atletasAsignados.map((atleta: any) => (
              <div
                key={atleta.id}
                className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{atleta.nombre}</p>
                    <p className="text-sm text-gray-500">{atleta.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Progreso</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-black h-2 rounded-full"
                          style={{ width: `${atleta.progreso || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {atleta.progreso || 0}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rutinas:</span>
                    <span className="font-medium">
                      {atleta.rutinasCompletadas || 0}
                    </span>
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