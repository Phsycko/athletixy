'use client'

import { Calendar, Clock, ChefHat, Plus } from 'lucide-react'

export default function DietasPage() {
  const dietaPlan = [
    {
      dia: 'Lunes',
      desayuno: { nombre: 'Avena con Proteína', calorias: 450, proteina: 30, carbs: 52, grasas: 12 },
      almuerzo: { nombre: 'Pollo con Arroz Integral', calorias: 680, proteina: 55, carbs: 68, grasas: 15 },
      cena: { nombre: 'Salmón con Vegetales', calorias: 520, proteina: 42, carbs: 28, grasas: 25 },
    },
    {
      dia: 'Martes',
      desayuno: { nombre: 'Huevos con Aguacate', calorias: 420, proteina: 28, carbs: 18, grasas: 28 },
      almuerzo: { nombre: 'Carne Magra con Quinoa', calorias: 720, proteina: 58, carbs: 65, grasas: 18 },
      cena: { nombre: 'Pechuga con Ensalada', calorias: 480, proteina: 48, carbs: 22, grasas: 18 },
    },
    {
      dia: 'Miércoles',
      desayuno: { nombre: 'Batido de Proteína', calorias: 380, proteina: 35, carbs: 42, grasas: 8 },
      almuerzo: { nombre: 'Atún con Pasta Integral', calorias: 650, proteina: 52, carbs: 72, grasas: 12 },
      cena: { nombre: 'Pescado al Horno', calorias: 440, proteina: 45, carbs: 18, grasas: 20 },
    },
  ]

  const macrosObjetivo = {
    calorias: 2800,
    proteina: 180,
    carbohidratos: 320,
    grasas: 80,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Dietas</h1>
          <p className="text-gray-400">Plan nutricional personalizado</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-lg transition shadow-lg">
          <Plus className="w-5 h-5" />
          Nueva Dieta
        </button>
      </div>

      {/* Macros Objetivo */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Objetivos Diarios</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
              <p className="text-gray-400 text-sm mb-1">Calorías</p>
              <p className="text-3xl font-bold text-orange-400">{macrosObjetivo.calorias}</p>
              <p className="text-gray-500 text-xs mt-1">kcal/día</p>
            </div>
          </div>
          <div>
            <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
              <p className="text-gray-400 text-sm mb-1">Proteína</p>
              <p className="text-3xl font-bold text-red-400">{macrosObjetivo.proteina}</p>
              <p className="text-gray-500 text-xs mt-1">g/día</p>
            </div>
          </div>
          <div>
            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
              <p className="text-gray-400 text-sm mb-1">Carbohidratos</p>
              <p className="text-3xl font-bold text-blue-400">{macrosObjetivo.carbohidratos}</p>
              <p className="text-gray-500 text-xs mt-1">g/día</p>
            </div>
          </div>
          <div>
            <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
              <p className="text-gray-400 text-sm mb-1">Grasas</p>
              <p className="text-3xl font-bold text-yellow-400">{macrosObjetivo.grasas}</p>
              <p className="text-gray-500 text-xs mt-1">g/día</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Semanal */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Plan Semanal</h2>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Semana del 4-10 Dic</span>
          </div>
        </div>

        <div className="space-y-6">
          {dietaPlan.map((dia, index) => (
            <div key={index} className="bg-dark-900 rounded-lg border border-dark-600 overflow-hidden">
              <div className="bg-white/10 px-6 py-3 border-b border-dark-600">
                <h3 className="text-white font-semibold">{dia.dia}</h3>
              </div>
              <div className="p-6 space-y-4">
                {/* Desayuno */}
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-500/10 p-2 rounded-lg mt-1">
                    <ChefHat className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400 text-sm font-medium">Desayuno</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        7:00 AM
                      </span>
                    </div>
                    <p className="text-white font-medium mb-2">{dia.desayuno.nombre}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="text-gray-400">{dia.desayuno.calorias} kcal</span>
                      <span className="text-red-400">P: {dia.desayuno.proteina}g</span>
                      <span className="text-blue-400">C: {dia.desayuno.carbs}g</span>
                      <span className="text-yellow-400">G: {dia.desayuno.grasas}g</span>
                    </div>
                  </div>
                </div>

                {/* Almuerzo */}
                <div className="flex items-start gap-4">
                  <div className="bg-orange-500/10 p-2 rounded-lg mt-1">
                    <ChefHat className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-orange-400 text-sm font-medium">Almuerzo</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        2:00 PM
                      </span>
                    </div>
                    <p className="text-white font-medium mb-2">{dia.almuerzo.nombre}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="text-gray-400">{dia.almuerzo.calorias} kcal</span>
                      <span className="text-red-400">P: {dia.almuerzo.proteina}g</span>
                      <span className="text-blue-400">C: {dia.almuerzo.carbs}g</span>
                      <span className="text-yellow-400">G: {dia.almuerzo.grasas}g</span>
                    </div>
                  </div>
                </div>

                {/* Cena */}
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/10 p-2 rounded-lg mt-1">
                    <ChefHat className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-purple-400 text-sm font-medium">Cena</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        8:00 PM
                      </span>
                    </div>
                    <p className="text-white font-medium mb-2">{dia.cena.nombre}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="text-gray-400">{dia.cena.calorias} kcal</span>
                      <span className="text-red-400">P: {dia.cena.proteina}g</span>
                      <span className="text-blue-400">C: {dia.cena.carbs}g</span>
                      <span className="text-yellow-400">G: {dia.cena.grasas}g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

