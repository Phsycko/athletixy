'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Filter, User, Calendar, Activity, TrendingUp, CreditCard, Plus, X } from 'lucide-react'

export default function AtletasPage() {
  const [busqueda, setBusqueda] = useState('')
  const [filtroActividad, setFiltroActividad] = useState<'todos' | 'activos' | 'inactivos'>('todos')
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false)
  const [nuevoAtleta, setNuevoAtleta] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    genero: '',
    suscripcion: ''
  })

  // Cargar atletas desde localStorage
  const [atletas, setAtletas] = useState<any[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem('gym_atletas')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const handleCrearAtleta = () => {
    if (!nuevoAtleta.nombre || !nuevoAtleta.email) {
      alert('Por favor completa al menos el nombre y email')
      return
    }

    const atletaId = `atleta_${Date.now()}`
    const nuevoAtletaCompleto = {
      id: atletaId,
      nombre: nuevoAtleta.nombre,
      email: nuevoAtleta.email.toLowerCase().trim(),
      telefono: nuevoAtleta.telefono || '',
      fechaNacimiento: nuevoAtleta.fechaNacimiento || '',
      genero: nuevoAtleta.genero || '',
      suscripcion: nuevoAtleta.suscripcion || 'sin-suscripcion',
      fechaRegistro: new Date().toISOString(),
      ultimaActividad: new Date().toISOString().split('T')[0],
      diasInactivos: 0,
      estadoSuscripcion: nuevoAtleta.suscripcion || 'sin-suscripcion',
      rutinasCompletadas: 0,
      progreso: 0,
      activo: true
    }

    const atletasActualizados = [...atletas, nuevoAtletaCompleto]
    setAtletas(atletasActualizados)
    localStorage.setItem('gym_atletas', JSON.stringify(atletasActualizados))

    // Limpiar formulario
    setNuevoAtleta({ nombre: '', email: '', telefono: '', fechaNacimiento: '', genero: '', suscripcion: '' })
    setMostrarModalCrear(false)
  }

  const atletasFiltrados = atletas.filter(atleta => {
    const matchBusqueda = busqueda === '' || 
      atleta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      atleta.email.toLowerCase().includes(busqueda.toLowerCase())
    const matchActividad = filtroActividad === 'todos' ||
      (filtroActividad === 'activos' && atleta.diasInactivos < 7) ||
      (filtroActividad === 'inactivos' && atleta.diasInactivos >= 7)
    return matchBusqueda && matchActividad
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-1">Gestión de Atletas</h1>
          <p className="text-gray-500 dark:text-zinc-500">Administra y monitorea a todos los atletas de tu gimnasio</p>
        </div>
        <button
          onClick={() => setMostrarModalCrear(true)}
          className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Crear Atleta
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Total Atletas</p>
          <p className="text-2xl font-bold text-black dark:text-zinc-100">{atletas.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Activos</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {atletas.filter(a => a.diasInactivos < 7).length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Inactivos</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {atletas.filter(a => a.diasInactivos >= 7).length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Con Suscripción</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {atletas.filter(a => a.estadoSuscripcion === 'activa').length}
          </p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
            />
          </div>
          <div className="flex gap-2">
            {(['todos', 'activos', 'inactivos'] as const).map((filtro) => (
              <button
                key={filtro}
                onClick={() => setFiltroActividad(filtro)}
                className={`px-4 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                  filtroActividad === filtro
                    ? 'bg-black dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-800'
                }`}
              >
                {filtro === 'todos' ? 'Todos' : filtro === 'activos' ? 'Activos' : 'Inactivos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Atletas */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Lista de Atletas</h2>
        {atletasFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-zinc-500">No hay atletas registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {atletasFiltrados.map((atleta) => (
            <div key={atleta.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-black dark:bg-zinc-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white dark:text-zinc-900" />
                  </div>
                  <div>
                    <p className="text-black dark:text-zinc-100 font-semibold">{atleta.nombre}</p>
                    <p className="text-sm text-gray-500 dark:text-zinc-500">{atleta.email}</p>
                  </div>
                  {atleta.diasInactivos >= 7 && (
                    <span className="px-2 py-1 bg-yellow-500/20 dark:bg-yellow-500/30 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-medium">
                      Inactivo {atleta.diasInactivos} días
                    </span>
                  )}
                  {atleta.diasInactivos < 7 && (
                    <span className="px-2 py-1 bg-green-500/20 dark:bg-green-500/30 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
                      Activo
                    </span>
                  )}
                </div>
                <div className="ml-15 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-zinc-500">Suscripción</p>
                    <p className="text-black dark:text-zinc-100 font-medium">{atleta.suscripcion}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-zinc-500">Última Actividad</p>
                    <p className="text-black dark:text-zinc-100 font-medium">{atleta.ultimaActividad}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-zinc-500">Rutinas Completadas</p>
                    <p className="text-black dark:text-zinc-100 font-medium">{atleta.rutinasCompletadas}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-zinc-500">Progreso</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                        <div 
                          className="bg-black dark:bg-zinc-100 h-2 rounded-full"
                          style={{ width: `${atleta.progreso}%` }}
                        />
                      </div>
                      <span className="text-black dark:text-zinc-100 font-medium">{atleta.progreso}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium text-sm">
                  Ver Detalles
                </button>
                <button className="px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium text-sm">
                  Rutinas
                </button>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear Atleta */}
      {mostrarModalCrear && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-zinc-100">Crear Nuevo Atleta</h2>
              <button
                onClick={() => {
                  setMostrarModalCrear(false)
                  setNuevoAtleta({ nombre: '', email: '', telefono: '', fechaNacimiento: '', genero: '', suscripcion: '' })
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nuevoAtleta.nombre}
                  onChange={(e) => setNuevoAtleta({...nuevoAtleta, nombre: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Nombre del atleta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={nuevoAtleta.email}
                  onChange={(e) => setNuevoAtleta({...nuevoAtleta, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={nuevoAtleta.telefono}
                  onChange={(e) => setNuevoAtleta({...nuevoAtleta, telefono: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="+52 55 1234 5678"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={nuevoAtleta.fechaNacimiento}
                    onChange={(e) => setNuevoAtleta({...nuevoAtleta, fechaNacimiento: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Género</label>
                  <select
                    value={nuevoAtleta.genero}
                    onChange={(e) => setNuevoAtleta({...nuevoAtleta, genero: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  >
                    <option value="">Seleccionar</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Tipo de Suscripción</label>
                <select
                  value={nuevoAtleta.suscripcion}
                  onChange={(e) => setNuevoAtleta({...nuevoAtleta, suscripcion: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                >
                  <option value="sin-suscripcion">Sin Suscripción</option>
                  <option value="basico">Básico</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setMostrarModalCrear(false)
                    setNuevoAtleta({ nombre: '', email: '', telefono: '', fechaNacimiento: '', genero: '', suscripcion: '' })
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCrearAtleta}
                  className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
                >
                  Crear Atleta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

