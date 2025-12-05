'use client'

import { useState, useEffect } from 'react'
import { Dumbbell, Clock, Target, Plus, TrendingUp, Edit, Trash2, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'

type Ejercicio = {
  nombre: string
  series: number
  reps: string
  peso: string
}

type RutinaDia = {
  dia: string
  fecha: Date
  grupo: string
  ejercicios: Ejercicio[]
  duracion: string
}

export default function RutinasPage() {
  const rutinasIniciales: RutinaDia[] = [
    {
      dia: 'Lunes',
      fecha: new Date(2025, 11, 2),
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
      fecha: new Date(2025, 11, 3),
      grupo: 'Espalda y Bíceps',
      ejercicios: [
        { nombre: 'Peso Muerto', series: 4, reps: '6-8', peso: '120 kg' },
        { nombre: 'Dominadas', series: 4, reps: '8-10', peso: 'Corporal' },
        { nombre: 'Remo con Barra', series: 3, reps: '10-12', peso: '70 kg' },
        { nombre: 'Curl con Barra', series: 3, reps: '10-12', peso: '35 kg' },
      ],
      duracion: '65 min',
    },
  ]

  const [rutinaSemanal, setRutinaSemanal] = useState<RutinaDia[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [rutinaAEliminar, setRutinaAEliminar] = useState<number | null>(null)
  const [confirmDeleteRangoOpen, setConfirmDeleteRangoOpen] = useState(false)
  
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
  const [nuevaRutina, setNuevaRutina] = useState<RutinaDia>({
    dia: '',
    fecha: new Date(),
    grupo: '',
    ejercicios: [{ nombre: '', series: 0, reps: '', peso: '' }],
    duracion: '',
  })

  // Cargar rutinas desde localStorage
  useEffect(() => {
    const rutinasGuardadas = localStorage.getItem('athletixy_rutinas')
    const primeraVez = localStorage.getItem('athletixy_rutinas_initialized')
    
    if (primeraVez) {
      try {
        const rutinas = JSON.parse(rutinasGuardadas || '[]')
        const rutinasConFecha = rutinas.map((rutina: any) => ({
          ...rutina,
          fecha: new Date(rutina.fecha)
        }))
        setRutinaSemanal(rutinasConFecha)
      } catch (error) {
        setRutinaSemanal([])
      }
    } else {
      setRutinaSemanal(rutinasIniciales)
      localStorage.setItem('athletixy_rutinas', JSON.stringify(rutinasIniciales))
      localStorage.setItem('athletixy_rutinas_initialized', 'true')
    }
  }, [])

  // Guardar rutinas en localStorage
  useEffect(() => {
    const primeraVez = localStorage.getItem('athletixy_rutinas_initialized')
    if (primeraVez && rutinaSemanal !== null) {
      localStorage.setItem('athletixy_rutinas', JSON.stringify(rutinaSemanal))
    }
  }, [rutinaSemanal])

  const statsProgreso = [
    { label: 'Entrenamientos', valor: '18', meta: '/ 20', color: 'text-blue-400' },
    { label: 'Volumen Total', valor: '45.2', meta: 'toneladas', color: 'text-green-400' },
    { label: 'Tiempo Total', valor: '22.5', meta: 'horas', color: 'text-purple-400' },
  ]

  const handleEditarRutina = (index: number) => {
    setEditandoIndex(index)
    setIsModalOpen(true)
  }

  const handleEliminarRutina = (index: number) => {
    setRutinaAEliminar(index)
    setConfirmDeleteOpen(true)
  }

  const confirmarEliminacion = () => {
    if (rutinaAEliminar !== null) {
      const nuevoPlan = rutinaSemanal.filter((_, i) => i !== rutinaAEliminar)
      setRutinaSemanal(nuevoPlan)
      setConfirmDeleteOpen(false)
      setRutinaAEliminar(null)
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
    if (modoSeleccion === 'eliminar' && rangoEliminar.inicio && rangoEliminar.fin) {
      return dia >= rangoEliminar.inicio && dia <= rangoEliminar.fin
    }
    return dia >= fechaInicio && dia <= fechaFin
  }

  const esMismoDia = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
  }

  const tieneRutinaEnFecha = (fecha: Date): boolean => {
    return rutinaSemanal.some(rutina => esMismoDia(rutina.fecha, fecha))
  }

  const abrirConfirmacionEliminarRango = () => {
    if (!rangoEliminar.inicio || !rangoEliminar.fin) {
      alert('Selecciona un rango de fechas')
      return
    }
    setConfirmDeleteRangoOpen(true)
  }

  const confirmarEliminacionRango = () => {
    const nuevoPlan = rutinaSemanal.filter(rutina => {
      return rutina.fecha < rangoEliminar.inicio! || rutina.fecha > rangoEliminar.fin!
    })
    setRutinaSemanal(nuevoPlan)
    setRangoEliminar({inicio: null, fin: null})
    setModoSeleccion('ver')
    setCalendarioOpen(false)
    setConfirmDeleteRangoOpen(false)
  }

  const handleAgregarRutina = () => {
    if (nuevaRutina.dia && nuevaRutina.grupo && nuevaRutina.duracion && nuevaRutina.ejercicios.length > 0) {
      const ejerciciosValidos = nuevaRutina.ejercicios.filter(e => e.nombre.trim() !== '')
      if (ejerciciosValidos.length === 0) {
        alert('Agrega al menos un ejercicio')
        return
      }

      const fechaBase = new Date()
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      const diaActual = fechaBase.getDay()
      const diaObjetivo = diasSemana.indexOf(nuevaRutina.dia)
      let diff = diaObjetivo - diaActual
      if (diff < 0) diff += 7
      
      const nuevaFecha = new Date(fechaBase)
      nuevaFecha.setDate(fechaBase.getDate() + diff)

      if (editandoIndex !== null) {
        const nuevoPlan = [...rutinaSemanal]
        nuevoPlan[editandoIndex] = {...nuevaRutina, fecha: nuevaFecha, ejercicios: ejerciciosValidos}
        setRutinaSemanal(nuevoPlan)
        setEditandoIndex(null)
      } else {
        setRutinaSemanal([...rutinaSemanal, {...nuevaRutina, fecha: nuevaFecha, ejercicios: ejerciciosValidos}])
      }
      
      setIsModalOpen(false)
      resetForm()
    } else {
      alert('Por favor completa todos los campos')
    }
  }

  const resetForm = () => {
    setNuevaRutina({
      dia: '',
      fecha: new Date(),
      grupo: '',
      ejercicios: [{ nombre: '', series: 0, reps: '', peso: '' }],
      duracion: '',
    })
    setEditandoIndex(null)
  }

  const agregarEjercicio = () => {
    setNuevaRutina({
      ...nuevaRutina,
      ejercicios: [...nuevaRutina.ejercicios, { nombre: '', series: 0, reps: '', peso: '' }]
    })
  }

  const eliminarEjercicio = (index: number) => {
    const nuevosEjercicios = nuevaRutina.ejercicios.filter((_, i) => i !== index)
    setNuevaRutina({
      ...nuevaRutina,
      ejercicios: nuevosEjercicios.length > 0 ? nuevosEjercicios : [{ nombre: '', series: 0, reps: '', peso: '' }]
    })
  }

  const actualizarEjercicio = (index: number, campo: keyof Ejercicio, valor: any) => {
    const nuevosEjercicios = [...nuevaRutina.ejercicios]
    nuevosEjercicios[index] = {
      ...nuevosEjercicios[index],
      [campo]: valor
    }
    setNuevaRutina({
      ...nuevaRutina,
      ejercicios: nuevosEjercicios
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black mb-2">Rutinas</h1>
          <p className="text-gray-600">Plan de entrenamiento estructurado</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nueva Rutina
        </button>
      </div>

      {/* Stats de Progreso */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statsProgreso.map((stat, index) => (
          <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-700" />
              </div>
              <span className="text-gray-600 text-sm">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.valor}</span>
              <span className="text-gray-600 text-sm">{stat.meta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rutina Semanal */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-black">Plan de Entrenamiento</h2>
          
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
                    <h3 className="text-xs font-semibold text-gray-800">Calendario de Rutinas</h3>
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
                      {modoSeleccion === 'eliminar' ? <>🗑️ Selecciona rango a eliminar</> : <>{seleccionandoRango === 'inicio' ? '📅 Paso 1: Inicio' : '📅 Paso 2: Final'}</>}
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
                      const tieneRutina = tieneRutinaEnFecha(dia)
                      const enRango = estaEnRango(dia)
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
                            ${tieneRutina && !esOtroMes && !enRango && modoSeleccion === 'ver' ? 'after:content-[""] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-green-500 after:rounded-full' : ''}
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
                            = Días con rutinas
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
                        Eliminar Rutinas del Rango
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
          {rutinaSemanal
            .filter(rutina => rutina.fecha >= fechaInicio && rutina.fecha <= fechaFin)
            .map((dia, index) => (
            <div key={index} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:border-gray-300 transition">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                <div>
                  <h3 className="text-black font-semibold text-lg">{dia.dia}</h3>
                  <p className="text-gray-700 text-sm mt-1">{dia.grupo}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{dia.duracion}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditarRutina(index)}
                      className="p-2 hover:bg-white rounded-lg transition text-gray-600 hover:text-blue-600"
                      title="Editar rutina"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEliminarRutina(index)}
                      className="p-2 hover:bg-white rounded-lg transition text-gray-600 hover:text-red-600"
                      title="Eliminar rutina"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dia.ejercicios.map((ejercicio, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-gray-600 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-200 w-10 h-10 rounded-lg flex items-center justify-center">
                          <Dumbbell className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <p className="text-black font-medium">{ejercicio.nombre}</p>
                          <p className="text-gray-600 text-sm">
                            {ejercicio.series} series × {ejercicio.reps} reps
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700 font-semibold">{ejercicio.peso}</span>
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

      {/* Modal de Confirmación de Eliminación Individual */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black">Eliminar Rutina</h3>
                <p className="text-gray-600 text-sm">Esta acción no se puede deshacer</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que quieres eliminar la rutina de <span className="font-semibold text-black">{rutinaAEliminar !== null ? rutinaSemanal[rutinaAEliminar]?.dia : ''}</span>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmDeleteOpen(false)
                  setRutinaAEliminar(null)
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

      {/* Modal de Confirmación de Eliminación de Rango */}
      {confirmDeleteRangoOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black">Eliminar Rango de Rutinas</h3>
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
                    Se eliminarán {Math.ceil((rangoEliminar.fin.getTime() - rangoEliminar.inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1} día(s) de rutinas
                  </>
                )}
              </p>
            </div>

            <p className="text-gray-700 mb-6 text-sm">
              ¿Estás seguro de que quieres eliminar todas las rutinas en este rango? Esta acción no se puede deshacer.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteRangoOpen(false)}
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

      {/* Modal Nueva Rutina */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">{editandoIndex !== null ? 'Editar Rutina' : 'Nueva Rutina'}</h2>
              <button onClick={() => {setIsModalOpen(false); resetForm()}} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Día de la semana</label>
                  <select
                    value={nuevaRutina.dia}
                    onChange={(e) => setNuevaRutina({...nuevaRutina, dia: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option value="">Selecciona...</option>
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grupo Muscular</label>
                  <input
                    type="text"
                    placeholder="Ej: Pecho y Tríceps"
                    value={nuevaRutina.grupo}
                    onChange={(e) => setNuevaRutina({...nuevaRutina, grupo: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duración</label>
                  <input
                    type="text"
                    placeholder="Ej: 60 min"
                    value={nuevaRutina.duracion}
                    onChange={(e) => setNuevaRutina({...nuevaRutina, duracion: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Ejercicios */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-black">Ejercicios</h3>
                  <button
                    type="button"
                    onClick={agregarEjercicio}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Ejercicio
                  </button>
                </div>

                <div className="space-y-4">
                  {nuevaRutina.ejercicios.map((ejercicio, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Ejercicio {idx + 1}</span>
                        {nuevaRutina.ejercicios.length > 1 && (
                          <button
                            onClick={() => eliminarEjercicio(idx)}
                            className="text-gray-400 hover:text-red-600 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">Nombre del ejercicio</label>
                          <input
                            type="text"
                            placeholder="Ej: Press de Banca"
                            value={ejercicio.nombre}
                            onChange={(e) => actualizarEjercicio(idx, 'nombre', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Series</label>
                          <input
                            type="number"
                            placeholder="4"
                            value={ejercicio.series || ''}
                            onChange={(e) => actualizarEjercicio(idx, 'series', Number(e.target.value))}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Repeticiones</label>
                          <input
                            type="text"
                            placeholder="8-10"
                            value={ejercicio.reps}
                            onChange={(e) => actualizarEjercicio(idx, 'reps', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">Peso / Carga</label>
                          <input
                            type="text"
                            placeholder="Ej: 80 kg, Corporal, Banda"
                            value={ejercicio.peso}
                            onChange={(e) => actualizarEjercicio(idx, 'peso', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {setIsModalOpen(false); resetForm()}}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAgregarRutina}
                  className="flex-1 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium shadow-lg"
                >
                  {editandoIndex !== null ? 'Guardar Cambios' : 'Agregar Rutina'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
