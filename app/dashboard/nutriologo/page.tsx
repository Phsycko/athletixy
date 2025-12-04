'use client'

import { Calendar, Video, MessageCircle, FileText, Clock, Star, Phone } from 'lucide-react'

export default function NutriologoPage() {
  const nutriologo = {
    nombre: 'Dra. Patricia Mendoza',
    especialidad: 'Nutrición Deportiva',
    experiencia: '12 años',
    calificacion: 4.9,
    certificaciones: ['Nutrición Clínica', 'Nutrición Deportiva', 'Dietética'],
  }

  const proximaConsulta = {
    fecha: '2025-12-08',
    hora: '15:00',
    tipo: 'Video llamada',
    duracion: '45 min',
  }

  const consultasAnteriores = [
    {
      fecha: '2025-11-24',
      tipo: 'Seguimiento mensual',
      notas: 'Ajuste de macronutrientes. Incremento de proteína a 2.2g/kg',
      archivos: 2,
    },
    {
      fecha: '2025-10-24',
      tipo: 'Revisión de progreso',
      notas: 'Excelente adherencia al plan. Pérdida de grasa progresiva',
      archivos: 1,
    },
    {
      fecha: '2025-09-24',
      tipo: 'Consulta inicial',
      notas: 'Evaluación completa. Plan nutricional personalizado establecido',
      archivos: 3,
    },
  ]

  const recomendaciones = [
    'Mantener ingesta de agua en 3L diarios',
    'Incluir más vegetales de hoja verde',
    'Suplementar con Omega-3',
    'Pre-entreno: carbohidratos 90 min antes',
    'Post-entreno: proteína + carbohidratos en 30 min',
  ]

  const documentos = [
    { nombre: 'Plan Nutricional Diciembre', tipo: 'PDF', fecha: '2025-12-01' },
    { nombre: 'Análisis de Composición Corporal', tipo: 'PDF', fecha: '2025-11-24' },
    { nombre: 'Guía de Suplementación', tipo: 'PDF', fecha: '2025-10-15' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black mb-2">Nutriólogo</h1>
        <p className="text-gray-600">Consultas y seguimiento nutricional</p>
      </div>

      {/* Perfil del Nutriólogo */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-3xl text-black font-bold">PM</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-black mb-1">{nutriologo.nombre}</h2>
            <p className="text-black/80 mb-3">{nutriologo.especialidad}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-black/90">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span>{nutriologo.calificacion} / 5.0</span>
              </div>
              <div className="text-black/90">{nutriologo.experiencia} de experiencia</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition font-semibold shadow-lg">
              <MessageCircle className="w-4 h-4" />
              Mensaje
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm text-black rounded-lg hover:bg-white/20 transition border border-white/20">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-black/80 text-sm mb-3">Certificaciones:</p>
          <div className="flex flex-wrap gap-2">
            {nutriologo.certificaciones.map((cert, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/10 backdrop-blur-sm text-black text-xs rounded-full border border-white/20"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Próxima Consulta */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-black mb-6">Próxima Consulta</h2>
          <div className="bg-white/10 border border-gray-600/30 rounded-lg p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <Video className="w-5 h-5 text-black" />
              </div>
              <span className="text-gray-700 font-medium">{proximaConsulta.tipo}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Fecha</span>
                <span className="text-black font-semibold">{proximaConsulta.fecha}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Hora</span>
                <span className="text-black font-semibold">{proximaConsulta.hora}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duración</span>
                <span className="text-black font-semibold">{proximaConsulta.duracion}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium">
              Unirse a la Consulta
            </button>
            <button className="px-4 py-3 bg-white hover:bg-gray-200 text-gray-600 hover:text-black rounded-lg transition border-2 border-gray-200">
              Reagendar
            </button>
          </div>
        </div>

        {/* Recomendaciones Actuales */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-black mb-6">Recomendaciones Actuales</h2>
          <div className="space-y-3">
            {recomendaciones.map((recomendacion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-200"
              >
                <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-700 text-sm">{recomendacion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consultas Anteriores */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black mb-6">Historial de Consultas</h2>
        <div className="space-y-4">
          {consultasAnteriores.map((consulta, index) => (
            <div
              key={index}
              className="p-5 bg-white rounded-lg border-2 border-gray-200 hover:border-gray-600 transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-black font-semibold mb-1">{consulta.tipo}</h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{consulta.fecha}</span>
                  </div>
                </div>
                {consulta.archivos > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                    <FileText className="w-4 h-4 text-gray-700" />
                    <span className="text-gray-700 text-sm font-medium">
                      {consulta.archivos} archivo{consulta.archivos > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm">{consulta.notas}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Documentos */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-black">Documentos Compartidos</h2>
          <button className="text-gray-700 text-sm hover:text-primary-300 transition">
            Ver todos
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documentos.map((doc, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-gray-600 transition cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="bg-red-500/10 p-2 rounded">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-black font-medium text-sm mb-1 truncate">{doc.nombre}</p>
                  <p className="text-gray-600 text-xs">{doc.tipo} • {doc.fecha}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agendar Nueva Consulta */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Agendar Nueva Consulta</h2>
        <p className="text-gray-600 text-sm mb-6">
          Selecciona un horario disponible para tu próxima consulta nutricional
        </p>
        <button className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium">
          <Calendar className="w-5 h-5" />
          Ver Calendario de Disponibilidad
        </button>
      </div>
    </div>
  )
}

