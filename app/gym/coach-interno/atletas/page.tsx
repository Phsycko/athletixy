'use client'

import { useState, useEffect } from 'react'
import { Users, Search, User, TrendingUp, Calendar, Plus, ClipboardList, X, Dumbbell, BookOpen, Play, CheckCircle, Star, Award, CheckSquare, Activity, Target, Ruler } from 'lucide-react'

export default function CoachInternoAtletasPage() {
  const [atletasAsignados, setAtletasAsignados] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [atletaSeleccionado, setAtletaSeleccionado] = useState<any>(null)
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false)
  const [mostrarModalEjercicios, setMostrarModalEjercicios] = useState(false)
  const [mostrarModalRutinas, setMostrarModalRutinas] = useState(false)
  const [mostrarModalEjecutarRutina, setMostrarModalEjecutarRutina] = useState(false)
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState<any>(null)
  const [nuevoRegistro, setNuevoRegistro] = useState({
    fecha: new Date().toISOString().split('T')[0],
    ejercicio: '',
    maquina: '',
    peso: '',
    series: '',
    repeticiones: '',
    notas: ''
  })
  const [nuevoEjercicio, setNuevoEjercicio] = useState({
    nombre: '',
    descripcion: '',
    grupoMuscular: '',
    tipo: '',
    maquina: ''
  })
  const [nuevaRutina, setNuevaRutina] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    ejercicios: [] as any[]
  })
  const [ejecucionRutina, setEjecucionRutina] = useState<any>({
    ejercicios: [],
    fecha: new Date().toISOString().split('T')[0]
  })
  const [seguimiento, setSeguimiento] = useState({
    fecha: new Date().toISOString().split('T')[0],
    ejerciciosCompletados: [] as string[],
    sesionCompletada: false,
    gruposMusculares: {
      pecho: false,
      espalda: false,
      hombros: false,
      brazos: false,
      piernas: false,
      core: false
    },
    aumentoMusculo: false,
    disminucionGrasa: false,
    observaciones: '',
    registroEjercicios: [] as any[]
  })
  const [mostrarModalExito, setMostrarModalExito] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')
  const [mostrarModalAsignarRutina, setMostrarModalAsignarRutina] = useState(false)
  const [atletaParaAsignarRutina, setAtletaParaAsignarRutina] = useState<any>(null)
  const [mostrarModalConfirmarReemplazo, setMostrarModalConfirmarReemplazo] = useState(false)
  const [confirmacionReemplazo, setConfirmacionReemplazo] = useState<{
    atleta: any
    rutinaAnterior: any
    rutinaNueva: any
    callback: () => void
  } | null>(null)

  // Cargar ejercicios guardados
  const [ejerciciosGuardados, setEjerciciosGuardados] = useState<any[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const session = localStorage.getItem('athletixy_session')
      if (!session) return []
      const sessionData = JSON.parse(session)
      if (!sessionData.coachId) return []
      
      const stored = localStorage.getItem(`gym_ejercicios_coach_${sessionData.coachId}`)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Cargar rutinas creadas
  const [rutinasCreadas, setRutinasCreadas] = useState<any[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const session = localStorage.getItem('athletixy_session')
      if (!session) return []
      const sessionData = JSON.parse(session)
      if (!sessionData.coachId) return []
      
      const stored = localStorage.getItem(`gym_rutinas_coach_${sessionData.coachId}`)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const session = localStorage.getItem('athletixy_session')
      if (!session) return
      
      const sessionData = JSON.parse(session)
      if (!sessionData.coachId) return

      const coachesInternos = localStorage.getItem('gym_coaches_internos')
      if (coachesInternos) {
        const coaches = JSON.parse(coachesInternos)
        const coach = coaches.find((c: any) => c.id === sessionData.coachId)
        if (coach) {
          setAtletasAsignados(coach.atletas || [])
        }
      }
    } catch (error) {
      console.error('Error loading athletes:', error)
    }
  }, [])

  const handleRegistrarEntrenamiento = (atleta: any) => {
    setAtletaSeleccionado(atleta)
    setNuevoRegistro({
      fecha: new Date().toISOString().split('T')[0],
      ejercicio: '',
      maquina: '',
      peso: '',
      series: '',
      repeticiones: '',
      notas: ''
    })
    setMostrarModalRegistro(true)
  }

  const handleGuardarRegistro = () => {
    if (!atletaSeleccionado || !nuevoRegistro.ejercicio) {
      alert('Por favor completa al menos el ejercicio')
      return
    }

    try {
      const session = localStorage.getItem('athletixy_session')
      if (!session) return
      
      const sessionData = JSON.parse(session)
      if (!sessionData.coachId) return

      const coachesInternos = localStorage.getItem('gym_coaches_internos')
      if (!coachesInternos) return

      const coaches = JSON.parse(coachesInternos)
      const coachIndex = coaches.findIndex((c: any) => c.id === sessionData.coachId)
      if (coachIndex === -1) return

      const coach = coaches[coachIndex]
      const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaSeleccionado.id)
      if (atletaIndex === -1) return

      const registroId = `registro_${Date.now()}`
      const registro = {
        id: registroId,
        fecha: nuevoRegistro.fecha,
        ejercicio: nuevoRegistro.ejercicio,
        maquina: nuevoRegistro.maquina,
        peso: nuevoRegistro.peso ? parseFloat(nuevoRegistro.peso) : null,
        series: nuevoRegistro.series ? parseInt(nuevoRegistro.series) : null,
        repeticiones: nuevoRegistro.repeticiones ? parseInt(nuevoRegistro.repeticiones) : null,
        notas: nuevoRegistro.notas,
        fechaCreacion: new Date().toISOString()
      }

      if (!coach.atletas[atletaIndex].registros) {
        coach.atletas[atletaIndex].registros = []
      }
      coach.atletas[atletaIndex].registros.unshift(registro)
      coach.atletas[atletaIndex].ultimaActividad = new Date().toISOString().split('T')[0]
      coach.atletas[atletaIndex].diasInactivos = 0

      // Recalcular progreso después de agregar registro
      const calcularProgreso = () => {
        const atleta = coach.atletas[atletaIndex]
        const progresos = atleta.progresos || []
        const registros = atleta.registros || []
        
        let progresoComposicion = 0
        let progresoPesos = 0
        let progresoEjercicios = 0
        
        // 1. Progreso por Composición Corporal (40% del total)
        if (progresos.length > 1) {
          const ultimo = progresos[0]
          const anterior = progresos[1]
          
          if (ultimo.pesoCorporal && anterior.pesoCorporal) {
            progresoComposicion += 10
          }
          if (ultimo.porcentajeGrasa && anterior.porcentajeGrasa) {
            progresoComposicion += 10
          }
          if (ultimo.masaMuscular && anterior.masaMuscular) {
            progresoComposicion += 10
          }
          if (Object.values(ultimo.medidas).some(v => v !== null) && Object.values(anterior.medidas).some(v => v !== null)) {
            progresoComposicion += 10
          }
        } else if (progresos.length === 1) {
          progresoComposicion = 10
        }
        
        // 2. Progreso por Aumentar Pesos (30% del total)
        if (registros.length > 0) {
          const ejerciciosPorNombre: any = {}
          registros.forEach((reg: any) => {
            if (reg.ejercicio && reg.peso) {
              if (!ejerciciosPorNombre[reg.ejercicio]) {
                ejerciciosPorNombre[reg.ejercicio] = []
              }
              ejerciciosPorNombre[reg.ejercicio].push(reg)
            }
          })
          
          let mejorasPeso = 0
          const ejerciciosConPeso = Object.keys(ejerciciosPorNombre)
          
          ejerciciosConPeso.forEach(ejercicio => {
            const registrosEjercicio = ejerciciosPorNombre[ejercicio].sort((a: any, b: any) => 
              new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
            )
            
            if (registrosEjercicio.length >= 2) {
              const primerPeso = registrosEjercicio[0].peso
              const ultimoPeso = registrosEjercicio[registrosEjercicio.length - 1].peso
              
              if (ultimoPeso > primerPeso) {
                const mejora = ((ultimoPeso - primerPeso) / primerPeso) * 100
                mejorasPeso += Math.min(mejora, 30)
              }
            }
          })
          
          if (ejerciciosConPeso.length > 0) {
            progresoPesos = Math.min(30, mejorasPeso / ejerciciosConPeso.length)
          }
        }
        
        // 3. Progreso por Dominio de Ejercicios (30% del total)
        if (registros.length > 0) {
          const ejerciciosUnicos = new Set(registros.map((r: any) => r.ejercicio).filter(Boolean))
          const totalEjercicios = ejerciciosUnicos.size
          
          if (totalEjercicios >= 10) {
            progresoEjercicios = 30
          } else if (totalEjercicios >= 7) {
            progresoEjercicios = 25
          } else if (totalEjercicios >= 5) {
            progresoEjercicios = 20
          } else if (totalEjercicios >= 3) {
            progresoEjercicios = 15
          } else if (totalEjercicios >= 1) {
            progresoEjercicios = 10
          }
          
          const diasEntrenados = new Set(registros.map((r: any) => r.fecha)).size
          if (diasEntrenados >= 20) {
            progresoEjercicios += 5
          } else if (diasEntrenados >= 10) {
            progresoEjercicios += 3
          }
          
          progresoEjercicios = Math.min(30, progresoEjercicios)
        }
        
        const progresoTotal = Math.min(100, progresoComposicion + progresoPesos + progresoEjercicios)
        
        return {
          total: progresoTotal,
          composicion: progresoComposicion,
          pesos: progresoPesos,
          ejercicios: progresoEjercicios
        }
      }
      
      const progresoCalculado = calcularProgreso()
      coach.atletas[atletaIndex].progreso = progresoCalculado.total
      coach.atletas[atletaIndex].progresoDetallado = {
        composicion: progresoCalculado.composicion,
        pesos: progresoCalculado.pesos,
        ejercicios: progresoCalculado.ejercicios
      }

      coaches[coachIndex] = coach
      localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

      setAtletasAsignados(coach.atletas)
      setMostrarModalRegistro(false)
      setAtletaSeleccionado(null)
    } catch (error) {
      console.error('Error guardando registro:', error)
      alert('Error al guardar el registro')
    }
  }

  const atletasFiltrados = atletasAsignados.filter(atleta =>
    busqueda === '' ||
    atleta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    atleta.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-1">Mis Atletas</h1>
          <p className="text-gray-500 dark:text-zinc-500">Atletas asignados por el gimnasio</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMostrarModalEjercicios(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium text-sm"
          >
            <Dumbbell className="w-4 h-4" />
            Ejercicios
          </button>
          <button
            onClick={() => setMostrarModalRutinas(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium text-sm"
          >
            <BookOpen className="w-4 h-4" />
            Rutinas
          </button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar atleta por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
          />
        </div>
      </div>

      {/* Lista de Atletas */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Atletas Asignados</h2>
        {atletasFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-zinc-500 text-lg mb-2">
              {atletasAsignados.length === 0 ? 'No tienes atletas asignados' : 'No se encontraron atletas'}
            </p>
            <p className="text-sm text-gray-400 dark:text-zinc-600">
              {atletasAsignados.length === 0 ? 'El gimnasio te asignará atletas próximamente' : 'Intenta con otra búsqueda'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {atletasFiltrados.map((atleta: any) => (
              <div key={atleta.id} className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Información del Atleta */}
                  <div className="flex items-start gap-4 flex-shrink-0">
                    <div className="w-16 h-16 bg-black dark:bg-zinc-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-white dark:text-zinc-900" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-black dark:text-zinc-100 mb-1">{atleta.nombre}</p>
                      <p className="text-sm text-gray-500 dark:text-zinc-500 truncate">{atleta.email}</p>
                    </div>
                  </div>

                  {/* Métricas */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-gray-200 dark:border-zinc-700">
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Progreso Total</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                          <div 
                            className="bg-black dark:bg-zinc-100 h-2 rounded-full transition-all"
                            style={{ width: `${atleta.progreso || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-black dark:text-zinc-100 whitespace-nowrap">{atleta.progreso || 0}%</span>
                      </div>
                      {atleta.progresoDetallado && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-zinc-500">Pesos:</span>
                            <span className="text-green-600 dark:text-green-400 font-medium">{Math.round(atleta.progresoDetallado.pesos || 0)}%</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-zinc-500">Ejercicios:</span>
                            <span className="text-purple-600 dark:text-purple-400 font-medium">{Math.round(atleta.progresoDetallado.ejercicios || 0)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-gray-200 dark:border-zinc-700">
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Rutinas</p>
                      <p className="text-lg font-bold text-black dark:text-zinc-100">{atleta.rutinasCompletadas || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-gray-200 dark:border-zinc-700">
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Última Actividad</p>
                      <p className="text-sm font-medium text-black dark:text-zinc-100">{atleta.ultimaActividad || 'N/A'}</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-gray-200 dark:border-zinc-700">
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Registros</p>
                      <p className="text-lg font-bold text-black dark:text-zinc-100">{atleta.registros?.length || 0}</p>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        window.location.href = `/gym/coach-interno/atletas/${atleta.id}`
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium text-sm whitespace-nowrap"
                    >
                      <User className="w-4 h-4" />
                      Ver Detalle
                    </button>
                    {atleta.rutinaAsignada && (
                      <button
                        onClick={() => {
                          const rutina = rutinasCreadas.find((r: any) => r.id === atleta.rutinaAsignada)
                          if (rutina) {
                            setRutinaSeleccionada(rutina)
                            setAtletaSeleccionado(atleta)
                            setEjecucionRutina({
                              ejercicios: rutina.ejercicios.map((ej: any) => ({
                                ejercicioId: ej.id,
                                ejercicioNombre: ej.nombre,
                                completado: false,
                                peso: '',
                                series: ej.series || '',
                                repeticiones: ej.repeticiones || '',
                                calificacion: 0,
                                dominio: 0,
                                notas: ''
                              })),
                              fecha: new Date().toISOString().split('T')[0]
                            })
                            setMostrarModalEjecutarRutina(true)
                          }
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium text-sm whitespace-nowrap"
                      >
                        <Play className="w-4 h-4" />
                        Ejecutar Rutina
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Registrar Entrenamiento */}
      {mostrarModalRegistro && atletaSeleccionado && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-lg w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-black dark:text-zinc-100">Registrar Entrenamiento</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">Atleta: {atletaSeleccionado.nombre}</p>
              </div>
              <button
                onClick={() => {
                  setMostrarModalRegistro(false)
                  setAtletaSeleccionado(null)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={nuevoRegistro.fecha}
                  onChange={(e) => setNuevoRegistro({...nuevoRegistro, fecha: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Ejercicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nuevoRegistro.ejercicio}
                  onChange={(e) => setNuevoRegistro({...nuevoRegistro, ejercicio: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Ej: Press de banca, Sentadillas, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Máquina/Equipo</label>
                <input
                  type="text"
                  value={nuevoRegistro.maquina}
                  onChange={(e) => setNuevoRegistro({...nuevoRegistro, maquina: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Ej: Máquina de press, Barra olímpica, etc."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={nuevoRegistro.peso}
                    onChange={(e) => setNuevoRegistro({...nuevoRegistro, peso: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Series</label>
                  <input
                    type="number"
                    value={nuevoRegistro.series}
                    onChange={(e) => setNuevoRegistro({...nuevoRegistro, series: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Repeticiones</label>
                  <input
                    type="number"
                    value={nuevoRegistro.repeticiones}
                    onChange={(e) => setNuevoRegistro({...nuevoRegistro, repeticiones: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Notas Adicionales</label>
                <textarea
                  value={nuevoRegistro.notas}
                  onChange={(e) => setNuevoRegistro({...nuevoRegistro, notas: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Observaciones, técnica, progreso, etc."
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setMostrarModalRegistro(false)
                    setAtletaSeleccionado(null)
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarRegistro}
                  className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
                >
                  Guardar Registro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestión de Ejercicios */}
      {mostrarModalEjercicios && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-2xl w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-zinc-100">Mis Ejercicios</h2>
              <button
                onClick={() => setMostrarModalEjercicios(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setNuevoEjercicio({ nombre: '', descripcion: '', grupoMuscular: '', tipo: '', maquina: '' })
                  const modalCrear = document.getElementById('modal-crear-ejercicio')
                  if (modalCrear) {
                    (modalCrear as any).showModal()
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
              >
                <Plus className="w-5 h-5" />
                Crear Nuevo Ejercicio
              </button>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {ejerciciosGuardados.length === 0 ? (
                  <div className="text-center py-8">
                    <Dumbbell className="w-12 h-12 text-gray-400 dark:text-zinc-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-zinc-500">No hay ejercicios creados</p>
                  </div>
                ) : (
                  ejerciciosGuardados.map((ejercicio: any) => (
                    <div key={ejercicio.id} className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-black dark:text-zinc-100">{ejercicio.nombre}</p>
                          {ejercicio.descripcion && (
                            <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">{ejercicio.descripcion}</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            {ejercicio.grupoMuscular && (
                              <span className="px-2 py-1 bg-blue-500/20 dark:bg-blue-500/30 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                                {ejercicio.grupoMuscular}
                              </span>
                            )}
                            {ejercicio.tipo && (
                              <span className="px-2 py-1 bg-purple-500/20 dark:bg-purple-500/30 text-purple-600 dark:text-purple-400 rounded-full text-xs">
                                {ejercicio.tipo}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Ejercicio */}
      <dialog id="modal-crear-ejercicio" className="bg-transparent backdrop:bg-black/50">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full border-2 border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black dark:text-zinc-100">Crear Ejercicio</h2>
            <button
              onClick={() => {
                const modal = document.getElementById('modal-crear-ejercicio')
                if (modal) {
                  (modal as any).close()
                }
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                Nombre del Ejercicio <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nuevoEjercicio.nombre}
                onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, nombre: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                placeholder="Ej: Press de banca"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Descripción</label>
              <textarea
                value={nuevoEjercicio.descripcion}
                onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, descripcion: e.target.value})}
                rows={2}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                placeholder="Descripción del ejercicio..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Grupo Muscular</label>
                <select
                  value={nuevoEjercicio.grupoMuscular}
                  onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, grupoMuscular: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                >
                  <option value="">Seleccionar</option>
                  <option value="Pecho">Pecho</option>
                  <option value="Espalda">Espalda</option>
                  <option value="Hombros">Hombros</option>
                  <option value="Brazos">Brazos</option>
                  <option value="Piernas">Piernas</option>
                  <option value="Core">Core</option>
                  <option value="Cardio">Cardio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Tipo</label>
                <select
                  value={nuevoEjercicio.tipo}
                  onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, tipo: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                >
                  <option value="">Seleccionar</option>
                  <option value="Fuerza">Fuerza</option>
                  <option value="Resistencia">Resistencia</option>
                  <option value="Hipertrofia">Hipertrofia</option>
                  <option value="Cardio">Cardio</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Máquina/Equipo</label>
              <input
                type="text"
                value={nuevoEjercicio.maquina}
                onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, maquina: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                placeholder="Ej: Barra olímpica, Máquina de press"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  const modal = document.getElementById('modal-crear-ejercicio')
                  if (modal) {
                    (modal as any).close()
                  }
                }}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!nuevoEjercicio.nombre) {
                    alert('Por favor ingresa el nombre del ejercicio')
                    return
                  }

                  try {
                    const session = localStorage.getItem('athletixy_session')
                    if (!session) return
                    const sessionData = JSON.parse(session)
                    if (!sessionData.coachId) return

                    const ejercicioId = `ejercicio_${Date.now()}`
                    const ejercicioCompleto = {
                      id: ejercicioId,
                      nombre: nuevoEjercicio.nombre,
                      descripcion: nuevoEjercicio.descripcion,
                      grupoMuscular: nuevoEjercicio.grupoMuscular,
                      tipo: nuevoEjercicio.tipo,
                      maquina: nuevoEjercicio.maquina,
                      fechaCreacion: new Date().toISOString()
                    }

                    const ejerciciosActualizados = [...ejerciciosGuardados, ejercicioCompleto]
                    setEjerciciosGuardados(ejerciciosActualizados)
                    localStorage.setItem(`gym_ejercicios_coach_${sessionData.coachId}`, JSON.stringify(ejerciciosActualizados))

                    setNuevoEjercicio({ nombre: '', descripcion: '', grupoMuscular: '', tipo: '', maquina: '' })
                    const modal = document.getElementById('modal-crear-ejercicio')
                    if (modal) {
                      (modal as any).close()
                    }
                  } catch (error) {
                    console.error('Error guardando ejercicio:', error)
                    alert('Error al guardar el ejercicio')
                  }
                }}
                className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
              >
                Guardar Ejercicio
              </button>
            </div>
          </div>
        </div>
      </dialog>

      {/* Modal Gestión de Rutinas - Mostrar Atletas */}
      {mostrarModalRutinas && !mostrarModalAsignarRutina && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-3xl w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-zinc-100">Asignar Rutinas a Atletas</h2>
              <button
                onClick={() => setMostrarModalRutinas(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {atletasAsignados.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 dark:text-zinc-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-zinc-500">No tienes atletas asignados</p>
                  </div>
                ) : (
                  atletasAsignados.map((atleta: any) => {
                    const rutinaActual = atleta.rutinaAsignada ? rutinasCreadas.find((r: any) => r.id === atleta.rutinaAsignada) : null

                    return (
                      <div key={atleta.id} className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-black dark:bg-zinc-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-white dark:text-zinc-900" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-black dark:text-zinc-100">{atleta.nombre}</p>
                              <p className="text-sm text-gray-500 dark:text-zinc-500 truncate">{atleta.email}</p>
                              {rutinaActual && (
                                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                  Rutina actual: {rutinaActual.nombre}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setAtletaParaAsignarRutina(atleta)
                              setMostrarModalAsignarRutina(true)
                            }}
                            className="px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition text-sm font-medium whitespace-nowrap"
                          >
                            Asignar Rutina
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Rutina */}
      <dialog id="modal-crear-rutina" className="bg-transparent backdrop:bg-black/50">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-2xl w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black dark:text-zinc-100">Crear Rutina</h2>
            <button
              onClick={() => {
                const modal = document.getElementById('modal-crear-rutina')
                if (modal) {
                  (modal as any).close()
                }
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                Nombre de la Rutina <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nuevaRutina.nombre}
                onChange={(e) => setNuevaRutina({...nuevaRutina, nombre: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                placeholder="Ej: Rutina de Fuerza Semanal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Descripción</label>
              <textarea
                value={nuevaRutina.descripcion}
                onChange={(e) => setNuevaRutina({...nuevaRutina, descripcion: e.target.value})}
                rows={2}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                placeholder="Descripción de la rutina..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Duración</label>
              <select
                value={nuevaRutina.duracion}
                onChange={(e) => setNuevaRutina({...nuevaRutina, duracion: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
              >
                <option value="">Seleccionar duración</option>
                <option value="1 semana">1 semana</option>
                <option value="2 semanas">2 semanas</option>
                <option value="1 mes">1 mes</option>
                <option value="2 meses">2 meses</option>
                <option value="3 meses">3 meses</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Ejercicios de la Rutina</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {ejerciciosGuardados.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-zinc-500 text-center py-4">
                    Primero crea ejercicios para agregarlos a la rutina
                  </p>
                ) : (
                  ejerciciosGuardados.map((ejercicio: any) => {
                    const estaAgregado = nuevaRutina.ejercicios.some((e: any) => e.id === ejercicio.id)
                    return (
                      <div key={ejercicio.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                        <div className="flex-1">
                          <p className="font-medium text-black dark:text-zinc-100">{ejercicio.nombre}</p>
                          <p className="text-xs text-gray-500 dark:text-zinc-500">{ejercicio.grupoMuscular} • {ejercicio.tipo}</p>
                        </div>
                        {estaAgregado ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Series"
                              value={nuevaRutina.ejercicios.find((e: any) => e.id === ejercicio.id)?.series || ''}
                              onChange={(e) => {
                                const ejerciciosActualizados = nuevaRutina.ejercicios.map((e: any) =>
                                  e.id === ejercicio.id ? {...e, series: e.target.value} : e
                                )
                                setNuevaRutina({...nuevaRutina, ejercicios: ejerciciosActualizados})
                              }}
                              className="w-20 px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded text-black dark:text-zinc-100 text-sm"
                            />
                            <input
                              type="number"
                              placeholder="Reps"
                              value={nuevaRutina.ejercicios.find((e: any) => e.id === ejercicio.id)?.repeticiones || ''}
                              onChange={(e) => {
                                const ejerciciosActualizados = nuevaRutina.ejercicios.map((e: any) =>
                                  e.id === ejercicio.id ? {...e, repeticiones: e.target.value} : e
                                )
                                setNuevaRutina({...nuevaRutina, ejercicios: ejerciciosActualizados})
                              }}
                              className="w-20 px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded text-black dark:text-zinc-100 text-sm"
                            />
                            <button
                              onClick={() => {
                                setNuevaRutina({
                                  ...nuevaRutina,
                                  ejercicios: nuevaRutina.ejercicios.filter((e: any) => e.id !== ejercicio.id)
                                })
                              }}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                            >
                              Quitar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setNuevaRutina({
                                ...nuevaRutina,
                                ejercicios: [...nuevaRutina.ejercicios, {
                                  id: ejercicio.id,
                                  nombre: ejercicio.nombre,
                                  series: '',
                                  repeticiones: ''
                                }]
                              })
                            }}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
                          >
                            Agregar
                          </button>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  const modal = document.getElementById('modal-crear-rutina')
                  if (modal) {
                    (modal as any).close()
                  }
                }}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Permitir crear rutina sin datos completos, el coach puede editarla después
                  // Si no hay nombre, usar uno por defecto
                  const nombreRutina = nuevaRutina.nombre?.trim() || 'Nueva Rutina'

                  try {
                    const session = localStorage.getItem('athletixy_session')
                    if (!session) return
                    const sessionData = JSON.parse(session)
                    if (!sessionData.coachId) return

                    const rutinaId = `rutina_${Date.now()}`
                    const rutinaCompleta = {
                      id: rutinaId,
                      nombre: nombreRutina,
                      descripcion: nuevaRutina.descripcion || '',
                      duracion: nuevaRutina.duracion || '',
                      ejercicios: nuevaRutina.ejercicios || [],
                      fechaCreacion: new Date().toISOString()
                    }

                    const rutinasActualizadas = [...rutinasCreadas, rutinaCompleta]
                    setRutinasCreadas(rutinasActualizadas)
                    localStorage.setItem(`gym_rutinas_coach_${sessionData.coachId}`, JSON.stringify(rutinasActualizadas))

                    setRutinasCreadas(rutinasActualizadas)
                    setNuevaRutina({ nombre: '', descripcion: '', duracion: '', ejercicios: [] })
                    const modal = document.getElementById('modal-crear-rutina')
                    if (modal) {
                      (modal as any).close()
                    }
                    
                    // Si había un atleta esperando asignación, volver a abrir el modal de asignar después de un breve delay
                    if (atletaParaAsignarRutina) {
                      setTimeout(() => {
                        setMostrarModalAsignarRutina(true)
                      }, 300)
                    }
                  } catch (error) {
                    console.error('Error guardando rutina:', error)
                    alert('Error al guardar la rutina')
                  }
                }}
                className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
              >
                Guardar Rutina
              </button>
            </div>
          </div>
        </div>
      </dialog>

      {/* Modal Ejecutar Rutina */}
      {mostrarModalEjecutarRutina && rutinaSeleccionada && atletaSeleccionado && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-3xl w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-black dark:text-zinc-100">Ejecutar Rutina</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">
                  Atleta: {atletaSeleccionado.nombre} • Rutina: {rutinaSeleccionada.nombre}
                </p>
              </div>
              <button
                onClick={() => {
                  setMostrarModalEjecutarRutina(false)
                  setRutinaSeleccionada(null)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Fecha de Ejecución <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={ejecucionRutina.fecha}
                  onChange={(e) => setEjecucionRutina({...ejecucionRutina, fecha: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Ejercicios de la Rutina</h3>
                {ejecucionRutina.ejercicios.map((ejecucion: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-black dark:text-zinc-100">{ejecucion.ejercicioNombre}</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-500">
                          Series: {ejecucion.series} • Reps: {ejecucion.repeticiones}
                        </p>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ejecucion.completado}
                          onChange={(e) => {
                            const ejerciciosActualizados = ejecucionRutina.ejercicios.map((ej: any, i: number) =>
                              i === index ? {...ej, completado: e.target.checked} : ej
                            )
                            setEjecucionRutina({...ejecucionRutina, ejercicios: ejerciciosActualizados})
                          }}
                          className="w-5 h-5 rounded border-gray-300 dark:border-zinc-700"
                        />
                        <span className="text-sm text-gray-600 dark:text-zinc-400">Completado</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Peso Usado (kg)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={ejecucion.peso}
                          onChange={(e) => {
                            const ejerciciosActualizados = ejecucionRutina.ejercicios.map((ej: any, i: number) =>
                              i === index ? {...ej, peso: e.target.value} : ej
                            )
                            setEjecucionRutina({...ejecucionRutina, ejercicios: ejerciciosActualizados})
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Notas</label>
                        <input
                          type="text"
                          value={ejecucion.notas}
                          onChange={(e) => {
                            const ejerciciosActualizados = ejecucionRutina.ejercicios.map((ej: any, i: number) =>
                              i === index ? {...ej, notas: e.target.value} : ej
                            )
                            setEjecucionRutina({...ejecucionRutina, ejercicios: ejerciciosActualizados})
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 text-sm"
                          placeholder="Observaciones..."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-2">
                          Calificación (1-10) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={ejecucion.calificacion || ''}
                            onChange={(e) => {
                              const ejerciciosActualizados = ejecucionRutina.ejercicios.map((ej: any, i: number) =>
                                i === index ? {...ej, calificacion: parseInt(e.target.value) || 0} : ej
                              )
                              setEjecucionRutina({...ejecucionRutina, ejercicios: ejerciciosActualizados})
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 text-sm"
                            placeholder="0"
                          />
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => {
                                  const ejerciciosActualizados = ejecucionRutina.ejercicios.map((ej: any, i: number) =>
                                    i === index ? {...ej, calificacion: num} : ej
                                  )
                                  setEjecucionRutina({...ejecucionRutina, ejercicios: ejerciciosActualizados})
                                }}
                                className={`w-8 h-8 rounded text-xs font-medium transition ${
                                  ejecucion.calificacion === num
                                    ? 'bg-black dark:bg-zinc-100 text-white dark:text-zinc-900'
                                    : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400 hover:bg-gray-300 dark:hover:bg-zinc-600'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Evalúa el desempeño general</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-2">
                          Dominio del Ejercicio (1-10) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={ejecucion.dominio || ''}
                            onChange={(e) => {
                              const ejerciciosActualizados = ejecucionRutina.ejercicios.map((ej: any, i: number) =>
                                i === index ? {...ej, dominio: parseInt(e.target.value) || 0} : ej
                              )
                              setEjecucionRutina({...ejecucionRutina, ejercicios: ejerciciosActualizados})
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 text-sm"
                            placeholder="0"
                          />
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => {
                                  const ejerciciosActualizados = ejecucionRutina.ejercicios.map((ej: any, i: number) =>
                                    i === index ? {...ej, dominio: num} : ej
                                  )
                                  setEjecucionRutina({...ejecucionRutina, ejercicios: ejerciciosActualizados})
                                }}
                                className={`w-8 h-8 rounded text-xs font-medium transition ${
                                  ejecucion.dominio === num
                                    ? 'bg-black dark:bg-zinc-100 text-white dark:text-zinc-900'
                                    : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400 hover:bg-gray-300 dark:hover:bg-zinc-600'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Evalúa la técnica y dominio</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setMostrarModalEjecutarRutina(false)
                    setRutinaSeleccionada(null)
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Validar que todos los ejercicios tengan calificación y dominio
                    const ejerciciosSinCalificar = ejecucionRutina.ejercicios.filter((e: any) => !e.calificacion || !e.dominio)
                    if (ejerciciosSinCalificar.length > 0) {
                      alert('Por favor califica todos los ejercicios (calificación y dominio)')
                      return
                    }

                    const ejerciciosCompletados = ejecucionRutina.ejercicios.filter((e: any) => e.completado).length
                    const totalEjercicios = ejecucionRutina.ejercicios.length
                    const porcentajeCompletado = (ejerciciosCompletados / totalEjercicios) * 100

                    // Calcular promedio de calificaciones y dominio
                    const promedioCalificacion = ejecucionRutina.ejercicios.reduce((sum: number, e: any) => sum + (e.calificacion || 0), 0) / totalEjercicios
                    const promedioDominio = ejecucionRutina.ejercicios.reduce((sum: number, e: any) => sum + (e.dominio || 0), 0) / totalEjercicios

                    try {
                      const session = localStorage.getItem('athletixy_session')
                      if (!session) return
                      const sessionData = JSON.parse(session)
                      if (!sessionData.coachId) return

                      const coachesInternos = localStorage.getItem('gym_coaches_internos')
                      if (!coachesInternos) return

                      const coaches = JSON.parse(coachesInternos)
                      const coachIndex = coaches.findIndex((c: any) => c.id === sessionData.coachId)
                      if (coachIndex === -1) return

                      const coach = coaches[coachIndex]
                      const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaSeleccionado.id)
                      if (atletaIndex === -1) return

                      // Guardar ejecución de rutina
                      const ejecucionId = `ejecucion_${Date.now()}`
                      const ejecucionCompleta = {
                        id: ejecucionId,
                        rutinaId: rutinaSeleccionada.id,
                        rutinaNombre: rutinaSeleccionada.nombre,
                        fecha: ejecucionRutina.fecha,
                        ejercicios: ejecucionRutina.ejercicios,
                        porcentajeCompletado: porcentajeCompletado,
                        promedioCalificacion: promedioCalificacion,
                        promedioDominio: promedioDominio,
                        fechaCreacion: new Date().toISOString()
                      }

                      if (!coach.atletas[atletaIndex].ejecucionesRutinas) {
                        coach.atletas[atletaIndex].ejecucionesRutinas = []
                      }
                      coach.atletas[atletaIndex].ejecucionesRutinas.unshift(ejecucionCompleta)

                      // Actualizar última actividad
                      coach.atletas[atletaIndex].ultimaActividad = ejecucionRutina.fecha
                      coach.atletas[atletaIndex].diasInactivos = 0

                      // Recalcular progreso basado en ejecución de rutina con calificaciones
                      const calcularProgresoPorRutina = () => {
                        const atleta = coach.atletas[atletaIndex]
                        const ejecuciones = atleta.ejecucionesRutinas || []
                        const registros = atleta.registros || []
                        const progresos = atleta.progresos || []
                        
                        let progresoComposicion = 0
                        let progresoPesos = 0
                        let progresoEjercicios = 0
                        let progresoRutinas = 0
                        
                        // 1. Progreso por Composición Corporal (30% del total)
                        if (progresos.length > 1) {
                          const ultimo = progresos[0]
                          const anterior = progresos[1]
                          if (ultimo.pesoCorporal && anterior.pesoCorporal) progresoComposicion += 7.5
                          if (ultimo.porcentajeGrasa && anterior.porcentajeGrasa) progresoComposicion += 7.5
                          if (ultimo.masaMuscular && anterior.masaMuscular) progresoComposicion += 7.5
                          if (Object.values(ultimo.medidas).some(v => v !== null) && Object.values(anterior.medidas).some(v => v !== null)) {
                            progresoComposicion += 7.5
                          }
                        } else if (progresos.length === 1) {
                          progresoComposicion = 7.5
                        }
                        
                        // 2. Progreso por Aumentar Pesos (25% del total) - Basado en calificaciones y mejoras de peso
                        if (ejecuciones.length > 0) {
                          const ejerciciosConPeso: any = {}
                          ejecuciones.forEach((ejec: any) => {
                            ejec.ejercicios.forEach((ej: any) => {
                              if (ej.ejercicioId && ej.peso) {
                                if (!ejerciciosConPeso[ej.ejercicioId]) {
                                  ejerciciosConPeso[ej.ejercicioId] = []
                                }
                                ejerciciosConPeso[ej.ejercicioId].push(ej)
                              }
                            })
                          })
                          
                          let mejorasPeso = 0
                          let calificacionesPeso = 0
                          Object.keys(ejerciciosConPeso).forEach(ejercicioId => {
                            const pesos = ejerciciosConPeso[ejercicioId]
                              .map((e: any) => parseFloat(e.peso))
                              .filter((p: number) => !isNaN(p))
                              .sort((a: number, b: number) => a - b)
                            
                            if (pesos.length >= 2 && pesos[pesos.length - 1] > pesos[0]) {
                              const mejora = ((pesos[pesos.length - 1] - pesos[0]) / pesos[0]) * 100
                              mejorasPeso += Math.min(mejora, 20)
                            }
                            
                            // Sumar calificaciones de peso (última ejecución)
                            const ultimaEjecucion = ejecuciones[0]
                            const ejercicioEnUltima = ultimaEjecucion.ejercicios.find((e: any) => e.ejercicioId === ejercicioId)
                            if (ejercicioEnUltima && ejercicioEnUltima.calificacion) {
                              calificacionesPeso += ejercicioEnUltima.calificacion
                            }
                          })
                          
                          if (Object.keys(ejerciciosConPeso).length > 0) {
                            const mejoraPromedio = mejorasPeso / Object.keys(ejerciciosConPeso).length
                            const calificacionPromedio = calificacionesPeso / Object.keys(ejerciciosConPeso).length
                            progresoPesos = Math.min(25, mejoraPromedio + (calificacionPromedio * 2.5))
                          }
                        }
                        
                        // 3. Progreso por Dominio de Ejercicios (25% del total) - Basado en calificaciones de dominio
                        if (ejecuciones.length > 0) {
                          const ejerciciosUnicos = new Set()
                          let sumaDominio = 0
                          ejecuciones.forEach((ejec: any) => {
                            ejec.ejercicios.forEach((ej: any) => {
                              if (ej.ejercicioId) {
                                ejerciciosUnicos.add(ej.ejercicioId)
                                if (ej.dominio) sumaDominio += ej.dominio
                              }
                            })
                          })
                          
                          const totalEjercicios = ejerciciosUnicos.size
                          const promedioDominioTotal = sumaDominio / (ejecuciones.length * totalEjercicios)
                          
                          // Combinar cantidad de ejercicios únicos con promedio de dominio
                          let progresoPorCantidad = 0
                          if (totalEjercicios >= 10) progresoPorCantidad = 15
                          else if (totalEjercicios >= 7) progresoPorCantidad = 12
                          else if (totalEjercicios >= 5) progresoPorCantidad = 9
                          else if (totalEjercicios >= 3) progresoPorCantidad = 6
                          else if (totalEjercicios >= 1) progresoPorCantidad = 3
                          
                          progresoEjercicios = Math.min(25, progresoPorCantidad + (promedioDominioTotal * 1.0))
                        }
                        
                        // 4. Progreso por Completar Rutinas (20% del total) - Basado en calificaciones y completitud
                        if (ejecuciones.length > 0) {
                          const rutinasCompletadas = ejecuciones.filter((e: any) => e.porcentajeCompletado >= 100).length
                          const totalEjecuciones = ejecuciones.length
                          const porcentajeCompletitud = (rutinasCompletadas / totalEjecuciones) * 15
                          
                          // Bonus por calificaciones altas
                          const promedioCalificaciones = ejecuciones.reduce((sum: number, e: any) => sum + (e.promedioCalificacion || 0), 0) / totalEjecuciones
                          const bonusCalificacion = (promedioCalificaciones / 10) * 5
                          
                          // Bonus por completar rutinas en tiempo
                          const rutinaAsignada = atleta.rutinaAsignada
                          if (rutinaAsignada) {
                            const rutina = rutinasCreadas.find((r: any) => r.id === rutinaAsignada)
                            if (rutina) {
                              const fechaAsignacion = new Date(atleta.rutinaAsignadaFecha)
                              const fechaActual = new Date()
                              const diasTranscurridos = Math.floor((fechaActual.getTime() - fechaAsignacion.getTime()) / (1000 * 60 * 60 * 24))
                              
                              let duracionDias = 7
                              if (rutina.duracion.includes('semana')) {
                                duracionDias = parseInt(rutina.duracion) * 7
                              } else if (rutina.duracion.includes('mes')) {
                                duracionDias = parseInt(rutina.duracion) * 30
                              }
                              
                              if (diasTranscurridos <= duracionDias && ejecuciones.length > 0) {
                                progresoRutinas += 2
                              }
                            }
                          }
                          
                          progresoRutinas = Math.min(20, porcentajeCompletitud + bonusCalificacion + progresoRutinas)
                        }
                        
                        const progresoTotal = Math.min(100, progresoComposicion + progresoPesos + progresoEjercicios + progresoRutinas)
                        
                        return {
                          total: progresoTotal,
                          composicion: progresoComposicion,
                          pesos: progresoPesos,
                          ejercicios: progresoEjercicios,
                          rutinas: progresoRutinas
                        }
                      }
                      
                      const progresoCalculado = calcularProgresoPorRutina()
                      coach.atletas[atletaIndex].progreso = progresoCalculado.total
                      coach.atletas[atletaIndex].progresoDetallado = {
                        composicion: progresoCalculado.composicion,
                        pesos: progresoCalculado.pesos,
                        ejercicios: progresoCalculado.ejercicios,
                        rutinas: progresoCalculado.rutinas
                      }

                      coaches[coachIndex] = coach
                      localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

                      setAtletasAsignados(coach.atletas)
                      setMostrarModalEjecutarRutina(false)
                      setRutinaSeleccionada(null)
                      setAtletaSeleccionado(null)
                    } catch (error) {
                      console.error('Error guardando ejecución:', error)
                      alert('Error al guardar la ejecución')
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Guardar Ejecución
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Seguimiento de Progreso */}
      <dialog id="modal-seguimiento-atleta" className="bg-transparent backdrop:bg-black/50">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-2xl w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black dark:text-zinc-100">Seguimiento de Progreso</h2>
            <button
              onClick={() => {
                const modal = document.getElementById('modal-seguimiento-atleta')
                if (modal) {
                  (modal as any).close()
                }
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
            </button>
          </div>

          {atletaSeleccionado && (() => {
            const rutinaAsignada = atletaSeleccionado.rutinaAsignada
            const rutina = rutinasCreadas.find((r: any) => r.id === rutinaAsignada)
            const fechaAsignacion = atletaSeleccionado.rutinaAsignadaFecha ? new Date(atletaSeleccionado.rutinaAsignadaFecha) : null
            const fechaActual = new Date()
            
            let diasTranscurridos = 0
            let duracionDias = 0
            let porcentajeTiempo = 0
            
            if (rutina && fechaAsignacion) {
              diasTranscurridos = Math.floor((fechaActual.getTime() - fechaAsignacion.getTime()) / (1000 * 60 * 60 * 24))
              
              if (rutina.duracion.includes('semana')) {
                duracionDias = parseInt(rutina.duracion) * 7
              } else if (rutina.duracion.includes('mes')) {
                duracionDias = parseInt(rutina.duracion) * 30
              } else if (rutina.duracion.includes('día')) {
                duracionDias = parseInt(rutina.duracion)
              }
              
              porcentajeTiempo = duracionDias > 0 ? (diasTranscurridos / duracionDias) * 100 : 0
            }

            const ejerciciosRutina = rutina ? rutina.ejercicios.map((ej: any) => ej.nombre) : []

            return (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">Atleta:</p>
                  <p className="text-lg font-semibold text-black dark:text-zinc-100">{atletaSeleccionado.nombre}</p>
                </div>

                {rutina && (
                  <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                    <p className="text-sm font-semibold text-black dark:text-zinc-100 mb-2">Rutina: {rutina.nombre}</p>
                    {fechaAsignacion && (
                      <div className="flex items-center justify-between text-xs mt-2">
                        <span className="text-gray-600 dark:text-zinc-400">Días: {diasTranscurridos} / {duracionDias}</span>
                        <span className="font-medium text-black dark:text-zinc-100">{Math.round(porcentajeTiempo)}%</span>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                    Fecha de Seguimiento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={seguimiento.fecha}
                    onChange={(e) => setSeguimiento({...seguimiento, fecha: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  />
                </div>

                {ejerciciosRutina.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-black dark:text-zinc-100">
                      <Dumbbell className="w-4 h-4 inline mr-2" />
                      Registro Detallado de Ejercicios de la Rutina
                    </label>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mb-3">
                      Registra el desempeño de cada ejercicio para calcular el progreso del atleta
                    </p>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {rutina.ejercicios.map((ejercicioRutina: any, index: number) => {
                        const ejercicioNombre = ejercicioRutina.nombre || ejerciciosRutina[index]
                        const registroExistente = seguimiento.registroEjercicios.find((r: any) => r.ejercicioId === ejercicioRutina.id || r.nombre === ejercicioNombre)
                        
                        return (
                          <div key={ejercicioRutina.id || index} className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={registroExistente ? true : seguimiento.ejerciciosCompletados.includes(ejercicioNombre)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      // Agregar ejercicio a completados si no está en registroEjercicios
                                      if (!seguimiento.registroEjercicios.find((r: any) => r.ejercicioId === ejercicioRutina.id || r.nombre === ejercicioNombre)) {
                                        setSeguimiento({
                                          ...seguimiento,
                                          ejerciciosCompletados: [...seguimiento.ejerciciosCompletados, ejercicioNombre],
                                          registroEjercicios: [
                                            ...seguimiento.registroEjercicios,
                                            {
                                              ejercicioId: ejercicioRutina.id,
                                              nombre: ejercicioNombre,
                                              completado: true,
                                              peso: '',
                                              series: ejercicioRutina.series || '',
                                              repeticiones: ejercicioRutina.repeticiones || '',
                                              notas: ''
                                            }
                                          ]
                                        })
                                      }
                                    } else {
                                      // Remover ejercicio
                                      setSeguimiento({
                                        ...seguimiento,
                                        ejerciciosCompletados: seguimiento.ejerciciosCompletados.filter(e => e !== ejercicioNombre),
                                        registroEjercicios: seguimiento.registroEjercicios.filter((r: any) => 
                                          r.ejercicioId !== ejercicioRutina.id && r.nombre !== ejercicioNombre
                                        )
                                      })
                                    }
                                  }}
                                  className="w-5 h-5 rounded border-gray-300 dark:border-zinc-700"
                                />
                                <span className="text-sm font-medium text-black dark:text-zinc-100">{ejercicioNombre}</span>
                              </div>
                              {ejercicioRutina.series && ejercicioRutina.repeticiones && (
                                <span className="text-xs text-gray-500 dark:text-zinc-500">
                                  {ejercicioRutina.series} series × {ejercicioRutina.repeticiones} reps
                                </span>
                              )}
                            </div>
                            
                            {registroExistente && (
                              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-zinc-700">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">
                                    Peso Usado (kg)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.5"
                                    value={registroExistente.peso || ''}
                                    onChange={(e) => {
                                      const nuevosRegistros = seguimiento.registroEjercicios.map((r: any) =>
                                        (r.ejercicioId === ejercicioRutina.id || r.nombre === ejercicioNombre)
                                          ? { ...r, peso: e.target.value }
                                          : r
                                      )
                                      setSeguimiento({
                                        ...seguimiento,
                                        registroEjercicios: nuevosRegistros
                                      })
                                    }}
                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 text-sm"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">
                                    Series Realizadas
                                  </label>
                                  <input
                                    type="number"
                                    value={registroExistente.series || ''}
                                    onChange={(e) => {
                                      const nuevosRegistros = seguimiento.registroEjercicios.map((r: any) =>
                                        (r.ejercicioId === ejercicioRutina.id || r.nombre === ejercicioNombre)
                                          ? { ...r, series: e.target.value }
                                          : r
                                      )
                                      setSeguimiento({
                                        ...seguimiento,
                                        registroEjercicios: nuevosRegistros
                                      })
                                    }}
                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 text-sm"
                                    placeholder={ejercicioRutina.series || '0'}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">
                                    Repeticiones Realizadas
                                  </label>
                                  <input
                                    type="number"
                                    value={registroExistente.repeticiones || ''}
                                    onChange={(e) => {
                                      const nuevosRegistros = seguimiento.registroEjercicios.map((r: any) =>
                                        (r.ejercicioId === ejercicioRutina.id || r.nombre === ejercicioNombre)
                                          ? { ...r, repeticiones: e.target.value }
                                          : r
                                      )
                                      setSeguimiento({
                                        ...seguimiento,
                                        registroEjercicios: nuevosRegistros
                                      })
                                    }}
                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 text-sm"
                                    placeholder={ejercicioRutina.repeticiones || '0'}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">
                                    Notas
                                  </label>
                                  <input
                                    type="text"
                                    value={registroExistente.notas || ''}
                                    onChange={(e) => {
                                      const nuevosRegistros = seguimiento.registroEjercicios.map((r: any) =>
                                        (r.ejercicioId === ejercicioRutina.id || r.nombre === ejercicioNombre)
                                          ? { ...r, notas: e.target.value }
                                          : r
                                      )
                                      setSeguimiento({
                                        ...seguimiento,
                                        registroEjercicios: nuevosRegistros
                                      })
                                    }}
                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 text-sm"
                                    placeholder="Observaciones..."
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-black dark:text-zinc-100">
                    <Activity className="w-4 h-4 inline mr-2" />
                    Sesión de Entrenamiento
                  </label>
                  <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                    <input
                      type="checkbox"
                      checked={seguimiento.sesionCompletada}
                      onChange={(e) => setSeguimiento({...seguimiento, sesionCompletada: e.target.checked})}
                      className="w-5 h-5 rounded border-gray-300 dark:border-zinc-700"
                    />
                    <div>
                      <p className="text-sm font-medium text-black dark:text-zinc-100">Sesión completada</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-500">Marca si el atleta completó toda la sesión de entrenamiento</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-black dark:text-zinc-100">
                    <Target className="w-4 h-4 inline mr-2" />
                    Grupos Musculares Trabajados
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(seguimiento.gruposMusculares).map((grupo) => (
                      <label key={grupo} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                        <input
                          type="checkbox"
                          checked={seguimiento.gruposMusculares[grupo as keyof typeof seguimiento.gruposMusculares]}
                          onChange={(e) => {
                            setSeguimiento({
                              ...seguimiento,
                              gruposMusculares: {
                                ...seguimiento.gruposMusculares,
                                [grupo]: e.target.checked
                              }
                            })
                          }}
                          className="w-5 h-5 rounded border-gray-300 dark:border-zinc-700"
                        />
                        <span className="text-sm text-black dark:text-zinc-100 capitalize">{grupo}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-black dark:text-zinc-100">
                    <Ruler className="w-4 h-4 inline mr-2" />
                    Progreso Físico
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                      <input
                        type="checkbox"
                        checked={seguimiento.aumentoMusculo}
                        onChange={(e) => setSeguimiento({...seguimiento, aumentoMusculo: e.target.checked})}
                        className="w-5 h-5 rounded border-gray-300 dark:border-zinc-700"
                      />
                      <div>
                        <p className="text-sm font-medium text-black dark:text-zinc-100">Aumento de masa muscular</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-500">Marca si observaste aumento de músculo</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                      <input
                        type="checkbox"
                        checked={seguimiento.disminucionGrasa}
                        onChange={(e) => setSeguimiento({...seguimiento, disminucionGrasa: e.target.checked})}
                        className="w-5 h-5 rounded border-gray-300 dark:border-zinc-700"
                      />
                      <div>
                        <p className="text-sm font-medium text-black dark:text-zinc-100">Disminución de porcentaje de grasa</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-500">Marca si observaste reducción de grasa corporal</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Observaciones</label>
                  <textarea
                    value={seguimiento.observaciones}
                    onChange={(e) => setSeguimiento({...seguimiento, observaciones: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                    placeholder="Notas adicionales sobre el progreso del atleta..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      const modal = document.getElementById('modal-seguimiento-atleta')
                      if (modal) {
                        (modal as any).close()
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      try {
                        const session = localStorage.getItem('athletixy_session')
                        if (!session) return
                        const sessionData = JSON.parse(session)
                        if (!sessionData.coachId) return

                        const coachesInternos = localStorage.getItem('gym_coaches_internos')
                        if (!coachesInternos) return

                        const coaches = JSON.parse(coachesInternos)
                        const coachIndex = coaches.findIndex((c: any) => c.id === sessionData.coachId)
                        if (coachIndex === -1) return

                        const coach = coaches[coachIndex]
                        const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaSeleccionado.id)
                        if (atletaIndex === -1) return

                        // Calcular puntos basados en lo marcado y registros detallados
                        let puntosTotales = 0
                        
                        // Ejercicios con registro detallado (más puntos por tener datos completos)
                        seguimiento.registroEjercicios.forEach((registro: any) => {
                          if (registro.completado) {
                            let puntosEjercicio = 3 // Base por completar ejercicio
                            
                            // Bonus por tener peso registrado
                            if (registro.peso && parseFloat(registro.peso) > 0) {
                              puntosEjercicio += 2
                            }
                            
                            // Bonus por completar series y repeticiones
                            if (registro.series && registro.repeticiones) {
                              // Buscar el ejercicio en la rutina para obtener series y repeticiones esperadas
                              const ejercicioEnRutina = rutina?.ejercicios.find((ej: any) => 
                                ej.id === registro.ejercicioId || ej.nombre === registro.nombre
                              )
                              
                              if (ejercicioEnRutina) {
                                const seriesCompletadas = parseInt(registro.series) || 0
                                const repeticionesCompletadas = parseInt(registro.repeticiones) || 0
                                const seriesEsperadas = parseInt(ejercicioEnRutina.series || '0') || 0
                                const repeticionesEsperadas = parseInt(ejercicioEnRutina.repeticiones || '0') || 0
                                
                                // Bonus si completó todas las series y repeticiones esperadas
                                if (seriesCompletadas >= seriesEsperadas && repeticionesCompletadas >= repeticionesEsperadas) {
                                  puntosEjercicio += 3
                                } else if (seriesCompletadas >= seriesEsperadas * 0.8) {
                                  puntosEjercicio += 1.5
                                }
                              } else {
                                // Si no hay ejercicio en rutina, dar bonus por tener datos
                                puntosEjercicio += 1
                              }
                            }
                            
                            puntosTotales += puntosEjercicio
                          }
                        })
                        
                        // Ejercicios solo marcados como completados (sin registro detallado) - menos puntos
                        const ejerciciosSoloMarcados = seguimiento.ejerciciosCompletados.filter(ej => 
                          !seguimiento.registroEjercicios.some((r: any) => r.nombre === ej || r.ejercicioId)
                        )
                        puntosTotales += ejerciciosSoloMarcados.length * 1
                        
                        // Sesión completada (5 puntos)
                        if (seguimiento.sesionCompletada) puntosTotales += 5
                        
                        // Grupos musculares trabajados (3 puntos cada uno)
                        const gruposTrabajados = Object.values(seguimiento.gruposMusculares).filter(v => v).length
                        puntosTotales += gruposTrabajados * 3
                        
                        // Aumento de músculo (8 puntos)
                        if (seguimiento.aumentoMusculo) puntosTotales += 8
                        
                        // Disminución de grasa (10 puntos)
                        if (seguimiento.disminucionGrasa) puntosTotales += 10

                        // Ajustar según período de rutina si existe
                        let factorAjuste = 1
                        if (rutina && fechaAsignacion && duracionDias > 0) {
                          if (porcentajeTiempo < 100 && porcentajeTiempo > 0) {
                            factorAjuste = 1 + (porcentajeTiempo / 100) * 0.3
                          } else if (porcentajeTiempo >= 100) {
                            factorAjuste = 1.3
                          } else {
                            factorAjuste = 0.8
                          }
                        }

                        let puntosAplicados = Math.round(puntosTotales * factorAjuste)

                        // Guardar seguimiento con registros detallados de ejercicios
                        const seguimientoId = `seguimiento_${Date.now()}`
                        const seguimientoCompleto = {
                          id: seguimientoId,
                          fecha: seguimiento.fecha,
                          ejerciciosCompletados: seguimiento.ejerciciosCompletados,
                          registroEjercicios: seguimiento.registroEjercicios,
                          sesionCompletada: seguimiento.sesionCompletada,
                          gruposMusculares: seguimiento.gruposMusculares,
                          aumentoMusculo: seguimiento.aumentoMusculo,
                          disminucionGrasa: seguimiento.disminucionGrasa,
                          observaciones: seguimiento.observaciones,
                          puntosBase: puntosTotales,
                          puntosAplicados: puntosAplicados,
                          factorAjuste: factorAjuste,
                          rutinaId: rutina?.id || null,
                          rutinaNombre: rutina?.nombre || null,
                          porcentajeTiempoRutina: rutina ? porcentajeTiempo : null,
                          fechaCreacion: new Date().toISOString(),
                          coachId: sessionData.coachId
                        }
                        
                        // Actualizar progreso basado en registros detallados de ejercicios
                        // Comparar pesos actuales vs anteriores para calcular mejora
                        if (seguimiento.registroEjercicios.length > 0) {
                          const seguimientosAnteriores = coach.atletas[atletaIndex].seguimientos || []
                          const registrosAnteriores = seguimientosAnteriores
                            .flatMap((s: any) => s.registroEjercicios || [])
                            .filter((r: any) => r.peso && parseFloat(r.peso) > 0)
                          
                          seguimiento.registroEjercicios.forEach((registroActual: any) => {
                            if (registroActual.peso && parseFloat(registroActual.peso) > 0) {
                              const registrosEjercicioAnterior = registrosAnteriores.filter((r: any) => 
                                r.ejercicioId === registroActual.ejercicioId || r.nombre === registroActual.nombre
                              )
                              
                              if (registrosEjercicioAnterior.length > 0) {
                                const pesoAnterior = Math.max(...registrosEjercicioAnterior.map((r: any) => parseFloat(r.peso)))
                                const pesoActual = parseFloat(registroActual.peso)
                                
                                // Si hay mejora en el peso, agregar puntos adicionales
                                if (pesoActual > pesoAnterior) {
                                  const mejoraPorcentual = ((pesoActual - pesoAnterior) / pesoAnterior) * 100
                                  puntosAplicados += Math.min(mejoraPorcentual * 0.5, 5) // Máximo 5 puntos por mejora
                                }
                              }
                            }
                          })
                        }

                        if (!coach.atletas[atletaIndex].seguimientos) {
                          coach.atletas[atletaIndex].seguimientos = []
                        }
                        coach.atletas[atletaIndex].seguimientos.unshift(seguimientoCompleto)

                        // Actualizar progreso
                        const progresoActual = coach.atletas[atletaIndex].progreso || 0
                        const nuevoProgreso = Math.max(0, Math.min(100, progresoActual + puntosAplicados))
                        coach.atletas[atletaIndex].progreso = nuevoProgreso

                        // Actualizar progreso detallado
                        const progresoDetallado = coach.atletas[atletaIndex].progresoDetallado || {
                          composicion: 0,
                          pesos: 0,
                          ejercicios: 0,
                          rutinas: 0
                        }

                        // Distribuir puntos según categorías basado en registros detallados
                        let puntosComposicion = 0
                        let puntosEjercicios = 0
                        let puntosPesos = 0
                        let puntosRutinas = 0

                        // Composición corporal (40%)
                        if (seguimiento.aumentoMusculo || seguimiento.disminucionGrasa) {
                          puntosComposicion = puntosAplicados * 0.4
                        }
                        
                        // Ejercicios y dominio (30%)
                        if (seguimiento.registroEjercicios.length > 0 || seguimiento.ejerciciosCompletados.length > 0 || seguimiento.sesionCompletada) {
                          puntosEjercicios = puntosAplicados * 0.3
                        }
                        
                        // Aumento de pesos (30%) - basado en registros detallados con pesos
                        const ejerciciosConPeso = seguimiento.registroEjercicios.filter((r: any) => r.peso && parseFloat(r.peso) > 0)
                        if (ejerciciosConPeso.length > 0) {
                          // Comparar con registros anteriores para calcular mejora
                          const seguimientosAnteriores = coach.atletas[atletaIndex].seguimientos || []
                          const registrosAnteriores = seguimientosAnteriores
                            .flatMap((s: any) => s.registroEjercicios || [])
                            .filter((r: any) => r.peso && parseFloat(r.peso) > 0)
                          
                          let mejorasPeso = 0
                          ejerciciosConPeso.forEach((registroActual: any) => {
                            const registrosEjercicioAnterior = registrosAnteriores.filter((r: any) => 
                              r.ejercicioId === registroActual.ejercicioId || r.nombre === registroActual.nombre
                            )
                            
                            if (registrosEjercicioAnterior.length > 0) {
                              const pesoAnterior = Math.max(...registrosEjercicioAnterior.map((r: any) => parseFloat(r.peso)))
                              const pesoActual = parseFloat(registroActual.peso)
                              
                              if (pesoActual > pesoAnterior) {
                                const mejoraPorcentual = ((pesoActual - pesoAnterior) / pesoAnterior) * 100
                                mejorasPeso += Math.min(mejoraPorcentual, 30)
                              }
                            } else {
                              // Primer registro del ejercicio con peso
                              mejorasPeso += 5
                            }
                          })
                          
                          puntosPesos = Math.min(puntosAplicados * 0.3, mejorasPeso)
                        }
                        
                        // Rutinas y sesiones (30%)
                        if (seguimiento.sesionCompletada || gruposTrabajados > 0) {
                          puntosRutinas = puntosAplicados * 0.3
                        }

                        coach.atletas[atletaIndex].progresoDetallado = {
                          composicion: Math.max(0, Math.min(100, progresoDetallado.composicion + puntosComposicion)),
                          pesos: Math.max(0, Math.min(100, progresoDetallado.pesos + puntosPesos)),
                          ejercicios: Math.max(0, Math.min(100, progresoDetallado.ejercicios + puntosEjercicios)),
                          rutinas: Math.max(0, Math.min(100, (progresoDetallado.rutinas || 0) + puntosRutinas))
                        }

                        coaches[coachIndex] = coach
                        localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

                        setAtletasAsignados(coach.atletas)
                        
                        const modal = document.getElementById('modal-seguimiento-atleta')
                        if (modal) {
                          (modal as any).close()
                        }
                        
                        setMensajeExito(`Seguimiento guardado exitosamente. Progreso aumentado en ${puntosAplicados} puntos`)
                        setMostrarModalExito(true)
                      } catch (error) {
                        console.error('Error guardando seguimiento:', error)
                        setMensajeExito('Error al guardar el seguimiento. Por favor intenta nuevamente.')
                        setMostrarModalExito(true)
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
                  >
                    <CheckSquare className="w-4 h-4 inline mr-2" />
                    Guardar Seguimiento
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      </dialog>

      {/* Modal Seleccionar Rutina para Asignar al Atleta */}
      {mostrarModalAsignarRutina && atletaParaAsignarRutina && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-3xl w-full border-2 border-gray-200 dark:border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-black dark:text-zinc-100">Asignar Rutina</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">
                  Selecciona la rutina para: <span className="font-medium">{atletaParaAsignarRutina.nombre}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setMostrarModalAsignarRutina(false)
                  setAtletaParaAsignarRutina(null)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  // Cerrar el modal de asignar rutina temporalmente
                  setMostrarModalAsignarRutina(false)
                  // Abrir el modal de crear rutina
                  setNuevaRutina({ nombre: '', descripcion: '', duracion: '', ejercicios: [] })
                  const modalCrear = document.getElementById('modal-crear-rutina')
                  if (modalCrear) {
                    (modalCrear as any).showModal()
                  }
                  // Guardar el atleta para cuando se cree la rutina, poder asignarla automáticamente
                  // Esto se manejará en el handleGuardarRutina
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
              >
                <Plus className="w-5 h-5" />
                Crear Nueva Rutina
              </button>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {rutinasCreadas.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 dark:text-zinc-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-zinc-500">No hay rutinas creadas</p>
                    <p className="text-sm text-gray-400 dark:text-zinc-600 mt-2">
                      Crea una rutina para poder asignarla a este atleta
                    </p>
                  </div>
                ) : (
                  rutinasCreadas.map((rutina: any) => {
                    const esRutinaActual = atletaParaAsignarRutina.rutinaAsignada === rutina.id

                    return (
                      <div
                        key={rutina.id}
                        className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                          esRutinaActual
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                            : 'bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 hover:border-black dark:hover:border-zinc-100'
                        }`}
                        onClick={async () => {
                          try {
                            const session = localStorage.getItem('athletixy_session')
                            if (!session) return
                            const sessionData = JSON.parse(session)
                            if (!sessionData.coachId) return

                            const coachesInternos = localStorage.getItem('gym_coaches_internos')
                            if (!coachesInternos) return

                            const coaches = JSON.parse(coachesInternos)
                            const coachIndex = coaches.findIndex((c: any) => c.id === sessionData.coachId)
                            if (coachIndex === -1) return

                            const coach = coaches[coachIndex]
                            const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaParaAsignarRutina.id)
                            if (atletaIndex === -1) return

                            // Si ya tiene esta rutina asignada, no hacer nada
                            if (esRutinaActual) {
                              setMensajeExito(`El atleta ${atletaParaAsignarRutina.nombre} ya tiene asignada esta rutina`)
                              setMostrarModalExito(true)
                              setMostrarModalAsignarRutina(false)
                              setAtletaParaAsignarRutina(null)
                              return
                            }

                            // Si tiene otra rutina asignada, mostrar modal de confirmación
                            if (atletaParaAsignarRutina.rutinaAsignada) {
                              const rutinaAnterior = rutinasCreadas.find((r: any) => r.id === atletaParaAsignarRutina.rutinaAsignada)
                              if (rutinaAnterior) {
                                setConfirmacionReemplazo({
                                  atleta: atletaParaAsignarRutina,
                                  rutinaAnterior: rutinaAnterior,
                                  rutinaNueva: rutina,
                                  callback: async () => {
                                    // Continuar con la asignación
                                    const session = localStorage.getItem('athletixy_session')
                                    if (!session) return
                                    const sessionData = JSON.parse(session)
                                    if (!sessionData.coachId) return

                                    const coachesInternos = localStorage.getItem('gym_coaches_internos')
                                    if (!coachesInternos) return

                                    const coaches = JSON.parse(coachesInternos)
                                    const coachIndex = coaches.findIndex((c: any) => c.id === sessionData.coachId)
                                    if (coachIndex === -1) return

                                    const coach = coaches[coachIndex]
                                    const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaParaAsignarRutina.id)
                                    if (atletaIndex === -1) return

                                    coach.atletas[atletaIndex].rutinaAsignada = rutina.id
                                    coach.atletas[atletaIndex].rutinaAsignadaFecha = new Date().toISOString()

                                    coaches[coachIndex] = coach
                                    localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

                                    setAtletasAsignados(coach.atletas)
                                    setMensajeExito(`Rutina "${rutina.nombre}" asignada a ${atletaParaAsignarRutina.nombre}`)
                                    setMostrarModalExito(true)
                                    setMostrarModalAsignarRutina(false)
                                    setAtletaParaAsignarRutina(null)
                                    setMostrarModalRutinas(false)
                                    setMostrarModalConfirmarReemplazo(false)
                                    setConfirmacionReemplazo(null)
                                  }
                                })
                                setMostrarModalConfirmarReemplazo(true)
                                return
                              }
                            }

                            // Si no tiene rutina previa, asignar directamente
                            coach.atletas[atletaIndex].rutinaAsignada = rutina.id
                            coach.atletas[atletaIndex].rutinaAsignadaFecha = new Date().toISOString()

                            coaches[coachIndex] = coach
                            localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

                            setAtletasAsignados(coach.atletas)
                            setMensajeExito(`Rutina "${rutina.nombre}" asignada a ${atletaParaAsignarRutina.nombre}`)
                            setMostrarModalExito(true)
                            setMostrarModalAsignarRutina(false)
                            setAtletaParaAsignarRutina(null)
                            setMostrarModalRutinas(false)
                          } catch (error) {
                            console.error('Error asignando rutina:', error)
                            alert('Error al asignar la rutina')
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-black dark:text-zinc-100">{rutina.nombre}</p>
                              {esRutinaActual && (
                                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                                  Asignada
                                </span>
                              )}
                            </div>
                            {rutina.descripcion && (
                              <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">{rutina.descripcion}</p>
                            )}
                            <p className="text-xs text-gray-400 dark:text-zinc-600 mt-1">
                              Duración: {rutina.duracion || 'No especificada'} • {rutina.ejercicios?.length || 0} ejercicios
                            </p>
                          </div>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              
                              // Si ya está asignada, mostrar mensaje informativo
                              if (esRutinaActual) {
                                setMensajeExito(`El atleta ${atletaParaAsignarRutina.nombre} ya tiene asignada la rutina "${rutina.nombre}"`)
                                setMostrarModalExito(true)
                                return
                              }
                              
                              // Si no está asignada, proceder con la asignación
                              try {
                                const session = localStorage.getItem('athletixy_session')
                                if (!session) return
                                const sessionData = JSON.parse(session)
                                if (!sessionData.coachId) return

                                const coachesInternos = localStorage.getItem('gym_coaches_internos')
                                if (!coachesInternos) return

                                const coaches = JSON.parse(coachesInternos)
                                const coachIndex = coaches.findIndex((c: any) => c.id === sessionData.coachId)
                                if (coachIndex === -1) return

                                const coach = coaches[coachIndex]
                                const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaParaAsignarRutina.id)
                                if (atletaIndex === -1) return

                                // Si tiene otra rutina asignada, mostrar modal de confirmación
                                if (atletaParaAsignarRutina.rutinaAsignada) {
                                  const rutinaAnterior = rutinasCreadas.find((r: any) => r.id === atletaParaAsignarRutina.rutinaAsignada)
                                  if (rutinaAnterior) {
                                    setConfirmacionReemplazo({
                                      atleta: atletaParaAsignarRutina,
                                      rutinaAnterior: rutinaAnterior,
                                      rutinaNueva: rutina,
                                      callback: async () => {
                                        // Continuar con la asignación
                                        const session = localStorage.getItem('athletixy_session')
                                        if (!session) return
                                        const sessionData = JSON.parse(session)
                                        if (!sessionData.coachId) return

                                        const coachesInternos = localStorage.getItem('gym_coaches_internos')
                                        if (!coachesInternos) return

                                        const coaches = JSON.parse(coachesInternos)
                                        const coachIndex = coaches.findIndex((c: any) => c.id === sessionData.coachId)
                                        if (coachIndex === -1) return

                                        const coach = coaches[coachIndex]
                                        const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaParaAsignarRutina.id)
                                        if (atletaIndex === -1) return

                                        coach.atletas[atletaIndex].rutinaAsignada = rutina.id
                                        coach.atletas[atletaIndex].rutinaAsignadaFecha = new Date().toISOString()

                                        coaches[coachIndex] = coach
                                        localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

                                        setAtletasAsignados(coach.atletas)
                                        setMensajeExito(`Rutina "${rutina.nombre}" asignada a ${atletaParaAsignarRutina.nombre}`)
                                        setMostrarModalExito(true)
                                        setMostrarModalAsignarRutina(false)
                                        setAtletaParaAsignarRutina(null)
                                        setMostrarModalRutinas(false)
                                        setMostrarModalConfirmarReemplazo(false)
                                        setConfirmacionReemplazo(null)
                                      }
                                    })
                                    setMostrarModalConfirmarReemplazo(true)
                                    return
                                  }
                                }

                                // Si no tiene rutina previa, asignar directamente
                                coach.atletas[atletaIndex].rutinaAsignada = rutina.id
                                coach.atletas[atletaIndex].rutinaAsignadaFecha = new Date().toISOString()

                                coaches[coachIndex] = coach
                                localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

                                setAtletasAsignados(coach.atletas)
                                setMensajeExito(`Rutina "${rutina.nombre}" asignada a ${atletaParaAsignarRutina.nombre}`)
                                setMostrarModalExito(true)
                                setMostrarModalAsignarRutina(false)
                                setAtletaParaAsignarRutina(null)
                                setMostrarModalRutinas(false)
                              } catch (error) {
                                console.error('Error asignando rutina:', error)
                                alert('Error al asignar la rutina')
                              }
                            }}
                            className={`px-4 py-2 rounded-lg transition text-sm font-medium whitespace-nowrap ${
                              esRutinaActual
                                ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 cursor-default'
                                : 'bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 cursor-pointer'
                            }`}
                          >
                            {esRutinaActual ? 'Ya Asignada' : 'Asignar'}
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setMostrarModalAsignarRutina(false)
                  setAtletaParaAsignarRutina(null)
                }}
                className="px-6 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Reemplazo de Rutina */}
      {mostrarModalConfirmarReemplazo && confirmacionReemplazo && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[110] p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full border-2 border-gray-200 dark:border-zinc-800 shadow-2xl">
            <div className="text-center mb-6">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-zinc-100 mb-2">
                ¿Reemplazar Rutina?
              </h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm">
                El atleta <span className="font-semibold text-black dark:text-zinc-100">{confirmacionReemplazo.atleta.nombre}</span> ya tiene asignada la rutina:
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">Rutina Actual</p>
                <p className="text-lg font-bold text-red-700 dark:text-red-300">{confirmacionReemplazo.rutinaAnterior.nombre}</p>
                {confirmacionReemplazo.rutinaAnterior.descripcion && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{confirmacionReemplazo.rutinaAnterior.descripcion}</p>
                )}
              </div>

              <div className="flex items-center justify-center">
                <div className="bg-gray-200 dark:bg-zinc-700 rounded-full p-2">
                  <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">Nueva Rutina</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">{confirmacionReemplazo.rutinaNueva.nombre}</p>
                {confirmacionReemplazo.rutinaNueva.descripcion && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">{confirmacionReemplazo.rutinaNueva.descripcion}</p>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-zinc-400 text-center mb-6">
              ¿Deseas reemplazar la rutina actual por la nueva?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setMostrarModalConfirmarReemplazo(false)
                  setConfirmacionReemplazo(null)
                }}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (confirmacionReemplazo.callback) {
                    confirmacionReemplazo.callback()
                  }
                }}
                className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
              >
                Reemplazar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito */}
      {mostrarModalExito && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full border-2 border-gray-200 dark:border-zinc-800 shadow-2xl transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-zinc-100 mb-2">
                ¡Seguimiento Guardado!
              </h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-6">
                {mensajeExito}
              </p>
              <button
                onClick={() => {
                  setMostrarModalExito(false)
                  setMensajeExito('')
                }}
                className="w-full px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium shadow-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

