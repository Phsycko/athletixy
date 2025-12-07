'use client'

import { useState, useEffect } from 'react'
import { ClipboardList, Users, Plus, X, Dumbbell, Activity, Calendar, TrendingUp, Target, Ruler } from 'lucide-react'

export default function SeguimientoPage() {
  const [atletasAsignados, setAtletasAsignados] = useState<any[]>([])
  const [atletaSeleccionado, setAtletaSeleccionado] = useState<any>(null)
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false)
  const [nuevoRegistro, setNuevoRegistro] = useState({
    fecha: new Date().toISOString().split('T')[0],
    ejercicio: '',
    maquina: '',
    peso: '',
    series: '',
    repeticiones: '',
    notas: ''
  })
  const [mostrarModalProgreso, setMostrarModalProgreso] = useState(false)
  const [atletaProgreso, setAtletaProgreso] = useState<any>(null)
  const [nuevoProgreso, setNuevoProgreso] = useState({
    fecha: new Date().toISOString().split('T')[0],
    periodo: '',
    pesoCorporal: '',
    porcentajeGrasa: '',
    masaMuscular: '',
    medidas: {
      pecho: '',
      cintura: '',
      cadera: '',
      brazo: '',
      muslo: ''
    },
    objetivos: '',
    observaciones: ''
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

      // Obtener coaches
      const coachesInternos = localStorage.getItem('gym_coaches_internos')
      if (!coachesInternos) return

      const coaches = JSON.parse(coachesInternos)
      const coachIndex = coaches.findIndex((c: any) => c.id === sessionData.coachId)
      if (coachIndex === -1) return

      const coach = coaches[coachIndex]
      const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaSeleccionado.id)
      if (atletaIndex === -1) return

      // Crear registro de entrenamiento
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

      // Agregar registro al atleta
      if (!coach.atletas[atletaIndex].registros) {
        coach.atletas[atletaIndex].registros = []
      }
      coach.atletas[atletaIndex].registros.unshift(registro)

      // Actualizar última actividad
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

      // Guardar cambios
      coaches[coachIndex] = coach
      localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

      // Actualizar estado local
      setAtletasAsignados(coach.atletas)
      setMostrarModalRegistro(false)
      setAtletaSeleccionado(null)
    } catch (error) {
      console.error('Error guardando registro:', error)
      alert('Error al guardar el registro')
    }
  }

  const getRegistrosAtleta = (atletaId: string) => {
    const atleta = atletasAsignados.find(a => a.id === atletaId)
    return atleta?.registros || []
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-1">Seguimiento de Entrenamientos</h1>
          <p className="text-gray-500 dark:text-zinc-500">Registra pesos, máquinas y progreso físico de tus atletas</p>
        </div>
      </div>

      {/* Lista de Atletas con Botón de Registro */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Mis Atletas</h2>
        {atletasAsignados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-zinc-500 text-lg mb-2">No tienes atletas asignados</p>
            <p className="text-sm text-gray-400 dark:text-zinc-600">El gimnasio te asignará atletas próximamente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {atletasAsignados.map((atleta: any) => {
              const registros = getRegistrosAtleta(atleta.id)
              return (
                <div key={atleta.id} className="border-2 border-gray-200 dark:border-zinc-700 rounded-xl p-6 bg-gray-50 dark:bg-zinc-800/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black dark:bg-zinc-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white dark:text-zinc-900" />
                      </div>
                      <div>
                        <p className="text-black dark:text-zinc-100 font-semibold text-lg">{atleta.nombre}</p>
                        <p className="text-sm text-gray-500 dark:text-zinc-500">{atleta.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRegistrarEntrenamiento(atleta)}
                        className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Entrenamiento
                      </button>
                      <button
                        onClick={() => {
                          setAtletaProgreso(atleta)
                          setNuevoProgreso({
                            fecha: new Date().toISOString().split('T')[0],
                            periodo: '',
                            pesoCorporal: '',
                            porcentajeGrasa: '',
                            masaMuscular: '',
                            medidas: {
                              pecho: '',
                              cintura: '',
                              cadera: '',
                              brazo: '',
                              muslo: ''
                            },
                            objetivos: '',
                            observaciones: ''
                          })
                          setMostrarModalProgreso(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
                      >
                        <Target className="w-4 h-4" />
                        Progreso
                      </button>
                    </div>
                  </div>

                  {/* Historial de Registros y Progresos */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 space-y-4">
                    {/* Progresos Físicos */}
                    {atleta.progresos && atleta.progresos.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Evaluaciones de Progreso
                        </h3>
                        <div className="space-y-2">
                          {atleta.progresos.slice(0, 3).map((progreso: any) => (
                            <div key={progreso.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-black dark:text-zinc-100 font-medium text-sm">
                                    {progreso.periodo.charAt(0).toUpperCase() + progreso.periodo.slice(1)} - {progreso.fecha}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                {progreso.pesoCorporal && (
                                  <span className="text-gray-600 dark:text-zinc-400">
                                    Peso: <strong className="text-black dark:text-zinc-100">{progreso.pesoCorporal} kg</strong>
                                  </span>
                                )}
                                {progreso.porcentajeGrasa && (
                                  <span className="text-gray-600 dark:text-zinc-400">
                                    Grasa: <strong className="text-black dark:text-zinc-100">{progreso.porcentajeGrasa}%</strong>
                                  </span>
                                )}
                                {progreso.masaMuscular && (
                                  <span className="text-gray-600 dark:text-zinc-400">
                                    Músculo: <strong className="text-black dark:text-zinc-100">{progreso.masaMuscular} kg</strong>
                                  </span>
                                )}
                              </div>
                              {progreso.objetivos && (
                                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-2">
                                  <strong>Objetivos:</strong> {progreso.objetivos}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Historial de Entrenamientos */}
                    {registros.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Historial de Entrenamientos
                        </h3>
                        <div className="space-y-2">
                          {registros.slice(0, 5).map((registro: any) => (
                            <div key={registro.id} className="p-3 bg-white dark:bg-zinc-900 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-black dark:text-zinc-100 font-medium text-sm">{registro.ejercicio}</p>
                                  <p className="text-xs text-gray-500 dark:text-zinc-500">{registro.fecha}</p>
                                </div>
                                {registro.maquina && (
                                  <span className="px-2 py-1 bg-blue-500/20 dark:bg-blue-500/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                                    {registro.maquina}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-3 text-xs">
                                {registro.peso && (
                                  <span className="text-gray-600 dark:text-zinc-400">
                                    <Dumbbell className="w-3 h-3 inline mr-1" />
                                    {registro.peso} kg
                                  </span>
                                )}
                                {registro.series && (
                                  <span className="text-gray-600 dark:text-zinc-400">Series: {registro.series}</span>
                                )}
                                {registro.repeticiones && (
                                  <span className="text-gray-600 dark:text-zinc-400">Reps: {registro.repeticiones}</span>
                                )}
                              </div>
                              {registro.notas && (
                                <p className="text-xs text-gray-500 dark:text-zinc-500 mt-2">{registro.notas}</p>
                              )}
                            </div>
                          ))}
                          {registros.length > 5 && (
                            <p className="text-xs text-gray-500 dark:text-zinc-500 text-center mt-2">
                              Y {registros.length - 5} entrenamientos más...
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
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

      {/* Modal Registrar Progreso */}
      {mostrarModalProgreso && atletaProgreso && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-2xl w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-black dark:text-zinc-100">Registrar Progreso Físico</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">Atleta: {atletaProgreso.nombre}</p>
              </div>
              <button
                onClick={() => {
                  setMostrarModalProgreso(false)
                  setAtletaProgreso(null)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                    Fecha de Evaluación <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={nuevoProgreso.fecha}
                    onChange={(e) => setNuevoProgreso({...nuevoProgreso, fecha: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                    Período de Evaluación <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={nuevoProgreso.periodo}
                    onChange={(e) => setNuevoProgreso({...nuevoProgreso, periodo: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  >
                    <option value="">Seleccionar período</option>
                    <option value="semanal">Semanal</option>
                    <option value="quincenal">Quincenal</option>
                    <option value="mensual">Mensual</option>
                    <option value="bimestral">Bimestral</option>
                    <option value="trimestral">Trimestral</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Composición Corporal
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Peso Corporal (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nuevoProgreso.pesoCorporal}
                      onChange={(e) => setNuevoProgreso({...nuevoProgreso, pesoCorporal: e.target.value})}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100 text-sm"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">% Grasa Corporal</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nuevoProgreso.porcentajeGrasa}
                      onChange={(e) => setNuevoProgreso({...nuevoProgreso, porcentajeGrasa: e.target.value})}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100 text-sm"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Masa Muscular (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nuevoProgreso.masaMuscular}
                      onChange={(e) => setNuevoProgreso({...nuevoProgreso, masaMuscular: e.target.value})}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100 text-sm"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
                <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Medidas Corporales (cm)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Pecho</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nuevoProgreso.medidas.pecho}
                      onChange={(e) => setNuevoProgreso({...nuevoProgreso, medidas: {...nuevoProgreso.medidas, pecho: e.target.value}})}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100 text-sm"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Cintura</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nuevoProgreso.medidas.cintura}
                      onChange={(e) => setNuevoProgreso({...nuevoProgreso, medidas: {...nuevoProgreso.medidas, cintura: e.target.value}})}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100 text-sm"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Cadera</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nuevoProgreso.medidas.cadera}
                      onChange={(e) => setNuevoProgreso({...nuevoProgreso, medidas: {...nuevoProgreso.medidas, cadera: e.target.value}})}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100 text-sm"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Brazo</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nuevoProgreso.medidas.brazo}
                      onChange={(e) => setNuevoProgreso({...nuevoProgreso, medidas: {...nuevoProgreso.medidas, brazo: e.target.value}})}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100 text-sm"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Muslo</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nuevoProgreso.medidas.muslo}
                      onChange={(e) => setNuevoProgreso({...nuevoProgreso, medidas: {...nuevoProgreso.medidas, muslo: e.target.value}})}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100 text-sm"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Objetivos del Período</label>
                <textarea
                  value={nuevoProgreso.objetivos}
                  onChange={(e) => setNuevoProgreso({...nuevoProgreso, objetivos: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Objetivos específicos para este período de evaluación..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Observaciones</label>
                <textarea
                  value={nuevoProgreso.observaciones}
                  onChange={(e) => setNuevoProgreso({...nuevoProgreso, observaciones: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Observaciones sobre el progreso, cambios notables, recomendaciones..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setMostrarModalProgreso(false)
                    setAtletaProgreso(null)
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!nuevoProgreso.fecha || !nuevoProgreso.periodo) {
                      alert('Por favor completa la fecha y el período de evaluación')
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
                      const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaProgreso.id)
                      if (atletaIndex === -1) return

                      const progresoId = `progreso_${Date.now()}`
                      const progreso = {
                        id: progresoId,
                        fecha: nuevoProgreso.fecha,
                        periodo: nuevoProgreso.periodo,
                        pesoCorporal: nuevoProgreso.pesoCorporal ? parseFloat(nuevoProgreso.pesoCorporal) : null,
                        porcentajeGrasa: nuevoProgreso.porcentajeGrasa ? parseFloat(nuevoProgreso.porcentajeGrasa) : null,
                        masaMuscular: nuevoProgreso.masaMuscular ? parseFloat(nuevoProgreso.masaMuscular) : null,
                        medidas: {
                          pecho: nuevoProgreso.medidas.pecho ? parseFloat(nuevoProgreso.medidas.pecho) : null,
                          cintura: nuevoProgreso.medidas.cintura ? parseFloat(nuevoProgreso.medidas.cintura) : null,
                          cadera: nuevoProgreso.medidas.cadera ? parseFloat(nuevoProgreso.medidas.cadera) : null,
                          brazo: nuevoProgreso.medidas.brazo ? parseFloat(nuevoProgreso.medidas.brazo) : null,
                          muslo: nuevoProgreso.medidas.muslo ? parseFloat(nuevoProgreso.medidas.muslo) : null,
                        },
                        objetivos: nuevoProgreso.objetivos,
                        observaciones: nuevoProgreso.observaciones,
                        fechaCreacion: new Date().toISOString()
                      }

                      if (!coach.atletas[atletaIndex].progresos) {
                        coach.atletas[atletaIndex].progresos = []
                      }
                      coach.atletas[atletaIndex].progresos.unshift(progreso)

                      // Calcular progreso dividido por categorías
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
                          // Agrupar ejercicios por nombre
                          const ejerciciosPorNombre: any = {}
                          registros.forEach((reg: any) => {
                            if (reg.ejercicio && reg.peso) {
                              if (!ejerciciosPorNombre[reg.ejercicio]) {
                                ejerciciosPorNombre[reg.ejercicio] = []
                              }
                              ejerciciosPorNombre[reg.ejercicio].push(reg)
                            }
                          })
                          
                          // Calcular mejoras de peso por ejercicio
                          let mejorasPeso = 0
                          Object.keys(ejerciciosPorNombre).forEach(ejercicio => {
                            const registrosEjercicio = ejerciciosPorNombre[ejercicio].sort((a: any, b: any) => 
                              new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
                            )
                            
                            if (registrosEjercicio.length >= 2) {
                              const primerPeso = registrosEjercicio[0].peso
                              const ultimoPeso = registrosEjercicio[registrosEjercicio.length - 1].peso
                              
                              if (ultimoPeso > primerPeso) {
                                const mejora = ((ultimoPeso - primerPeso) / primerPeso) * 100
                                mejorasPeso += Math.min(mejora, 30) // Máximo 30% por ejercicio
                              }
                            }
                          })
                          
                          progresoPesos = Math.min(30, mejorasPeso / Object.keys(ejerciciosPorNombre).length || 1)
                        }
                        
                        // 3. Progreso por Dominio de Ejercicios (30% del total)
                        if (registros.length > 0) {
                          const ejerciciosUnicos = new Set(registros.map((r: any) => r.ejercicio).filter(Boolean))
                          const totalEjercicios = ejerciciosUnicos.size
                          
                          // Más ejercicios diferentes = más dominio
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
                          
                          // Bonus por frecuencia de entrenamiento
                          const diasEntrenados = new Set(registros.map((r: any) => r.fecha)).size
                          if (diasEntrenados >= 20) {
                            progresoEjercicios += 5
                          } else if (diasEntrenados >= 10) {
                            progresoEjercicios += 3
                          }
                          
                          progresoEjercicios = Math.min(30, progresoEjercicios)
                        }
                        
                        // Calcular progreso total (suma de las 3 categorías)
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
                      setMostrarModalProgreso(false)
                      setAtletaProgreso(null)
                    } catch (error) {
                      console.error('Error guardando progreso:', error)
                      alert('Error al guardar el progreso')
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                >
                  Guardar Progreso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

