'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserCog, Users, Plus, Search, UserPlus, X, User, Check } from 'lucide-react'

export default function CoachesPage() {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')
  const [mostrarModalAsignar, setMostrarModalAsignar] = useState(false)
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false)
  const [mostrarModalCrearAPI, setMostrarModalCrearAPI] = useState(false)
  const [mostrarCredenciales, setMostrarCredenciales] = useState(false)
  const [credencialesCreadas, setCredencialesCreadas] = useState<any>(null)
  const [coachSeleccionado, setCoachSeleccionado] = useState<any>(null)
  const [nuevoCoach, setNuevoCoach] = useState({
    nombre: '',
    email: '',
    password: '',
    especialidad: ''
  })
  const [nuevoCoachAPI, setNuevoCoachAPI] = useState({
    nombre: '',
    email: '',
    password: ''
  })
  const [errorAPI, setErrorAPI] = useState('')
  const [loadingAPI, setLoadingAPI] = useState(false)

  // Cargar coaches desde localStorage
  const [coaches, setCoaches] = useState<any[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem('gym_coaches_internos')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Cargar atletas disponibles desde el módulo de atletas del gym
  const [atletasDisponibles, setAtletasDisponibles] = useState<any[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem('gym_atletas')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Actualizar atletas disponibles cuando cambien
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem('gym_atletas')
      if (stored) {
        setAtletasDisponibles(JSON.parse(stored))
      }
    } catch {
      setAtletasDisponibles([])
    }
  }, [])

  const coachesFiltrados = coaches.filter(coach => 
    busqueda === '' || 
    coach.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    coach.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleAsignarAtletas = (coach: any) => {
    setCoachSeleccionado(coach)
    setMostrarModalAsignar(true)
  }

  const handleCrearCoach = () => {
    if (!nuevoCoach.nombre || !nuevoCoach.email || !nuevoCoach.password) {
      alert('Por favor completa todos los campos')
      return
    }

    const coachId = `coach_${Date.now()}`
    const nuevoCoachCompleto = {
      id: coachId,
      nombre: nuevoCoach.nombre,
      email: nuevoCoach.email.toLowerCase().trim(),
      password: nuevoCoach.password,
      especialidad: nuevoCoach.especialidad,
      activo: true,
      atletas: [],
      fechaCreacion: new Date().toISOString()
    }

    const coachesActualizados = [...coaches, nuevoCoachCompleto]
    setCoaches(coachesActualizados)
    localStorage.setItem('gym_coaches_internos', JSON.stringify(coachesActualizados))

    // Mostrar credenciales
    setCredencialesCreadas({
      email: nuevoCoachCompleto.email,
      password: nuevoCoach.password
    })
    setMostrarCredenciales(true)

    // Limpiar formulario
    setNuevoCoach({ nombre: '', email: '', password: '', especialidad: '' })
    setMostrarModalCrear(false)
  }

  const handleAsignarAtleta = (atleta: any) => {
    if (!coachSeleccionado) return

    const coachesActualizados = coaches.map((c: any) => {
      if (c.id === coachSeleccionado.id) {
        const atletasActuales = c.atletas || []
        const yaAsignado = atletasActuales.some((a: any) => a.id === atleta.id)
        
        if (yaAsignado) {
          // Desasignar
          return {
            ...c,
            atletas: atletasActuales.filter((a: any) => a.id !== atleta.id)
          }
        } else {
          // Asignar - agregar datos de progreso si no existen
          const atletaConProgreso = {
            ...atleta,
            progreso: atleta.progreso || 0,
            rutinasCompletadas: atleta.rutinasCompletadas || 0,
            ultimaActividad: atleta.ultimaActividad || new Date().toISOString().split('T')[0],
            activo: atleta.activo !== undefined ? atleta.activo : true
          }
          return {
            ...c,
            atletas: [...atletasActuales, atletaConProgreso]
          }
        }
      }
      return c
    })

    setCoaches(coachesActualizados)
    localStorage.setItem('gym_coaches_internos', JSON.stringify(coachesActualizados))
    
    // Actualizar coach seleccionado
    const coachActualizado = coachesActualizados.find((c: any) => c.id === coachSeleccionado.id)
    setCoachSeleccionado(coachActualizado)
  }

  const handleEliminarAtleta = (atletaId: string) => {
    if (!coachSeleccionado) return

    const coachesActualizados = coaches.map((c: any) => {
      if (c.id === coachSeleccionado.id) {
        return {
          ...c,
          atletas: (c.atletas || []).filter((a: any) => a.id !== atletaId)
        }
      }
      return c
    })

    setCoaches(coachesActualizados)
    localStorage.setItem('gym_coaches_internos', JSON.stringify(coachesActualizados))
    
    const coachActualizado = coachesActualizados.find((c: any) => c.id === coachSeleccionado.id)
    setCoachSeleccionado(coachActualizado)
  }

  const handleToggleActivo = (coachId: string) => {
    const coachesActualizados = coaches.map((c: any) => {
      if (c.id === coachId) {
        return { ...c, activo: !c.activo }
      }
      return c
    })

    setCoaches(coachesActualizados)
    localStorage.setItem('gym_coaches_internos', JSON.stringify(coachesActualizados))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-1">Gestión de Coaches</h1>
          <p className="text-gray-500 dark:text-zinc-500">Administra coaches y asigna atletas</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setMostrarModalCrearAPI(true)
              setErrorAPI('')
              setNuevoCoachAPI({ nombre: '', email: '', password: '' })
            }}
            className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Registrar Coach Interno
          </button>
          <button 
            onClick={() => setMostrarModalCrear(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Agregar Coach
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Total Coaches</p>
          <p className="text-2xl font-bold text-black dark:text-zinc-100">{coaches.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Coaches Activos</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {coaches.filter((c: any) => c.activo).length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Atletas Asignados</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {coaches.reduce((total: number, coach: any) => total + (coach.atletas?.length || 0), 0)}
          </p>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar coach por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
          />
        </div>
      </div>

      {/* Lista de Coaches */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Coaches del Gimnasio</h2>
        {coachesFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <UserCog className="w-16 h-16 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-zinc-500 text-lg mb-2">No hay coaches registrados</p>
            <p className="text-sm text-gray-400 dark:text-zinc-600">Agrega coaches para comenzar a asignar atletas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {coachesFiltrados.map((coach: any) => (
              <div key={coach.id} className="border-2 border-gray-200 dark:border-zinc-700 rounded-xl p-6 bg-gray-50 dark:bg-zinc-800/50">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-black dark:bg-zinc-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserCog className="w-8 h-8 text-white dark:text-zinc-900" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-black dark:text-zinc-100">{coach.nombre}</h3>
                        {coach.activo ? (
                          <span className="px-2 py-1 bg-green-500/20 dark:bg-green-500/30 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
                            Activo
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-500/20 dark:bg-gray-500/30 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                            Inactivo
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-zinc-400 mb-1">{coach.email}</p>
                      {coach.especialidad && (
                        <p className="text-sm text-gray-500 dark:text-zinc-500">Especialidad: {coach.especialidad}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAsignarAtletas(coach)}
                      className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium text-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      Asignar Atletas
                    </button>
                    <button 
                      onClick={() => handleToggleActivo(coach.id)}
                      className={`px-4 py-2 rounded-lg transition font-medium text-sm ${
                        coach.activo
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {coach.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium text-sm">
                      Ver Detalles
                    </button>
                  </div>
                </div>

                {/* Atletas Asignados */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Atletas Asignados ({coach.atletas?.length || 0})
                    </h4>
                  </div>
                  {coach.atletas && coach.atletas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {coach.atletas.map((atleta: any) => (
                        <div key={atleta.id} className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                          <div className="w-10 h-10 bg-black dark:bg-zinc-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white dark:text-zinc-900" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black dark:text-zinc-100 truncate">{atleta.nombre}</p>
                            <p className="text-xs text-gray-500 dark:text-zinc-500 truncate">{atleta.email}</p>
                          </div>
                          <button 
                            onClick={() => handleEliminarAtleta(atleta.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition"
                          >
                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-white dark:bg-zinc-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-700">
                      <p className="text-sm text-gray-500 dark:text-zinc-500">No hay atletas asignados</p>
                      <button
                        onClick={() => handleAsignarAtletas(coach)}
                        className="mt-2 text-sm text-black dark:text-zinc-100 hover:underline font-medium"
                      >
                        Asignar atletas ahora
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Asignar Atletas */}
      {mostrarModalAsignar && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-2xl w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-zinc-100">
                Asignar Atletas a {coachSeleccionado?.nombre}
              </h2>
              <button
                onClick={() => setMostrarModalAsignar(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            {atletasDisponibles.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-zinc-500 text-lg mb-2">No hay atletas disponibles</p>
                <p className="text-sm text-gray-400 dark:text-zinc-600">Registra atletas primero para poder asignarlos</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar atleta..."
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                  {atletasDisponibles.map((atleta: any) => {
                    const estaAsignado = coachSeleccionado?.atletas?.some((a: any) => a.id === atleta.id)
                    return (
                      <div
                        key={atleta.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 transition cursor-pointer ${
                          estaAsignado
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                            : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:border-black dark:hover:border-zinc-600'
                        }`}
                      >
                        <div className="w-10 h-10 bg-black dark:bg-zinc-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white dark:text-zinc-900" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black dark:text-zinc-100">{atleta.nombre}</p>
                          <p className="text-xs text-gray-500 dark:text-zinc-500">{atleta.email}</p>
                        </div>
                        {estaAsignado ? (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <Check className="w-5 h-5" />
                            <span className="text-sm font-medium">Asignado</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAsignarAtleta(atleta)}
                            className="px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium text-sm"
                          >
                            Asignar
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-zinc-800">
                  <button
                    onClick={() => setMostrarModalAsignar(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Crear Coach */}
      {mostrarModalCrear && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full border-2 border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-zinc-100">Crear Nuevo Coach</h2>
              <button
                onClick={() => {
                  setMostrarModalCrear(false)
                  setNuevoCoach({ nombre: '', email: '', password: '', especialidad: '' })
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={nuevoCoach.nombre}
                  onChange={(e) => setNuevoCoach({...nuevoCoach, nombre: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Nombre del coach"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Email</label>
                <input
                  type="email"
                  value={nuevoCoach.email}
                  onChange={(e) => setNuevoCoach({...nuevoCoach, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={nuevoCoach.password}
                  onChange={(e) => setNuevoCoach({...nuevoCoach, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Especialidad (Opcional)</label>
                <input
                  type="text"
                  value={nuevoCoach.especialidad}
                  onChange={(e) => setNuevoCoach({...nuevoCoach, especialidad: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Ej: Fuerza, Cardio, etc."
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setMostrarModalCrear(false)
                    setNuevoCoach({ nombre: '', email: '', password: '', especialidad: '' })
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCrearCoach}
                  className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
                >
                  Crear Coach
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Mostrar Credenciales */}
      {mostrarCredenciales && credencialesCreadas && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full border-2 border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-zinc-100">Coach Creado Exitosamente</h2>
              <button
                onClick={() => {
                  setMostrarCredenciales(false)
                  setCredencialesCreadas(null)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">El coach puede iniciar sesión con estas credenciales:</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Email:</p>
                    <p className="text-sm font-mono font-semibold text-black dark:text-zinc-100 bg-white dark:bg-zinc-800 p-2 rounded border border-gray-200 dark:border-zinc-700">
                      {credencialesCreadas.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Contraseña:</p>
                    <p className="text-sm font-mono font-semibold text-black dark:text-zinc-100 bg-white dark:bg-zinc-800 p-2 rounded border border-gray-200 dark:border-zinc-700">
                      {credencialesCreadas.password}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-3 font-medium">
                  ⚠️ Guarda estas credenciales. El coach las necesitará para acceder a su espacio privado.
                </p>
              </div>
              <button
                onClick={() => {
                  setMostrarCredenciales(false)
                  setCredencialesCreadas(null)
                }}
                className="w-full px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Coach Interno (API) */}
      {mostrarModalCrearAPI && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full border-2 border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-zinc-100">Registrar Coach Interno</h2>
              <button
                onClick={() => {
                  setMostrarModalCrearAPI(false)
                  setNuevoCoachAPI({ nombre: '', email: '', password: '' })
                  setErrorAPI('')
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            {errorAPI && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{errorAPI}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={nuevoCoachAPI.nombre}
                  onChange={(e) => setNuevoCoachAPI({...nuevoCoachAPI, nombre: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Nombre del coach"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Email</label>
                <input
                  type="email"
                  value={nuevoCoachAPI.email}
                  onChange={(e) => setNuevoCoachAPI({...nuevoCoachAPI, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={nuevoCoachAPI.password}
                  onChange={(e) => setNuevoCoachAPI({...nuevoCoachAPI, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setMostrarModalCrearAPI(false)
                    setNuevoCoachAPI({ nombre: '', email: '', password: '' })
                    setErrorAPI('')
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
                  disabled={loadingAPI}
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    if (!nuevoCoachAPI.nombre || !nuevoCoachAPI.email || !nuevoCoachAPI.password) {
                      setErrorAPI('Por favor completa todos los campos')
                      return
                    }

                    if (nuevoCoachAPI.password.length < 6) {
                      setErrorAPI('La contraseña debe tener al menos 6 caracteres')
                      return
                    }

                    try {
                      setLoadingAPI(true)
                      setErrorAPI('')

                      // Obtener gymManagerId desde localStorage
                      const session = localStorage.getItem('athletixy_session')
                      if (!session) {
                        setErrorAPI('No se encontró la sesión. Por favor inicia sesión nuevamente.')
                        setLoadingAPI(false)
                        return
                      }

                      const sessionData = JSON.parse(session)
                      const gymManagerId = sessionData.user?.id || sessionData.id

                      if (!gymManagerId) {
                        setErrorAPI('No se pudo obtener el ID del gimnasio. Por favor inicia sesión nuevamente.')
                        setLoadingAPI(false)
                        return
                      }

                      const response = await fetch('/api/gym/coaches', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          nombre: nuevoCoachAPI.nombre,
                          email: nuevoCoachAPI.email,
                          password: nuevoCoachAPI.password,
                          gymManagerId: gymManagerId,
                        }),
                      })

                      const data = await response.json()

                      if (!response.ok) {
                        setErrorAPI(data.error || 'Error al crear el coach interno')
                        setLoadingAPI(false)
                        return
                      }

                      // Éxito
                      setMostrarModalCrearAPI(false)
                      setNuevoCoachAPI({ nombre: '', email: '', password: '' })
                      setErrorAPI('')
                      router.refresh()
                    } catch (error: any) {
                      console.error('Error creando coach interno:', error)
                      setErrorAPI('Error al crear el coach interno. Por favor intenta nuevamente.')
                    } finally {
                      setLoadingAPI(false)
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loadingAPI}
                >
                  {loadingAPI ? 'Creando...' : 'Crear Coach'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

