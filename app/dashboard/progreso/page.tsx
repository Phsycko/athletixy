'use client'

import { TrendingUp, Scale, Ruler, Activity, Calendar } from 'lucide-react'

export default function ProgresoPage() {
  const mediciones = [
    { fecha: '2025-12-04', peso: 75.2, grasa: 14.5, musculo: 38.2, agua: 62.5 },
    { fecha: '2025-11-27', peso: 75.8, grasa: 15.1, musculo: 37.8, agua: 62.1 },
    { fecha: '2025-11-20', peso: 76.3, grasa: 15.8, musculo: 37.5, agua: 61.8 },
    { fecha: '2025-11-13', peso: 76.9, grasa: 16.3, musculo: 37.2, agua: 61.5 },
    { fecha: '2025-11-06', peso: 77.5, grasa: 16.9, musculo: 36.9, agua: 61.2 },
  ]

  const medicionesCorporales = [
    { parte: 'Pecho', medida: 105, cambio: '+2.5', tendencia: 'up' },
    { parte: 'Cintura', medida: 82, cambio: '-3.0', tendencia: 'down' },
    { parte: 'Brazos', medida: 38, cambio: '+1.5', tendencia: 'up' },
    { parte: 'Piernas', medida: 58, cambio: '+2.0', tendencia: 'up' },
    { parte: 'Cadera', medida: 98, cambio: '-1.5', tendencia: 'down' },
  ]

  const objetivos = [
    { nombre: 'Peso Objetivo', actual: 75.2, meta: 73.0, unidad: 'kg', progreso: 68 },
    { nombre: 'Grasa Corporal', actual: 14.5, meta: 12.0, unidad: '%', progreso: 72 },
    { nombre: 'Masa Muscular', actual: 38.2, meta: 40.0, unidad: 'kg', progreso: 45 },
  ]

  const rendimiento = [
    { ejercicio: 'Press de Banca', inicial: 70, actual: 80, mejora: '+14.3%' },
    { ejercicio: 'Sentadilla', inicial: 85, actual: 100, mejora: '+17.6%' },
    { ejercicio: 'Peso Muerto', inicial: 100, actual: 120, mejora: '+20.0%' },
    { ejercicio: 'Dominadas', inicial: 8, actual: 12, mejora: '+50.0%' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Progreso</h1>
        <p className="text-gray-400">Seguimiento detallado de tu evolución</p>
      </div>

      {/* Resumen Actual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-800 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500/10 p-2 rounded-lg">
              <Scale className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-gray-400 text-sm">Peso</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mediciones[0].peso}</p>
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>-0.6 kg</span>
          </div>
        </div>

        <div className="bg-dark-800 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-gray-400 text-sm">Grasa</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mediciones[0].grasa}%</p>
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>-2.4%</span>
          </div>
        </div>

        <div className="bg-dark-800 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/10 p-2 rounded-lg">
              <Ruler className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-gray-400 text-sm">Músculo</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mediciones[0].musculo}</p>
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+1.3 kg</span>
          </div>
        </div>

        <div className="bg-dark-800 border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-cyan-500/10 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-gray-400 text-sm">Agua</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mediciones[0].agua}%</p>
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+1.3%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Historial de Mediciones */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Historial de Mediciones</h2>
          <div className="space-y-4">
            {mediciones.map((med, index) => (
              <div
                key={index}
                className="p-4 bg-dark-900 rounded-lg border border-dark-600"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400 text-sm">{med.fecha}</span>
                </div>
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Peso</p>
                    <p className="text-white font-semibold">{med.peso} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Grasa</p>
                    <p className="text-blue-400 font-semibold">{med.grasa}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Músculo</p>
                    <p className="text-purple-400 font-semibold">{med.musculo} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Agua</p>
                    <p className="text-cyan-400 font-semibold">{med.agua}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mediciones Corporales */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Mediciones Corporales (cm)</h2>
          <div className="space-y-4">
            {medicionesCorporales.map((medicion, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-dark-900 rounded-lg border border-dark-600"
              >
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-gray-500" />
                  <span className="text-white font-medium">{medicion.parte}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white">{medicion.medida}</span>
                  <span
                    className={`text-sm font-medium ${
                      medicion.tendencia === 'up' ? 'text-green-400' : 'text-orange-400'
                    }`}
                  >
                    {medicion.cambio} cm
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Objetivos */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Objetivos</h2>
        <div className="space-y-6">
          {objetivos.map((objetivo, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{objetivo.nombre}</span>
                <span className="text-gray-400 text-sm">
                  {objetivo.actual} {objetivo.unidad} / {objetivo.meta} {objetivo.unidad}
                </span>
              </div>
              <div className="w-full bg-dark-900 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-600 to-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${objetivo.progreso}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rendimiento en Ejercicios */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Rendimiento en Ejercicios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rendimiento.map((ejercicio, index) => (
            <div
              key={index}
              className="p-4 bg-dark-900 rounded-lg border border-dark-600"
            >
              <p className="text-white font-medium mb-3">{ejercicio.ejercicio}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Inicial</span>
                <span className="text-gray-300">{ejercicio.inicial} kg</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Actual</span>
                <span className="text-white font-semibold">{ejercicio.actual} kg</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-dark-600">
                <span className="text-gray-400 text-sm">Mejora</span>
                <span className="text-green-400 font-semibold">{ejercicio.mejora}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

