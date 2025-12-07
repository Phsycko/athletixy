'use client'

import { useState } from 'react'
import { CreditCard, Search, Filter, Calendar, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function SuscripcionesPage() {
  const [filtroEstado, setFiltroEstado] = useState<'todas' | 'activas' | 'por-vencer' | 'vencidas' | 'sin-suscripcion'>('todas')
  const [busqueda, setBusqueda] = useState('')

  const suscripciones: any[] = []

  const suscripcionesFiltradas = suscripciones.filter(sub => {
    const matchEstado = filtroEstado === 'todas' || sub.estado === filtroEstado
    const matchBusqueda = busqueda === '' || 
      sub.atleta.toLowerCase().includes(busqueda.toLowerCase()) ||
      sub.email.toLowerCase().includes(busqueda.toLowerCase())
    return matchEstado && matchBusqueda
  })

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activa':
        return <span className="px-2 py-1 bg-green-500/20 dark:bg-green-500/30 text-green-600 dark:text-green-400 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Activa</span>
      case 'por-vencer':
        return <span className="px-2 py-1 bg-yellow-500/20 dark:bg-yellow-500/30 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Por Vencer</span>
      case 'vencida':
        return <span className="px-2 py-1 bg-red-500/20 dark:bg-red-500/30 text-red-600 dark:text-red-400 rounded-full text-xs font-medium flex items-center gap-1"><XCircle className="w-3 h-3" /> Vencida</span>
      case 'sin-suscripcion':
        return <span className="px-2 py-1 bg-gray-500/20 dark:bg-gray-500/30 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">Sin Suscripción</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-1">Gestión de Suscripciones</h1>
        <p className="text-gray-500 dark:text-zinc-500">Administra todas las suscripciones de tu gimnasio</p>
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
            {(['todas', 'activas', 'por-vencer', 'vencidas', 'sin-suscripcion'] as const).map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                  filtroEstado === estado
                    ? 'bg-black dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-800'
                }`}
              >
                {estado === 'todas' ? 'Todas' : 
                 estado === 'activas' ? 'Activas' :
                 estado === 'por-vencer' ? 'Por Vencer' :
                 estado === 'vencidas' ? 'Vencidas' :
                 'Sin Suscripción'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Total Suscripciones</p>
          <p className="text-2xl font-bold text-black dark:text-zinc-100">{suscripciones.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Activas</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {suscripciones.filter(s => s.estado === 'activa').length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Por Vencer</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {suscripciones.filter(s => s.estado === 'por-vencer').length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">Sin Suscripción</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {suscripciones.filter(s => s.estado === 'sin-suscripcion').length}
          </p>
        </div>
      </div>

      {/* Lista de Suscripciones */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-100 mb-6">Suscripciones</h2>
        {suscripcionesFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-zinc-500">No hay suscripciones registradas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suscripcionesFiltradas.map((suscripcion) => (
            <div key={suscripcion.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-black dark:bg-zinc-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white dark:text-zinc-900" />
                  </div>
                  <div>
                    <p className="text-black dark:text-zinc-100 font-semibold">{suscripcion.atleta}</p>
                    <p className="text-sm text-gray-500 dark:text-zinc-500">{suscripcion.email}</p>
                  </div>
                  {getEstadoBadge(suscripcion.estado)}
                </div>
                {suscripcion.plan && (
                  <div className="ml-13 mt-2 space-y-1">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      Plan: <span className="font-medium text-black dark:text-zinc-100">{suscripcion.plan}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      Monto: <span className="font-medium text-black dark:text-zinc-100">${suscripcion.monto}/mes</span>
                    </p>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-zinc-400">
                      <span>Inicio: {suscripcion.fechaInicio}</span>
                      <span>Vence: {suscripcion.fechaVencimiento}</span>
                      {suscripcion.diasRestantes !== null && (
                        <span className={suscripcion.diasRestantes < 10 ? 'text-yellow-600 dark:text-yellow-400 font-medium' : ''}>
                          {suscripcion.diasRestantes > 0 ? `${suscripcion.diasRestantes} días restantes` : `Vencida hace ${Math.abs(suscripcion.diasRestantes)} días`}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {!suscripcion.plan && (
                  <div className="ml-13 mt-2">
                    <p className="text-sm text-gray-500 dark:text-zinc-500">Este atleta no tiene suscripción activa</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {suscripcion.estado === 'por-vencer' && (
                  <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition font-medium text-sm">
                    Renovar
                  </button>
                )}
                {suscripcion.estado === 'vencida' && (
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium text-sm">
                    Reactivar
                  </button>
                )}
                {suscripcion.estado === 'sin-suscripcion' && (
                  <button className="px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium text-sm">
                    Crear Suscripción
                  </button>
                )}
                {suscripcion.estado === 'activa' && (
                  <button className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium text-sm">
                    Ver Detalles
                  </button>
                )}
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

