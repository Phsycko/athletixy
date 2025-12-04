'use client'

import { Calendar, Video, MessageCircle, TrendingUp, Target, Clock, Star, Dumbbell, Phone } from 'lucide-react'

export default function CoachPage() {
  const coach = {
    nombre: 'Lic. Roberto Sánchez',
    especialidad: 'Entrenamiento de Fuerza',
    experiencia: '15 años',
    calificacion: 5.0,
    certificaciones: ['NSCA-CPT', 'CrossFit Level 2', 'Entrenamiento Funcional'],
  }

  const proximaSesion = {
    fecha: '2025-12-05',
    hora: '10:00',
    tipo: 'Presencial',
    ubicacion: 'Gimnasio Athletixy',
    enfoque: 'Técnica de Sentadilla',
  }

  const sesionesPrevias = [
    {
      fecha: '2025-12-02',
      enfoque: 'Entrenamiento de Pierna',
      duracion: '60 min',
      notas: 'Excelente progresión en peso muerto. Mantener forma en sentadilla profunda.',
      rating: 5,
    },
    {
      fecha: '2025-11-30',
      enfoque: 'Técnica de Press de Banca',
      duracion: '45 min',
      notas: 'Corrección de agarre y recorrido. Implementar pausa en pecho.',
      rating: 5,
    },
    {
      fecha: '2025-11-28',
      enfoque: 'Evaluación Mensual',
      duracion: '90 min',
      notas: 'Incremento de 5kg en todos los ejercicios principales. Continuar con programa actual.',
      rating: 5,
    },
  ]

  const objetivosActuales = [
    { objetivo: 'Sentadilla 120kg', actual: 100, meta: 120, progreso: 83 },
    { objetivo: 'Press Banca 90kg', actual: 80, meta: 90, progreso: 89 },
    { objetivo: 'Peso Muerto 140kg', actual: 120, meta: 140, progreso: 86 },
  ]

  const mensajesRecientes = [
    {
      remitente: 'coach',
      mensaje: 'Excelente sesión hoy. Recuerda descansar bien antes del entrenamiento de pierna del jueves.',
      fecha: 'Hace 2 horas',
    },
    {
      remitente: 'usuario',
      mensaje: '¿Puedo cambiar el entrenamiento del viernes a sábado?',
      fecha: 'Hace 1 día',
    },
    {
      remitente: 'coach',
      mensaje: 'Claro, sin problema. Te espero el sábado a las 10:00 AM',
      fecha: 'Hace 1 día',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Coach Personal</h1>
        <p className="text-gray-400">Tu entrenador personal dedicado</p>
      </div>

      {/* Perfil del Coach */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-3xl text-white font-bold">RS</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{coach.nombre}</h2>
            <p className="text-white/80 mb-3">{coach.especialidad}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-white/90">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span>{coach.calificacion} / 5.0</span>
              </div>
              <div className="text-white/90">{coach.experiencia} de experiencia</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold shadow-lg">
              <MessageCircle className="w-4 h-4" />
              Mensaje
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition border border-white/20">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-white/80 text-sm mb-3">Certificaciones:</p>
          <div className="flex flex-wrap gap-2">
            {coach.certificaciones.map((cert, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full border border-white/20"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Próxima Sesión */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Próxima Sesión</h2>
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-blue-400 font-medium">{proximaSesion.enfoque}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Fecha</span>
                <span className="text-white font-semibold">{proximaSesion.fecha}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Hora</span>
                <span className="text-white font-semibold">{proximaSesion.hora}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tipo</span>
                <span className="text-white font-semibold">{proximaSesion.tipo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Ubicación</span>
                <span className="text-white font-semibold">{proximaSesion.ubicacion}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium">
              Confirmar Asistencia
            </button>
            <button className="px-4 py-3 bg-dark-900 hover:bg-dark-700 text-gray-400 hover:text-white rounded-lg transition border border-dark-600">
              Reagendar
            </button>
          </div>
        </div>

        {/* Objetivos Actuales */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Objetivos de Fuerza</h2>
          <div className="space-y-5">
            {objetivosActuales.map((obj, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{obj.objetivo}</span>
                  <span className="text-gray-400 text-sm">
                    {obj.actual}kg / {obj.meta}kg
                  </span>
                </div>
                <div className="w-full bg-dark-900 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${obj.progreso}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-right">
                  <span className="text-green-400 text-xs font-medium">{obj.progreso}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sesiones Previas */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Historial de Sesiones</h2>
        <div className="space-y-4">
          {sesionesPrevias.map((sesion, index) => (
            <div
              key={index}
              className="p-5 bg-dark-900 rounded-lg border border-dark-600 hover:border-blue-600 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold mb-1">{sesion.enfoque}</h3>
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{sesion.fecha}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{sesion.duracion}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(sesion.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-400 text-sm">{sesion.notas}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Rápido */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Mensajes Recientes</h2>
        <div className="space-y-4 mb-6">
          {mensajesRecientes.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.remitente === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-lg ${
                  msg.remitente === 'usuario'
                    ? 'bg-blue-600 text-white'
                    : 'bg-dark-900 text-gray-300 border border-dark-600'
                }`}
              >
                <p className="text-sm mb-1">{msg.mensaje}</p>
                <span className={`text-xs ${msg.remitente === 'usuario' ? 'text-blue-200' : 'text-gray-500'}`}>
                  {msg.fecha}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
            Enviar
          </button>
        </div>
      </div>

      {/* Agendar Nueva Sesión */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Agendar Nueva Sesión</h2>
        <p className="text-gray-400 text-sm mb-6">
          Reserva tu próxima sesión de entrenamiento personalizado
        </p>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium">
          <Calendar className="w-5 h-5" />
          Ver Horarios Disponibles
        </button>
      </div>
    </div>
  )
}

