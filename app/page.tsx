'use client'

import { useState, useEffect } from 'react'
import { LogIn, Dumbbell, UserPlus, Apple, User, Building2, ShoppingBag, Users } from 'lucide-react'

type UserType = 'atleta' | 'nutriologo' | 'coach' | 'gym' | 'vendedor' | 'GYM_MANAGER' | 'COACH_INTERNO'

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

  // 🔍 Revisar si ya había sesión guardada
  useEffect(() => {
    const session = localStorage.getItem('athletixy_session')
    if (!session) {
      setCheckingSession(false)
      return
    }

    try {
      const data = JSON.parse(session)
      if (data.loggedIn) {
        redirigirPorRol(data.role)
      } else {
        setCheckingSession(false)
      }
    } catch {
      setCheckingSession(false)
    }
  }, [])

// 🔁 Función de redirección centralizada
const redirigirPorRol = (role: string) => {
  role = role.toUpperCase(); // Normalizar por seguridad

  window.location.href =
    role === 'COACH_INTERNO'
      ? '/gym/coach-interno'
      : role === 'ATHLETE_INTERNO'
      ? '/athlete/dashboard'
      : role === 'GYM_MANAGER'
      ? '/gym/dashboard'
      : role === 'NUTRIOLOGO'
      ? '/dashboard/nutriologo'
      : role === 'COACH'
      ? '/dashboard/coach'
      : role === 'VENDEDOR'
      ? '/dashboard/marketplace'
      : '/dashboard'; // atleta u otros
};

  // 🔥 Registrar usuario desde el login
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
        setError(data.error || 'Error al crear el usuario.')
        return
      }

      const tipoFinal = credentials.tipoUsuario === 'gym' ? 'GYM_MANAGER' : credentials.tipoUsuario

      localStorage.setItem(
        'athletixy_session',
        JSON.stringify({
          id: data.user.id,
          email: credentials.email.trim().toLowerCase(),
          nombre: credentials.nombre.trim(),
          role: tipoFinal,
          gymManagerId: data.user.id,
          loggedIn: true,
        })
      )

      setSuccess('¡Registro exitoso! Redirigiendo...')
      setTimeout(() => redirigirPorRol(tipoFinal), 800)
    } catch {
      setError('Error inesperado al registrar usuario.')
    }
  }

  // 🔥 LOGIN REAL CON BACKEND
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!credentials.email || !credentials.password) {
      setError('Por favor ingresa email y contraseña')
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
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

      // 🟩 GUARDAMOS SESIÓN COMPLETA (AQUÍ ESTABA EL PROBLEMA)
      // Normalizar el rol en el cliente también
      let roleFinal = data.user.role
      if (roleFinal === "coach" && data.user.gymManagerId) {
        roleFinal = "COACH_INTERNO"
      } else if (roleFinal === "gym") {
        roleFinal = "GYM_MANAGER"
      } else if (roleFinal === "ATHLETE_INTERNO") {
        roleFinal = "ATHLETE_INTERNO"
      }

      localStorage.setItem(
        'athletixy_session',
        JSON.stringify({
          id: data.user.id,                     // ID del usuario (coachId para COACH_INTERNO)
          email: data.user.email,
          nombre: data.user.nombre,
          role: roleFinal,                       // Rol normalizado
          coachId: data.user.id,                 // Para COACH_INTERNO: su propio ID
          gymManagerId: data.user.gymManagerId || null, // ID del GYM_MANAGER que lo creó
          loggedIn: true,
          isAdmin: data.user.isAdmin || false
        })
      )

      setSuccess('Iniciando sesión...')
      setTimeout(() => redirigirPorRol(data.user.role), 500)
    } catch (error) {
      console.error(error)
      setError('Ocurrió un error al iniciar sesión.')
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Dumbbell className="w-12 h-12 animate-pulse text-black" />
      </div>
    )
  }

  // 🟦 UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-black p-4 rounded-2xl">
              <Dumbbell className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Athletixy</h1>
          <p className="text-gray-600">Gestión profesional de atletas</p>
        </div>

        {/* TABS LOGIN / REGISTER */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-lg font-medium ${
              isLogin ? 'bg-black text-white' : 'text-gray-600'
            }`}
          >
            Iniciar Sesión
          </button>

          <button
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-lg font-medium ${
              !isLogin ? 'bg-black text-white' : 'text-gray-600'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border">
          <h2 className="text-xl font-semibold mb-6">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="text-sm">Nombre Completo</label>
                <input
                  type="text"
                  value={credentials.nombre}
                  onChange={(e) => setCredentials({ ...credentials, nombre: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm">Contraseña</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            {/* Tipos de usuario (solo registro) */}
            {!isLogin && (
              <>
                <label className="text-sm">Tipo de Usuario</label>
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
                        key={item.key}
                        type="button"
                        onClick={() => setCredentials({ ...credentials, tipoUsuario: item.key as UserType })}
                        className={`p-4 border rounded-lg flex flex-col items-center gap-2 ${
                          credentials.tipoUsuario === item.key ? 'border-black bg-gray-100' : 'border-gray-200'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}
            {success && <div className="text-green-600 bg-green-100 p-3 rounded-lg">{success}</div>}

            <button className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2">
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