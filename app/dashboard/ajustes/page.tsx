'use client'

import { useState, useEffect } from 'react'
import { User, Lock, Bell, Globe, Shield, Moon, Sun } from 'lucide-react'

export default function AjustesPage() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const updateDarkMode = () => {
      const savedTheme = localStorage.getItem('theme')
      const isDark = savedTheme === 'dark' || document.documentElement.classList.contains('dark')
      setDarkMode(isDark)
    }

    // Cargar estado inicial
    updateDarkMode()

    // Escuchar cambios de tema desde otros componentes
    window.addEventListener('themechange', updateDarkMode)

    return () => {
      window.removeEventListener('themechange', updateDarkMode)
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
    // Disparar evento personalizado para que otros componentes se actualicen
    window.dispatchEvent(new Event('themechange'))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-1">Ajustes</h1>
        <p className="text-gray-500 dark:text-zinc-500">Configura tu cuenta y preferencias</p>
      </div>

      {/* Apariencia - Primero para acceso rápido */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-200">
        <div className="flex items-center gap-3 mb-5">
          {darkMode ? <Moon className="w-5 h-5 text-zinc-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100">Apariencia</h2>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              darkMode ? 'bg-zinc-700' : 'bg-amber-100'
            }`}>
              {darkMode ? (
                <Moon className="w-6 h-6 text-zinc-300" />
              ) : (
                <Sun className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div>
              <span className="text-black dark:text-zinc-100 font-medium block">
                Modo {darkMode ? 'Nocturno' : 'Diurno'}
              </span>
              <p className="text-sm text-gray-500 dark:text-zinc-500">
                {darkMode ? 'Colores suaves para proteger tu vista' : 'Interfaz clara y brillante'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-16 h-9 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-zinc-700 hover:bg-zinc-600' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            <div
              className={`absolute top-1.5 w-6 h-6 rounded-full shadow-sm transition-all duration-300 flex items-center justify-center ${
                darkMode 
                  ? 'translate-x-8 bg-zinc-100' 
                  : 'translate-x-1.5 bg-white'
              }`}
            >
              {darkMode ? (
                <Moon className="w-3.5 h-3.5 text-zinc-700" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Perfil Personal */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-200">
        <div className="flex items-center gap-3 mb-5">
          <User className="w-5 h-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100">Perfil Personal</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Nombre</label>
              <input
                type="text"
                defaultValue="Alex Hernández"
                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                defaultValue="alex@athletixy.com"
                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 transition-colors duration-200"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Edad</label>
              <input
                type="number"
                defaultValue="28"
                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Género</label>
              <select className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 transition-colors duration-200">
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
          </div>
          <button className="px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition-colors duration-200 font-medium">
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Seguridad */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-200">
        <div className="flex items-center gap-3 mb-5">
          <Lock className="w-5 h-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100">Seguridad</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Contraseña Actual</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Nueva Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 transition-colors duration-200"
            />
          </div>
          <button className="px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition-colors duration-200 font-medium">
            Actualizar Contraseña
          </button>
        </div>
      </div>

      {/* Notificaciones */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-200">
        <div className="flex items-center gap-3 mb-5">
          <Bell className="w-5 h-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100">Notificaciones</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Recordatorios de entrenamiento', checked: true },
            { label: 'Notificaciones de progreso', checked: true },
            { label: 'Mensajes del coach', checked: true },
            { label: 'Actualizaciones de la comunidad', checked: false },
            { label: 'Ofertas del marketplace', checked: false },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
              <span className="text-gray-700 dark:text-zinc-300">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-zinc-100 after:dark:peer-checked:bg-zinc-900"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Preferencias */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-200">
        <div className="flex items-center gap-3 mb-5">
          <Globe className="w-5 h-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100">Preferencias</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Idioma</label>
            <select className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 transition-colors duration-200">
              <option>Español</option>
              <option>English</option>
              <option>Português</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Zona Horaria</label>
            <select className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 transition-colors duration-200">
              <option>GMT-6 (Ciudad de México)</option>
              <option>GMT-5 (New York)</option>
              <option>GMT+1 (Madrid)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Unidades</label>
            <select className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 transition-colors duration-200">
              <option>Métricas (kg, cm)</option>
              <option>Imperiales (lb, in)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacidad */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-200">
        <div className="flex items-center gap-3 mb-5">
          <Shield className="w-5 h-5 text-gray-500 dark:text-zinc-500" />
          <h2 className="text-lg font-semibold text-black dark:text-zinc-100">Privacidad</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Perfil público', checked: true },
            { label: 'Mostrar progreso en comunidad', checked: false },
            { label: 'Permitir mensajes directos', checked: true },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
              <span className="text-gray-700 dark:text-zinc-300">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-zinc-100 after:dark:peer-checked:bg-zinc-900"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
