'use client'

import { useState } from 'react'
import { Calendar, Clock, ChefHat, Plus, X } from 'lucide-react'

type Comida = {
  nombre: string
  calorias: number
  proteina: number
  carbs: number
  grasas: number
}

type DiaPlan = {
  dia: string
  desayuno: Comida
  almuerzo: Comida
  cena: Comida
}

export default function DietasPage() {
  const [dietaPlan, setDietaPlan] = useState<DiaPlan[]>([
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
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nuevaDieta, setNuevaDieta] = useState<DiaPlan>({
    dia: '',
    desayuno: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
    almuerzo: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
    cena: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
  })

  const macrosObjetivo = {
    calorias: 2800,
    proteina: 180,
    carbohidratos: 320,
    grasas: 80,
  }

  const handleAgregarDieta = () => {
    if (nuevaDieta.dia && nuevaDieta.desayuno.nombre && nuevaDieta.almuerzo.nombre && nuevaDieta.cena.nombre) {
      setDietaPlan([...dietaPlan, nuevaDieta])
      setIsModalOpen(false)
      // Reset form
      setNuevaDieta({
        dia: '',
        desayuno: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
        almuerzo: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
        cena: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
      })
    } else {
      alert('Por favor completa todos los campos')
    }
  }

  const updateComida = (tipo: 'desayuno' | 'almuerzo' | 'cena', campo: string, valor: string | number) => {
    setNuevaDieta({
      ...nuevaDieta,
      [tipo]: {
        ...nuevaDieta[tipo],
        [campo]: valor
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black mb-2">Dietas</h1>
          <p className="text-gray-600">Plan nutricional personalizado</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nueva Dieta
        </button>
      </div>

      {/* Macros Objetivo */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black mb-6">Objetivos Diarios</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
              <p className="text-gray-600 text-sm mb-1">Calorías</p>
              <p className="text-3xl font-bold text-orange-400">{macrosObjetivo.calorias}</p>
              <p className="text-gray-600 text-xs mt-1">kcal/día</p>
            </div>
          </div>
          <div>
            <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
              <p className="text-gray-600 text-sm mb-1">Proteína</p>
              <p className="text-3xl font-bold text-red-400">{macrosObjetivo.proteina}</p>
              <p className="text-gray-600 text-xs mt-1">g/día</p>
            </div>
          </div>
          <div>
            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
              <p className="text-gray-600 text-sm mb-1">Carbohidratos</p>
              <p className="text-3xl font-bold text-blue-400">{macrosObjetivo.carbohidratos}</p>
              <p className="text-gray-600 text-xs mt-1">g/día</p>
            </div>
          </div>
          <div>
            <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
              <p className="text-gray-600 text-sm mb-1">Grasas</p>
              <p className="text-3xl font-bold text-yellow-400">{macrosObjetivo.grasas}</p>
              <p className="text-gray-600 text-xs mt-1">g/día</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Semanal */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-black">Plan Semanal</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Semana del 4-10 Dic</span>
          </div>
        </div>

        <div className="space-y-6">
          {dietaPlan.map((dia, index) => (
            <div key={index} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                <h3 className="text-black font-semibold">{dia.dia}</h3>
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
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        7:00 AM
                      </span>
                    </div>
                    <p className="text-black font-medium mb-2">{dia.desayuno.nombre}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="text-gray-600">{dia.desayuno.calorias} kcal</span>
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
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        2:00 PM
                      </span>
                    </div>
                    <p className="text-black font-medium mb-2">{dia.almuerzo.nombre}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="text-gray-600">{dia.almuerzo.calorias} kcal</span>
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
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        8:00 PM
                      </span>
                    </div>
                    <p className="text-black font-medium mb-2">{dia.cena.nombre}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="text-gray-600">{dia.cena.calorias} kcal</span>
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

      {/* Modal Nueva Dieta */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Nueva Dieta</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Día de la semana */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Día de la semana
                </label>
                <input
                  type="text"
                  placeholder="Ej: Jueves, Viernes..."
                  value={nuevaDieta.dia}
                  onChange={(e) => setNuevaDieta({...nuevaDieta, dia: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Desayuno */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-600 mb-4">Desayuno</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del plato</label>
                    <input
                      type="text"
                      placeholder="Ej: Avena con frutas"
                      value={nuevaDieta.desayuno.nombre}
                      onChange={(e) => updateComida('desayuno', 'nombre', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calorías</label>
                    <input
                      type="number"
                      placeholder="450"
                      value={nuevaDieta.desayuno.calorias || ''}
                      onChange={(e) => updateComida('desayuno', 'calorias', Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proteína (g)</label>
                    <input
                      type="number"
                      placeholder="30"
                      value={nuevaDieta.desayuno.proteina || ''}
                      onChange={(e) => updateComida('desayuno', 'proteina', Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Carbohidratos (g)</label>
                    <input
                      type="number"
                      placeholder="52"
                      value={nuevaDieta.desayuno.carbs || ''}
                      onChange={(e) => updateComida('desayuno', 'carbs', Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grasas (g)</label>
                    <input
                      type="number"
                      placeholder="12"
                      value={nuevaDieta.desayuno.grasas || ''}
                      onChange={(e) => updateComida('desayuno', 'grasas', Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
              </div>

              {/* Almuerzo */}
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-600 mb-4">Almuerzo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del plato</label>
                    <input
                      type="text"
                      placeholder="Ej: Pollo con arroz"
                      value={nuevaDieta.almuerzo.nombre}
                      onChange={(e) => updateComida('almuerzo', 'nombre', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calorías</label>
                    <input
                      type="number"
                      placeholder="680"
                      value={nuevaDieta.almuerzo.calorias || ''}
                      onChange={(e) => updateComida('almuerzo', 'calorias', Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proteína (g)</label>
                    <input
                      type="number"
                      placeholder="55"
                      value={nuevaDieta.almuerzo.proteina || ''}
                      onChange={(e) => updateComida('almuerzo', 'proteina', Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Carbohidratos (g)</label>
                    <input
                      type="number"
                      placeholder="68"
                      value={nuevaDieta.almuerzo.carbs || ''}
                      onChange={(e) => updateComida('almuerzo', 'carbs', Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grasas (g)</label>
                    <input
                      type="number"
                      placeholder="15"
                      value={nuevaDieta.almuerzo.grasas || ''}
                      onChange={(e) => updateComida('almuerzo', 'grasas', Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Cena */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-600 mb-4">Cena</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del plato</label>
                    <input
                      type="text"
                      placeholder="Ej: Salmón con vegetales"
                      value={nuevaDieta.cena.nombre}
                      onChange={(e) => updateComida('cena', 'nombre', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calorías</label>
                    <input
                      type="number"
                      placeholder="520"
                      value={nuevaDieta.cena.calorias || ''}
                      onChange={(e) => updateComida('cena', 'calorias', Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proteína (g)</label>
                    <input
                      type="number"
                      placeholder="42"
                      value={nuevaDieta.cena.proteina || ''}
                      onChange={(e) => updateComida('cena', 'proteina', Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Carbohidratos (g)</label>
                    <input
                      type="number"
                      placeholder="28"
                      value={nuevaDieta.cena.carbs || ''}
                      onChange={(e) => updateComida('cena', 'carbs', Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grasas (g)</label>
                    <input
                      type="number"
                      placeholder="25"
                      value={nuevaDieta.cena.grasas || ''}
                      onChange={(e) => updateComida('cena', 'grasas', Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAgregarDieta}
                  className="flex-1 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium shadow-lg"
                >
                  Agregar Dieta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
