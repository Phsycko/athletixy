'use client'

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  CreditCard,
  Users,
  TrendingUp,
  FileText,
  Settings,
  Bell,
  Dumbbell,
  LogOut,
  Menu,
  X,
  DollarSign,
  BarChart3,
  Calendar,
  UserCheck,
  AlertCircle,
  User,
  UserCog
} from 'lucide-react'

export default function GymLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0)

  // Efecto para manejar el tema
  useEffect(() => {
    if (typeof window === 'undefined') return

    const applyTheme = () => {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    applyTheme()
    window.addEventListener('themechange', applyTheme)
    
    return () => {
      window.removeEventListener('themechange', applyTheme)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Si la ruta es de coach-interno, no hacer verificación aquí (su propio layout lo maneja)
    if (pathname?.startsWith('/gym/coach-interno')) {
      return
    }

    try {
      const session = localStorage.getItem('athletixy_session')
      if (!session) {
        window.location.href = '/'
        return
      }
      
      const sessionData = JSON.parse(session)
      if (!sessionData.loggedIn) {
        window.location.href = '/'
        return
      }

      // Verificar que sea GYM_MANAGER (solo para rutas que no son coach-interno)
      if (sessionData.role !== 'GYM_MANAGER') {
        window.location.href = '/'
        return
      }
      
      setUserEmail(sessionData.email || '')
    } catch (error) {
      console.error('Error parsing session:', error)
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem('athletixy_session')
    router.push('/')
  }

  // Menú específico para GYM_MANAGER
  const menuItems = [
    { href: '/gym/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/gym/suscripciones', icon: CreditCard, label: 'Suscripciones' },
    { href: '/gym/atletas', icon: Users, label: 'Atletas' },
    { href: '/gym/coaches', icon: UserCog, label: 'Coaches' },
    { href: '/gym/ventas', icon: DollarSign, label: 'Ventas' },
    { href: '/gym/reportes', icon: FileText, label: 'Reportes' },
    { href: '/gym/notificaciones', icon: Bell, label: 'Notificaciones' },
    { href: '/gym/configuracion', icon: Settings, label: 'Configuración' },
  ]

  // Calcular notificaciones no leídas
  useEffect(() => {
    const notificaciones = [
      { leido: false },
      { leido: false },
      { leido: true },
    ]
    const noLeidas = notificaciones.filter(n => !n.leido).length
    setNotificacionesNoLeidas(noLeidas)
  }, [])

  // Si es una ruta de coach-interno o atletas-internos, renderizar solo el children sin el layout del gym
  if (pathname?.startsWith('/gym/coach-interno') || pathname?.startsWith('/gym/atletas-internos')) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 flex transition-colors duration-200">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 fixed h-screen transition-colors duration-200">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="bg-black dark:bg-zinc-100 p-2 rounded-lg">
              <Dumbbell className="w-6 h-6 text-white dark:text-zinc-900" />
            </div>
            <div>
              <span className="text-xl font-bold text-black dark:text-zinc-100">Athletixy</span>
              <p className="text-xs text-gray-500 dark:text-zinc-500">Gestor de Gimnasio</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const tieneNotificaciones = item.href === '/gym/notificaciones' && notificacionesNoLeidas > 0
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 relative ${
                    isActive
                      ? 'bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                      : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-zinc-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {tieneNotificaciones && (
                    <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive 
                        ? 'bg-white dark:bg-zinc-900 text-black dark:text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {notificacionesNoLeidas}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-black dark:bg-zinc-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white dark:text-zinc-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black dark:text-zinc-100 truncate">{userEmail}</p>
              <p className="text-xs text-gray-500 dark:text-zinc-500">Gestor de Gimnasio</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition font-medium"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 z-40 px-4 py-3 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black dark:bg-zinc-100 p-2 rounded-lg">
              <Dumbbell className="w-5 h-5 text-white dark:text-zinc-900" />
            </div>
            <span className="text-lg font-bold text-black dark:text-zinc-100">Athletixy Gym</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white dark:bg-zinc-900 z-30 pt-16 overflow-y-auto transition-colors duration-200">
          <nav className="p-4">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                const tieneNotificaciones = item.href === '/gym/notificaciones' && notificacionesNoLeidas > 0
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 relative ${
                      isActive
                        ? 'bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                        : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-zinc-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {tieneNotificaciones && (
                      <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                        isActive 
                          ? 'bg-white dark:bg-zinc-900 text-black dark:text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {notificacionesNoLeidas}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition font-medium"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 bg-white dark:bg-zinc-950 min-h-screen transition-colors duration-200">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

