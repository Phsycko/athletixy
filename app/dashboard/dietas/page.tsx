'use client'

import { useState } from 'react'
import { Calendar, Clock, ChefHat, Plus, X, Sparkles, Target, Activity, User, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

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

type DatosUsuario = {
  peso: number
  altura: number
  edad: number
  sexo: 'masculino' | 'femenino'
  objetivo: 'perder' | 'mantener' | 'ganar'
  nivelActividad: 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'atleta'
  caloriasObjetivo: number
  proteinaObjetivo: number
  carbsObjetivo: number
  grasasObjetivo: number
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
  const [modoCreacion, setModoCreacion] = useState<'manual' | 'ia'>('manual')
  const [generandoIA, setGenerandoIA] = useState(false)
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [dietaAEliminar, setDietaAEliminar] = useState<number | null>(null)
  const [fechaInicio, setFechaInicio] = useState<Date>(() => {
    const hoy = new Date()
    const dia = hoy.getDay()
    const diff = hoy.getDate() - dia + (dia === 0 ? -6 : 1)
    return new Date(hoy.getFullYear(), hoy.getMonth(), diff)
  })
  const [fechaFin, setFechaFin] = useState<Date>(() => {
    const hoy = new Date()
    const dia = hoy.getDay()
    const diff = hoy.getDate() - dia + (dia === 0 ? -6 : 1)
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), diff)
    const fin = new Date(inicio)
    fin.setDate(inicio.getDate() + 6)
    return fin
  })
  const [calendarioOpen, setCalendarioOpen] = useState(false)
  const [mesCalendario, setMesCalendario] = useState(new Date())
  const [seleccionandoRango, setSeleccionandoRango] = useState<'inicio' | 'fin'>('inicio')
  
  const [nuevaDieta, setNuevaDieta] = useState<DiaPlan>({
    dia: '',
    desayuno: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
    almuerzo: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
    cena: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
  })

  const [datosUsuario, setDatosUsuario] = useState<DatosUsuario>({
    peso: 75,
    altura: 175,
    edad: 28,
    sexo: 'masculino',
    objetivo: 'mantener',
    nivelActividad: 'moderado',
    caloriasObjetivo: 2800,
    proteinaObjetivo: 180,
    carbsObjetivo: 320,
    grasasObjetivo: 80,
  })

  const macrosObjetivo = {
    calorias: 2800,
    proteina: 180,
    carbohidratos: 320,
    grasas: 80,
  }

  const handleAgregarDieta = () => {
    if (nuevaDieta.dia && nuevaDieta.desayuno.nombre && nuevaDieta.almuerzo.nombre && nuevaDieta.cena.nombre) {
      if (editandoIndex !== null) {
        // Editar dieta existente
        const nuevoPlan = [...dietaPlan]
        nuevoPlan[editandoIndex] = nuevaDieta
        setDietaPlan(nuevoPlan)
        setEditandoIndex(null)
      } else {
        // Agregar nueva dieta
        setDietaPlan([...dietaPlan, nuevaDieta])
      }
      setIsModalOpen(false)
      resetForm()
    } else {
      alert('Por favor completa todos los campos')
    }
  }

  const handleEditarDieta = (index: number) => {
    setEditandoIndex(index)
    setNuevaDieta(dietaPlan[index])
    setModoCreacion('manual')
    setIsModalOpen(true)
  }

  const handleEliminarDieta = (index: number) => {
    setDietaAEliminar(index)
    setConfirmDeleteOpen(true)
  }

  const confirmarEliminacion = () => {
    if (dietaAEliminar !== null) {
      const nuevoPlan = dietaPlan.filter((_, i) => i !== dietaAEliminar)
      setDietaPlan(nuevoPlan)
      setConfirmDeleteOpen(false)
      setDietaAEliminar(null)
    }
  }

  const cancelarEliminacion = () => {
    setConfirmDeleteOpen(false)
    setDietaAEliminar(null)
  }

  const formatoFecha = (d: Date) => {
    return `${d.getDate()} ${['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][d.getMonth()]}`
  }

  const obtenerRangoSemana = () => {
    return `${formatoFecha(fechaInicio)} - ${formatoFecha(fechaFin)}`
  }

  const cambiarPeriodo = (direccion: 'anterior' | 'siguiente') => {
    const dias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const nuevaInicio = new Date(fechaInicio)
    const nuevaFin = new Date(fechaFin)
    
    if (direccion === 'anterior') {
      nuevaInicio.setDate(nuevaInicio.getDate() - dias)
      nuevaFin.setDate(nuevaFin.getDate() - dias)
    } else {
      nuevaInicio.setDate(nuevaInicio.getDate() + dias)
      nuevaFin.setDate(nuevaFin.getDate() + dias)
    }
    
    setFechaInicio(nuevaInicio)
    setFechaFin(nuevaFin)
  }

  const irAHoy = () => {
    const hoy = new Date()
    const dia = hoy.getDay()
    const diff = hoy.getDate() - dia + (dia === 0 ? -6 : 1)
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), diff)
    const fin = new Date(inicio)
    fin.setDate(inicio.getDate() + 6)
    setFechaInicio(inicio)
    setFechaFin(fin)
  }

  const getDiasDelMes = (fecha: Date) => {
    const año = fecha.getFullYear()
    const mes = fecha.getMonth()
    const primerDia = new Date(año, mes, 1)
    const ultimoDia = new Date(año, mes + 1, 0)
    
    const dias: Date[] = []
    const diaInicio = primerDia.getDay()
    const diasAnteriores = diaInicio === 0 ? 6 : diaInicio - 1
    
    for (let i = diasAnteriores; i > 0; i--) {
      const dia = new Date(año, mes, 1 - i)
      dias.push(dia)
    }
    
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      dias.push(new Date(año, mes, i))
    }
    
    const diasRestantes = 42 - dias.length
    for (let i = 1; i <= diasRestantes; i++) {
      dias.push(new Date(año, mes + 1, i))
    }
    
    return dias
  }

  const seleccionarDia = (dia: Date) => {
    if (seleccionandoRango === 'inicio') {
      setFechaInicio(dia)
      setSeleccionandoRango('fin')
    } else {
      if (dia >= fechaInicio) {
        setFechaFin(dia)
        setCalendarioOpen(false)
        setSeleccionandoRango('inicio')
      } else {
        setFechaInicio(dia)
      }
    }
  }

  const estaEnRango = (dia: Date) => {
    return dia >= fechaInicio && dia <= fechaFin
  }

  const esMismoDia = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear()
  }

  const resetForm = () => {
    setNuevaDieta({
      dia: '',
      desayuno: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
      almuerzo: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
      cena: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
    })
    setEditandoIndex(null)
  }

  const generarDietaConIA = async () => {
    setGenerandoIA(true)
    
    // Simulación de llamada a API de IA (aquí integrarías OpenAI, Claude, etc.)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generación simulada basada en los datos del usuario
    const dietaGenerada: DiaPlan = {
      dia: 'Jueves (Generado por IA)',
      desayuno: {
        nombre: generarNombrePlato(datosUsuario.objetivo, 'desayuno'),
        calorias: Math.round(datosUsuario.caloriasObjetivo * 0.3),
        proteina: Math.round(datosUsuario.proteinaObjetivo * 0.3),
        carbs: Math.round(datosUsuario.carbsObjetivo * 0.35),
        grasas: Math.round(datosUsuario.grasasObjetivo * 0.25),
      },
      almuerzo: {
        nombre: generarNombrePlato(datosUsuario.objetivo, 'almuerzo'),
        calorias: Math.round(datosUsuario.caloriasObjetivo * 0.45),
        proteina: Math.round(datosUsuario.proteinaObjetivo * 0.45),
        carbs: Math.round(datosUsuario.carbsObjetivo * 0.45),
        grasas: Math.round(datosUsuario.grasasObjetivo * 0.40),
      },
      cena: {
        nombre: generarNombrePlato(datosUsuario.objetivo, 'cena'),
        calorias: Math.round(datosUsuario.caloriasObjetivo * 0.25),
        proteina: Math.round(datosUsuario.proteinaObjetivo * 0.25),
        carbs: Math.round(datosUsuario.carbsObjetivo * 0.20),
        grasas: Math.round(datosUsuario.grasasObjetivo * 0.35),
      },
    }
    
    setGenerandoIA(false)
    setDietaPlan([...dietaPlan, dietaGenerada])
    setIsModalOpen(false)
    setModoCreacion('manual')
  }

  const generarNombrePlato = (objetivo: string, tipoComida: string): string => {
    const platosDesayuno = {
      perder: ['Claras de Huevo con Espinacas', 'Avena con Frutos Rojos', 'Yogurt Griego con Semillas'],
      mantener: ['Huevos Revueltos con Aguacate', 'Avena con Proteína y Banana', 'Tostadas Integrales con Mantequilla de Maní'],
      ganar: ['Tortilla de 4 Huevos con Queso', 'Avena con Proteína, Nueces y Miel', 'Pan Integral con Mantequilla y Mermelada'],
    }
    
    const platosAlmuerzo = {
      perder: ['Pechuga de Pollo con Ensalada', 'Pescado al Vapor con Brócoli', 'Atún con Quinoa y Vegetales'],
      mantener: ['Pollo con Arroz Integral y Vegetales', 'Salmón con Batata y Espárragos', 'Carne Magra con Quinoa'],
      ganar: ['Pollo con Arroz Blanco y Aguacate', 'Carne Roja con Pasta Integral', 'Salmón con Arroz Basmati'],
    }
    
    const platosCena = {
      perder: ['Pescado a la Plancha con Ensalada', 'Pechuga con Vegetales al Vapor', 'Merluza con Espárragos'],
      mantener: ['Salmón con Brócoli', 'Pollo con Ensalada Mixta', 'Pescado con Vegetales Asados'],
      ganar: ['Carne con Batata', 'Pollo con Arroz y Aguacate', 'Salmón con Quinoa'],
    }
    
    const platos = tipoComida === 'desayuno' ? platosDesayuno : tipoComida === 'almuerzo' ? platosAlmuerzo : platosCena
    const opciones = platos[objetivo as keyof typeof platos]
    return opciones[Math.floor(Math.random() * opciones.length)]
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-black">Plan Semanal</h2>
          
          <div className="flex items-center gap-2">
            {/* Botones de navegación */}
            <button
              onClick={() => cambiarPeriodo('anterior')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Período anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Selector de rango */}
            <button
              onClick={() => setCalendarioOpen(!calendarioOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition group ${
                calendarioOpen 
                  ? 'bg-blue-100 border-2 border-blue-300' 
                  : 'hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <Calendar className={`w-5 h-5 ${calendarioOpen ? 'text-blue-600' : 'text-gray-600 group-hover:text-black'}`} />
              <span className={`text-sm font-medium whitespace-nowrap ${
                calendarioOpen ? 'text-blue-700' : 'text-gray-600 group-hover:text-black'
              }`}>
                {obtenerRangoSemana()}
              </span>
            </button>
            
            <button
              onClick={() => cambiarPeriodo('siguiente')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Período siguiente"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Botón ir a hoy */}
            <button
              onClick={irAHoy}
              className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition"
            >
              Hoy
            </button>
          </div>
        </div>

        {/* Calendario de selección de rango */}
        {calendarioOpen && (
          <div className="mb-6 p-4 bg-white border-2 border-blue-200 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Selecciona el rango de días
              </h3>
              <button
                onClick={() => {
                  setCalendarioOpen(false)
                  setSeleccionandoRango('inicio')
                }}
                className="text-gray-500 hover:text-red-600 transition p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-gray-700">
                {seleccionandoRango === 'inicio' ? (
                  <>📅 <strong>Paso 1:</strong> Selecciona la fecha de inicio</>
                ) : (
                  <>📅 <strong>Paso 2:</strong> Selecciona la fecha final</>
                )}
              </p>
            </div>

            {/* Navegación del mes */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  const nuevoMes = new Date(mesCalendario)
                  nuevoMes.setMonth(nuevoMes.getMonth() - 1)
                  setMesCalendario(nuevoMes)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <span className="text-lg font-bold text-gray-800">
                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][mesCalendario.getMonth()]} {mesCalendario.getFullYear()}
              </span>
              
              <button
                onClick={() => {
                  const nuevoMes = new Date(mesCalendario)
                  nuevoMes.setMonth(nuevoMes.getMonth() + 1)
                  setMesCalendario(nuevoMes)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((dia, i) => (
                <div key={i} className="text-center text-xs font-semibold text-gray-600 py-2">
                  {dia}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-1">
              {getDiasDelMes(mesCalendario).map((dia, index) => {
                const esOtroMes = dia.getMonth() !== mesCalendario.getMonth()
                const enRango = estaEnRango(dia)
                const esInicio = esMismoDia(dia, fechaInicio)
                const esFin = esMismoDia(dia, fechaFin)
                const esHoy = esMismoDia(dia, new Date())
                
                return (
                  <button
                    key={index}
                    onClick={() => !esOtroMes && seleccionarDia(dia)}
                    disabled={esOtroMes}
                    className={`
                      p-2 text-sm rounded-lg transition
                      ${esOtroMes ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                      ${enRango && !esOtroMes ? 'bg-blue-100' : ''}
                      ${(esInicio || esFin) && !esOtroMes ? 'bg-blue-600 text-white font-bold' : ''}
                      ${esHoy && !esOtroMes && !enRango ? 'border-2 border-blue-400' : ''}
                    `}
                  >
                    {dia.getDate()}
                  </button>
                )
              })}
            </div>

            {/* Resumen del rango seleccionado */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Rango seleccionado:</p>
              <p className="text-sm font-semibold text-gray-800">
                {formatoFecha(fechaInicio)} - {formatoFecha(fechaFin)}
                <span className="ml-2 text-gray-500">
                  ({Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1} días)
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {dietaPlan.map((dia, index) => (
            <div key={index} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:border-gray-300 transition">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-300 flex items-center justify-between">
                <h3 className="text-black font-semibold">{dia.dia}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditarDieta(index)}
                    className="p-2 hover:bg-white rounded-lg transition text-gray-600 hover:text-blue-600"
                    title="Editar dieta"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEliminarDieta(index)}
                    className="p-2 hover:bg-white rounded-lg transition text-gray-600 hover:text-red-600"
                    title="Eliminar dieta"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
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
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-black">
                {editandoIndex !== null ? 'Editar Dieta' : 'Nueva Dieta'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setModoCreacion('manual')
                  resetForm()
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Toggle Manual / IA */}
            <div className="px-6 pt-6">
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setModoCreacion('manual')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                    modoCreacion === 'manual'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Crear Manual
                </button>
                <button
                  onClick={() => setModoCreacion('ia')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                    modoCreacion === 'ia'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  Generar con IA
                  <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-black text-xs font-bold rounded">
                    PREMIUM
                  </span>
                </button>
              </div>
            </div>

            {modoCreacion === 'manual' ? (
              // FORMULARIO MANUAL
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
                  {editandoIndex !== null ? 'Guardar Cambios' : 'Agregar Dieta'}
                </button>
                </div>
              </div>
            ) : (
              // FORMULARIO IA
              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-purple-900">Generación Inteligente de Dieta</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Nuestra IA creará un plan nutricional personalizado basado en tus objetivos, datos físicos y nivel de actividad.
                  </p>
                </div>

                {/* Datos Personales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      value={datosUsuario.peso}
                      onChange={(e) => setDatosUsuario({...datosUsuario, peso: Number(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      value={datosUsuario.altura}
                      onChange={(e) => setDatosUsuario({...datosUsuario, altura: Number(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
                    <input
                      type="number"
                      value={datosUsuario.edad}
                      onChange={(e) => setDatosUsuario({...datosUsuario, edad: Number(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                    <select
                      value={datosUsuario.sexo}
                      onChange={(e) => setDatosUsuario({...datosUsuario, sexo: e.target.value as 'masculino' | 'femenino'})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                    </select>
                  </div>
                </div>

                {/* Objetivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Objetivo Principal
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['perder', 'mantener', 'ganar'] as const).map((obj) => (
                      <button
                        key={obj}
                        onClick={() => setDatosUsuario({...datosUsuario, objetivo: obj})}
                        className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                          datosUsuario.objetivo === obj
                            ? 'border-purple-600 bg-purple-50 text-purple-900'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {obj === 'perder' ? 'Perder Peso' : obj === 'mantener' ? 'Mantener' : 'Ganar Músculo'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nivel de Actividad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Actividad</label>
                  <select
                    value={datosUsuario.nivelActividad}
                    onChange={(e) => setDatosUsuario({...datosUsuario, nivelActividad: e.target.value as any})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="sedentario">Sedentario (poco o ningún ejercicio)</option>
                    <option value="ligero">Ligero (ejercicio 1-3 días/semana)</option>
                    <option value="moderado">Moderado (ejercicio 3-5 días/semana)</option>
                    <option value="intenso">Intenso (ejercicio 6-7 días/semana)</option>
                    <option value="atleta">Atleta (entrenamiento 2 veces al día)</option>
                  </select>
                </div>

                {/* Macros Objetivo */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Macros Objetivo Diarios</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Calorías</label>
                      <input
                        type="number"
                        value={datosUsuario.caloriasObjetivo}
                        onChange={(e) => setDatosUsuario({...datosUsuario, caloriasObjetivo: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-black text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Proteína (g)</label>
                      <input
                        type="number"
                        value={datosUsuario.proteinaObjetivo}
                        onChange={(e) => setDatosUsuario({...datosUsuario, proteinaObjetivo: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-black text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Carbohidratos (g)</label>
                      <input
                        type="number"
                        value={datosUsuario.carbsObjetivo}
                        onChange={(e) => setDatosUsuario({...datosUsuario, carbsObjetivo: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-black text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Grasas (g)</label>
                      <input
                        type="number"
                        value={datosUsuario.grasasObjetivo}
                        onChange={(e) => setDatosUsuario({...datosUsuario, grasasObjetivo: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-black text-sm"
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
                    onClick={generarDietaConIA}
                    disabled={generandoIA}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition font-medium shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generandoIA ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generar Dieta con IA
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black">Eliminar Dieta</h3>
                <p className="text-gray-600 text-sm">Esta acción no se puede deshacer</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que quieres eliminar la dieta de <span className="font-semibold text-black">{dietaAEliminar !== null ? dietaPlan[dietaAEliminar]?.dia : ''}</span>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={cancelarEliminacion}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium shadow-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
