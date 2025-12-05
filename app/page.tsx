'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, Dumbbell } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación simple de credenciales
    if (!credentials.email || !credentials.password) {
      setError('Por favor ingresa email y contraseña')
      return
    }

    // Normalizar email (trim y lowercase)
    const emailNormalized = credentials.email.trim().toLowerCase()
    const passwordNormalized = credentials.password.trim()
    
    // Detectar rol según credenciales
    let role = 'atleta' // Rol por defecto
    let isValid = false
    
    // Credenciales de nutriólogo
    const nutriologoCredentials = [
      { email: 'nutriologo@athletixy.com', password: 'nutriologo123' },
      { email: 'patricia.mendoza@athletixy.com', password: 'nutriologo123' },
      { email: 'nutriologo@test.com', password: 'nutriologo123' }
    ]
    
    for (const cred of nutriologoCredentials) {
      if (emailNormalized === cred.email.toLowerCase() && passwordNormalized === cred.password) {
        role = 'nutriologo'
        isValid = true
        break
      }
    }
    
    // Si no es nutriólogo, cualquier credencial válida es atleta
    if (!isValid && emailNormalized && passwordNormalized) {
      isValid = true
      role = 'atleta'
    }
    
    if (isValid) {
      // Guardar sesión en localStorage
      localStorage.setItem('athletixy_session', JSON.stringify({
        email: emailNormalized,
        role: role,
        loggedIn: true
      }))
      
      // Redirigir según rol
      if (role === 'nutriologo') {
        router.push('/dashboard/nutriologo')
      } else {
        router.push('/dashboard')
      }
    } else {
      setError('Credenciales inválidas. Por favor verifica tu email y contraseña.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-black p-4 rounded-2xl shadow-2xl">
              <Dumbbell className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Athletixy</h1>
          <p className="text-gray-600">Gestión profesional de atletas</p>
        </div>

        {/* Formulario de login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-black">Iniciar Sesión</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              Ingresar
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-gray-600 hover:text-black transition">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          © 2025 Athletixy. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}

