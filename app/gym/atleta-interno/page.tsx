'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Dumbbell, Target, Activity, Calendar } from 'lucide-react'

export default function AtletaInternoDashboard() {
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const session = localStorage.getItem("athletixy_session")
        if (session) {
          const data = JSON.parse(session)
          setUserData(data)
        }
      } catch (error) {
        console.error('Error cargando datos del usuario:', error)
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-zinc-100 mb-2">
          Bienvenido, {userData?.nombre || 'Atleta'}
        </h1>
        <p className="text-gray-500 dark:text-zinc-400">
          Panel de control del atleta interno
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-black dark:bg-zinc-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-white dark:text-zinc-900" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-zinc-100 mb-1">
            Entrenamientos
          </h3>
          <p className="text-2xl font-bold text-black dark:text-zinc-100">12</p>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Este mes</p>
        </div>

        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-black dark:bg-zinc-100 p-3 rounded-lg">
              <Target className="w-6 h-6 text-white dark:text-zinc-900" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-zinc-100 mb-1">
            Objetivos
          </h3>
          <p className="text-2xl font-bold text-black dark:text-zinc-100">5</p>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Activos</p>
        </div>

        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-black dark:bg-zinc-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white dark:text-zinc-900" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-zinc-100 mb-1">
            Progreso
          </h3>
          <p className="text-2xl font-bold text-black dark:text-zinc-100">+8%</p>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Este mes</p>
        </div>

        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-black dark:bg-zinc-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white dark:text-zinc-900" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-zinc-100 mb-1">
            Próxima Sesión
          </h3>
          <p className="text-2xl font-bold text-black dark:text-zinc-100">Hoy</p>
          <p className="text-sm text-gray-500 dark:text-zinc-400">15:00 hrs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-black dark:text-zinc-100 mb-4">
            Rutinas Asignadas
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg">
              <Dumbbell className="w-5 h-5 text-black dark:text-zinc-100" />
              <div className="flex-1">
                <p className="font-medium text-black dark:text-zinc-100">Rutina de Fuerza</p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Asignada por tu coach</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg">
              <Dumbbell className="w-5 h-5 text-black dark:text-zinc-100" />
              <div className="flex-1">
                <p className="font-medium text-black dark:text-zinc-100">Cardio Intensivo</p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Programada para esta semana</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-black dark:text-zinc-100 mb-4">
            Últimas Actividades
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg">
              <p className="font-medium text-black dark:text-zinc-100">Entrenamiento completado</p>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Hace 2 horas</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg">
              <p className="font-medium text-black dark:text-zinc-100">Nuevo mensaje del coach</p>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Hace 1 día</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
