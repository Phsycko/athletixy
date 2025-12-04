'use client'

import { User, Lock, Bell, Globe, Shield, CreditCard, Moon } from 'lucide-react'

export default function AjustesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black mb-2">Ajustes</h1>
        <p className="text-gray-600">Configura tu cuenta y preferencias</p>
      </div>

      {/* Perfil Personal */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-black">Perfil Personal</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                defaultValue="Alex Hernández"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue="alex@athletixy.com"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
              <input
                type="number"
                defaultValue="28"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
              <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white">
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
          </div>
          <button className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium">
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Seguridad */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-black">Seguridad</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <button className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium">
            Actualizar Contraseña
          </button>
        </div>
      </div>

      {/* Notificaciones */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-black">Preferencias de Notificaciones</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Recordatorios de entrenamiento', checked: true },
            { label: 'Notificaciones de progreso', checked: true },
            { label: 'Mensajes del coach', checked: true },
            { label: 'Actualizaciones de la comunidad', checked: false },
            { label: 'Ofertas del marketplace', checked: false },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300">
              <span className="text-gray-700">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Preferencias */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-black">Preferencias</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
            <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white">
              <option>Español</option>
              <option>English</option>
              <option>Português</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
            <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white">
              <option>GMT-6 (Ciudad de México)</option>
              <option>GMT-5 (New York)</option>
              <option>GMT+1 (Madrid)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unidades</label>
            <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white">
              <option>Métricas (kg, cm)</option>
              <option>Imperiales (lb, in)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacidad */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-black">Privacidad</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Perfil público', checked: true },
            { label: 'Mostrar progreso en comunidad', checked: false },
            { label: 'Permitir mensajes directos', checked: true },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300">
              <span className="text-gray-700">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

