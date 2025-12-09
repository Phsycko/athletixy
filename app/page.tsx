'use client'

import { useState, useEffect } from 'react'
import { LogIn, Dumbbell, UserPlus, Apple, User, Building2, ShoppingBag, Users } from 'lucide-react'

type UserType = 'atleta' | 'nutriologo' | 'coach' | 'gym' | 'vendedor' | 'GYM_MANAGER'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    nombre: '',
    tipoUsuario: 'atleta' as UserType
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  // 🔍 Revisar sesión antes de mostrar formulario
  useEffect(() => {
    const session = localStorage.getItem('athletixy_session')
    if (!session) {
      setCheckingSession(false)
      return
    }

    try {
      const data = JSON.parse(session)
      if (data.loggedIn) {
        window.location.href =
          data.role === 'GYM_MANAGER'
            ? '/gym/dashboard'
            : data.role === 'nutriologo'
            ? '/dashboard/nutriologo'
            : data.role === 'coach'
            ? '/dashboard/coach'
            : data.role === 'vendedor'
            ? '/dashboard/marketplace'
            : '/dashboard'
      } else {
        setCheckingSession(false)
      }
    } catch {
      setCheckingSession(false)
    }
  }, [])

  // 🔥 REGISTRO
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!credentials.email || !credentials.password || !credentials.nombre) {
      setError('Por favor completa todos los campos')
      return
    }

    if (credentials.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          nombre: credentials.nombre,
          tipoUsuario: credentials.tipoUsuario
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || data.details || 'Error al crear el usuario.')
        return
      }

      const tipoFinal = credentials.tipoUsuario === 'gym' ? 'GYM_MANAGER' : credentials.tipoUsuario

      localStorage.setItem(
        'athletixy_session',
        JSON.stringify({
          email: credentials.email.trim().toLowerCase(),
          nombre: credentials.nombre.trim(),
          role: tipoFinal,
          loggedIn: true,
        })
      )

      setSuccess('¡Registro exitoso! Redirigiendo...')

      setTimeout(() => {
        window.location.href =
          tipoFinal === 'GYM_MANAGER'
            ? '/gym/dashboard'
            : tipoFinal === 'nutriologo'
            ? '/dashboard/nutriologo'
            : tipoFinal === 'coach'
            ? '/dashboard/coach'
            : tipoFinal === 'vendedor'
            ? '/dashboard/marketplace'
            : '/dashboard'
      }, 800)
    } catch (error: any) {
      setError('Error inesperado al registrar usuario.')
    }
  }

  // 🔥 LOGIN REAL (SE CONECTA A TU API /api/login)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!credentials.email || !credentials.password) {
      setError('Por favor ingresa email y contraseña')
      return
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Credenciales inválidas.')
        return
      }

      // Guardar sesión
      localStorage.setItem(
        'athletixy_session',
        JSON.stringify({
          email: data.user.email,
          nombre: data.user.nombre,
          role: data.user.role,
          loggedIn: true,
          isAdmin: data.user.isAdmin || false
        })
      )

      setSuccess('Iniciando sesión...')

      setTimeout(() => {
        const role = data.user.role
        window.location.href =
          role === 'GYM_MANAGER'
            ? '/gym/dashboard'
            : role === 'nutriologo'
            ? '/dashboard/nutriologo'
            : role === 'coach'
            ? '/dashboard/coach'
            : role === 'vendedor'
            ? '/dashboard/marketplace'
            : '/dashboard'
      }, 500)
    } catch (error) {
      console.error('Login error:', error)
      setError('Ocurrió un error al iniciar sesión.')
    }
  }

  // Pantalla de carga mientras revisa sesión
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="bg-black p-4 rounded-2xl shadow-2xl inline-block mb-4">
            <Dumbbell className="w-12 h-12 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // UI PRINCIPAL
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-black p-4 rounded-2xl shadow-2xl">
              <Dumbbell className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Athletixy</h1>
          <p className="text-gray-600">Gestión profesional de atletas</p>
        </div>

        {/* LOGIN / REGISTER TABS */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium ${
              isLogin ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Iniciar Sesión
          </button>

          <button
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium ${
              !isLogin ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* FORMULARIO */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-black">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>

          <form
            onSubmit={isLogin ? handleLogin : handleRegister}
            className="space-y-6"
          >
            {/* Nombre */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={credentials.nombre}
                  onChange={(e) => setCredentials({ ...credentials, nombre: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg"
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg"
                placeholder="••••••••"
              />
            </div>

            {/* Tipo de Usuario */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Usuario
                </label>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'atleta', label: 'Atleta', icon: User },
                    { key: 'nutriologo', label: 'Nutriólogo', icon: Apple },
                    { key: 'coach', label: 'Coach', icon: Users },
                    { key: 'gym', label: 'Gym', icon: Building2 },
                    { key: 'vendedor', label: 'Vendedor', icon: ShoppingBag },
                    { key: 'GYM_MANAGER', label: 'Gestor Gym', icon: Building2 },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() =>
                          setCredentials({ ...credentials, tipoUsuario: item.key as UserType })
                        }
                        className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
                          credentials.tipoUsuario === item.key
                            ? 'border-black bg-gray-100'
                            : 'border-gray-200'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* BOTÓN */}
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isLogin ? 'Ingresar' : 'Registrarse'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          © 2025 Athletixy. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
