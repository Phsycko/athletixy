'use client'

import { CreditCard, Calendar, Check, Star, Clock } from 'lucide-react'

export default function MembresiasPage() {
  const membresiaActual = {
    plan: 'Premium',
    precio: 89.99,
    fechaInicio: '2025-01-15',
    fechaVencimiento: '2025-12-15',
    renovacionAutomatica: true,
  }

  const planes = [
    {
      nombre: 'Básico',
      precio: 29.99,
      periodo: 'mes',
      caracteristicas: [
        'Acceso a rutinas básicas',
        'Planes de dieta estándar',
        'Seguimiento de progreso',
        'Comunidad de usuarios',
      ],
      popular: false,
    },
    {
      nombre: 'Pro',
      precio: 59.99,
      periodo: 'mes',
      caracteristicas: [
        'Todo lo del plan Básico',
        'Rutinas personalizadas',
        'Planes nutricionales avanzados',
        'Soporte prioritario',
        'Acceso a recetas premium',
        'Análisis de progreso detallado',
      ],
      popular: true,
    },
    {
      nombre: 'Premium',
      precio: 89.99,
      periodo: 'mes',
      caracteristicas: [
        'Todo lo del plan Pro',
        'Coach personal dedicado',
        'Consultas con nutriólogo',
        'Acceso completo al marketplace',
        'Sesiones en vivo',
        'Sin publicidad',
        'Prioridad en soporte 24/7',
      ],
      popular: false,
    },
  ]

  const historialPagos = [
    { fecha: '2025-11-15', monto: 89.99, estado: 'Completado', metodo: 'Visa ****1234' },
    { fecha: '2025-10-15', monto: 89.99, estado: 'Completado', metodo: 'Visa ****1234' },
    { fecha: '2025-09-15', monto: 89.99, estado: 'Completado', metodo: 'Visa ****1234' },
  ]

  const diasRestantes = Math.ceil(
    (new Date('2025-12-15').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black mb-2">Membresías</h1>
        <p className="text-gray-600">Administra tu plan y pagos</p>
      </div>

      {/* Membresía Actual */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span className="text-yellow-300 font-semibold text-sm">Plan Activo</span>
            </div>
            <h2 className="text-3xl font-bold text-black mb-2">{membresiaActual.plan}</h2>
            <p className="text-black/80">
              ${membresiaActual.precio} <span className="text-sm">/mes</span>
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-black/80 text-sm">Vence en</p>
            <p className="text-2xl font-bold text-black">{diasRestantes}</p>
            <p className="text-black/80 text-sm">días</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-black/60 text-sm mb-1">Inicio</p>
            <p className="text-black font-medium">{membresiaActual.fechaInicio}</p>
          </div>
          <div>
            <p className="text-black/60 text-sm mb-1">Vencimiento</p>
            <p className="text-black font-medium">{membresiaActual.fechaVencimiento}</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
          <span className="text-black text-sm">Renovación automática</span>
          <span className="px-3 py-1 bg-green-500 text-black text-xs font-medium rounded-full">
            Activa
          </span>
        </div>
      </div>

      {/* Planes Disponibles */}
      <div>
        <h2 className="text-lg font-semibold text-black mb-6">Planes Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planes.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 border-2 transition-all ${
                plan.popular
                  ? 'bg-white/10 border-gray-600 shadow-xl'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="mb-4">
                  <span className="px-3 py-1 bg-white text-black text-xs font-medium rounded-full">
                    Más Popular
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-black mb-2">{plan.nombre}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-black">${plan.precio}</span>
                <span className="text-gray-600">/{plan.periodo}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.caracteristicas.map((caracteristica, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{caracteristica}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  membresiaActual.plan === plan.nombre
                    ? 'bg-dark-600 text-gray-600 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-black hover:bg-gray-800 text-white'
                    : 'bg-dark-700 hover:bg-dark-600 text-black'
                }`}
                disabled={membresiaActual.plan === plan.nombre}
              >
                {membresiaActual.plan === plan.nombre ? 'Plan Actual' : 'Cambiar a este Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Historial de Pagos */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-black mb-6">Historial de Pagos</h2>
        <div className="space-y-4">
          {historialPagos.map((pago, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <CreditCard className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-black font-medium">${pago.monto}</p>
                  <p className="text-gray-500 text-sm">{pago.metodo}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 text-sm">{pago.fecha}</span>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                  {pago.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

