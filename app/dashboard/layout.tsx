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

  useEffect(() => {
    // Verificar autenticación
    const session = localStorage.getItem('athletixy_session')
    if (!session) {
      router.push('/')
    } else {
      const sessionData = JSON.parse(session)
      setUserEmail(sessionData.email)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('athletixy_session')
    router.push('/')
  }

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/dietas', icon: UtensilsCrossed, label: 'Dietas' },
    { href: '/dashboard/rutinas', icon: Dumbbell, label: 'Rutinas' },
    { href: '/dashboard/membresias', icon: CreditCard, label: 'Membresías' },
    { href: '/dashboard/progreso', icon: TrendingUp, label: 'Progreso' },
    { href: '/dashboard/recetas', icon: Book, label: 'Recetas' },
    { href: '/dashboard/nutriologo', icon: Apple, label: 'Nutriólogo' },
    { href: '/dashboard/coach', icon: User, label: 'Coach' },
    { href: '/dashboard/comunidad', icon: MessageSquare, label: 'Comunidad' },
    { href: '/dashboard/marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { href: '/dashboard/notificaciones', icon: Bell, label: 'Notificaciones' },
    { href: '/dashboard/soporte', icon: HeadphonesIcon, label: 'Soporte' },
    { href: '/dashboard/ajustes', icon: Settings, label: 'Ajustes' },
  ]

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-screen">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-black p-2 rounded-lg">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-black">Athletixy</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3">
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
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black truncate">{userEmail}</p>
              <p className="text-xs text-gray-500">Atleta</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-400 hover:bg-gray-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black p-2 rounded-lg">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-black">Athletixy</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600 hover:text-black transition"
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
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-400 hover:bg-gray-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

