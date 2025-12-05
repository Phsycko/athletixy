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

type ComidaExtra = {
  id: string
  tipo: string
  hora: string
  comida: Comida
}

type DiaPlan = {
  dia: string
  fecha: Date
  desayuno: Comida
  almuerzo: Comida
  cena: Comida
  comidasExtras?: ComidaExtra[]
}

export default function DietasPage() {
  const dietasIniciales = [
    {
      dia: 'Lunes',
      fecha: new Date(2025, 11, 2),
      desayuno: { nombre: 'Avena con Proteína', calorias: 450, proteina: 30, carbs: 52, grasas: 12 },
      almuerzo: { nombre: 'Pollo con Arroz Integral', calorias: 680, proteina: 55, carbs: 68, grasas: 15 },
      cena: { nombre: 'Salmón con Vegetales', calorias: 520, proteina: 42, carbs: 28, grasas: 25 },
    },
    {
      dia: 'Martes',
      fecha: new Date(2025, 11, 3),
      desayuno: { nombre: 'Huevos con Aguacate', calorias: 420, proteina: 28, carbs: 18, grasas: 28 },
      almuerzo: { nombre: 'Carne Magra con Quinoa', calorias: 720, proteina: 58, carbs: 65, grasas: 18 },
      cena: { nombre: 'Pechuga con Ensalada', calorias: 480, proteina: 48, carbs: 22, grasas: 18 },
    },
    {
      dia: 'Miércoles',
      fecha: new Date(2025, 11, 4),
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
  const [modoCreacion, setModoCreacion] = useState<'manual' | 'ia'>('manual')
  const [generandoIA, setGenerandoIA] = useState(false)
  const [datosUsuario, setDatosUsuario] = useState({
    peso: 75,
    altura: 175,
    edad: 28,
    sexo: 'masculino' as 'masculino' | 'femenino',
    objetivo: 'mantener' as 'perder' | 'mantener' | 'ganar',
    nivelActividad: 'moderado' as 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'atleta',
    caloriasObjetivo: 2800,
    proteinaObjetivo: 180,
    carbsObjetivo: 320,
    grasasObjetivo: 80,
  })
  const [duracionGeneracion, setDuracionGeneracion] = useState<'dia' | 'semana' | 'mes' | 'bimestre'>('dia')
  const [mostrarFormularioDatos, setMostrarFormularioDatos] = useState(false)
  const [datosGuardados, setDatosGuardados] = useState(false)
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
  const [modoSeleccion, setModoSeleccion] = useState<'ver' | 'eliminar'>('ver')
  const [rangoEliminar, setRangoEliminar] = useState<{inicio: Date | null, fin: Date | null}>({inicio: null, fin: null})
  const [confirmDeleteRangoOpen, setConfirmDeleteRangoOpen] = useState(false)
  const [editarDatosModalOpen, setEditarDatosModalOpen] = useState(false)
  const [esPremium] = useState(true) // true = Premium, false = Básico
  const [comidasExtras, setComidasExtras] = useState<ComidaExtra[]>([])
  
  const tiposComidaDisponibles = [
    { tipo: 'Snack Mañana', hora: '10:00 AM' },
    { tipo: 'Snack Tarde', hora: '5:00 PM' },
    { tipo: 'Pre-Entreno', hora: '6:00 PM' },
    { tipo: 'Post-Entreno', hora: '8:00 PM' },
    { tipo: 'Colación', hora: '11:00 AM' },
    { tipo: 'Merienda', hora: '4:00 PM' },
  ]

  // Cargar dietas y datos del usuario desde localStorage
  useEffect(() => {
    const dietasGuardadas = localStorage.getItem('athletixy_dietas')
    const primeraVez = localStorage.getItem('athletixy_dietas_initialized')
    const datosGuardadosLS = localStorage.getItem('athletixy_datos_usuario')
    
    if (primeraVez) {
      try {
        const dietas = JSON.parse(dietasGuardadas || '[]')
        // Agregar fechas a dietas antiguas que no las tienen
        const dietasConFecha = dietas.map((dieta: any, index: number) => {
          if (!dieta.fecha) {
            const fecha = new Date()
            fecha.setDate(fecha.getDate() + index)
            return { ...dieta, fecha: fecha }
          }
          // Convertir string de fecha a Date object
          return { ...dieta, fecha: new Date(dieta.fecha) }
        })
        setDietaPlan(dietasConFecha)
      } catch (error) {
        console.error('Error cargando dietas:', error)
        setDietaPlan([])
      }
    } else {
      setDietaPlan(dietasIniciales)
      localStorage.setItem('athletixy_dietas', JSON.stringify(dietasIniciales))
      localStorage.setItem('athletixy_dietas_initialized', 'true')
    }

    // Cargar datos del usuario
    if (datosGuardadosLS) {
      try {
        const datos = JSON.parse(datosGuardadosLS)
        setDatosUsuario(datos)
        setDatosGuardados(true)
      } catch (error) {
        setDatosGuardados(false)
      }
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
    fecha: new Date(),
    desayuno: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
    almuerzo: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
    cena: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
  })

  // Los macros objetivo ahora vienen de datosUsuario (se actualizan dinámicamente)
  const macrosObjetivo = {
    calorias: datosUsuario.caloriasObjetivo,
    proteina: datosUsuario.proteinaObjetivo,
    carbohidratos: datosUsuario.carbsObjetivo,
    grasas: datosUsuario.grasasObjetivo,
  }

  const handleAgregarDieta = () => {
    if (nuevaDieta.dia && nuevaDieta.desayuno.nombre && nuevaDieta.almuerzo.nombre && nuevaDieta.cena.nombre) {
      // Asignar fecha automáticamente basada en el día seleccionado
      const fechaBase = new Date()
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      const diaActual = fechaBase.getDay()
      const diaObjetivo = diasSemana.indexOf(nuevaDieta.dia)
      let diff = diaObjetivo - diaActual
      if (diff < 0) diff += 7
      
      const nuevaFecha = new Date(fechaBase)
      nuevaFecha.setDate(fechaBase.getDate() + diff)
      
      const dietaConExtras = {
        ...nuevaDieta,
        fecha: nuevaFecha,
        comidasExtras: comidasExtras.length > 0 ? comidasExtras : undefined
      }
      
      if (editandoIndex !== null) {
        const nuevoPlan = [...dietaPlan]
        nuevoPlan[editandoIndex] = dietaConExtras
        setDietaPlan(nuevoPlan)
        setEditandoIndex(null)
      } else {
        setDietaPlan([...dietaPlan, dietaConExtras])
      }
      setIsModalOpen(false)
      setNuevaDieta({
        dia: '',
        fecha: new Date(),
        desayuno: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
        almuerzo: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
        cena: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 },
      })
      setComidasExtras([])
    } else {
      alert('Por favor completa todos los campos')
    }
  }

  const handleEditarDieta = (index: number) => {
    setEditandoIndex(index)
    setNuevaDieta(dietaPlan[index])
    setComidasExtras(dietaPlan[index].comidasExtras || [])
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
    if (modoSeleccion === 'eliminar') {
      // Modo eliminar - seleccionar rango
      if (!rangoEliminar.inicio) {
        setRangoEliminar({inicio: dia, fin: null})
      } else if (!rangoEliminar.fin) {
        if (dia >= rangoEliminar.inicio) {
          setRangoEliminar({...rangoEliminar, fin: dia})
        } else {
          setRangoEliminar({inicio: dia, fin: null})
        }
      } else {
        setRangoEliminar({inicio: dia, fin: null})
      }
    } else {
      // Modo ver - cambiar rango de visualización
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

  const agregarComidaExtra = () => {
    const nuevaComidaExtra: ComidaExtra = {
      id: `extra-${Date.now()}`,
      tipo: 'Snack',
      hora: '10:00 AM',
      comida: { nombre: '', calorias: 0, proteina: 0, carbs: 0, grasas: 0 }
    }
    setComidasExtras([...comidasExtras, nuevaComidaExtra])
  }

  const eliminarComidaExtra = (id: string) => {
    setComidasExtras(comidasExtras.filter(c => c.id !== id))
  }

  const updateComidaExtra = (id: string, campo: string, valor: string | number) => {
    setComidasExtras(comidasExtras.map(c => {
      if (c.id === id) {
        if (campo === 'tipo' || campo === 'hora') {
          return { ...c, [campo]: valor }
        }
        return { ...c, comida: { ...c.comida, [campo]: valor } }
      }
      return c
    }))
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

  const calcularMacrosAutomatico = () => {
    const { peso, altura, edad, sexo, nivelActividad, objetivo } = datosUsuario
    
    // Fórmula Harris-Benedict para TMB (Tasa Metabólica Basal)
    let tmb = 0
    if (sexo === 'masculino') {
      tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad)
    } else {
      tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad)
    }
    
    // Factor de actividad
    const factoresActividad: { [key: string]: number } = {
      'sedentario': 1.2,
      'ligero': 1.375,
      'moderado': 1.55,
      'intenso': 1.725,
      'atleta': 1.9
    }
    
    let calorias = tmb * factoresActividad[nivelActividad]
    
    // Ajustar según objetivo
    if (objetivo === 'perder') {
      calorias = calorias * 0.85 // Déficit 15%
    } else if (objetivo === 'ganar') {
      calorias = calorias * 1.15 // Superávit 15%
    }
    
    // Calcular macros según objetivo
    let proteina, carbs, grasas
    if (objetivo === 'perder') {
      proteina = peso * 2.2 // Alta proteína para preservar músculo
      grasas = peso * 0.8
      carbs = (calorias - (proteina * 4) - (grasas * 9)) / 4
    } else if (objetivo === 'ganar') {
      proteina = peso * 2.0
      grasas = peso * 1.0
      carbs = (calorias - (proteina * 4) - (grasas * 9)) / 4
    } else {
      proteina = peso * 1.8
      grasas = peso * 0.9
      carbs = (calorias - (proteina * 4) - (grasas * 9)) / 4
    }
    
    const nuevosDatos = {
      ...datosUsuario,
      caloriasObjetivo: Math.round(calorias),
      proteinaObjetivo: Math.round(proteina),
      carbsObjetivo: Math.round(carbs),
      grasasObjetivo: Math.round(grasas),
    }
    
    setDatosUsuario(nuevosDatos)
    
    // Guardar en localStorage
    localStorage.setItem('athletixy_datos_usuario', JSON.stringify(nuevosDatos))
    setDatosGuardados(true)
    setMostrarFormularioDatos(false)
  }

  const generarDietaCompletaConIA = async () => {
    setGenerandoIA(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    const diasNombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const platosDesayuno = ['Avena con Proteína y Frutas', 'Huevos Revueltos con Aguacate', 'Batido de Proteína con Banana', 'Yogurt Griego con Granola', 'Tortilla de Claras con Espinacas', 'Tostadas Integrales con Mantequilla de Maní', 'Pancakes de Proteína']
    const platosAlmuerzo = ['Pollo con Arroz Integral y Vegetales', 'Carne Magra con Quinoa', 'Salmón con Batata', 'Atún con Pasta Integral', 'Pechuga con Ensalada Caesar', 'Pescado con Arroz Basmati', 'Lentejas con Vegetales']
    const platosCena = ['Salmón con Vegetales al Vapor', 'Pechuga con Brócoli', 'Pescado con Ensalada', 'Pollo con Espárragos', 'Atún con Vegetales', 'Merluza al Horno', 'Carne con Ensalada Mixta']

    let numDias = 1
    if (duracionGeneracion === 'semana') numDias = 7
    else if (duracionGeneracion === 'mes') numDias = 30
    else if (duracionGeneracion === 'bimestre') numDias = 60

    const nuevasDietas: DiaPlan[] = []
    const fechaInicial = new Date()

    for (let i = 0; i < numDias; i++) {
      const fechaDieta = new Date(fechaInicial)
      fechaDieta.setDate(fechaInicial.getDate() + i)
      const nombreDia = diasNombres[fechaDieta.getDay()]
      
      const dietaGenerada: DiaPlan = {
        dia: `${nombreDia} ${fechaDieta.getDate()} ${['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][fechaDieta.getMonth()]}`,
        fecha: fechaDieta,
        desayuno: {
          nombre: platosDesayuno[i % platosDesayuno.length],
          calorias: Math.round(datosUsuario.caloriasObjetivo * 0.3),
          proteina: Math.round(datosUsuario.proteinaObjetivo * 0.3),
          carbs: Math.round(datosUsuario.carbsObjetivo * 0.35),
          grasas: Math.round(datosUsuario.grasasObjetivo * 0.25),
        },
        almuerzo: {
          nombre: platosAlmuerzo[i % platosAlmuerzo.length],
          calorias: Math.round(datosUsuario.caloriasObjetivo * 0.45),
          proteina: Math.round(datosUsuario.proteinaObjetivo * 0.45),
          carbs: Math.round(datosUsuario.carbsObjetivo * 0.45),
          grasas: Math.round(datosUsuario.grasasObjetivo * 0.40),
        },
        cena: {
          nombre: platosCena[i % platosCena.length],
          calorias: Math.round(datosUsuario.caloriasObjetivo * 0.25),
          proteina: Math.round(datosUsuario.proteinaObjetivo * 0.25),
          carbs: Math.round(datosUsuario.carbsObjetivo * 0.20),
          grasas: Math.round(datosUsuario.grasasObjetivo * 0.35),
        },
      }
      
      nuevasDietas.push(dietaGenerada)
    }

    setDietaPlan([...dietaPlan, ...nuevasDietas])
    setGenerandoIA(false)
    setIsModalOpen(false)
    setModoCreacion('manual')
  }

  const tieneDietaEnFecha = (fecha: Date): boolean => {
    return dietaPlan.some(dieta => esMismoDia(dieta.fecha, fecha))
  }

  const abrirConfirmacionEliminarRango = () => {
    if (!rangoEliminar.inicio || !rangoEliminar.fin) {
      alert('Selecciona un rango de fechas')
      return
    }
    setConfirmDeleteRangoOpen(true)
  }

  const confirmarEliminacionRango = () => {
    const nuevoPlan = dietaPlan.filter(dieta => {
      return dieta.fecha < rangoEliminar.inicio! || dieta.fecha > rangoEliminar.fin!
    })
    setDietaPlan(nuevoPlan)
    setRangoEliminar({inicio: null, fin: null})
    setModoSeleccion('ver')
    setCalendarioOpen(false)
    setConfirmDeleteRangoOpen(false)
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-black">Objetivos Diarios</h2>
          <button
            onClick={() => setEditarDatosModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 hover:border-black text-gray-700 hover:text-black rounded-lg transition text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Editar Datos
          </button>
        </div>
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
                <div className="absolute top-full mt-2 right-0 z-50 p-3 bg-white border-2 border-gray-200 rounded-lg shadow-xl w-80">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-800">Calendario de Dietas</h3>
                    <button onClick={() => {setCalendarioOpen(false); setModoSeleccion('ver'); setRangoEliminar({inicio: null, fin: null})}} className="text-gray-500 hover:text-red-600 transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Toggle Ver / Eliminar */}
                  <div className="flex gap-1 bg-gray-100 p-1 rounded mb-2">
                    <button
                      onClick={() => {setModoSeleccion('ver'); setRangoEliminar({inicio: null, fin: null})}}
                      className={`flex-1 py-1 px-2 rounded text-xs font-medium transition ${modoSeleccion === 'ver' ? 'bg-white text-black shadow-sm' : 'text-gray-600'}`}
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => {setModoSeleccion('eliminar'); setSeleccionandoRango('inicio')}}
                      className={`flex-1 py-1 px-2 rounded text-xs font-medium transition ${modoSeleccion === 'eliminar' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600'}`}
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="bg-gray-50 px-2 py-1 rounded mb-2">
                    <p className="text-xs text-gray-700">
                      {modoSeleccion === 'eliminar' ? (
                        <>🗑️ Selecciona rango a eliminar</>
                      ) : (
                        <>{seleccionandoRango === 'inicio' ? '📅 Paso 1: Inicio' : '📅 Paso 2: Final'}</>
                      )}
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
                      const tieneDieta = tieneDietaEnFecha(dia)
                      const enRango = modoSeleccion === 'ver' ? estaEnRango(dia) : (rangoEliminar.inicio && rangoEliminar.fin && dia >= rangoEliminar.inicio && dia <= rangoEliminar.fin)
                      const esInicio = modoSeleccion === 'ver' ? esMismoDia(dia, fechaInicio) : (rangoEliminar.inicio && esMismoDia(dia, rangoEliminar.inicio))
                      const esFin = modoSeleccion === 'ver' ? esMismoDia(dia, fechaFin) : (rangoEliminar.fin && esMismoDia(dia, rangoEliminar.fin))
                      const esHoy = esMismoDia(dia, new Date())
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => !esOtroMes && seleccionarDia(dia)}
                          disabled={esOtroMes}
                          className={`
                            relative p-1.5 text-xs rounded transition
                            ${esOtroMes ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                            ${enRango && !esOtroMes ? (modoSeleccion === 'eliminar' ? 'bg-red-100' : 'bg-blue-100') : ''}
                            ${(esInicio || esFin) && !esOtroMes ? (modoSeleccion === 'eliminar' ? 'bg-red-600 text-white font-bold' : 'bg-black text-white font-bold') : ''}
                            ${esHoy && !esOtroMes && !enRango ? 'border border-gray-400' : ''}
                            ${tieneDieta && !esOtroMes && !enRango && modoSeleccion === 'ver' ? 'after:content-[""] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-green-500 after:rounded-full' : ''}
                          `}
                        >
                          {dia.getDate()}
                        </button>
                      )
                    })}
                  </div>

                  {modoSeleccion === 'ver' ? (
                    <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-gray-800">
                            {formatoFecha(fechaInicio)} - {formatoFecha(fechaFin)}
                            <span className="ml-1 text-gray-500 font-normal">
                              ({Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1}d)
                            </span>
                          </p>
                          <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            = Días con dietas
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {rangoEliminar.inicio && rangoEliminar.fin && (
                        <div className="p-2 bg-red-50 rounded border border-red-200">
                          <p className="text-xs font-semibold text-red-800">
                            Rango a eliminar: {formatoFecha(rangoEliminar.inicio)} - {formatoFecha(rangoEliminar.fin)}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={abrirConfirmacionEliminarRango}
                        disabled={!rangoEliminar.inicio || !rangoEliminar.fin}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Eliminar Dietas del Rango
                      </button>
                    </div>
                  )}
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
          {dietaPlan
            .filter(dieta => {
              const fecha = new Date(dieta.fecha)
              return fecha >= fechaInicio && fecha <= fechaFin
            })
            .map((dia, index) => (
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
                  <div className="bg-gray-1000/10 p-2 rounded-lg mt-1">
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

                {/* Comidas Extras */}
                {dia.comidasExtras && dia.comidasExtras.map((comidaExtra) => (
                  <div key={comidaExtra.id} className="flex items-start gap-4">
                    <div className="bg-green-500/10 p-2 rounded-lg mt-1">
                      <ChefHat className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-500 text-sm font-medium">{comidaExtra.tipo}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-600 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {comidaExtra.hora}
                        </span>
                      </div>
                      <p className="text-black font-medium mb-2">{comidaExtra.comida.nombre}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="text-gray-600">{comidaExtra.comida.calorias} kcal</span>
                        <span className="text-red-400">P: {comidaExtra.comida.proteina}g</span>
                        <span className="text-blue-400">C: {comidaExtra.comida.carbs}g</span>
                        <span className="text-yellow-400">G: {comidaExtra.comida.grasas}g</span>
                      </div>
                    </div>
                  </div>
                ))}
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
                onClick={() => {
                  setIsModalOpen(false)
                  setModoCreacion('manual')
                  setComidasExtras([])
                  setEditandoIndex(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Toggle Manual / IA */}
            {editandoIndex === null && (
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
                        ? 'bg-black text-white shadow-sm'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                    Generar con IA
                    <span className="ml-1 px-2 py-0.5 bg-yellow-400 text-black text-xs font-bold rounded">
                      PREMIUM
                    </span>
                  </button>
                </div>
              </div>
            )}

            {modoCreacion === 'manual' ? (
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
                      {esPremium && (
                        <button
                          type="button"
                          onClick={() => abrirCalculadoraIA('desayuno')}
                          className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition flex items-center gap-2"
                          title="Calcular macros con IA - Premium"
                        >
                          <Sparkles className="w-4 h-4" />
                          IA
                        </button>
                      )}
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
                      {esPremium && (
                        <button
                          type="button"
                          onClick={() => abrirCalculadoraIA('almuerzo')}
                          className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition flex items-center gap-2"
                          title="Calcular macros con IA - Premium"
                        >
                          <Sparkles className="w-4 h-4" />
                          IA
                        </button>
                      )}
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
              <div className="bg-gray-100 border-2 border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Cena</h3>
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
                      {esPremium && (
                        <button
                          type="button"
                          onClick={() => abrirCalculadoraIA('cena')}
                          className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition flex items-center gap-2"
                          title="Calcular macros con IA - Premium"
                        >
                          <Sparkles className="w-4 h-4" />
                          IA
                        </button>
                      )}
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

              {/* Comidas Extras */}
              {comidasExtras.map((comidaExtra, idx) => (
                <div key={comidaExtra.id} className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <select
                        value={comidaExtra.tipo}
                        onChange={(e) => updateComidaExtra(comidaExtra.id, 'tipo', e.target.value)}
                        className="px-3 py-2 border-2 border-green-300 rounded-lg text-black font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {tiposComidaDisponibles.map((t) => (
                          <option key={t.tipo} value={t.tipo}>{t.tipo}</option>
                        ))}
                        <option value="Personalizado">Personalizado</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Hora"
                        value={comidaExtra.hora}
                        onChange={(e) => updateComidaExtra(comidaExtra.id, 'hora', e.target.value)}
                        className="w-24 px-3 py-2 border-2 border-green-300 rounded-lg text-black text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarComidaExtra(comidaExtra.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar comida"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">NOMBRE DEL ALIMENTO</label>
                      <input
                        type="text"
                        placeholder="Ej: Yogurt con frutas"
                        value={comidaExtra.comida.nombre}
                        onChange={(e) => updateComidaExtra(comidaExtra.id, 'nombre', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Calorías</label>
                      <input
                        type="number"
                        placeholder="200"
                        value={comidaExtra.comida.calorias || ''}
                        onChange={(e) => updateComidaExtra(comidaExtra.id, 'calorias', Number(e.target.value))}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Proteína (g)</label>
                      <input
                        type="number"
                        placeholder="15"
                        value={comidaExtra.comida.proteina || ''}
                        onChange={(e) => updateComidaExtra(comidaExtra.id, 'proteina', Number(e.target.value))}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Carbohidratos (g)</label>
                      <input
                        type="number"
                        placeholder="20"
                        value={comidaExtra.comida.carbs || ''}
                        onChange={(e) => updateComidaExtra(comidaExtra.id, 'carbs', Number(e.target.value))}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Grasas (g)</label>
                      <input
                        type="number"
                        placeholder="8"
                        value={comidaExtra.comida.grasas || ''}
                        onChange={(e) => updateComidaExtra(comidaExtra.id, 'grasas', Number(e.target.value))}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Botón para agregar más comidas */}
              <button
                type="button"
                onClick={agregarComidaExtra}
                className="w-full py-4 border-2 border-dashed border-gray-300 hover:border-green-500 text-gray-600 hover:text-green-600 rounded-lg transition flex items-center justify-center gap-2 font-medium hover:bg-green-50"
              >
                <Plus className="w-5 h-5" />
                Agregar Comida Extra (Snack, Pre-Entreno, etc.)
              </button>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    setComidasExtras([])
                    setEditandoIndex(null)
                  }}
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
              // MODO IA - GENERACIÓN AUTOMÁTICA
              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-gray-700" />
                    <h3 className="text-xl font-bold text-black">Generación Inteligente de Dieta</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    La IA creará un plan completo del día (desayuno, almuerzo y cena) basado en tus objetivos y macros.
                  </p>
                </div>

                {/* Resumen de datos guardados */}
                {datosGuardados && !mostrarFormularioDatos ? (
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-800">Tus Datos</h4>
                      <button
                        type="button"
                        onClick={() => setMostrarFormularioDatos(true)}
                        className="text-xs text-gray-700 hover:text-black font-medium flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Editar Información
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-600 text-xs">Peso</p>
                        <p className="font-semibold text-gray-800">{datosUsuario.peso} kg</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-600 text-xs">Altura</p>
                        <p className="font-semibold text-gray-800">{datosUsuario.altura} cm</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-600 text-xs">Edad</p>
                        <p className="font-semibold text-gray-800">{datosUsuario.edad} años</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-600 text-xs">Objetivo</p>
                        <p className="font-semibold text-gray-800 capitalize">{datosUsuario.objetivo}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-4 gap-2">
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Cal</p>
                        <p className="font-bold text-orange-600">{datosUsuario.caloriasObjetivo}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Prot</p>
                        <p className="font-bold text-red-600">{datosUsuario.proteinaObjetivo}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Carbs</p>
                        <p className="font-bold text-blue-600">{datosUsuario.carbsObjetivo}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Grasas</p>
                        <p className="font-bold text-yellow-600">{datosUsuario.grasasObjetivo}g</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                {/* Configuración del usuario - FORMULARIO COMPLETO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                    <input
                      type="number"
                      value={datosUsuario.peso}
                      onChange={(e) => setDatosUsuario({...datosUsuario, peso: Number(e.target.value)})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                    <input
                      type="number"
                      value={datosUsuario.altura}
                      onChange={(e) => setDatosUsuario({...datosUsuario, altura: Number(e.target.value)})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
                    <input
                      type="number"
                      value={datosUsuario.edad}
                      onChange={(e) => setDatosUsuario({...datosUsuario, edad: Number(e.target.value)})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                    <select
                      value={datosUsuario.sexo}
                      onChange={(e) => setDatosUsuario({...datosUsuario, sexo: e.target.value as any})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
                    >
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                    </select>
                  </div>
                </div>

                {/* Nivel de Actividad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Actividad</label>
                  <select
                    value={datosUsuario.nivelActividad}
                    onChange={(e) => setDatosUsuario({...datosUsuario, nivelActividad: e.target.value as any})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option value="sedentario">Sedentario (poco o ningún ejercicio)</option>
                    <option value="ligero">Ligero (ejercicio 1-3 días/semana)</option>
                    <option value="moderado">Moderado (ejercicio 3-5 días/semana)</option>
                    <option value="intenso">Intenso (ejercicio 6-7 días/semana)</option>
                    <option value="atleta">Atleta (entrenamiento 2 veces al día)</option>
                  </select>
                </div>

                {/* Objetivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Objetivo Principal</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { valor: 'perder', label: 'Perder Peso' },
                      { valor: 'mantener', label: 'Mantener' },
                      { valor: 'ganar', label: 'Ganar Músculo' }
                    ].map((obj) => (
                      <button
                        key={obj.valor}
                        type="button"
                        onClick={() => setDatosUsuario({...datosUsuario, objetivo: obj.valor as any})}
                        className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                          datosUsuario.objetivo === obj.valor
                            ? 'border-black bg-gray-100 text-black'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {obj.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Macros objetivo */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Macros Objetivo Diarios</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                  <button
                    type="button"
                    onClick={calcularMacrosAutomatico}
                    className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    Calcular Macros Automáticamente
                  </button>
                </div>
                  </>
                )}

                {/* Duración de la generación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Generar Dietas Para:</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { valor: 'dia', label: '1 Día', dias: 1 },
                      { valor: 'semana', label: '1 Semana', dias: 7 },
                      { valor: 'mes', label: '1 Mes', dias: 30 },
                      { valor: 'bimestre', label: '2 Meses', dias: 60 }
                    ].map((opcion) => (
                      <button
                        key={opcion.valor}
                        type="button"
                        onClick={() => setDuracionGeneracion(opcion.valor as any)}
                        className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                          duracionGeneracion === opcion.valor
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-bold">{opcion.label}</div>
                        <div className="text-xs text-gray-600">{opcion.dias} día{opcion.dias > 1 ? 's' : ''}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info sobre la generación */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700">
                    <strong>💡 Nota:</strong> Se generarán {duracionGeneracion === 'dia' ? '3 comidas (1 día)' : duracionGeneracion === 'semana' ? '21 comidas (7 días)' : duracionGeneracion === 'mes' ? '90 comidas (30 días)' : '180 comidas (60 días)'} con variedad de alimentos adaptados a tus macros.
                  </p>
                </div>

                {/* Botones */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={generarDietaCompletaConIA}
                    disabled={generandoIA}
                    className="flex-1 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {generandoIA ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generando dieta completa...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generar Dieta Completa
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Porción para IA */}
      {porcionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
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
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Unidad</label>
                        <select
                          value={ingrediente.unidad}
                          onChange={(e) => actualizarIngrediente(idx, 'unidad', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
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
                  className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 hover:border-black hover:text-gray-700 rounded-lg transition text-sm font-medium"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
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
                            ? 'border-black bg-gray-100 text-black'
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
                className="flex-1 px-4 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
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

      {/* Modal de Editar Datos del Usuario */}
      {editarDatosModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Editar Información Personal</h2>
              <button
                onClick={() => setEditarDatosModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Datos físicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    value={datosUsuario.peso}
                    onChange={(e) => setDatosUsuario({...datosUsuario, peso: Number(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                  <input
                    type="number"
                    value={datosUsuario.altura}
                    onChange={(e) => setDatosUsuario({...datosUsuario, altura: Number(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
                  <input
                    type="number"
                    value={datosUsuario.edad}
                    onChange={(e) => setDatosUsuario({...datosUsuario, edad: Number(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                  <select
                    value={datosUsuario.sexo}
                    onChange={(e) => setDatosUsuario({...datosUsuario, sexo: e.target.value as any})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                  </select>
                </div>
              </div>

              {/* Nivel de actividad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Actividad</label>
                <select
                  value={datosUsuario.nivelActividad}
                  onChange={(e) => setDatosUsuario({...datosUsuario, nivelActividad: e.target.value as any})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  <option value="sedentario">Sedentario (poco o ningún ejercicio)</option>
                  <option value="ligero">Ligero (ejercicio 1-3 días/semana)</option>
                  <option value="moderado">Moderado (ejercicio 3-5 días/semana)</option>
                  <option value="intenso">Intenso (ejercicio 6-7 días/semana)</option>
                  <option value="atleta">Atleta (entrenamiento 2 veces al día)</option>
                </select>
              </div>

              {/* Objetivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Objetivo Principal</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { valor: 'perder', label: 'Perder Peso' },
                    { valor: 'mantener', label: 'Mantener' },
                    { valor: 'ganar', label: 'Ganar Músculo' }
                  ].map((obj) => (
                    <button
                      key={obj.valor}
                      type="button"
                      onClick={() => setDatosUsuario({...datosUsuario, objetivo: obj.valor as any})}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                        datosUsuario.objetivo === obj.valor
                          ? 'border-black bg-gray-100 text-black'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {obj.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Macros objetivo */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="text-sm font-semibold text-gray-700">Macros Objetivo Diarios</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Calorías</label>
                    <input
                      type="number"
                      value={datosUsuario.caloriasObjetivo}
                      onChange={(e) => setDatosUsuario({...datosUsuario, caloriasObjetivo: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded text-black font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Proteína (g)</label>
                    <input
                      type="number"
                      value={datosUsuario.proteinaObjetivo}
                      onChange={(e) => setDatosUsuario({...datosUsuario, proteinaObjetivo: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded text-black font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Carbohidratos (g)</label>
                    <input
                      type="number"
                      value={datosUsuario.carbsObjetivo}
                      onChange={(e) => setDatosUsuario({...datosUsuario, carbsObjetivo: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded text-black font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Grasas (g)</label>
                    <input
                      type="number"
                      value={datosUsuario.grasasObjetivo}
                      onChange={(e) => setDatosUsuario({...datosUsuario, grasasObjetivo: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded text-black font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                {esPremium && (
                  <>
                    <button
                      type="button"
                      onClick={calcularMacrosAutomatico}
                      className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Sparkles className="w-5 h-5" />
                      Recalcular Macros Automáticamente
                    </button>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      Los macros se calculan automáticamente con fórmula Harris-Benedict
                    </p>
                  </>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    // Recargar datos originales
                    const datosGuardadosLS = localStorage.getItem('athletixy_datos_usuario')
                    if (datosGuardadosLS) {
                      setDatosUsuario(JSON.parse(datosGuardadosLS))
                    }
                    setEditarDatosModalOpen(false)
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('athletixy_datos_usuario', JSON.stringify(datosUsuario))
                    setDatosGuardados(true)
                    setEditarDatosModalOpen(false)
                  }}
                  className="flex-1 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium shadow-lg"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación de Rango */}
      {confirmDeleteRangoOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black">Eliminar Rango de Dietas</h3>
                <p className="text-gray-600 text-sm">Esta acción eliminará múltiples días</p>
              </div>
            </div>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
              <p className="text-gray-800 text-sm mb-2">
                <strong>Rango seleccionado:</strong>
              </p>
              <p className="text-red-800 font-bold text-lg">
                {rangoEliminar.inicio && formatoFecha(rangoEliminar.inicio)} - {rangoEliminar.fin && formatoFecha(rangoEliminar.fin)}
              </p>
              <p className="text-gray-600 text-xs mt-2">
                {rangoEliminar.inicio && rangoEliminar.fin && (
                  <>
                    Se eliminarán {Math.ceil((rangoEliminar.fin.getTime() - rangoEliminar.inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1} día(s) de dietas
                  </>
                )}
              </p>
            </div>

            <p className="text-gray-700 mb-6 text-sm">
              ¿Estás seguro de que quieres eliminar todas las dietas en este rango? Esta acción no se puede deshacer.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmDeleteRangoOpen(false)
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacionRango}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium shadow-lg"
              >
                Eliminar Rango
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación Individual */}
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
