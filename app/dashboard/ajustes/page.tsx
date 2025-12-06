'use client'

import { useState, useEffect } from 'react'
import { User, Lock, Bell, Globe, Shield, CreditCard, Moon, Sun } from 'lucide-react'

export default function AjustesPage() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Cargar preferencia de localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Ajustes</h1>
        <p className="text-gray-600 dark:text-gray-400">Configura tu cuenta y preferencias</p>
      </div>

      {/* Perfil Personal */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-black dark:text-white">Perfil Personal</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
              <input
                type="text"
                defaultValue="Alex Hernández"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                defaultValue="alex@athletixy.com"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edad</label>
              <input
                type="number"
                defaultValue="28"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Género</label>
              <select className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400">
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
          </div>
          <button className="px-6 py-3 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black rounded-lg transition font-medium">
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Seguridad */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-black dark:text-white">Seguridad</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contraseña Actual</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nueva Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <button className="px-6 py-3 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black rounded-lg transition font-medium">
            Actualizar Contraseña
          </button>
        </div>
      </div>

      {/* Notificaciones */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-black dark:text-white">Preferencias de Notificaciones</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Recordatorios de entrenamiento', checked: true },
            { label: 'Notificaciones de progreso', checked: true },
            { label: 'Mensajes del coach', checked: true },
            { label: 'Actualizaciones de la comunidad', checked: false },
            { label: 'Ofertas del marketplace', checked: false },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-200">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-white"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Preferencias */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-black dark:text-white">Preferencias</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Idioma</label>
            <select className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400">
              <option>Español</option>
              <option>English</option>
              <option>Português</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zona Horaria</label>
            <select className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400">
              <option>GMT-6 (Ciudad de México)</option>
              <option>GMT-5 (New York)</option>
              <option>GMT+1 (Madrid)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unidades</label>
            <select className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400">
              <option>Métricas (kg, cm)</option>
              <option>Imperiales (lb, in)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Apariencia */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-black dark:text-white">Apariencia</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-blue-500" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
              <div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">Modo {darkMode ? 'Oscuro' : 'Claro'}</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cambia la apariencia de la aplicación</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              >
                {darkMode ? (
                  <Moon className="w-3 h-3 text-blue-600" />
                ) : (
                  <Sun className="w-3 h-3 text-yellow-500" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Privacidad */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-black dark:text-white">Privacidad</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Perfil público', checked: true },
            { label: 'Mostrar progreso en comunidad', checked: false },
            { label: 'Permitir mensajes directos', checked: true },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-200">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-white"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

