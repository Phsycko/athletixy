'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, ChefHat, Plus, X, Sparkles, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

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
  const dietasIniciales = [
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

  const [dietaPlan, setDietaPlan] = useState<DiaPlan[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [porcionModalOpen, setPorcionModalOpen] = useState(false)
  const [calculandoMacros, setCalculandoMacros] = useState(false)
  const [tipoComidaActual, setTipoComidaActual] = useState<'desayuno' | 'almuerzo' | 'cena'>('desayuno')
  const [porcionInfo, setPorcionInfo] = useState({ cantidad: '', unidad: 'gramos' })
  const [ingredientesDetectados, setIngredientesDetectados] = useState<Array<{nombre: string, cantidad: string, unidad: string}>>([])
  const [esComidaCompuesta, setEsComidaCompuesta] = useState(false)
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

  // Cargar dietas desde localStorage
  useEffect(() => {
    const dietasGuardadas = localStorage.getItem('athletixy_dietas')
    const primeraVez = localStorage.getItem('athletixy_dietas_initialized')
    
    if (primeraVez) {
      try {
        const dietas = JSON.parse(dietasGuardadas || '[]')
        setDietaPlan(dietas)
      } catch (error) {
        setDietaPlan([])
      }
    } else {
      setDietaPlan(dietasIniciales)
      localStorage.setItem('athletixy_dietas', JSON.stringify(dietasIniciales))
      localStorage.setItem('athletixy_dietas_initialized', 'true')
    }
  }, [])

  // Guardar dietas en localStorage
  useEffect(() => {
    const primeraVez = localStorage.getItem('athletixy_dietas_initialized')
    if (primeraVez && dietaPlan !== null) {
      localStorage.setItem('athletixy_dietas', JSON.stringify(dietaPlan))
    }
  }, [dietaPlan])
  
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
      if (editandoIndex !== null) {
        const nuevoPlan = [...dietaPlan]
        nuevoPlan[editandoIndex] = nuevaDieta
        setDietaPlan(nuevoPlan)
        setEditandoIndex(null)
      } else {
        setDietaPlan([...dietaPlan, nuevaDieta])
      }
      setIsModalOpen(false)
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

  const handleEditarDieta = (index: number) => {
    setEditandoIndex(index)
    setNuevaDieta(dietaPlan[index])
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
      dias.push(new Date(año, mes, 1 - i))
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
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
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

  const abrirCalculadoraIA = (tipo: 'desayuno' | 'almuerzo' | 'cena') => {
    if (!nuevaDieta[tipo].nombre.trim()) {
      alert('Por favor escribe el nombre del alimento primero')
      return
    }
    setTipoComidaActual(tipo)
    
    // Detectar si es comida compuesta
    const nombre = nuevaDieta[tipo].nombre.toLowerCase()
    const esCompuesta = nombre.includes(' con ') || nombre.includes(' y ') || nombre.includes(',')
    
    if (esCompuesta) {
      // Detectar ingredientes
      const ingredientes = detectarIngredientes(nombre)
      setIngredientesDetectados(ingredientes)
      setEsComidaCompuesta(true)
    } else {
      setEsComidaCompuesta(false)
    }
    
    setPorcionModalOpen(true)
  }

  const detectarIngredientes = (nombre: string): Array<{nombre: string, cantidad: string, unidad: string}> => {
    const ingredientes: Array<{nombre: string, cantidad: string, unidad: string}> = []
    
    // Separar por "con", "y", o ","
    let partes = nombre.split(/\s+con\s+|\s+y\s+|,\s*/)
    
    partes.forEach(parte => {
      const palabras = parte.trim().split(' ')
      let nombreIngrediente = palabras.join(' ')
      
      // Limpiar palabras comunes
      nombreIngrediente = nombreIngrediente
        .replace(/\s+(a la plancha|al horno|al vapor|a la parrilla|cocido|crudo)/gi, '')
        .trim()
      
      if (nombreIngrediente) {
        ingredientes.push({
          nombre: nombreIngrediente.charAt(0).toUpperCase() + nombreIngrediente.slice(1),
          cantidad: '',
          unidad: 'gramos'
        })
      }
    })
    
    return ingredientes
  }

  const calcularMacros = async () => {
    if (esComidaCompuesta) {
      // Validar que todos los ingredientes tengan cantidad
      const faltaCantidad = ingredientesDetectados.some(ing => !ing.cantidad)
      if (faltaCantidad) {
        alert('Por favor indica la cantidad de cada ingrediente')
        return
      }
    } else {
      if (!porcionInfo.cantidad) {
        alert('Por favor indica la cantidad')
        return
      }
    }

    setCalculandoMacros(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const alimentosBase: { [key: string]: any } = {
      'pollo': { calorias: 165, proteina: 31, carbs: 0, grasas: 3.6 },
      'pechuga': { calorias: 165, proteina: 31, carbs: 0, grasas: 3.6 },
      'arroz': { calorias: 130, proteina: 2.7, carbs: 28, grasas: 0.3 },
      'salmón': { calorias: 206, proteina: 22, carbs: 0, grasas: 13 },
      'avena': { calorias: 389, proteina: 17, carbs: 66, grasas: 7 },
      'huevo': { calorias: 155, proteina: 13, carbs: 1, grasas: 11 },
      'atún': { calorias: 132, proteina: 28, carbs: 0, grasas: 1.3 },
      'pescado': { calorias: 110, proteina: 24, carbs: 0, grasas: 1.5 },
      'carne': { calorias: 250, proteina: 26, carbs: 0, grasas: 15 },
      'quinoa': { calorias: 120, proteina: 4.4, carbs: 21, grasas: 1.9 },
      'pasta': { calorias: 131, proteina: 5, carbs: 25, grasas: 1.1 },
      'batata': { calorias: 86, proteina: 1.6, carbs: 20, grasas: 0.1 },
      'aguacate': { calorias: 160, proteina: 2, carbs: 9, grasas: 15 },
      'vegetales': { calorias: 35, proteina: 2, carbs: 7, grasas: 0.2 },
      'ensalada': { calorias: 15, proteina: 1, carbs: 3, grasas: 0.1 },
      'brócoli': { calorias: 34, proteina: 2.8, carbs: 7, grasas: 0.4 },
      'espárragos': { calorias: 20, proteina: 2.2, carbs: 4, grasas: 0.1 },
      'jamón': { calorias: 145, proteina: 21, carbs: 1, grasas: 6 },
      'queso': { calorias: 402, proteina: 25, carbs: 1.3, grasas: 33 },
      'yogurt': { calorias: 59, proteina: 10, carbs: 3.6, grasas: 0.4 },
      'frutas': { calorias: 60, proteina: 0.5, carbs: 15, grasas: 0.2 },
    }

    let macrosTotales = { calorias: 0, proteina: 0, carbs: 0, grasas: 0 }

    if (esComidaCompuesta) {
      // Calcular macros de cada ingrediente y sumar
      ingredientesDetectados.forEach(ingrediente => {
        const nombreLower = ingrediente.nombre.toLowerCase()
        const cantidad = parseFloat(ingrediente.cantidad)
        const factor = ingrediente.unidad === 'gramos' ? cantidad / 100 : cantidad
        
        let macrosIngrediente = { calorias: 100 * factor, proteina: 5 * factor, carbs: 15 * factor, grasas: 3 * factor }
        
        for (const [key, valores] of Object.entries(alimentosBase)) {
          if (nombreLower.includes(key)) {
            macrosIngrediente = {
              calorias: valores.calorias * factor,
              proteina: valores.proteina * factor,
              carbs: valores.carbs * factor,
              grasas: valores.grasas * factor,
            }
            break
          }
        }
        
        macrosTotales.calorias += macrosIngrediente.calorias
        macrosTotales.proteina += macrosIngrediente.proteina
        macrosTotales.carbs += macrosIngrediente.carbs
        macrosTotales.grasas += macrosIngrediente.grasas
      })
    } else {
      // Cálculo simple para un solo alimento
      const nombreAlimento = nuevaDieta[tipoComidaActual].nombre.toLowerCase()
      const cantidad = parseFloat(porcionInfo.cantidad)
      const factor = porcionInfo.unidad === 'gramos' ? cantidad / 100 : cantidad

      macrosTotales = { calorias: 150 * factor, proteina: 8 * factor, carbs: 20 * factor, grasas: 5 * factor }

      for (const [key, valores] of Object.entries(alimentosBase)) {
        if (nombreAlimento.includes(key)) {
          macrosTotales = {
            calorias: valores.calorias * factor,
            proteina: valores.proteina * factor,
            carbs: valores.carbs * factor,
            grasas: valores.grasas * factor,
          }
          break
        }
      }
    }

    setNuevaDieta({
      ...nuevaDieta,
      [tipoComidaActual]: {
        ...nuevaDieta[tipoComidaActual],
        calorias: Math.round(macrosTotales.calorias),
        proteina: Math.round(macrosTotales.proteina),
        carbs: Math.round(macrosTotales.carbs),
        grasas: Math.round(macrosTotales.grasas),
      }
    })

    setCalculandoMacros(false)
    setPorcionModalOpen(false)
    setPorcionInfo({ cantidad: '', unidad: 'gramos' })
    setIngredientesDetectados([])
    setEsComidaCompuesta(false)
  }

  const actualizarIngrediente = (index: number, campo: 'cantidad' | 'unidad', valor: string) => {
    const nuevosIngredientes = [...ingredientesDetectados]
    nuevosIngredientes[index][campo] = valor
    setIngredientesDetectados(nuevosIngredientes)
  }

  const agregarIngrediente = () => {
    setIngredientesDetectados([...ingredientesDetectados, { nombre: '', cantidad: '', unidad: 'gramos' }])
  }

  const eliminarIngrediente = (index: number) => {
    setIngredientesDetectados(ingredientesDetectados.filter((_, i) => i !== index))
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
          
          <div className="flex items-center gap-2 relative">
            <button onClick={() => cambiarPeriodo('anterior')} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setCalendarioOpen(!calendarioOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${calendarioOpen ? 'bg-blue-100 border-2 border-blue-300' : 'hover:bg-gray-100 border-2 border-transparent'}`}
              >
                <Calendar className={`w-5 h-5 ${calendarioOpen ? 'text-blue-600' : 'text-gray-600'}`} />
                <span className={`text-sm font-medium whitespace-nowrap ${calendarioOpen ? 'text-blue-700' : 'text-gray-600'}`}>
                  {obtenerRangoSemana()}
                </span>
              </button>

              {calendarioOpen && (
                <div className="absolute top-full mt-2 right-0 z-50 p-3 bg-white border-2 border-blue-200 rounded-lg shadow-xl w-80">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-800">Selecciona rango</h3>
                    <button onClick={() => setCalendarioOpen(false)} className="text-gray-500 hover:text-red-600 transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-blue-50 px-2 py-1 rounded mb-2">
                    <p className="text-xs text-gray-700">
                      {seleccionandoRango === 'inicio' ? '📅 Paso 1: Inicio' : '📅 Paso 2: Final'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <button onClick={() => {const m = new Date(mesCalendario); m.setMonth(m.getMonth() - 1); setMesCalendario(m)}} className="p-1 hover:bg-gray-100 rounded">
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-sm font-bold text-gray-800">
                      {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][mesCalendario.getMonth()]} {mesCalendario.getFullYear()}
                    </span>
                    <button onClick={() => {const m = new Date(mesCalendario); m.setMonth(m.getMonth() + 1); setMesCalendario(m)}} className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-0.5 mb-1">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
                      <div key={i} className="text-center text-xs font-semibold text-gray-600 py-1">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-0.5">
                    {getDiasDelMes(mesCalendario).map((dia, idx) => {
                      const esOtroMes = dia.getMonth() !== mesCalendario.getMonth()
                      const enRango = estaEnRango(dia)
                      const esInicio = esMismoDia(dia, fechaInicio)
                      const esFin = esMismoDia(dia, fechaFin)
                      const esHoy = esMismoDia(dia, new Date())
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => !esOtroMes && seleccionarDia(dia)}
                          disabled={esOtroMes}
                          className={`p-1.5 text-xs rounded transition ${esOtroMes ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'} ${enRango && !esOtroMes ? 'bg-blue-100' : ''} ${(esInicio || esFin) && !esOtroMes ? 'bg-blue-600 text-white font-bold' : ''} ${esHoy && !esOtroMes && !enRango ? 'border border-blue-400' : ''}`}
                        >
                          {dia.getDate()}
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                    <p className="text-xs font-semibold text-gray-800">
                      {formatoFecha(fechaInicio)} - {formatoFecha(fechaFin)}
                      <span className="ml-1 text-gray-500 font-normal">
                        ({Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1}d)
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <button onClick={() => cambiarPeriodo('siguiente')} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            <button onClick={irAHoy} className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition">
              Hoy
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {dietaPlan.map((dia, index) => (
            <div key={index} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:border-gray-300 transition">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-300 flex items-center justify-between">
                <h3 className="text-black font-semibold">{dia.dia}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleEditarDieta(index)} className="p-2 hover:bg-white rounded-lg transition text-gray-600 hover:text-blue-600" title="Editar">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleEliminarDieta(index)} className="p-2 hover:bg-white rounded-lg transition text-gray-600 hover:text-red-600" title="Eliminar">
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
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">{editandoIndex !== null ? 'Editar Dieta' : 'Nueva Dieta'}</h2>
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
                <select
                  value={nuevaDieta.dia}
                  onChange={(e) => setNuevaDieta({...nuevaDieta, dia: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  <option value="">Selecciona un día...</option>
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miércoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                  <option value="Sábado">Sábado</option>
                  <option value="Domingo">Domingo</option>
                </select>
              </div>

              {/* Desayuno */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-600 mb-4">Desayuno</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">NOMBRE DEL ALIMENTO</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ej: Avena con frutas"
                        value={nuevaDieta.desayuno.nombre}
                        onChange={(e) => updateComida('desayuno', 'nombre', e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <button
                        type="button"
                        onClick={() => abrirCalculadoraIA('desayuno')}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition flex items-center gap-2"
                        title="Calcular macros con IA"
                      >
                        <Sparkles className="w-4 h-4" />
                        IA
                      </button>
                    </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">NOMBRE DEL ALIMENTO</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ej: Pollo con arroz"
                        value={nuevaDieta.almuerzo.nombre}
                        onChange={(e) => updateComida('almuerzo', 'nombre', e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => abrirCalculadoraIA('almuerzo')}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition flex items-center gap-2"
                        title="Calcular macros con IA"
                      >
                        <Sparkles className="w-4 h-4" />
                        IA
                      </button>
                    </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">NOMBRE DEL ALIMENTO</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ej: Salmón con vegetales"
                        value={nuevaDieta.cena.nombre}
                        onChange={(e) => updateComida('cena', 'nombre', e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => abrirCalculadoraIA('cena')}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition flex items-center gap-2"
                        title="Calcular macros con IA"
                      >
                        <Sparkles className="w-4 h-4" />
                        IA
                      </button>
                    </div>
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
          </div>
        </div>
      )}

      {/* Modal de Porción para IA */}
      {porcionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black">Calcular Macros con IA</h3>
                <p className="text-gray-600 text-sm">{nuevaDieta[tipoComidaActual].nombre}</p>
              </div>
              <button onClick={() => {setPorcionModalOpen(false); setIngredientesDetectados([]); setEsComidaCompuesta(false)}} className="text-gray-500 hover:text-red-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {esComidaCompuesta ? (
              // COMIDA COMPUESTA - Múltiples ingredientes
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700">
                    <strong>💡 Comida compuesta detectada</strong><br/>
                    Indica la cantidad de cada ingrediente para un cálculo preciso de macros:
                  </p>
                </div>

                {ingredientesDetectados.map((ingrediente, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-gray-800">
                        {ingrediente.nombre}
                      </label>
                      {ingredientesDetectados.length > 1 && (
                        <button
                          onClick={() => eliminarIngrediente(idx)}
                          className="text-gray-400 hover:text-red-600 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Cantidad</label>
                        <input
                          type="number"
                          placeholder="150"
                          value={ingrediente.cantidad}
                          onChange={(e) => actualizarIngrediente(idx, 'cantidad', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Unidad</label>
                        <select
                          value={ingrediente.unidad}
                          onChange={(e) => actualizarIngrediente(idx, 'unidad', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
                        >
                          <option value="gramos">gramos</option>
                          <option value="piezas">piezas</option>
                          <option value="tazas">tazas</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={agregarIngrediente}
                  className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 hover:border-purple-600 hover:text-purple-600 rounded-lg transition text-sm font-medium"
                >
                  + Agregar otro ingrediente
                </button>
              </div>
            ) : (
              // ALIMENTO SIMPLE - Una sola porción
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                  <input
                    type="number"
                    placeholder="Ej: 150, 200..."
                    value={porcionInfo.cantidad}
                    onChange={(e) => setPorcionInfo({...porcionInfo, cantidad: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-600"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unidad</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['gramos', 'piezas', 'tazas'].map((unidad) => (
                      <button
                        key={unidad}
                        type="button"
                        onClick={() => setPorcionInfo({...porcionInfo, unidad})}
                        className={`py-2 px-3 rounded-lg border-2 font-medium transition text-sm ${
                          porcionInfo.unidad === unidad
                            ? 'border-purple-600 bg-purple-50 text-purple-900'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {unidad}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPorcionModalOpen(false)
                  setPorcionInfo({ cantidad: '', unidad: 'gramos' })
                  setIngredientesDetectados([])
                  setEsComidaCompuesta(false)
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={calcularMacros}
                disabled={calculandoMacros}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {calculandoMacros ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Calculando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Calcular
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
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
                onClick={() => {
                  setConfirmDeleteOpen(false)
                  setDietaAEliminar(null)
                }}
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
