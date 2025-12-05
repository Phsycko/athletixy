'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, Dumbbell, UserPlus, Apple, User, Building2, ShoppingBag, Users } from 'lucide-react'

type UserType = 'atleta' | 'nutriologo' | 'coach' | 'gym' | 'vendedor'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    nombre: '',
    tipoUsuario: 'atleta' as UserType
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Inicializar usuarios en localStorage si no existen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const users = localStorage.getItem('athletixy_users')
      if (!users) {
        // Usuarios por defecto
        const defaultUsers = [
          {
            email: 'nutriologo@athletixy.com',
            password: 'nutriologo123',
            nombre: 'Dra. Patricia Mendoza',
            tipoUsuario: 'nutriologo',
            fechaRegistro: new Date().toISOString()
          }
        ]
        localStorage.setItem('athletixy_users', JSON.stringify(defaultUsers))
      }
    }
  }, [])

  const handleRegister = (e: React.FormEvent) => {
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

    // Normalizar email
    const emailNormalized = credentials.email.trim().toLowerCase()
    const nombreNormalized = credentials.nombre.trim()

    // Obtener usuarios existentes
    const usersStr = localStorage.getItem('athletixy_users')
    const users = usersStr ? JSON.parse(usersStr) : []

    // Verificar si el email ya existe
    const emailExists = users.some((u: any) => u.email.toLowerCase() === emailNormalized)
    if (emailExists) {
      setError('Este email ya está registrado. Por favor inicia sesión.')
      return
    }

    // Crear nuevo usuario
    const newUser = {
      email: emailNormalized,
      password: credentials.password,
      nombre: nombreNormalized,
      tipoUsuario: credentials.tipoUsuario,
      fechaRegistro: new Date().toISOString()
    }

    // Guardar usuario
    users.push(newUser)
    localStorage.setItem('athletixy_users', JSON.stringify(users))

    // Iniciar sesión automáticamente
    localStorage.setItem('athletixy_session', JSON.stringify({
      email: emailNormalized,
      nombre: nombreNormalized,
      role: credentials.tipoUsuario,
      loggedIn: true
    }))

    setSuccess('¡Registro exitoso! Redirigiendo...')
    
    // Redirigir según tipo de usuario
    setTimeout(() => {
      if (credentials.tipoUsuario === 'nutriologo') {
        router.push('/dashboard/nutriologo')
      } else if (credentials.tipoUsuario === 'coach') {
        router.push('/dashboard/coach')
      } else if (credentials.tipoUsuario === 'gym') {
        router.push('/dashboard')
      } else if (credentials.tipoUsuario === 'vendedor') {
        router.push('/dashboard/marketplace')
      } else {
        router.push('/dashboard')
      }
    }, 1000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!credentials.email || !credentials.password) {
      setError('Por favor ingresa email y contraseña')
      return
    }

    // Normalizar email
    const emailNormalized = credentials.email.trim().toLowerCase()
    const passwordNormalized = credentials.password.trim()

    // Obtener usuarios registrados
    const usersStr = localStorage.getItem('athletixy_users')
    const users = usersStr ? JSON.parse(usersStr) : []

    // Buscar usuario
    const user = users.find((u: any) => 
      u.email.toLowerCase() === emailNormalized && u.password === passwordNormalized
    )

    if (user) {
      // Guardar sesión
      localStorage.setItem('athletixy_session', JSON.stringify({
        email: user.email,
        nombre: user.nombre,
        role: user.tipoUsuario,
        loggedIn: true
      }))

      // Redirigir según rol
      if (user.tipoUsuario === 'nutriologo') {
        router.push('/dashboard/nutriologo')
      } else if (user.tipoUsuario === 'coach') {
        router.push('/dashboard/coach')
      } else if (user.tipoUsuario === 'gym') {
        router.push('/dashboard')
      } else if (user.tipoUsuario === 'vendedor') {
        router.push('/dashboard/marketplace')
      } else {
        router.push('/dashboard')
      }
    } else {
      setError('Credenciales inválidas. Por favor verifica tu email y contraseña.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
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

        {/* Toggle Login/Register */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => {
              setIsLogin(true)
              setError('')
              setSuccess('')
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              isLogin
                ? 'bg-black text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setIsLogin(false)
              setError('')
              setSuccess('')
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              !isLogin
                ? 'bg-black text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-black">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={credentials.nombre}
                  onChange={(e) => setCredentials({...credentials, nombre: e.target.value})}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

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
                placeholder={isLogin ? "••••••••" : "Mínimo 6 caracteres"}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Usuario
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setCredentials({...credentials, tipoUsuario: 'atleta'})}
                    className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                      credentials.tipoUsuario === 'atleta'
                        ? 'border-black bg-gray-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className={`w-6 h-6 ${credentials.tipoUsuario === 'atleta' ? 'text-black' : 'text-gray-400'}`} />
                    <span className={`font-medium text-sm ${credentials.tipoUsuario === 'atleta' ? 'text-black' : 'text-gray-600'}`}>
                      Atleta
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCredentials({...credentials, tipoUsuario: 'nutriologo'})}
                    className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                      credentials.tipoUsuario === 'nutriologo'
                        ? 'border-black bg-gray-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Apple className={`w-6 h-6 ${credentials.tipoUsuario === 'nutriologo' ? 'text-black' : 'text-gray-400'}`} />
                    <span className={`font-medium text-sm ${credentials.tipoUsuario === 'nutriologo' ? 'text-black' : 'text-gray-600'}`}>
                      Nutriólogo
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCredentials({...credentials, tipoUsuario: 'coach'})}
                    className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                      credentials.tipoUsuario === 'coach'
                        ? 'border-black bg-gray-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users className={`w-6 h-6 ${credentials.tipoUsuario === 'coach' ? 'text-black' : 'text-gray-400'}`} />
                    <span className={`font-medium text-sm ${credentials.tipoUsuario === 'coach' ? 'text-black' : 'text-gray-600'}`}>
                      Coach
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCredentials({...credentials, tipoUsuario: 'gym'})}
                    className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                      credentials.tipoUsuario === 'gym'
                        ? 'border-black bg-gray-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className={`w-6 h-6 ${credentials.tipoUsuario === 'gym' ? 'text-black' : 'text-gray-400'}`} />
                    <span className={`font-medium text-sm ${credentials.tipoUsuario === 'gym' ? 'text-black' : 'text-gray-600'}`}>
                      Gym
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCredentials({...credentials, tipoUsuario: 'vendedor'})}
                    className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                      credentials.tipoUsuario === 'vendedor'
                        ? 'border-black bg-gray-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ShoppingBag className={`w-6 h-6 ${credentials.tipoUsuario === 'vendedor' ? 'text-black' : 'text-gray-400'}`} />
                    <span className={`font-medium text-sm ${credentials.tipoUsuario === 'vendedor' ? 'text-black' : 'text-gray-600'}`}>
                      Vendedor
                    </span>
                  </button>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">
                    {credentials.tipoUsuario === 'nutriologo' && 'Como nutriólogo tendrás acceso completo a tu panel de gestión de pacientes y planes nutricionales.'}
                    {credentials.tipoUsuario === 'coach' && 'Como coach podrás gestionar rutinas, entrenamientos y seguimiento de tus atletas.'}
                    {credentials.tipoUsuario === 'gym' && 'Como gimnasio podrás administrar membresías, instalaciones y servicios para tus miembros.'}
                    {credentials.tipoUsuario === 'vendedor' && 'Como vendedor podrás gestionar tu tienda en el marketplace, productos y ventas.'}
                    {credentials.tipoUsuario === 'atleta' && 'Como atleta tendrás acceso a dietas, rutinas, progreso y todos los servicios de Athletixy.'}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              {isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  Ingresar
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Registrarse
                </>
              )}
            </button>
          </form>

          {isLogin && (
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-gray-600 hover:text-black transition">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          )}
        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          © 2025 Athletixy. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
