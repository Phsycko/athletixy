'use client'

import { useState, useEffect } from 'react'
import { Settings, Building2, MapPin, Clock, Mail, Phone, Upload, Save, Dumbbell, Plus, X, Trash2 } from 'lucide-react'

export default function ConfiguracionPage() {
  const [configuracion, setConfiguracion] = useState({
    nombreGimnasio: 'Athletixy Gym',
    direccion: 'Av. Principal 123, Ciudad',
    telefono: '+52 55 1234 5678',
    email: 'contacto@athletixygym.com',
    horarioApertura: '06:00',
    horarioCierre: '22:00',
    diasSemana: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    marketplaceHabilitado: true,
    notificacionesHabilitadas: true,
  })

  const [mostrarMensaje, setMostrarMensaje] = useState(false)
  const [maquinaria, setMaquinaria] = useState<string[]>([])
  const [nuevaMaquina, setNuevaMaquina] = useState('')

  useEffect(() => {
    // Cargar maquinaria guardada
    try {
      const maquinariaStr = localStorage.getItem('gym_maquinaria')
      if (maquinariaStr) {
        setMaquinaria(JSON.parse(maquinariaStr))
      } else {
        // Maquinaria por defecto común
        const maquinariaDefault = [
          'Barra',
          'Mancuernas',
          'Máquina de poleas',
          'Máquina de prensa',
          'Máquina de extensión',
          'Máquina de curl',
          'Máquina Smith',
          'Paralelas',
          'Banco',
          'Cinta de correr',
          'Bicicleta estática',
          'Elíptica',
          'Máquina de remo',
          'Máquina de hombros',
          'Máquina de remo sentado'
        ]
        setMaquinaria(maquinariaDefault)
        localStorage.setItem('gym_maquinaria', JSON.stringify(maquinariaDefault))
      }
    } catch (error) {
      console.error('Error loading equipment:', error)
    }
  }, [])

  const handleSave = () => {
    // Guardar configuración y maquinaria
    try {
      localStorage.setItem('gym_configuracion', JSON.stringify(configuracion))
      localStorage.setItem('gym_maquinaria', JSON.stringify(maquinaria))
      setMostrarMensaje(true)
      setTimeout(() => setMostrarMensaje(false), 3000)
    } catch (error) {
      console.error('Error saving configuration:', error)
      alert('Error al guardar la configuración')
    }
  }

  const handleAgregarMaquina = () => {
    if (nuevaMaquina.trim() && !maquinaria.includes(nuevaMaquina.trim())) {
      const maquinariaActualizada = [...maquinaria, nuevaMaquina.trim()]
      setMaquinaria(maquinariaActualizada)
      setNuevaMaquina('')
      localStorage.setItem('gym_maquinaria', JSON.stringify(maquinariaActualizada))
    }
  }

  const handleEliminarMaquina = (maquina: string) => {
    if (confirm(`¿Estás seguro de eliminar "${maquina}"?`)) {
      const maquinariaActualizada = maquinaria.filter(m => m !== maquina)
      setMaquinaria(maquinariaActualizada)
      localStorage.setItem('gym_maquinaria', JSON.stringify(maquinariaActualizada))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-1">Configuración del Gimnasio</h1>
        <p className="text-gray-500 dark:text-zinc-500">Administra la información y preferencias de tu gimnasio</p>
      </div>

      {/* Información General */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-5 h-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100">Información General</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Nombre del Gimnasio</label>
            <input
              type="text"
              value={configuracion.nombreGimnasio}
              onChange={(e) => setConfiguracion({...configuracion, nombreGimnasio: e.target.value})}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Dirección</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={configuracion.direccion}
                onChange={(e) => setConfiguracion({...configuracion, direccion: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={configuracion.telefono}
                  onChange={(e) => setConfiguracion({...configuracion, telefono: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={configuracion.email}
                  onChange={(e) => setConfiguracion({...configuracion, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horarios */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100">Horarios</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Hora de Apertura</label>
            <input
              type="time"
              value={configuracion.horarioApertura}
              onChange={(e) => setConfiguracion({...configuracion, horarioApertura: e.target.value})}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Hora de Cierre</label>
            <input
              type="time"
              value={configuracion.horarioCierre}
              onChange={(e) => setConfiguracion({...configuracion, horarioCierre: e.target.value})}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Días de Operación</label>
          <div className="flex flex-wrap gap-2">
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia) => (
              <button
                key={dia}
                onClick={() => {
                  const dias = configuracion.diasSemana.includes(dia)
                    ? configuracion.diasSemana.filter(d => d !== dia)
                    : [...configuracion.diasSemana, dia]
                  setConfiguracion({...configuracion, diasSemana: dias})
                }}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  configuracion.diasSemana.includes(dia)
                    ? 'bg-black dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-800'
                }`}
              >
                {dia}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-5 h-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100">Logo del Gimnasio</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center border-2 border-gray-300 dark:border-zinc-700">
            <Building2 className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <button className="px-4 py-2 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium">
              Subir Logo
            </button>
            <p className="text-sm text-gray-500 dark:text-zinc-500 mt-2">PNG, JPG hasta 2MB</p>
          </div>
        </div>
      </div>

      {/* Maquinaria del Gimnasio */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Dumbbell className="w-5 h-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100">Maquinaria del Gimnasio</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-zinc-500 mb-4">
          Registra toda la maquinaria disponible en tu gimnasio. Esta información será utilizada por los coaches internos para generar ejercicios personalizados con IA.
        </p>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={nuevaMaquina}
              onChange={(e) => setNuevaMaquina(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAgregarMaquina()
                }
              }}
              placeholder="Ej: Press de banca, Máquina de poleas, etc."
              className="flex-1 px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
            />
            <button
              onClick={handleAgregarMaquina}
              className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Agregar
            </button>
          </div>
          {maquinaria.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {maquinaria.map((maquina, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700"
                >
                  <span className="text-sm font-medium text-black dark:text-zinc-100">{maquina}</span>
                  <button
                    onClick={() => handleEliminarMaquina(maquina)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-zinc-500">
              <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay maquinaria registrada</p>
            </div>
          )}
        </div>
      </div>

      {/* Preferencias */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-5 h-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100">Preferencias</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
            <div>
              <p className="text-black dark:text-zinc-100 font-medium">Marketplace Habilitado</p>
              <p className="text-sm text-gray-500 dark:text-zinc-500">Permite ventas a través del marketplace</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={configuracion.marketplaceHabilitado}
                onChange={(e) => setConfiguracion({...configuracion, marketplaceHabilitado: e.target.checked})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-zinc-100 after:dark:peer-checked:bg-zinc-900"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
            <div>
              <p className="text-black dark:text-zinc-100 font-medium">Notificaciones Habilitadas</p>
              <p className="text-sm text-gray-500 dark:text-zinc-500">Recibe notificaciones importantes del sistema</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={configuracion.notificacionesHabilitadas}
                onChange={(e) => setConfiguracion({...configuracion, notificacionesHabilitadas: e.target.checked})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-zinc-100 after:dark:peer-checked:bg-zinc-900"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
        >
          <Save className="w-5 h-5" />
          Guardar Cambios
        </button>
      </div>

      {/* Mensaje de confirmación */}
      {mostrarMensaje && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Configuración guardada exitosamente
        </div>
      )}
    </div>
  )
}

