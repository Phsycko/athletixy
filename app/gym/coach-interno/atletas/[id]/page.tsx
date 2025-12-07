'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  User, 
  ArrowLeft, 
  TrendingUp, 
  Dumbbell, 
  Activity, 
  Calendar, 
  CheckSquare, 
  BarChart3,
  Target,
  Ruler,
  ClipboardList,
  Plus,
  Play,
  CheckCircle,
  X,
  Trash2,
  Clock,
  Circle,
  AlertTriangle
} from 'lucide-react'

export default function AtletaDetallePage() {
  const params = useParams()
  const router = useRouter()
  const atletaId = params.id as string

  const [atleta, setAtleta] = useState<any>(null)
  const [rutinaAsignada, setRutinaAsignada] = useState<any>(null)
  const [ejerciciosGuardados, setEjerciciosGuardados] = useState<any[]>([])
  const [rutinasCreadas, setRutinasCreadas] = useState<any[]>([])
  const [seguimientos, setSeguimientos] = useState<any[]>([])
  const [ejecucionesRutinas, setEjecucionesRutinas] = useState<any[]>([])
  const [mostrarModalSeguimiento, setMostrarModalSeguimiento] = useState(false)
  const [mostrarModalEjecutarRutina, setMostrarModalEjecutarRutina] = useState(false)
  const [ejecucionRutina, setEjecucionRutina] = useState<any>(null)
  const [mostrarModalDetalleSesion, setMostrarModalDetalleSesion] = useState(false)
  const [sesionSeleccionada, setSesionSeleccionada] = useState<any>(null)
  const [mostrarModalLesion, setMostrarModalLesion] = useState(false)
  const [nuevaLesion, setNuevaLesion] = useState({
    tipo: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    activa: true
  })
  const [mostrarModalExito, setMostrarModalExito] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')
  const [mostrarModalDetalleEjecucion, setMostrarModalDetalleEjecucion] = useState(false)
  const [ejecucionSeleccionada, setEjecucionSeleccionada] = useState<any>(null)
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

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const session = localStorage.getItem('athletixy_session')
      if (!session) {
        router.push('/')
        return
      }

      const sessionData = JSON.parse(session)
      if (!sessionData.coachId) {
        router.push('/')
        return
      }

      // Cargar datos del coach
      const coachesInternos = localStorage.getItem('gym_coaches_internos')
      if (coachesInternos) {
        const coaches = JSON.parse(coachesInternos)
        const coach = coaches.find((c: any) => c.id === sessionData.coachId)
        if (coach) {
          const atletaEncontrado = coach.atletas.find((a: any) => a.id === atletaId)
          if (atletaEncontrado) {
            setAtleta(atletaEncontrado)
            setSeguimientos(atletaEncontrado.seguimientos || [])
            setEjecucionesRutinas(atletaEncontrado.ejecucionesRutinas || [])

            // Cargar rutina asignada
            if (atletaEncontrado.rutinaAsignada) {
              const rutinasStr = localStorage.getItem(`gym_rutinas_coach_${sessionData.coachId}`)
              if (rutinasStr) {
                const rutinas = JSON.parse(rutinasStr)
                const rutina = rutinas.find((r: any) => r.id === atletaEncontrado.rutinaAsignada)
                if (rutina) {
                  setRutinaAsignada(rutina)
                }
              }
            }
          } else {
            router.push('/gym/coach-interno/atletas')
            return
          }
        }
      }

      // Cargar ejercicios y rutinas del coach
      const ejerciciosStr = localStorage.getItem(`gym_ejercicios_coach_${sessionData.coachId}`)
      if (ejerciciosStr) {
        setEjerciciosGuardados(JSON.parse(ejerciciosStr))
      }

      const rutinasStr = localStorage.getItem(`gym_rutinas_coach_${sessionData.coachId}`)
      if (rutinasStr) {
        setRutinasCreadas(JSON.parse(rutinasStr))
      }
    } catch (error) {
      console.error('Error loading athlete data:', error)
      router.push('/gym/coach-interno/atletas')
    }
  }, [atletaId, router])

  if (!atleta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-black dark:bg-zinc-100 p-4 rounded-2xl shadow-2xl inline-block mb-4">
            <Dumbbell className="w-12 h-12 text-white dark:text-zinc-900 animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-zinc-400">Cargando datos del atleta...</p>
        </div>
      </div>
    )
  }

  // Estadísticas del atleta
  const estadisticas = {
    progresoTotal: atleta.progreso || 0,
    composicion: atleta.progresoDetallado?.composicion || 0,
    pesos: atleta.progresoDetallado?.pesos || 0,
    ejercicios: atleta.progresoDetallado?.ejercicios || 0,
    rutinas: atleta.progresoDetallado?.rutinas || 0,
    totalSeguimientos: seguimientos.length,
    totalEjecuciones: ejecucionesRutinas.length,
    rutinasCompletadas: ejecucionesRutinas.filter((e: any) => e.porcentajeCompletado >= 100).length,
    ultimaActividad: atleta.ultimaActividad || 'N/A',
    diasInactivos: atleta.diasInactivos || 0
  }

  // Obtener ejercicios únicos de todos los seguimientos
  const ejerciciosRegistrados = new Set<string>()
  seguimientos.forEach((seg: any) => {
    if (seg.registroEjercicios) {
      seg.registroEjercicios.forEach((reg: any) => {
        if (reg.nombre) ejerciciosRegistrados.add(reg.nombre)
      })
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/gym/coach-interno/atletas')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-black dark:text-zinc-100" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-1">{atleta.nombre}</h1>
          <p className="text-gray-500 dark:text-zinc-500">{atleta.email}</p>
        </div>
        {rutinaAsignada && (
          <button
            onClick={() => {
              setEjecucionRutina({
                ejercicios: rutinaAsignada.ejercicios.map((ej: any) => ({
                  ejercicioId: ej.id,
                  ejercicioNombre: ej.nombre,
                  completado: false,
                  peso: '',
                  series: ej.series || '',
                  repeticiones: ej.repeticiones || '',
                  dominio: 0,
                  notas: ''
                })),
                fecha: new Date().toISOString().split('T')[0]
              })
              setMostrarModalEjecutarRutina(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium text-sm"
          >
            <Play className="w-4 h-4" />
            Ejecutar Rutina
          </button>
        )}
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 dark:bg-blue-500/20 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-zinc-400">Progreso Total</p>
              <p className="text-xl font-bold text-black dark:text-zinc-100">{estadisticas.progresoTotal}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/10 dark:bg-green-500/20 p-2 rounded-lg">
              <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-zinc-400">Seguimientos</p>
              <p className="text-xl font-bold text-black dark:text-zinc-100">{estadisticas.totalSeguimientos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/10 dark:bg-purple-500/20 p-2 rounded-lg">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-zinc-400">Rutinas Ejecutadas</p>
              <p className="text-xl font-bold text-black dark:text-zinc-100">{estadisticas.totalEjecuciones}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/10 dark:bg-orange-500/20 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-zinc-400">Última Actividad</p>
              <p className="text-sm font-bold text-black dark:text-zinc-100">{estadisticas.ultimaActividad}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progreso por Categorías */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-4">Progreso por Categorías</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Composición Corporal</p>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(estadisticas.composicion)}%</p>
            <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div 
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                style={{ width: `${estadisticas.composicion}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-green-900 dark:text-green-100">Aumentar Pesos</p>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(estadisticas.pesos)}%</p>
            <div className="mt-2 bg-green-200 dark:bg-green-800 rounded-full h-2">
              <div 
                className="bg-green-600 dark:bg-green-400 h-2 rounded-full"
                style={{ width: `${estadisticas.pesos}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Dominio de Ejercicios</p>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{Math.round(estadisticas.ejercicios)}%</p>
            <div className="mt-2 bg-purple-200 dark:bg-purple-800 rounded-full h-2">
              <div 
                className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full"
                style={{ width: `${estadisticas.ejercicios}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Ejercicios de la Rutina - Con Checkboxes para Palomear */}
      {rutinaAsignada && (
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black dark:text-zinc-100">Ejercicios de la Rutina: {rutinaAsignada.nombre}</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-zinc-500">Duración: {rutinaAsignada.duracion}</span>
              <button
                onClick={() => {
                  const fechaHoy = new Date().toISOString().split('T')[0]
                  const seguimientoHoy = seguimientos.find((s: any) => s.fecha === fechaHoy)
                  
                  if (seguimientoHoy) {
                    // Si ya existe un seguimiento de hoy, actualizarlo
                    setSeguimiento({
                      fecha: fechaHoy,
                      ejerciciosCompletados: seguimientoHoy.ejerciciosCompletados || [],
                      sesionCompletada: seguimientoHoy.sesionCompletada || false,
                      gruposMusculares: seguimientoHoy.gruposMusculares || {
                        pecho: false,
                        espalda: false,
                        hombros: false,
                        brazos: false,
                        piernas: false,
                        core: false
                      },
                      aumentoMusculo: seguimientoHoy.aumentoMusculo || false,
                      disminucionGrasa: seguimientoHoy.disminucionGrasa || false,
                      observaciones: seguimientoHoy.observaciones || '',
                      registroEjercicios: seguimientoHoy.registroEjercicios || []
                    })
                  } else {
                    // Crear nuevo seguimiento para hoy
                    setSeguimiento({
                      fecha: fechaHoy,
                      ejerciciosCompletados: [],
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
                      registroEjercicios: rutinaAsignada.ejercicios.map((ej: any) => ({
                        ejercicioId: ej.id,
                        nombre: ej.nombre,
                        completado: false,
                        peso: '',
                        series: ej.series || '',
                        repeticiones: ej.repeticiones || '',
                        notas: ''
                      }))
                    })
                  }
                  setMostrarModalSeguimiento(true)
                }}
                className="px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition text-sm font-medium"
              >
                <CheckSquare className="w-4 h-4 inline mr-2" />
                Seguimiento de Hoy
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-zinc-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Ejercicio</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Series</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Reps</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Último Peso</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Hoy</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Completado</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rutinaAsignada.ejercicios.map((ejercicio: any, index: number) => {
                  // Buscar el último registro de este ejercicio
                  const ultimoRegistro = seguimientos
                    .flatMap((seg: any) => seg.registroEjercicios || [])
                    .filter((reg: any) => reg.ejercicioId === ejercicio.id || reg.nombre === ejercicio.nombre)
                    .sort((a: any, b: any) => {
                      const fechaA = seguimientos.find((s: any) => s.registroEjercicios?.some((r: any) => r === a))?.fecha || ''
                      const fechaB = seguimientos.find((s: any) => s.registroEjercicios?.some((r: any) => r === b))?.fecha || ''
                      return fechaB.localeCompare(fechaA)
                    })[0]

                  // Buscar registro de hoy
                  const fechaHoy = new Date().toISOString().split('T')[0]
                  const seguimientoHoy = seguimientos.find((s: any) => s.fecha === fechaHoy)
                  const registroHoy = seguimientoHoy?.registroEjercicios?.find((reg: any) => 
                    reg.ejercicioId === ejercicio.id || reg.nombre === ejercicio.nombre
                  )

                  const vecesCompletado = seguimientos.filter((seg: any) =>
                    seg.registroEjercicios?.some((reg: any) => 
                      (reg.ejercicioId === ejercicio.id || reg.nombre === ejercicio.nombre) && reg.completado
                    )
                  ).length

                  return (
                    <tr key={ejercicio.id || index} className="border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-black dark:text-zinc-100">{ejercicio.nombre}</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-500">Completado {vecesCompletado} vez{vecesCompletado !== 1 ? 'es' : ''}</p>
                      </td>
                      <td className="text-center py-3 px-4 text-black dark:text-zinc-100">{ejercicio.series || '-'}</td>
                      <td className="text-center py-3 px-4 text-black dark:text-zinc-100">{ejercicio.repeticiones || '-'}</td>
                      <td className="text-center py-3 px-4 text-black dark:text-zinc-100">
                        {ultimoRegistro?.peso ? `${ultimoRegistro.peso} kg` : '-'}
                      </td>
                      <td className="text-center py-3 px-4">
                        <label className="flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={registroHoy?.completado || false}
                            onChange={async (e) => {
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
                                const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaId)
                                if (atletaIndex === -1) return

                                const fechaHoy = new Date().toISOString().split('T')[0]
                                let seguimientoHoy = coach.atletas[atletaIndex].seguimientos?.find((s: any) => s.fecha === fechaHoy)

                                if (!seguimientoHoy) {
                                  // Crear nuevo seguimiento para hoy
                                  seguimientoHoy = {
                                    id: `seguimiento_${Date.now()}`,
                                    fecha: fechaHoy,
                                    ejerciciosCompletados: [],
                                    registroEjercicios: [],
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
                                    puntosBase: 0,
                                    puntosAplicados: 0,
                                    factorAjuste: 1,
                                    rutinaId: rutinaAsignada?.id || null,
                                    rutinaNombre: rutinaAsignada?.nombre || null,
                                    fechaCreacion: new Date().toISOString(),
                                    coachId: sessionData.coachId
                                  }
                                  
                                  if (!coach.atletas[atletaIndex].seguimientos) {
                                    coach.atletas[atletaIndex].seguimientos = []
                                  }
                                  coach.atletas[atletaIndex].seguimientos.unshift(seguimientoHoy)
                                }

                                // Actualizar o crear registro del ejercicio
                                if (!seguimientoHoy.registroEjercicios) {
                                  seguimientoHoy.registroEjercicios = []
                                }

                                const registroIndex = seguimientoHoy.registroEjercicios.findIndex((r: any) => 
                                  r.ejercicioId === ejercicio.id || r.nombre === ejercicio.nombre
                                )

                                if (e.target.checked) {
                                  if (registroIndex === -1) {
                                    seguimientoHoy.registroEjercicios.push({
                                      ejercicioId: ejercicio.id,
                                      nombre: ejercicio.nombre,
                                      completado: true,
                                      peso: ultimoRegistro?.peso || '',
                                      series: ejercicio.series || '',
                                      repeticiones: ejercicio.repeticiones || '',
                                      notas: ''
                                    })
                                  } else {
                                    seguimientoHoy.registroEjercicios[registroIndex].completado = true
                                  }
                                } else {
                                  if (registroIndex !== -1) {
                                    seguimientoHoy.registroEjercicios[registroIndex].completado = false
                                  }
                                }

                                coaches[coachIndex] = coach
                                localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

                                // Recargar datos
                                setAtleta(coach.atletas[atletaIndex])
                                setSeguimientos(coach.atletas[atletaIndex].seguimientos || [])
                              } catch (error) {
                                console.error('Error actualizando ejercicio:', error)
                                alert('Error al actualizar el ejercicio')
                              }
                            }}
                            className="w-5 h-5 rounded border-gray-300 dark:border-zinc-700 cursor-pointer"
                          />
                        </label>
                      </td>
                      <td className="text-center py-3 px-4">
                        {ultimoRegistro?.completado ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 dark:text-zinc-600 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        <button
                          onClick={() => {
                            const fechaHoy = new Date().toISOString().split('T')[0]
                            const seguimientoHoy = seguimientos.find((s: any) => s.fecha === fechaHoy)
                            const registroExistente = seguimientoHoy?.registroEjercicios?.find((reg: any) => 
                              reg.ejercicioId === ejercicio.id || reg.nombre === ejercicio.nombre
                            )

                            setSeguimiento({
                              fecha: fechaHoy,
                              ejerciciosCompletados: [],
                              sesionCompletada: seguimientoHoy?.sesionCompletada || false,
                              gruposMusculares: seguimientoHoy?.gruposMusculares || {
                                pecho: false,
                                espalda: false,
                                hombros: false,
                                brazos: false,
                                piernas: false,
                                core: false
                              },
                              aumentoMusculo: seguimientoHoy?.aumentoMusculo || false,
                              disminucionGrasa: seguimientoHoy?.disminucionGrasa || false,
                              observaciones: seguimientoHoy?.observaciones || '',
                              registroEjercicios: seguimientoHoy?.registroEjercicios || [registroExistente || {
                                ejercicioId: ejercicio.id,
                                nombre: ejercicio.nombre,
                                completado: true,
                                peso: ultimoRegistro?.peso || '',
                                series: ejercicio.series || '',
                                repeticiones: ejercicio.repeticiones || '',
                                notas: ''
                              }]
                            })
                            setMostrarModalSeguimiento(true)
                          }}
                          className="px-3 py-1 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition text-sm font-medium"
                        >
                          Detalle
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tabla de Sesiones de Entrenamiento */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-4">Historial de Sesiones</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-zinc-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Fecha</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Ejercicios</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Sesión</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Grupos</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Puntos</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Estatus</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {seguimientos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500 dark:text-zinc-500">
                    No hay sesiones registradas
                  </td>
                </tr>
              ) : (
                seguimientos.map((seg: any) => {
                  const gruposTrabajados = Object.values(seg.gruposMusculares || {}).filter((v: any) => v).length
                  const ejerciciosCompletados = seg.registroEjercicios?.length || seg.ejerciciosCompletados?.length || 0
                  const estatusActual = seg.estatus || 'pendiente'

                  const getEstatusInfo = (estatus: string) => {
                    switch (estatus) {
                      case 'en_curso':
                        return {
                          label: 'En Curso',
                          color: 'text-blue-600 dark:text-blue-400',
                          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                          borderColor: 'border-blue-200 dark:border-blue-800',
                          icon: Clock
                        }
                      case 'completada':
                        return {
                          label: 'Completada',
                          color: 'text-green-600 dark:text-green-400',
                          bgColor: 'bg-green-50 dark:bg-green-900/20',
                          borderColor: 'border-green-200 dark:border-green-800',
                          icon: CheckCircle
                        }
                      case 'pendiente':
                      default:
                        return {
                          label: 'Pendiente',
                          color: 'text-orange-600 dark:text-orange-400',
                          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
                          borderColor: 'border-orange-200 dark:border-orange-800',
                          icon: Circle
                        }
                    }
                  }

                  const estatusInfo = getEstatusInfo(estatusActual)
                  const EstatusIcon = estatusInfo.icon

                  return (
                    <tr key={seg.id} className="border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                      <td className="py-3 px-4 text-black dark:text-zinc-100">{seg.fecha}</td>
                      <td className="text-center py-3 px-4 text-black dark:text-zinc-100">{ejerciciosCompletados}</td>
                      <td className="text-center py-3 px-4">
                        {seg.sesionCompletada ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 dark:text-zinc-600 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3 px-4 text-black dark:text-zinc-100">{gruposTrabajados}</td>
                      <td className="text-center py-3 px-4 text-black dark:text-zinc-100 font-medium">
                        +{seg.puntosAplicados || 0}
                      </td>
                      <td className="text-center py-3 px-4">
                        <select
                          value={estatusActual}
                          onChange={async (e) => {
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
                              const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaId)
                              if (atletaIndex === -1) return

                              const seguimientoIndex = coach.atletas[atletaIndex].seguimientos?.findIndex((s: any) => s.id === seg.id)
                              if (seguimientoIndex !== undefined && seguimientoIndex !== -1) {
                                coach.atletas[atletaIndex].seguimientos[seguimientoIndex].estatus = e.target.value
                                coaches[coachIndex] = coach
                                localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

                                setAtleta(coach.atletas[atletaIndex])
                                setSeguimientos(coach.atletas[atletaIndex].seguimientos || [])
                              }
                            } catch (error) {
                              console.error('Error actualizando estatus:', error)
                              alert('Error al actualizar el estatus')
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition ${estatusInfo.bgColor} ${estatusInfo.borderColor} ${estatusInfo.color} focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100 cursor-pointer`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en_curso">En Curso</option>
                          <option value="completada">Completada</option>
                        </select>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSesionSeleccionada(seg)
                              setMostrarModalDetalleSesion(true)
                            }}
                            className="px-3 py-1 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition text-sm"
                          >
                            Ver
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm(`¿Estás seguro de eliminar la sesión del ${seg.fecha}?`)) {
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
                                const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaId)
                                if (atletaIndex === -1) return

                                // Eliminar el seguimiento
                                coach.atletas[atletaIndex].seguimientos = coach.atletas[atletaIndex].seguimientos?.filter((s: any) => s.id !== seg.id) || []

                                // Recalcular progreso (restar los puntos de la sesión eliminada)
                                const puntosEliminados = seg.puntosAplicados || 0
                                const progresoActual = coach.atletas[atletaIndex].progreso || 0
                                const nuevoProgreso = Math.max(0, progresoActual - Math.round(puntosEliminados * 0.1))
                                coach.atletas[atletaIndex].progreso = nuevoProgreso

                                coaches[coachIndex] = coach
                                localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

                                setAtleta(coach.atletas[atletaIndex])
                                setSeguimientos(coach.atletas[atletaIndex].seguimientos || [])
                                
                                alert('Sesión eliminada correctamente')
                              } catch (error) {
                                console.error('Error eliminando sesión:', error)
                                alert('Error al eliminar la sesión')
                              }
                            }}
                            className="p-1.5 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition"
                            title="Eliminar sesión"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Ejecuciones de Rutinas */}
      {ejecucionesRutinas.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-4">Ejecuciones de Rutinas</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-zinc-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Rutina</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Completado</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Dominio</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-black dark:text-zinc-100">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ejecucionesRutinas.map((ejec: any) => (
                  <tr key={ejec.id} className="border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <td className="py-3 px-4 text-black dark:text-zinc-100">{ejec.fecha}</td>
                    <td className="py-3 px-4 text-black dark:text-zinc-100">{ejec.rutinaNombre}</td>
                    <td className="text-center py-3 px-4">
                      <span className="text-sm font-medium text-black dark:text-zinc-100">
                        {Math.round(ejec.porcentajeCompletado || 0)}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 text-black dark:text-zinc-100">
                      {ejec.promedioDominio ? `${ejec.promedioDominio.toFixed(1)}/10` : '-'}
                    </td>
                    <td className="text-center py-3 px-4">
                      <button
                        onClick={() => {
                          setEjecucionSeleccionada(ejec)
                          setMostrarModalDetalleEjecucion(true)
                        }}
                        className="px-3 py-1 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition text-sm"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Seguimiento Completo */}
      {mostrarModalSeguimiento && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-3xl w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-zinc-100">Seguimiento de Ejercicios</h2>
              <button
                onClick={() => setMostrarModalSeguimiento(false)}
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
                  value={seguimiento.fecha}
                  onChange={(e) => setSeguimiento({...seguimiento, fecha: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                />
              </div>

              {rutinaAsignada && seguimiento.registroEjercicios.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-black dark:text-zinc-100">
                    <Dumbbell className="w-4 h-4 inline mr-2" />
                    Registro Detallado de Ejercicios
                  </label>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {seguimiento.registroEjercicios.map((registro: any, index: number) => {
                      const ejercicioEnRutina = rutinaAsignada.ejercicios.find((ej: any) => 
                        ej.id === registro.ejercicioId || ej.nombre === registro.nombre
                      )

                      return (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={registro.completado}
                                onChange={(e) => {
                                  const nuevosRegistros = seguimiento.registroEjercicios.map((r: any, i: number) =>
                                    i === index ? {...r, completado: e.target.checked} : r
                                  )
                                  setSeguimiento({...seguimiento, registroEjercicios: nuevosRegistros})
                                }}
                                className="w-5 h-5 rounded border-gray-300 dark:border-zinc-700"
                              />
                              <span className="text-sm font-medium text-black dark:text-zinc-100">{registro.nombre}</span>
                            </div>
                            {ejercicioEnRutina && (
                              <span className="text-xs text-gray-500 dark:text-zinc-500">
                                {ejercicioEnRutina.series} series × {ejercicioEnRutina.repeticiones} reps
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">
                                Peso Usado (kg)
                              </label>
                              <input
                                type="number"
                                step="0.5"
                                value={registro.peso || ''}
                                onChange={(e) => {
                                  const nuevosRegistros = seguimiento.registroEjercicios.map((r: any, i: number) =>
                                    i === index ? {...r, peso: e.target.value} : r
                                  )
                                  setSeguimiento({...seguimiento, registroEjercicios: nuevosRegistros})
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
                                value={registro.series || ''}
                                onChange={(e) => {
                                  const nuevosRegistros = seguimiento.registroEjercicios.map((r: any, i: number) =>
                                    i === index ? {...r, series: e.target.value} : r
                                  )
                                  setSeguimiento({...seguimiento, registroEjercicios: nuevosRegistros})
                                }}
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 text-sm"
                                placeholder={ejercicioEnRutina?.series || '0'}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">
                                Repeticiones Realizadas
                              </label>
                              <input
                                type="number"
                                value={registro.repeticiones || ''}
                                onChange={(e) => {
                                  const nuevosRegistros = seguimiento.registroEjercicios.map((r: any, i: number) =>
                                    i === index ? {...r, repeticiones: e.target.value} : r
                                  )
                                  setSeguimiento({...seguimiento, registroEjercicios: nuevosRegistros})
                                }}
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 text-sm"
                                placeholder={ejercicioEnRutina?.repeticiones || '0'}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">
                                Notas
                              </label>
                              <input
                                type="text"
                                value={registro.notas || ''}
                                onChange={(e) => {
                                  const nuevosRegistros = seguimiento.registroEjercicios.map((r: any, i: number) =>
                                    i === index ? {...r, notas: e.target.value} : r
                                  )
                                  setSeguimiento({...seguimiento, registroEjercicios: nuevosRegistros})
                                }}
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 text-sm"
                                placeholder="Observaciones..."
                              />
                            </div>
                          </div>
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
                <div className="grid grid-cols-3 gap-2">
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
                  onClick={() => setMostrarModalSeguimiento(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
                >
                  Cancelar
                </button>
                <button
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
                      const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaId)
                      if (atletaIndex === -1) return

                      // Calcular puntos (reutilizar lógica del modal principal)
                      let puntosTotales = 0
                      
                      seguimiento.registroEjercicios.forEach((registro: any) => {
                        if (registro.completado) {
                          let puntosEjercicio = 3
                          if (registro.peso && parseFloat(registro.peso) > 0) {
                            puntosEjercicio += 2
                          }
                          if (registro.series && registro.repeticiones) {
                            const ejercicioEnRutina = rutinaAsignada?.ejercicios.find((ej: any) => 
                              ej.id === registro.ejercicioId || ej.nombre === registro.nombre
                            )
                            if (ejercicioEnRutina) {
                              const seriesCompletadas = parseInt(registro.series) || 0
                              const repeticionesCompletadas = parseInt(registro.repeticiones) || 0
                              const seriesEsperadas = parseInt(ejercicioEnRutina.series || '0') || 0
                              const repeticionesEsperadas = parseInt(ejercicioEnRutina.repeticiones || '0') || 0
                              
                              if (seriesCompletadas >= seriesEsperadas && repeticionesCompletadas >= repeticionesEsperadas) {
                                puntosEjercicio += 3
                              } else if (seriesCompletadas >= seriesEsperadas * 0.8) {
                                puntosEjercicio += 1.5
                              }
                            }
                          }
                          puntosTotales += puntosEjercicio
                        }
                      })

                      if (seguimiento.sesionCompletada) puntosTotales += 5
                      const gruposTrabajados = Object.values(seguimiento.gruposMusculares).filter(v => v).length
                      puntosTotales += gruposTrabajados * 3
                      if (seguimiento.aumentoMusculo) puntosTotales += 8
                      if (seguimiento.disminucionGrasa) puntosTotales += 10

                      // Ajustar según período de rutina
                      let factorAjuste = 1
                      if (rutinaAsignada && atleta.rutinaAsignadaFecha) {
                        const fechaAsignacion = new Date(atleta.rutinaAsignadaFecha)
                        const fechaActual = new Date()
                        const diasTranscurridos = Math.floor((fechaActual.getTime() - fechaAsignacion.getTime()) / (1000 * 60 * 60 * 24))
                        
                        let duracionDias = 7
                        if (rutinaAsignada.duracion.includes('semana')) {
                          duracionDias = parseInt(rutinaAsignada.duracion) * 7
                        } else if (rutinaAsignada.duracion.includes('mes')) {
                          duracionDias = parseInt(rutinaAsignada.duracion) * 30
                        }
                        
                        const porcentajeTiempo = duracionDias > 0 ? (diasTranscurridos / duracionDias) * 100 : 0
                        
                        if (porcentajeTiempo < 100 && porcentajeTiempo > 0) {
                          factorAjuste = 1 + (porcentajeTiempo / 100) * 0.3
                        } else if (porcentajeTiempo >= 100) {
                          factorAjuste = 1.3
                        } else {
                          factorAjuste = 0.8
                        }
                      }

                      let puntosAplicados = Math.round(puntosTotales * factorAjuste)

                      // Comparar con registros anteriores para mejoras de peso
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
                              
                              if (pesoActual > pesoAnterior) {
                                const mejoraPorcentual = ((pesoActual - pesoAnterior) / pesoAnterior) * 100
                                puntosAplicados += Math.min(mejoraPorcentual * 0.5, 5)
                              }
                            }
                          }
                        })
                      }

                      // Buscar si ya existe seguimiento para esta fecha
                      const seguimientoExistenteIndex = coach.atletas[atletaIndex].seguimientos?.findIndex((s: any) => s.fecha === seguimiento.fecha)

                      const seguimientoCompleto = {
                        id: seguimientoExistenteIndex !== undefined && seguimientoExistenteIndex !== -1 
                          ? coach.atletas[atletaIndex].seguimientos[seguimientoExistenteIndex].id
                          : `seguimiento_${Date.now()}`,
                        fecha: seguimiento.fecha,
                        ejerciciosCompletados: seguimiento.registroEjercicios.filter((r: any) => r.completado).map((r: any) => r.nombre),
                        registroEjercicios: seguimiento.registroEjercicios,
                        sesionCompletada: seguimiento.sesionCompletada,
                        gruposMusculares: seguimiento.gruposMusculares,
                        aumentoMusculo: seguimiento.aumentoMusculo,
                        disminucionGrasa: seguimiento.disminucionGrasa,
                        observaciones: seguimiento.observaciones,
                        puntosBase: puntosTotales,
                        puntosAplicados: puntosAplicados,
                        factorAjuste: factorAjuste,
                        rutinaId: rutinaAsignada?.id || null,
                        rutinaNombre: rutinaAsignada?.nombre || null,
                        estatus: seguimientoExistenteIndex !== undefined && seguimientoExistenteIndex !== -1
                          ? (coach.atletas[atletaIndex].seguimientos[seguimientoExistenteIndex].estatus || 'pendiente')
                          : 'pendiente',
                        fechaCreacion: seguimientoExistenteIndex !== undefined && seguimientoExistenteIndex !== -1
                          ? coach.atletas[atletaIndex].seguimientos[seguimientoExistenteIndex].fechaCreacion
                          : new Date().toISOString(),
                        coachId: sessionData.coachId
                      }

                      if (!coach.atletas[atletaIndex].seguimientos) {
                        coach.atletas[atletaIndex].seguimientos = []
                      }

                      if (seguimientoExistenteIndex !== undefined && seguimientoExistenteIndex !== -1) {
                        coach.atletas[atletaIndex].seguimientos[seguimientoExistenteIndex] = seguimientoCompleto
                      } else {
                        coach.atletas[atletaIndex].seguimientos.unshift(seguimientoCompleto)
                      }

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

                      let puntosComposicion = 0
                      let puntosEjercicios = 0
                      let puntosPesos = 0
                      let puntosRutinas = 0

                      if (seguimiento.aumentoMusculo || seguimiento.disminucionGrasa) {
                        puntosComposicion = puntosAplicados * 0.4
                      }
                      if (seguimiento.registroEjercicios.length > 0 || seguimiento.sesionCompletada) {
                        puntosEjercicios = puntosAplicados * 0.3
                      }
                      
                      const ejerciciosConPeso = seguimiento.registroEjercicios.filter((r: any) => r.peso && parseFloat(r.peso) > 0)
                      if (ejerciciosConPeso.length > 0) {
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
                            mejorasPeso += 5
                          }
                        })
                        
                        puntosPesos = Math.min(puntosAplicados * 0.3, mejorasPeso)
                      }
                      
                      if (seguimiento.sesionCompletada || gruposTrabajados > 0) {
                        puntosRutinas = puntosAplicados * 0.3
                      }

                      coach.atletas[atletaIndex].progresoDetallado = {
                        composicion: Math.max(0, Math.min(100, progresoDetallado.composicion + puntosComposicion)),
                        pesos: Math.max(0, Math.min(100, progresoDetallado.pesos + puntosPesos)),
                        ejercicios: Math.max(0, Math.min(100, progresoDetallado.ejercicios + puntosEjercicios)),
                        rutinas: Math.max(0, Math.min(100, (progresoDetallado.rutinas || 0) + puntosRutinas))
                      }

                      // Actualizar última actividad
                      coach.atletas[atletaIndex].ultimaActividad = seguimiento.fecha
                      coach.atletas[atletaIndex].diasInactivos = 0

                      coaches[coachIndex] = coach
                      localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

                      setAtleta(coach.atletas[atletaIndex])
                      setSeguimientos(coach.atletas[atletaIndex].seguimientos || [])
                      setMostrarModalSeguimiento(false)
                      
                      alert(`Seguimiento guardado. Progreso aumentado en ${puntosAplicados} puntos`)
                    } catch (error) {
                      console.error('Error guardando seguimiento:', error)
                      alert('Error al guardar el seguimiento')
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
                >
                  <CheckSquare className="w-4 h-4 inline mr-2" />
                  Guardar Seguimiento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ejecutar Rutina */}
      {mostrarModalEjecutarRutina && ejecucionRutina && rutinaAsignada && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-3xl w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-black dark:text-zinc-100">Ejecutar Rutina</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">
                  Atleta: {atleta.nombre} • Rutina: {rutinaAsignada.nombre}
                </p>
              </div>
              <button
                onClick={() => {
                  setMostrarModalEjecutarRutina(false)
                  setEjecucionRutina(null)
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
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setMostrarModalEjecutarRutina(false)
                    setEjecucionRutina(null)
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    const ejerciciosSinCalificar = ejecucionRutina.ejercicios.filter((e: any) => !e.dominio)
                    if (ejerciciosSinCalificar.length > 0) {
                      alert('Por favor califica el dominio de todos los ejercicios')
                      return
                    }

                    const ejerciciosCompletados = ejecucionRutina.ejercicios.filter((e: any) => e.completado).length
                    const totalEjercicios = ejecucionRutina.ejercicios.length
                    const porcentajeCompletado = (ejerciciosCompletados / totalEjercicios) * 100

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
                      const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaId)
                      if (atletaIndex === -1) return

                      const ejecucionId = `ejecucion_${Date.now()}`
                      const ejecucionCompleta = {
                        id: ejecucionId,
                        rutinaId: rutinaAsignada.id,
                        rutinaNombre: rutinaAsignada.nombre,
                        fecha: ejecucionRutina.fecha,
                        ejercicios: ejecucionRutina.ejercicios,
                        porcentajeCompletado: porcentajeCompletado,
                        promedioDominio: promedioDominio,
                        fechaCreacion: new Date().toISOString()
                      }

                      if (!coach.atletas[atletaIndex].ejecucionesRutinas) {
                        coach.atletas[atletaIndex].ejecucionesRutinas = []
                      }
                      coach.atletas[atletaIndex].ejecucionesRutinas.unshift(ejecucionCompleta)

                      coach.atletas[atletaIndex].ultimaActividad = ejecucionRutina.fecha
                      coach.atletas[atletaIndex].diasInactivos = 0

                      // Recalcular progreso (simplificado)
                      const progresoActual = coach.atletas[atletaIndex].progreso || 0
                      const nuevoProgreso = Math.min(100, progresoActual + Math.round(porcentajeCompletado * 0.1))
                      coach.atletas[atletaIndex].progreso = nuevoProgreso

                      coaches[coachIndex] = coach
                      localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

                      setAtleta(coach.atletas[atletaIndex])
                      setEjecucionesRutinas(coach.atletas[atletaIndex].ejecucionesRutinas || [])
                      setMostrarModalEjecutarRutina(false)
                      setEjecucionRutina(null)
                      
                      setMensajeExito('Rutina ejecutada. Progreso actualizado.')
                      setMostrarModalExito(true)
                    } catch (error) {
                      console.error('Error guardando ejecución:', error)
                      setMensajeExito('Error al guardar la ejecución. Por favor intenta nuevamente.')
                      setMostrarModalExito(true)
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

      {/* Modal de Detalle de Sesión */}
      {mostrarModalDetalleSesion && sesionSeleccionada && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-2xl w-full border-2 border-gray-200 dark:border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-black dark:text-zinc-100">Detalles de la Sesión</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">Fecha: {sesionSeleccionada.fecha}</p>
              </div>
              <button
                onClick={() => {
                  setMostrarModalDetalleSesion(false)
                  setSesionSeleccionada(null)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Información General */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Ejercicios Registrados</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {sesionSeleccionada.registroEjercicios?.length || sesionSeleccionada.ejerciciosCompletados?.length || 0}
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Puntos Obtenidos</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    +{sesionSeleccionada.puntosAplicados || 0}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Grupos Musculares</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Object.values(sesionSeleccionada.gruposMusculares || {}).filter((v: any) => v).length}
                  </p>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-2">
                    {sesionSeleccionada.sesionCompletada ? (
                      <CheckCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    ) : (
                      <X className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    )}
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100">Estado de Sesión</p>
                  </div>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {sesionSeleccionada.sesionCompletada ? 'Completada' : 'Incompleta'}
                  </p>
                </div>
              </div>

              {/* Estatus */}
              {sesionSeleccionada.estatus && (
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                  <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Estatus</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                    sesionSeleccionada.estatus === 'completada' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : sesionSeleccionada.estatus === 'en_curso'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  }`}>
                    {sesionSeleccionada.estatus === 'completada' && <CheckCircle className="w-4 h-4" />}
                    {sesionSeleccionada.estatus === 'en_curso' && <Clock className="w-4 h-4" />}
                    {sesionSeleccionada.estatus === 'pendiente' && <Circle className="w-4 h-4" />}
                    {sesionSeleccionada.estatus === 'completada' ? 'Completada' : 
                     sesionSeleccionada.estatus === 'en_curso' ? 'En Curso' : 'Pendiente'}
                  </span>
                </div>
              )}

              {/* Grupos Musculares Trabajados */}
              {sesionSeleccionada.gruposMusculares && (
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                  <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-3">Grupos Musculares Trabajados</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(sesionSeleccionada.gruposMusculares).map(([grupo, trabajado]: [string, any]) => (
                      trabajado && (
                        <span
                          key={grupo}
                          className="px-3 py-1 bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium capitalize"
                        >
                          {grupo}
                        </span>
                      )
                    ))}
                    {Object.values(sesionSeleccionada.gruposMusculares).filter((v: any) => v).length === 0 && (
                      <span className="text-sm text-gray-500 dark:text-zinc-500">Ninguno registrado</span>
                    )}
                  </div>
                </div>
              )}

              {/* Progreso Físico */}
              {(sesionSeleccionada.aumentoMusculo || sesionSeleccionada.disminucionGrasa) && (
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                  <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-3">Progreso Físico Observado</p>
                  <div className="space-y-2">
                    {sesionSeleccionada.aumentoMusculo && (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Aumento de masa muscular</span>
                      </div>
                    )}
                    {sesionSeleccionada.disminucionGrasa && (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Disminución de porcentaje de grasa</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ejercicios Registrados */}
              {sesionSeleccionada.registroEjercicios && sesionSeleccionada.registroEjercicios.length > 0 && (
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                  <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-3">Ejercicios Registrados</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {sesionSeleccionada.registroEjercicios.map((ejercicio: any, index: number) => (
                      <div key={index} className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {ejercicio.completado ? (
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400 dark:text-zinc-600" />
                            )}
                            <span className="text-sm font-medium text-black dark:text-zinc-100">{ejercicio.nombre}</span>
                          </div>
                        </div>
                        {ejercicio.completado && (
                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-zinc-400 mt-2">
                            {ejercicio.peso && (
                              <div>
                                <span className="font-medium">Peso: </span>
                                {ejercicio.peso} kg
                              </div>
                            )}
                            {ejercicio.series && (
                              <div>
                                <span className="font-medium">Series: </span>
                                {ejercicio.series}
                              </div>
                            )}
                            {ejercicio.repeticiones && (
                              <div>
                                <span className="font-medium">Reps: </span>
                                {ejercicio.repeticiones}
                              </div>
                            )}
                          </div>
                        )}
                        {ejercicio.notas && (
                          <p className="text-xs text-gray-500 dark:text-zinc-500 mt-2 italic">{ejercicio.notas}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Observaciones */}
              {sesionSeleccionada.observaciones && (
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                  <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Observaciones</p>
                  <p className="text-sm text-black dark:text-zinc-100 whitespace-pre-wrap">{sesionSeleccionada.observaciones}</p>
                </div>
              )}

              {/* Información Adicional */}
              <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-3">Información Adicional</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-zinc-500">Puntos Base: </span>
                    <span className="font-medium text-black dark:text-zinc-100">{sesionSeleccionada.puntosBase || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-zinc-500">Factor de Ajuste: </span>
                    <span className="font-medium text-black dark:text-zinc-100">{(sesionSeleccionada.factorAjuste || 1).toFixed(2)}x</span>
                  </div>
                  {sesionSeleccionada.rutinaNombre && (
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-zinc-500">Rutina: </span>
                      <span className="font-medium text-black dark:text-zinc-100">{sesionSeleccionada.rutinaNombre}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setMostrarModalDetalleSesion(false)
                  setSesionSeleccionada(null)
                }}
                className="px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Lesión */}
      {mostrarModalLesion && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full border-2 border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black dark:text-zinc-100">Registrar Lesión</h2>
                  <p className="text-sm text-gray-500 dark:text-zinc-500">Atleta: {atleta?.nombre}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMostrarModalLesion(false)
                  setNuevaLesion({ tipo: '', descripcion: '', fecha: new Date().toISOString().split('T')[0], activa: true })
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Tipo de Lesión <span className="text-red-500">*</span>
                </label>
                <select
                  value={nuevaLesion.tipo}
                  onChange={(e) => setNuevaLesion({...nuevaLesion, tipo: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                >
                  <option value="">Seleccionar tipo...</option>
                  {lesionesComunes.map((lesion) => (
                    <option key={lesion} value={lesion}>{lesion}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Fecha de la Lesión
                </label>
                <input
                  type="date"
                  value={nuevaLesion.fecha}
                  onChange={(e) => setNuevaLesion({...nuevaLesion, fecha: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={nuevaLesion.descripcion}
                  onChange={(e) => setNuevaLesion({...nuevaLesion, descripcion: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Describe la lesión, síntomas, restricciones, etc."
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                <input
                  type="checkbox"
                  checked={nuevaLesion.activa}
                  onChange={(e) => setNuevaLesion({...nuevaLesion, activa: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 dark:border-zinc-700"
                />
                <div>
                  <p className="text-sm font-medium text-black dark:text-zinc-100">Lesión Activa</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">
                    Si está activa, los ejercicios generados con IA se adaptarán automáticamente
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setMostrarModalLesion(false)
                  setNuevaLesion({ tipo: '', descripcion: '', fecha: new Date().toISOString().split('T')[0], activa: true })
                }}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarLesion}
                className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium"
              >
                Guardar Lesión
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
              <div className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                mensajeExito.includes('Error') 
                  ? 'bg-red-100 dark:bg-red-900/30' 
                  : 'bg-green-100 dark:bg-green-900/30'
              }`}>
                {mensajeExito.includes('Error') ? (
                  <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                ) : (
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-black dark:text-zinc-100 mb-2">
                {mensajeExito.includes('Error') ? 'Error' : '¡Rutina Ejecutada!'}
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

      {/* Modal de Detalle de Ejecución de Rutina */}
      {mostrarModalDetalleEjecucion && ejecucionSeleccionada && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-2xl w-full border-2 border-gray-200 dark:border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-black dark:text-zinc-100">Detalles de la Ejecución</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">Fecha: {ejecucionSeleccionada.fecha}</p>
              </div>
              <button
                onClick={() => {
                  setMostrarModalDetalleEjecucion(false)
                  setEjecucionSeleccionada(null)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Información General */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Rutina</p>
                  </div>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {ejecucionSeleccionada.rutinaNombre || 'N/A'}
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Completado</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {Math.round(ejecucionSeleccionada.porcentajeCompletado || 0)}%
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Dominio Promedio</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {ejecucionSeleccionada.promedioDominio ? `${ejecucionSeleccionada.promedioDominio.toFixed(1)}/10` : 'N/A'}
                  </p>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100">Ejercicios</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {ejecucionSeleccionada.ejercicios?.length || 0}
                  </p>
                </div>
              </div>

              {/* Ejercicios de la Ejecución */}
              {ejecucionSeleccionada.ejercicios && ejecucionSeleccionada.ejercicios.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-black dark:text-zinc-100 mb-4 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    Ejercicios Ejecutados
                  </h3>
                  <div className="space-y-3">
                    {ejecucionSeleccionada.ejercicios.map((ejercicio: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {ejercicio.completado ? (
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
                            )}
                            <span className="text-sm font-semibold text-black dark:text-zinc-100">
                              {ejercicio.nombre || `Ejercicio ${index + 1}`}
                            </span>
                          </div>
                          {ejercicio.dominio && (
                            <span className="text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                              Dominio: {ejercicio.dominio}/10
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-sm">
                          {ejercicio.peso && (
                            <div>
                              <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">Peso</p>
                              <p className="font-medium text-black dark:text-zinc-100">{ejercicio.peso} kg</p>
                            </div>
                          )}
                          {ejercicio.series && (
                            <div>
                              <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">Series</p>
                              <p className="font-medium text-black dark:text-zinc-100">{ejercicio.series}</p>
                            </div>
                          )}
                          {ejercicio.repeticiones && (
                            <div>
                              <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">Repeticiones</p>
                              <p className="font-medium text-black dark:text-zinc-100">{ejercicio.repeticiones}</p>
                            </div>
                          )}
                        </div>

                        {ejercicio.notas && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-700">
                            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">Notas</p>
                            <p className="text-sm text-black dark:text-zinc-100">{ejercicio.notas}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Información Adicional */}
              {ejecucionSeleccionada.fechaCreacion && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    Registrado el: {new Date(ejecucionSeleccionada.fechaCreacion).toLocaleString('es-ES')}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setMostrarModalDetalleEjecucion(false)
                  setEjecucionSeleccionada(null)
                }}
                className="px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium shadow-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


