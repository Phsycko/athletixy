'use client'

import { useState } from 'react'
import { Bell, AlertCircle, CreditCard, Users, DollarSign, Calendar, Check } from 'lucide-react'

export default function NotificacionesPage() {
  const [filtro, setFiltro] = useState<'todas' | 'renovaciones' | 'inactivos' | 'ventas' | 'sistema'>('todas')

  const notificaciones: any[] = []

  const notificacionesFiltradas = filtro === 'todas' 
    ? notificaciones 
    : notificaciones.filter(n => n.tipo === filtro)

  const noLeidas = notificaciones.filter(n => !n.leido).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-black dark:text-zinc-100">Notificaciones</h1>
            {noLeidas > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                {noLeidas} nuevas
              </span>
            )}
          </div>
          <p className="text-gray-500 dark:text-zinc-500">Mantente al día con tu gimnasio</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-black dark:text-zinc-100 rounded-lg transition border-2 border-gray-200 dark:border-zinc-800">
          <Check className="w-5 h-5" />
          Marcar todas como leídas
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {([
          { id: 'todas', label: 'Todas' },
          { id: 'renovaciones', label: 'Renovaciones' },
          { id: 'inactivos', label: 'Inactivos' },
          { id: 'ventas', label: 'Ventas' },
          { id: 'sistema', label: 'Sistema' },
        ] as const).map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filtro === f.id
                ? 'bg-white dark:bg-zinc-100 text-black dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-zinc-100 border-2 border-gray-200 dark:border-zinc-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de Notificaciones */}
      {notificacionesFiltradas.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-12 text-center">
          <Bell className="w-12 h-12 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-zinc-500 text-lg">No hay notificaciones</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificacionesFiltradas.map((notif) => {
          const Icon = notif.icon
          return (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer ${
                !notif.leido
                  ? 'bg-white/5 dark:bg-zinc-800/50 border-gray-600/30 dark:border-zinc-700 hover:border-gray-600 dark:hover:border-zinc-600'
                  : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className={`${notif.bgColor} p-3 rounded-lg flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${notif.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="text-black dark:text-zinc-100 font-semibold">{notif.titulo}</h3>
                  {!notif.leido && (
                    <span className="w-2 h-2 bg-black dark:bg-zinc-100 rounded-full flex-shrink-0 mt-1.5"></span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-zinc-400 text-sm mb-2">{notif.mensaje}</p>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 dark:text-zinc-500 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {notif.fecha}
                  </span>
                  {!notif.leido && (
                    <button className="text-gray-700 dark:text-zinc-300 text-xs hover:text-black dark:hover:text-zinc-100 transition">
                      Marcar como leída
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
          })}
        </div>
      )}
    </div>
  )
}

