'use client'

import { Bell, Check, Clock, AlertCircle, MessageSquare, TrendingUp, Star } from 'lucide-react'

export default function NotificacionesPage() {
  const notificaciones = [
    {
      tipo: 'entrenamiento',
      icon: AlertCircle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      titulo: 'Recordatorio de Entrenamiento',
      mensaje: 'Tienes programado "Pierna" para hoy a las 18:00',
      fecha: 'Hace 1 hora',
      leido: false,
    },
    {
      tipo: 'progreso',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      titulo: '¡Nuevo Récord Personal!',
      mensaje: 'Has alcanzado un nuevo récord en Press de Banca: 85 kg',
      fecha: 'Hace 3 horas',
      leido: false,
    },
    {
      tipo: 'mensaje',
      icon: MessageSquare,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      titulo: 'Mensaje de tu Coach',
      mensaje: 'Tu coach te ha enviado un nuevo plan de entrenamiento',
      fecha: 'Hace 5 horas',
      leido: true,
    },
    {
      tipo: 'sistema',
      icon: Star,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      titulo: 'Actualización Premium',
      mensaje: 'Nuevas funcionalidades disponibles en tu plan Premium',
      fecha: 'Ayer',
      leido: true,
    },
    {
      tipo: 'dieta',
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      titulo: 'Hora de Comer',
      mensaje: 'No olvides tu almuerzo: Pollo con Arroz Integral',
      fecha: 'Ayer',
      leido: true,
    },
    {
      tipo: 'comunidad',
      icon: MessageSquare,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      titulo: 'Nueva Publicación en Comunidad',
      mensaje: 'Alguien comentó en tu publicación sobre técnica de sentadilla',
      fecha: '2 días',
      leido: true,
    },
    {
      tipo: 'progreso',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      titulo: 'Objetivo Semanal Completado',
      mensaje: 'Has completado 5 de 5 entrenamientos esta semana',
      fecha: '3 días',
      leido: true,
    },
    {
      tipo: 'membresia',
      icon: Bell,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      titulo: 'Renovación de Membresía',
      mensaje: 'Tu membresía se renovará automáticamente en 10 días',
      fecha: '5 días',
      leido: true,
    },
  ]

  const noLeidas = notificaciones.filter(n => !n.leido).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-black">Notificaciones</h1>
            {noLeidas > 0 && (
              <span className="px-3 py-1 bg-white text-black text-sm font-semibold rounded-full">
                {noLeidas} nuevas
              </span>
            )}
          </div>
          <p className="text-gray-600">Mantente al día con tus actividades</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-lg transition border-2 border-gray-200">
          <Check className="w-5 h-5" />
          Marcar todas como leídas
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Todas', 'Entrenamientos', 'Progreso', 'Mensajes', 'Sistema'].map((filtro, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              index === 0
                ? 'bg-white text-black'
                : 'bg-white text-gray-600 hover:bg-gray-200 hover:text-black border-2 border-gray-200'
            }`}
          >
            {filtro}
          </button>
        ))}
      </div>

      {/* Lista de Notificaciones */}
      <div className="space-y-3">
        {notificaciones.map((notif, index) => {
          const Icon = notif.icon
          return (
            <div
              key={index}
              className={`flex items-start gap-4 p-5 rounded-xl border transition-all cursor-pointer ${
                !notif.leido
                  ? 'bg-white/5 border-gray-600/30 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`${notif.bgColor} p-3 rounded-lg flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${notif.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="text-black font-semibold">{notif.titulo}</h3>
                  {!notif.leido && (
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0 mt-1.5"></span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{notif.mensaje}</p>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {notif.fecha}
                  </span>
                  {!notif.leido && (
                    <button className="text-gray-700 text-xs hover:text-primary-300 transition">
                      Marcar como leída
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Preferencias de Notificación */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Preferencias de Notificación</h2>
        <p className="text-gray-600 text-sm mb-4">
          Configura qué notificaciones deseas recibir. Puedes ajustar estas preferencias en{' '}
          <a href="/dashboard/ajustes" className="text-gray-700 hover:text-primary-300">
            Ajustes
          </a>
          .
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <div className="bg-orange-500/10 p-2 rounded">
              <AlertCircle className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-gray-700 text-sm">Recordatorios de entrenamiento</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <div className="bg-green-500/10 p-2 rounded">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-gray-700 text-sm">Actualizaciones de progreso</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <div className="bg-blue-500/10 p-2 rounded">
              <MessageSquare className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-gray-700 text-sm">Mensajes directos</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <div className="bg-purple-500/10 p-2 rounded">
              <Star className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-gray-700 text-sm">Actualizaciones del sistema</span>
          </div>
        </div>
      </div>
    </div>
  )
}

