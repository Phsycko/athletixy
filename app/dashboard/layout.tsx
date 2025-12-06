'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  UtensilsCrossed,
  Dumbbell,
  CreditCard,
  TrendingUp,
  Book,
  Settings,
  HeadphonesIcon,
  Bell,
  Users,
  MessageSquare,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  Apple
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState<'atleta' | 'nutriologo' | 'coach' | 'gym' | 'vendedor'>('atleta')
  const [isAdminState, setIsAdminState] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setMounted(true)

    try {
      // Verificar autenticación
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
      
      setUserEmail(sessionData.email || '')
      setUserRole(sessionData.role || 'atleta')
      
      // Verificar si es admin y establecer estado
      const isAdmin = sessionData.isAdmin || false
      setIsAdminState(isAdmin)
      
      // Redirigir según rol si está en una ruta no permitida (admin tiene acceso a todo)
      const role = sessionData.role
      
      // Admin tiene acceso completo, no redirigir
      if (!isAdmin) {
        if (role === 'nutriologo') {
          const allowedRoutes = ['/dashboard', '/dashboard/nutriologo', '/dashboard/notificaciones', '/dashboard/soporte', '/dashboard/ajustes']
          if (pathname.startsWith('/dashboard') && !allowedRoutes.includes(pathname)) {
            window.location.href = '/dashboard/nutriologo'
          }
        } else if (role === 'coach') {
          const allowedRoutes = ['/dashboard', '/dashboard/coach', '/dashboard/notificaciones', '/dashboard/soporte', '/dashboard/ajustes']
          if (pathname.startsWith('/dashboard') && !allowedRoutes.includes(pathname)) {
            window.location.href = '/dashboard/coach'
          }
        } else if (role === 'gym') {
          const allowedRoutes = ['/dashboard', '/dashboard/membresias', '/dashboard/notificaciones', '/dashboard/soporte', '/dashboard/ajustes']
          if (pathname.startsWith('/dashboard') && !allowedRoutes.includes(pathname)) {
            window.location.href = '/dashboard'
          }
        } else if (role === 'vendedor') {
          const allowedRoutes = ['/dashboard', '/dashboard/marketplace', '/dashboard/notificaciones', '/dashboard/soporte', '/dashboard/ajustes']
          if (pathname.startsWith('/dashboard') && !allowedRoutes.includes(pathname)) {
            window.location.href = '/dashboard/marketplace'
          }
        }
      }
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

  // Menú completo
  const allMenuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['atleta', 'coach', 'gym', 'vendedor'] },
    { href: '/dashboard/dietas', icon: UtensilsCrossed, label: 'Dietas', roles: ['atleta'] },
    { href: '/dashboard/rutinas', icon: Dumbbell, label: 'Rutinas', roles: ['atleta'] },
    { href: '/dashboard/membresias', icon: CreditCard, label: 'Membresías', roles: ['atleta', 'gym'] },
    { href: '/dashboard/progreso', icon: TrendingUp, label: 'Progreso', roles: ['atleta'] },
    { href: '/dashboard/recetas', icon: Book, label: 'Recetas', roles: ['atleta'] },
    { href: '/dashboard/nutriologo', icon: Apple, label: 'Panel Nutriólogo', roles: ['nutriologo'] },
    { href: '/dashboard/coach', icon: User, label: 'Panel Coach', roles: ['coach'] },
    { href: '/dashboard/comunidad', icon: MessageSquare, label: 'Comunidad', roles: ['atleta'] },
    { href: '/dashboard/marketplace', icon: ShoppingBag, label: 'Marketplace', roles: ['atleta', 'vendedor'] },
    { href: '/dashboard/notificaciones', icon: Bell, label: 'Notificaciones', roles: ['atleta', 'nutriologo', 'coach', 'gym', 'vendedor'] },
    { href: '/dashboard/soporte', icon: HeadphonesIcon, label: 'Soporte', roles: ['atleta', 'nutriologo', 'coach', 'gym', 'vendedor'] },
    { href: '/dashboard/ajustes', icon: Settings, label: 'Ajustes', roles: ['atleta', 'nutriologo', 'coach', 'gym', 'vendedor'] },
  ]

  // Filtrar menú según rol (admin ve todo)
  const menuItems = isAdminState 
    ? allMenuItems 
    : allMenuItems.filter(item => item.roles.includes(userRole))

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r-2 border-gray-200 fixed h-screen">
        <div className="p-6 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-black p-2 rounded-lg">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-black">Athletixy</span>
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-black text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-4 border-t-2 border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black truncate">{userEmail}</p>
              <p className="text-xs text-gray-600 capitalize">
                {userRole === 'nutriologo' ? 'Nutriólogo' : 
                 userRole === 'coach' ? 'Coach' : 
                 userRole === 'gym' ? 'Gym' : 
                 userRole === 'vendedor' ? 'Vendedor' : 
                 'Atleta'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-200 rounded-lg transition font-medium"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b-2 border-gray-200 z-40 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black p-2 rounded-lg">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-black">Athletixy</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-30 pt-16 overflow-y-auto">
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-black text-white font-semibold'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition font-medium"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 bg-gray-50 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

