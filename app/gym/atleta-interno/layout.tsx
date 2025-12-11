'use client'

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  TrendingUp,
  User,
  Dumbbell,
  Users,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
  Target
} from 'lucide-react'

export default function AtletaInternoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(true)

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
    if (isVerifying === false) return

    const verifySession = () => {
      try {
        const session = localStorage.getItem('athletixy_session')
        if (!session) {
          setIsVerifying(false)
          setTimeout(() => router.replace('/'), 100)
          return
        }
        
        const sessionData = JSON.parse(session)
        if (!sessionData.loggedIn) {
          setIsVerifying(false)
          setTimeout(() => router.replace('/'), 100)
          return
        }

        const role = sessionData.role?.toUpperCase()
        if (role !== 'ATLETA_INTERNO' && role !== 'ATHLETE_INTERNO') {
          setIsVerifying(false)
          setTimeout(() => router.replace('/'), 100)
          return
        }

        if (!sessionData.userId) {
          setIsVerifying(false)
          setTimeout(() => router.replace('/'), 100)
          return
        }

        setUserData(sessionData)
        setIsVerifying(false)
      } catch (error) {
        console.error('Error verificando sesión:', error)
        localStorage.removeItem('athletixy_session')
        setIsVerifying(false)
        setTimeout(() => router.replace('/'), 100)
      }
    }

    verifySession()
  }, [isVerifying, router])

  const handleLogout = () => {
    localStorage.removeItem('athletixy_session')
    router.push('/')
  }

  const menuItems = [
    { href: '/gym/atleta-interno', icon: LayoutDashboard, label: 'Mi Panel' },
    { href: '/gym/atleta-interno/mi-progreso', icon: TrendingUp, label: 'Mi Progreso' },
    { href: '/gym/atleta-interno/rutinas', icon: Dumbbell, label: 'Rutinas' },
    { href: '/gym/atleta-interno/mi-coach', icon: User, label: 'Mi Coach' },
    { href: '/gym/atleta-interno/comunidad', icon: Users, label: 'Comunidad' },
    { href: '/gym/atleta-interno/notificaciones', icon: Bell, label: 'Notificaciones' },
    { href: '/gym/atleta-interno/ajustes', icon: Settings, label: 'Ajustes' },
  ]

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <div className="bg-black dark:bg-zinc-100 p-4 rounded-2xl shadow-2xl inline-block mb-4">
            <Dumbbell className="w-12 h-12 text-white dark:text-zinc-900 animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-zinc-400">Verificando sesión...</p>
        </div>
      </div>
    )
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
              <p className="text-xs text-gray-500 dark:text-zinc-500">Atleta Interno</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
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
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-black dark:bg-zinc-100 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-white dark:text-zinc-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black dark:text-zinc-100 truncate">
                {userData?.nombre || 'Atleta'}
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-500">Atleta Interno</p>
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
            <span className="text-lg font-bold text-black dark:text-zinc-100">Athletixy</span>
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
