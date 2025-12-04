'use client'

import { Dumbbell, Clock, Target, Plus, TrendingUp } from 'lucide-react'

export default function RutinasPage() {
  const rutinaSemanal = [
    {
      dia: 'Lunes',
      grupo: 'Pecho y Tríceps',
      ejercicios: [
        { nombre: 'Press de Banca', series: 4, reps: '8-10', peso: '80 kg' },
        { nombre: 'Press Inclinado', series: 3, reps: '10-12', peso: '65 kg' },
        { nombre: 'Fondos', series: 3, reps: '12-15', peso: 'Corporal' },
        { nombre: 'Extensión de Tríceps', series: 3, reps: '12-15', peso: '30 kg' },
      ],
      duracion: '60 min',
    },
    {
      dia: 'Martes',
      grupo: 'Espalda y Bíceps',
      ejercicios: [
        { nombre: 'Peso Muerto', series: 4, reps: '6-8', peso: '120 kg' },
        { nombre: 'Dominadas', series: 4, reps: '8-10', peso: 'Corporal' },
        { nombre: 'Remo con Barra', series: 3, reps: '10-12', peso: '70 kg' },
        { nombre: 'Curl con Barra', series: 3, reps: '10-12', peso: '35 kg' },
      ],
      duracion: '65 min',
    },
    {
      dia: 'Miércoles',
      grupo: 'Descanso Activo',
      ejercicios: [
        { nombre: 'Cardio Ligero', series: 1, reps: '30 min', peso: '-' },
        { nombre: 'Estiramiento', series: 1, reps: '20 min', peso: '-' },
      ],
      duracion: '50 min',
    },
    {
      dia: 'Jueves',
      grupo: 'Pierna',
      ejercicios: [
        { nombre: 'Sentadilla', series: 4, reps: '8-10', peso: '100 kg' },
        { nombre: 'Prensa', series: 4, reps: '10-12', peso: '180 kg' },
        { nombre: 'Curl Femoral', series: 3, reps: '12-15', peso: '50 kg' },
        { nombre: 'Elevación de Gemelos', series: 4, reps: '15-20', peso: '80 kg' },
      ],
      duracion: '70 min',
    },
    {
      dia: 'Viernes',
      grupo: 'Hombro y Core',
      ejercicios: [
        { nombre: 'Press Militar', series: 4, reps: '8-10', peso: '55 kg' },
        { nombre: 'Elevaciones Laterales', series: 3, reps: '12-15', peso: '15 kg' },
        { nombre: 'Plancha', series: 3, reps: '60 seg', peso: 'Corporal' },
        { nombre: 'Abdominales', series: 3, reps: '20', peso: 'Corporal' },
      ],
      duracion: '55 min',
    },
  ]

  const statsProgreso = [
    { label: 'Entrenamientos', valor: '18', meta: '/ 20', color: 'text-blue-400' },
    { label: 'Volumen Total', valor: '45.2', meta: 'toneladas', color: 'text-green-400' },
    { label: 'Tiempo Total', valor: '22.5', meta: 'horas', color: 'text-purple-400' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Rutinas</h1>
          <p className="text-gray-400">Plan de entrenamiento estructurado</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition shadow-lg">
          <Plus className="w-5 h-5" />
          Nueva Rutina
        </button>
      </div>

      {/* Stats de Progreso */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statsProgreso.map((stat, index) => (
          <div key={index} className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-600/10 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary-400" />
              </div>
              <span className="text-gray-400 text-sm">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.valor}</span>
              <span className="text-gray-500 text-sm">{stat.meta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rutina Semanal */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Plan Semanal</h2>
        <div className="space-y-6">
          {rutinaSemanal.map((dia, index) => (
            <div key={index} className="bg-dark-900 rounded-lg border border-dark-600 overflow-hidden">
              <div className="bg-primary-600/10 px-6 py-4 border-b border-dark-600 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg">{dia.dia}</h3>
                  <p className="text-primary-400 text-sm mt-1">{dia.grupo}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{dia.duracion}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dia.ejercicios.map((ejercicio, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-dark-800 rounded-lg border border-dark-600 hover:border-primary-600 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary-600/20 w-10 h-10 rounded-lg flex items-center justify-center">
                          <Dumbbell className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{ejercicio.nombre}</p>
                          <p className="text-gray-500 text-sm">
                            {ejercicio.series} series × {ejercicio.reps} reps
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-500" />
                          <span className="text-primary-400 font-semibold">{ejercicio.peso}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

