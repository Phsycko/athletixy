'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, TrendingUp, Calendar, Target, Flame, Droplet } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Verificar rol del usuario y redirigir si es necesario
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('athletixy_session')
      if (session) {
        try {
          const sessionData = JSON.parse(session)
          const role = sessionData.role

          // Redirigir según el rol
          if (role === 'nutriologo') {
            router.push('/dashboard/nutriologo')
            return
          } else if (role === 'coach') {
            router.push('/dashboard/coach')
            return
          } else if (role === 'vendedor') {
            router.push('/dashboard/marketplace')
            return
          }
          // Si es atleta o gym, mostrar el dashboard normal
        } catch (error) {
          console.error('Error parsing session:', error)
        }
      }
    }
  }, [router])
  const stats = [
    {
      label: 'Calorías Hoy',
      value: '2,450',
      target: '/ 2,800',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      label: 'Entrenamientos',
      value: '18',
      target: '/ 20 este mes',
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      label: 'Peso Actual',
      value: '75.2',
      target: 'kg',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      label: 'Hidratación',
      value: '2.1',
      target: '/ 3.0 L',
      icon: Droplet,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
  ]

  const recentActivities = [
    { name: 'Entrenamiento de Fuerza', date: '2025-12-04', duration: '60 min', calories: 420 },
    { name: 'Cardio HIIT', date: '2025-12-03', duration: '30 min', calories: 350 },
    { name: 'Yoga y Estiramiento', date: '2025-12-02', duration: '45 min', calories: 180 },
  ]

  const upcomingEvents = [
    { title: 'Consulta con Nutriólogo', time: 'Hoy 15:00', type: 'nutricion' },
    { title: 'Sesión con Coach', time: 'Mañana 10:00', type: 'entrenamiento' },
    { title: 'Renovar Membresía', time: '10 Dic', type: 'admin' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen de tu actividad y progreso</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`bg-white border ${stat.borderColor} rounded-xl p-6 hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-black">{stat.value}</span>
                  <span className="text-gray-600 text-sm">{stat.target}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-black mb-6">Actividad Reciente</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-gray-600 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Activity className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-black font-medium">{activity.name}</p>
                    <p className="text-gray-600 text-sm">{activity.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-black font-semibold">{activity.duration}</p>
                  <p className="text-gray-600 text-sm">{activity.calories} kcal</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-black mb-6">Próximos Eventos</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white rounded-lg border-2 border-gray-200"
              >
                <div className="bg-purple-600/10 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-black font-medium">{event.title}</p>
                  <p className="text-gray-600 text-sm">{event.time}</p>
                </div>
                <span className="px-3 py-1 bg-white/10 text-black text-xs font-medium rounded-full">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Goals */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black mb-6">Objetivos Semanales</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Entrenamientos</span>
              <span className="text-gray-600">4 / 5</span>
            </div>
            <div className="w-full bg-white rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Calorías Objetivo</span>
              <span className="text-gray-600">18,200 / 21,000</span>
            </div>
            <div className="w-full bg-white rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Hidratación Diaria</span>
              <span className="text-gray-600">5 / 7 días</span>
            </div>
            <div className="w-full bg-white rounded-full h-2">
              <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '71%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

