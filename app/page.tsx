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

  // Verificar si ya hay una sesión activa y redirigir ANTES de renderizar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const session = localStorage.getItem('athletixy_session')
        if (session) {
          const sessionData = JSON.parse(session)
          if (sessionData.loggedIn) {
            // Redirigir según el rol del usuario sin mostrar el formulario
            const role = sessionData.role
            if (role === 'COACH_INTERNO') {
              window.location.href = '/gym/coach-interno'
              return
            } else if (role === 'GYM_MANAGER') {
              window.location.href = '/gym/dashboard'
              return
            } else if (role === 'nutriologo') {
              window.location.href = '/dashboard/nutriologo'
              return
            } else if (role === 'coach') {
              window.location.href = '/dashboard/coach'
              return
            } else if (role === 'gym') {
              window.location.href = '/dashboard'
              return
            } else if (role === 'vendedor') {
              window.location.href = '/dashboard/marketplace'
              return
            } else {
              window.location.href = '/dashboard'
              return
            }
          }
        }
        // Si no hay sesión activa, mostrar el formulario
        setCheckingSession(false)
      } catch (error) {
        console.error('Error verificando sesión:', error)
        setCheckingSession(false)
      }
    }
  }, [])


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
      // Enviar datos al backend para crear usuario en Supabase
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          nombre: credentials.nombre,
          tipoUsuario: credentials.tipoUsuario
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error del servidor:', data)
        setError(data.error || data.details || 'Error al crear el usuario. Por favor intenta nuevamente.')
        return
      }

      // Si el tipo es 'gym', convertirlo a 'GYM_MANAGER' para el sistema
      const tipoUsuarioFinal = credentials.tipoUsuario === 'gym' ? 'GYM_MANAGER' : credentials.tipoUsuario

      // Iniciar sesión automáticamente con el tipo final (GYM_MANAGER si es gym)
      localStorage.setItem('athletixy_session', JSON.stringify({
        email: credentials.email.trim().toLowerCase(),
        nombre: credentials.nombre.trim(),
        role: tipoUsuarioFinal, // Usamos GYM_MANAGER si es gym
        loggedIn: true
      }))

      setSuccess('¡Registro exitoso! Redirigiendo...')
      
      // Redirigir según tipo de usuario
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          if (tipoUsuarioFinal === 'GYM_MANAGER') {
            window.location.href = '/gym/dashboard'
          } else if (tipoUsuarioFinal === 'nutriologo') {
            window.location.href = '/dashboard/nutriologo'
          } else if (tipoUsuarioFinal === 'coach') {
            window.location.href = '/dashboard/coach'
          } else if (tipoUsuarioFinal === 'vendedor') {
            window.location.href = '/dashboard/marketplace'
          } else {
            window.location.href = '/dashboard'
          }
        }
      }, 1000)
    } catch (error: any) {
      console.error('Error en el registro:', error)
      setError(error.message || 'Error al crear el usuario. Por favor intenta nuevamente.')
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!credentials.email || !credentials.password) {
      setError('Por favor ingresa email y contraseña')
      return
    }

    try {
      // Normalizar email
      const emailNormalized = credentials.email.trim().toLowerCase()
      const passwordNormalized = credentials.password.trim()

      // Obtener usuarios registrados
      const usersStr = localStorage.getItem('athletixy_users')
      const users = usersStr ? JSON.parse(usersStr) : []

      // Buscar usuario
      const user = users.find((u: any) => 
        u.email.toLowerCase() === emailNormalized && 
        u.password === passwordNormalized
      )
      
      // Si no encuentra usuario, verificar credenciales hardcodeadas
      if (!user) {
        // Admin
        if (emailNormalized === 'admin@athletixy.com' && passwordNormalized === 'admin123') {
          const sessionData = {
            email: 'admin@athletixy.com',
            nombre: 'Administrador',
            role: 'atleta',
            loggedIn: true,
            isAdmin: true
          }
          localStorage.setItem('athletixy_session', JSON.stringify(sessionData))
          setSuccess('Iniciando sesión...')
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 100)
          return
        }
        // Atleta de ejemplo
        if (emailNormalized === 'atleta@athletixy.com' && passwordNormalized === 'atleta123') {
          const sessionData = {
            email: 'atleta@athletixy.com',
            nombre: 'Carlos Martínez',
            role: 'atleta',
            loggedIn: true,
            isAdmin: false
          }
          localStorage.setItem('athletixy_session', JSON.stringify(sessionData))
          setSuccess('Iniciando sesión...')
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 100)
          return
        }
        // Nutriólogo
        if (emailNormalized === 'nutriologo@athletixy.com' && passwordNormalized === 'nutriologo123') {
          const sessionData = {
            email: 'nutriologo@athletixy.com',
            nombre: 'Dra. Patricia Mendoza',
            role: 'nutriologo',
            loggedIn: true,
            isAdmin: false
          }
          localStorage.setItem('athletixy_session', JSON.stringify(sessionData))
          setSuccess('Iniciando sesión...')
          setTimeout(() => {
            window.location.href = '/dashboard/nutriologo'
          }, 100)
          return
        }
        // Coach
        if (emailNormalized === 'coach@athletixy.com' && passwordNormalized === 'coach123') {
          const sessionData = {
            email: 'coach@athletixy.com',
            nombre: 'Miguel Ángel Torres',
            role: 'coach',
            loggedIn: true,
            isAdmin: false
          }
          localStorage.setItem('athletixy_session', JSON.stringify(sessionData))
          setSuccess('Iniciando sesión...')
          setTimeout(() => {
            window.location.href = '/dashboard/coach'
          }, 100)
          return
        }
        // GYM_MANAGER
        if (emailNormalized === 'gymmanager@athletixy.com' && passwordNormalized === 'gymmanager123') {
          const sessionData = {
            email: 'gymmanager@athletixy.com',
            nombre: 'Gestor del Gimnasio',
            role: 'GYM_MANAGER',
            loggedIn: true,
            isAdmin: false
          }
          localStorage.setItem('athletixy_session', JSON.stringify(sessionData))
          setSuccess('Iniciando sesión...')
          setTimeout(() => {
            window.location.href = '/gym/dashboard'
          }, 100)
          return
        }

        // COACH_INTERNO - Verificar coaches internos del gym
        try {
          const coachesInternos = localStorage.getItem('gym_coaches_internos')
          if (coachesInternos) {
            const coaches = JSON.parse(coachesInternos)
            const coach = coaches.find((c: any) => 
              c.email.toLowerCase() === emailNormalized && 
              c.password === passwordNormalized &&
              c.activo === true
            )
            if (coach) {
              const sessionData = {
                email: coach.email,
                nombre: coach.nombre,
                role: 'COACH_INTERNO',
                coachId: coach.id,
                loggedIn: true,
                isAdmin: false
              }
              localStorage.setItem('athletixy_session', JSON.stringify(sessionData))
              setSuccess('Iniciando sesión...')
              setTimeout(() => {
                window.location.href = '/gym/coach-interno'
              }, 100)
              return
            }
          }
        } catch (error) {
          console.error('Error verificando coach interno:', error)
        }
      }

      if (user) {
        // Si el tipo es 'gym', convertirlo a 'GYM_MANAGER' para el sistema
        const roleFinal = user.tipoUsuario === 'gym' ? 'GYM_MANAGER' : user.tipoUsuario
        
        // Guardar sesión
        const sessionData = {
          email: user.email,
          nombre: user.nombre,
          role: roleFinal, // Usamos GYM_MANAGER si es gym
          loggedIn: true,
          isAdmin: user.isAdmin || false
        }
        localStorage.setItem('athletixy_session', JSON.stringify(sessionData))
        setSuccess('Iniciando sesión...')

        // Redirigir según rol
        setTimeout(() => {
          if (roleFinal === 'GYM_MANAGER') {
            window.location.href = '/gym/dashboard'
          } else if (roleFinal === 'nutriologo') {
            window.location.href = '/dashboard/nutriologo'
          } else if (roleFinal === 'coach') {
            window.location.href = '/dashboard/coach'
          } else if (roleFinal === 'vendedor') {
            window.location.href = '/dashboard/marketplace'
          } else {
            window.location.href = '/dashboard'
          }
        }, 100)
      } else {
        setError('Credenciales inválidas. Por favor verifica tu email y contraseña.')
      }
    } catch (error) {
      console.error('Error en login:', error)
      setError('Ocurrió un error al iniciar sesión. Por favor intenta de nuevo.')
    }
  }

  // No renderizar nada mientras se verifica la sesión
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="bg-black p-4 rounded-2xl shadow-2xl inline-block mb-4">
            <Dumbbell className="w-12 h-12 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8" style={{ minHeight: '100vh' }}>
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

          <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (isLogin) {
              handleLogin(e)
            } else {
              handleRegister(e)
            }
          }} className="space-y-6">
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
                  <button
                    type="button"
                    onClick={() => setCredentials({...credentials, tipoUsuario: 'GYM_MANAGER'})}
                    className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                      credentials.tipoUsuario === 'GYM_MANAGER'
                        ? 'border-black bg-gray-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className={`w-6 h-6 ${credentials.tipoUsuario === 'GYM_MANAGER' ? 'text-black' : 'text-gray-400'}`} />
                    <span className={`font-medium text-sm ${credentials.tipoUsuario === 'GYM_MANAGER' ? 'text-black' : 'text-gray-600'}`}>
                      Gestor Gym
                    </span>
                  </button>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">
                    {credentials.tipoUsuario === 'GYM_MANAGER' && 'Como gestor del gimnasio tendrás acceso completo a finanzas, suscripciones, atletas, ventas, reportes y configuración del gimnasio.'}
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
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
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
