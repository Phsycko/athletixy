'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, MessageCircle, Send, Search, User, X, Paperclip } from 'lucide-react'

type Paciente = {
  id: string
  nombre: string
  email: string
  telefono?: string
}

export default function ComunicacionesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [tipoComunicacion, setTipoComunicacion] = useState<'email' | 'whatsapp' | 'mensaje'>('email')
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pacientesGuardados = localStorage.getItem('athletixy_pacientes_nutriologo')
      if (pacientesGuardados) {
        const pacientesData = JSON.parse(pacientesGuardados)
        setPacientes(pacientesData)
      }
    }
  }, [])

  const pacientesFiltrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleEnviarEmail = () => {
    if (!pacienteSeleccionado || !asunto || !mensaje) return
    
    setEnviando(true)
    
    // Simular envío de email
    setTimeout(() => {
      const emailData = {
        id: Date.now().toString(),
        pacienteId: pacienteSeleccionado.id,
        pacienteNombre: pacienteSeleccionado.nombre,
        pacienteEmail: pacienteSeleccionado.email,
        asunto,
        mensaje,
        fecha: new Date().toISOString(),
        tipo: 'email',
        estado: 'enviado'
      }
      
      const emailsGuardados = localStorage.getItem('athletixy_emails_nutriologo') || '[]'
      const emails = JSON.parse(emailsGuardados)
      emails.push(emailData)
      localStorage.setItem('athletixy_emails_nutriologo', JSON.stringify(emails))
      
      // En producción, aquí se haría la llamada a la API de email
      alert(`Email enviado a ${pacienteSeleccionado.email}`)
      
      setAsunto('')
      setMensaje('')
      setEnviando(false)
    }, 1000)
  }

  const handleEnviarWhatsApp = () => {
    if (!pacienteSeleccionado || !mensaje) return
    
    const telefono = pacienteSeleccionado.telefono || ''
    if (!telefono) {
      alert('El paciente no tiene número de teléfono registrado')
      return
    }
    
    // Formatear número (eliminar caracteres especiales)
    const numeroLimpio = telefono.replace(/[^0-9]/g, '')
    
    // Abrir WhatsApp Web con el mensaje prellenado
    const mensajeCodificado = encodeURIComponent(mensaje)
    const urlWhatsApp = `https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`
    window.open(urlWhatsApp, '_blank')
    
    // Guardar registro del mensaje
    const whatsappData = {
      id: Date.now().toString(),
      pacienteId: pacienteSeleccionado.id,
      pacienteNombre: pacienteSeleccionado.nombre,
      pacienteTelefono: telefono,
      mensaje,
      fecha: new Date().toISOString(),
      tipo: 'whatsapp',
      estado: 'enviado'
    }
    
    const whatsappsGuardados = localStorage.getItem('athletixy_whatsapps_nutriologo') || '[]'
    const whatsapps = JSON.parse(whatsappsGuardados)
    whatsapps.push(whatsappData)
    localStorage.setItem('athletixy_whatsapps_nutriologo', JSON.stringify(whatsapps))
    
    setMensaje('')
  }

  const handleEnviarMensaje = () => {
    if (!pacienteSeleccionado || !mensaje) return
    
    setEnviando(true)
    
    setTimeout(() => {
      const mensajeData = {
        id: Date.now().toString(),
        pacienteId: pacienteSeleccionado.id,
        pacienteNombre: pacienteSeleccionado.nombre,
        mensaje,
        fecha: new Date().toISOString(),
        tipo: 'mensaje',
        enviadoPor: 'nutriologo' as const
      }
      
      const mensajesGuardados = localStorage.getItem(`athletixy_mensajes_${pacienteSeleccionado.id}`) || '[]'
      const mensajes = JSON.parse(mensajesGuardados)
      mensajes.push(mensajeData)
      localStorage.setItem(`athletixy_mensajes_${pacienteSeleccionado.id}`, JSON.stringify(mensajes))
      
      alert(`Mensaje enviado a ${pacienteSeleccionado.nombre}`)
      
      setMensaje('')
      setEnviando(false)
    }, 500)
  }

  const handleEnviar = () => {
    if (tipoComunicacion === 'email') {
      handleEnviarEmail()
    } else if (tipoComunicacion === 'whatsapp') {
      handleEnviarWhatsApp()
    } else {
      handleEnviarMensaje()
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Comunicaciones</h1>
        <p className="text-gray-600">Envía correos, mensajes de WhatsApp y mensajes internos a tus pacientes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Pacientes */}
        <div className="lg:col-span-1 bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {pacientesFiltrados.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No se encontraron pacientes</p>
              </div>
            ) : (
              pacientesFiltrados.map((paciente) => (
                <button
                  key={paciente.id}
                  onClick={() => setPacienteSeleccionado(paciente)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    pacienteSeleccionado?.id === paciente.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                      {paciente.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-black">{paciente.nombre}</p>
                      <p className="text-sm text-gray-600">{paciente.email}</p>
                      {paciente.telefono && (
                        <p className="text-xs text-gray-500 mt-1">{paciente.telefono}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Panel de Comunicación */}
        <div className="lg:col-span-2 bg-white border-2 border-gray-200 rounded-xl p-6">
          {!pacienteSeleccionado ? (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Selecciona un paciente</p>
              <p className="text-gray-500 text-sm">Elige un paciente de la lista para comenzar a comunicarte</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header del Paciente */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg">
                    {pacienteSeleccionado.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-black text-lg">{pacienteSeleccionado.nombre}</p>
                    <p className="text-sm text-gray-600">{pacienteSeleccionado.email}</p>
                    {pacienteSeleccionado.telefono && (
                      <p className="text-xs text-gray-500">{pacienteSeleccionado.telefono}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPacienteSeleccionado(null)
                    setAsunto('')
                    setMensaje('')
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Selector de Tipo de Comunicación */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">Tipo de Comunicación</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTipoComunicacion('email')}
                    className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                      tipoComunicacion === 'email'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Mail className={`w-6 h-6 ${tipoComunicacion === 'email' ? 'text-black' : 'text-gray-400'}`} />
                    <span className={`font-semibold text-sm ${tipoComunicacion === 'email' ? 'text-black' : 'text-gray-600'}`}>
                      Email
                    </span>
                  </button>
                  <button
                    onClick={() => setTipoComunicacion('whatsapp')}
                    className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                      tipoComunicacion === 'whatsapp'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Phone className={`w-6 h-6 ${tipoComunicacion === 'whatsapp' ? 'text-black' : 'text-gray-400'}`} />
                    <span className={`font-semibold text-sm ${tipoComunicacion === 'whatsapp' ? 'text-black' : 'text-gray-600'}`}>
                      WhatsApp
                    </span>
                  </button>
                  <button
                    onClick={() => setTipoComunicacion('mensaje')}
                    className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                      tipoComunicacion === 'mensaje'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <MessageCircle className={`w-6 h-6 ${tipoComunicacion === 'mensaje' ? 'text-black' : 'text-gray-400'}`} />
                    <span className={`font-semibold text-sm ${tipoComunicacion === 'mensaje' ? 'text-black' : 'text-gray-600'}`}>
                      Mensaje Interno
                    </span>
                  </button>
                </div>
              </div>

              {/* Formulario de Comunicación */}
              <div className="space-y-4">
                {tipoComunicacion === 'email' && (
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Asunto</label>
                    <input
                      type="text"
                      value={asunto}
                      onChange={(e) => setAsunto(e.target.value)}
                      placeholder="Asunto del correo..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    {tipoComunicacion === 'email' ? 'Mensaje' : tipoComunicacion === 'whatsapp' ? 'Mensaje de WhatsApp' : 'Mensaje Interno'}
                  </label>
                  <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder={
                      tipoComunicacion === 'email'
                        ? 'Escribe tu mensaje aquí...'
                        : tipoComunicacion === 'whatsapp'
                        ? 'Escribe el mensaje para WhatsApp...'
                        : 'Escribe tu mensaje interno...'
                    }
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition resize-none"
                  />
                </div>

                {tipoComunicacion === 'whatsapp' && !pacienteSeleccionado.telefono && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Este paciente no tiene número de teléfono registrado. Por favor, agrega un número de teléfono para enviar mensajes de WhatsApp.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleEnviar}
                  disabled={enviando || !mensaje || (tipoComunicacion === 'email' && !asunto) || (tipoComunicacion === 'whatsapp' && !pacienteSeleccionado.telefono)}
                  className="w-full px-6 py-3 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition font-semibold flex items-center justify-center gap-2"
                >
                  {enviando ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {tipoComunicacion === 'email' ? 'Enviar Email' : tipoComunicacion === 'whatsapp' ? 'Abrir WhatsApp' : 'Enviar Mensaje'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

