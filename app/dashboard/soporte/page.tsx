'use client'

import { MessageSquare, Mail, Phone, HelpCircle, Send, Book } from 'lucide-react'

export default function SoportePage() {
  const preguntasFrecuentes = [
    {
      pregunta: '¿Cómo cambio mi plan de membresía?',
      respuesta: 'Puedes cambiar tu plan desde la sección de Membresías en el dashboard. Selecciona el nuevo plan y confirma el cambio.',
    },
    {
      pregunta: '¿Puedo compartir mi cuenta?',
      respuesta: 'Cada cuenta es personal e intransferible. Si necesitas múltiples usuarios, contacta con nuestro equipo de ventas.',
    },
    {
      pregunta: '¿Cómo actualizo mi información de pago?',
      respuesta: 'Ve a Ajustes > Membresías y haz clic en "Actualizar método de pago".',
    },
    {
      pregunta: '¿Los planes de dieta son personalizados?',
      respuesta: 'Sí, nuestros planes se personalizan según tus objetivos, peso, edad y nivel de actividad física.',
    },
    {
      pregunta: '¿Puedo cancelar mi suscripción en cualquier momento?',
      respuesta: 'Sí, puedes cancelar desde la sección de Membresías. Tendrás acceso hasta el final del período pagado.',
    },
  ]

  const ticketsRecientes = [
    { id: '#1247', asunto: 'Problema con el pago', estado: 'Resuelto', fecha: '2025-12-02' },
    { id: '#1235', asunto: 'Consulta sobre rutinas', estado: 'En progreso', fecha: '2025-11-28' },
    { id: '#1189', asunto: 'Actualización de datos', estado: 'Resuelto', fecha: '2025-11-20' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Soporte</h1>
        <p className="text-gray-400">Estamos aquí para ayudarte</p>
      </div>

      {/* Contacto Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-gray-600 transition cursor-pointer">
          <div className="bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-gray-300" />
          </div>
          <h3 className="text-white font-semibold mb-2">Chat en Vivo</h3>
          <p className="text-gray-400 text-sm mb-4">Respuesta inmediata de nuestro equipo</p>
          <button className="text-gray-300 text-sm font-medium hover:text-primary-300 transition">
            Iniciar chat →
          </button>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-gray-600 transition cursor-pointer">
          <div className="bg-green-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Email</h3>
          <p className="text-gray-400 text-sm mb-4">soporte@athletixy.com</p>
          <button className="text-gray-300 text-sm font-medium hover:text-primary-300 transition">
            Enviar email →
          </button>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-gray-600 transition cursor-pointer">
          <div className="bg-blue-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Teléfono</h3>
          <p className="text-gray-400 text-sm mb-4">+52 55 1234 5678</p>
          <button className="text-gray-300 text-sm font-medium hover:text-primary-300 transition">
            Llamar ahora →
          </button>
        </div>
      </div>

      {/* Nuevo Ticket */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Send className="w-5 h-5 text-gray-300" />
          <h2 className="text-lg font-semibold text-white">Enviar Nuevo Ticket</h2>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Asunto</label>
            <input
              type="text"
              placeholder="¿En qué podemos ayudarte?"
              className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
            <select className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white">
              <option>Problema técnico</option>
              <option>Consulta de facturación</option>
              <option>Pregunta sobre entrenamientos</option>
              <option>Pregunta sobre nutrición</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
            <textarea
              rows={5}
              placeholder="Describe tu consulta o problema..."
              className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-lg transition font-medium shadow-lg"
          >
            <Send className="w-4 h-4" />
            Enviar Ticket
          </button>
        </form>
      </div>

      {/* Tickets Recientes */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Book className="w-5 h-5 text-gray-300" />
          <h2 className="text-lg font-semibold text-white">Tickets Recientes</h2>
        </div>
        <div className="space-y-3">
          {ticketsRecientes.map((ticket, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-dark-900 rounded-lg border border-dark-600 hover:border-gray-600 transition cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-gray-300 font-mono text-sm">{ticket.id}</span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      ticket.estado === 'Resuelto'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {ticket.estado}
                  </span>
                </div>
                <p className="text-white font-medium">{ticket.asunto}</p>
              </div>
              <span className="text-gray-500 text-sm">{ticket.fecha}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Preguntas Frecuentes */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-5 h-5 text-gray-300" />
          <h2 className="text-lg font-semibold text-white">Preguntas Frecuentes</h2>
        </div>
        <div className="space-y-4">
          {preguntasFrecuentes.map((faq, index) => (
            <details
              key={index}
              className="group bg-dark-900 rounded-lg border border-dark-600 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-dark-800 transition">
                <span className="text-white font-medium">{faq.pregunta}</span>
                <svg
                  className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-4 text-gray-400 text-sm border-t border-dark-600 pt-3">
                {faq.respuesta}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}

