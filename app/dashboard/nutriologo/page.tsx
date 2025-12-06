'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  Video,
  MessageCircle,
  FileText,
  Clock,
  Star,
  Phone,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  UserPlus,
  UserCheck,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  X,
  ChevronRight,
  BarChart3,
  Target,
  Activity,
  Award,
  ChevronLeft
} from 'lucide-react'

type Paciente = {
  id: string
  nombre: string
  email: string
  telefono?: string
  fechaRegistro: string
  tipo: 'existente' | 'app'
  planActivo: string
  ultimaConsulta: string
  proximaConsulta?: string
  estado: 'activo' | 'inactivo'
  objetivos: string[]
  progreso: {
    peso: number
    pesoObjetivo: number
    grasaCorporal: number
    musculo: number
  }
}

type PlanNutricional = {
  id: string
  pacienteId: string
  nombre: string
  fechaInicio: string
  fechaFin: string
  calorias: number
  macros: {
    proteinas: number
    carbohidratos: number
    grasas: number
  }
  objetivos: string[]
  estado: 'activo' | 'completado' | 'pausado'
}

export default function NutriologoPage() {
  const [vistaActiva, setVistaActiva] = useState<'dashboard' | 'pacientes' | 'asignaciones' | 'calendario'>('dashboard')
  const [filtroPacientes, setFiltroPacientes] = useState<'todos' | 'existentes' | 'app'>('todos')
  const [busquedaPaciente, setBusquedaPaciente] = useState('')
  const [modalAsignarPlan, setModalAsignarPlan] = useState(false)
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null)
  
  // Estados para calendario
  const [mesActual, setMesActual] = useState(new Date())
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null)
  const [modalConsulta, setModalConsulta] = useState(false)
  const [modalBloquearFecha, setModalBloquearFecha] = useState(false)
  const [fechasBloqueadas, setFechasBloqueadas] = useState<string[]>([])
  const [nuevaConsulta, setNuevaConsulta] = useState({
    pacienteId: '',
    fecha: '',
    hora: '',
    tipo: 'presencial' as 'presencial' | 'virtual',
    duracion: '30',
    notas: ''
  })
  const [consultas, setConsultas] = useState<Array<{
    id: string
    pacienteId: string
    pacienteNombre: string
    fecha: string
    hora: string
    tipo: 'presencial' | 'virtual'
    duracion: string
    notas: string
    estado: 'programada' | 'completada' | 'cancelada'
  }>>([])
  
  // Estados para nuevo paciente
  const [modalNuevoPaciente, setModalNuevoPaciente] = useState(false)
  const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'app' as 'existente' | 'app'
  })
  const [nuevoPlan, setNuevoPlan] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    calorias: '',
    proteinas: '',
    carbohidratos: '',
    grasas: '',
    objetivos: [] as string[]
  })

  // Datos del nutriólogo
  const nutriologo = {
    nombre: 'Dra. Patricia Mendoza',
    especialidad: 'Nutrición Deportiva',
    experiencia: '12 años',
    calificacion: 4.9,
    certificaciones: ['Nutrición Clínica', 'Nutrición Deportiva', 'Dietética'],
  }

  // Pacientes iniciales - definidos fuera del estado para evitar problemas de referencia
  const pacientesIniciales: Paciente[] = [
    {
      id: '1',
      nombre: 'Carlos Ramírez',
      email: 'carlos.ramirez@email.com',
      telefono: '+52 555 123 4567',
      fechaRegistro: '2024-01-15',
      tipo: 'existente',
      planActivo: 'Premium',
      ultimaConsulta: '2025-12-01',
      proximaConsulta: '2025-12-15',
      estado: 'activo',
      objetivos: ['Pérdida de grasa', 'Ganancia muscular'],
      progreso: { peso: 75, pesoObjetivo: 70, grasaCorporal: 18, musculo: 45 }
    },
    {
      id: '2',
      nombre: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      telefono: '+52 555 234 5678',
      fechaRegistro: '2025-11-20',
      tipo: 'app',
      planActivo: 'Premium',
      ultimaConsulta: '2025-11-25',
      proximaConsulta: '2025-12-10',
      estado: 'activo',
      objetivos: ['Aumento de masa muscular'],
      progreso: { peso: 58, pesoObjetivo: 65, grasaCorporal: 22, musculo: 38 }
    },
    {
      id: '3',
      nombre: 'Roberto Sánchez',
      email: 'roberto.sanchez@email.com',
      fechaRegistro: '2024-06-10',
      tipo: 'existente',
      planActivo: 'Pro',
      ultimaConsulta: '2025-11-20',
      estado: 'activo',
      objetivos: ['Mantenimiento', 'Rendimiento deportivo'],
      progreso: { peso: 82, pesoObjetivo: 82, grasaCorporal: 15, musculo: 52 }
    },
    {
      id: '4',
      nombre: 'María González',
      email: 'maria.gonzalez@email.com',
      telefono: '+52 555 345 6789',
      fechaRegistro: '2025-10-05',
      tipo: 'app',
      planActivo: 'Premium',
      ultimaConsulta: '2025-11-30',
      estado: 'activo',
      objetivos: ['Pérdida de peso'],
      progreso: { peso: 68, pesoObjetivo: 60, grasaCorporal: 28, musculo: 35 }
    }
  ]

  const [pacientes, setPacientes] = useState<Paciente[]>(pacientesIniciales)

  const [planesNutricionales, setPlanesNutricionales] = useState<PlanNutricional[]>([])

  // Estadísticas - calculadas de forma segura
  const pacientesArray = pacientes || []
  const estadisticas = {
    totalPacientes: pacientesArray.length,
    pacientesActivos: pacientesArray.filter(p => p?.estado === 'activo').length,
    pacientesApp: pacientesArray.filter(p => p?.tipo === 'app').length,
    pacientesExistentes: pacientesArray.filter(p => p?.tipo === 'existente').length,
    consultasEsteMes: 24,
    planesActivos: (planesNutricionales || []).filter(p => p?.estado === 'activo').length
  }

  // Cargar datos del localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      // Cargar pacientes
      const pacientesGuardados = localStorage.getItem('athletixy_pacientes_nutriologo')
      if (pacientesGuardados) {
        const pacientesParsed = JSON.parse(pacientesGuardados)
        if (Array.isArray(pacientesParsed) && pacientesParsed.length > 0) {
          setPacientes(pacientesParsed)
        }
      }
    } catch (e) {
      console.error('Error al cargar pacientes:', e)
    }

    try {
      // Cargar consultas
      const consultasGuardadas = localStorage.getItem('athletixy_consultas_nutriologo')
      if (consultasGuardadas) {
        const consultasParsed = JSON.parse(consultasGuardadas)
        if (Array.isArray(consultasParsed)) {
          setConsultas(consultasParsed)
        }
      }
    } catch (e) {
      console.error('Error al cargar consultas:', e)
    }
    
    try {
      // Cargar fechas bloqueadas
      const fechasBloqueadasGuardadas = localStorage.getItem('athletixy_fechas_bloqueadas_nutriologo')
      if (fechasBloqueadasGuardadas) {
        const fechasParsed = JSON.parse(fechasBloqueadasGuardadas)
        if (Array.isArray(fechasParsed)) {
          setFechasBloqueadas(fechasParsed)
        }
      }
    } catch (e) {
      console.error('Error al cargar fechas bloqueadas:', e)
    }
  }, [])

  // Guardar pacientes en localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || pacientes.length === 0) return
    
    try {
      localStorage.setItem('athletixy_pacientes_nutriologo', JSON.stringify(pacientes))
    } catch (e) {
      console.error('Error al guardar pacientes:', e)
    }
  }, [pacientes])

  // Guardar consultas en localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('athletixy_consultas_nutriologo', JSON.stringify(consultas))
    } catch (e) {
      console.error('Error al guardar consultas:', e)
    }
  }, [consultas])

  // Guardar fechas bloqueadas en localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('athletixy_fechas_bloqueadas_nutriologo', JSON.stringify(fechasBloqueadas))
    } catch (e) {
      console.error('Error al guardar fechas bloqueadas:', e)
    }
  }, [fechasBloqueadas])

  // Funciones del calendario
  const obtenerDiasDelMes = () => {
    const año = mesActual.getFullYear()
    const mes = mesActual.getMonth()
    const primerDia = new Date(año, mes, 1)
    const ultimoDia = new Date(año, mes + 1, 0)
    const diasEnMes = ultimoDia.getDate()
    const diaInicioSemana = primerDia.getDay()
    
    const dias: (Date | null)[] = []
    
    // Días del mes anterior para completar la semana
    for (let i = diaInicioSemana - 1; i >= 0; i--) {
      dias.push(null)
    }
    
    // Días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
      dias.push(new Date(año, mes, dia))
    }
    
    return dias
  }

  const formatearFecha = (fecha: Date) => {
    return fecha.toISOString().split('T')[0]
  }

  const tieneConsulta = (fecha: Date) => {
    const fechaStr = formatearFecha(fecha)
    return consultas.some(c => c.fecha === fechaStr && c.estado === 'programada')
  }

  const estaBloqueada = (fecha: Date) => {
    const fechaStr = formatearFecha(fecha)
    return fechasBloqueadas.includes(fechaStr)
  }

  const obtenerConsultasDelDia = (fecha: Date) => {
    const fechaStr = formatearFecha(fecha)
    return consultas.filter(c => c.fecha === fechaStr && c.estado === 'programada')
  }

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    setMesActual(prev => {
      const nuevoMes = new Date(prev)
      if (direccion === 'anterior') {
        nuevoMes.setMonth(prev.getMonth() - 1)
      } else {
        nuevoMes.setMonth(prev.getMonth() + 1)
      }
      return nuevoMes
    })
  }

  const abrirModalConsulta = (fecha?: Date) => {
    if (fecha) {
      setFechaSeleccionada(fecha)
      setNuevaConsulta({
        ...nuevaConsulta,
        fecha: formatearFecha(fecha)
      })
    }
    setModalConsulta(true)
  }

  const guardarConsulta = () => {
    if (!nuevaConsulta.pacienteId || !nuevaConsulta.fecha || !nuevaConsulta.hora) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    const paciente = (pacientes || []).find(p => p?.id === nuevaConsulta.pacienteId)
    if (!paciente) {
      alert('Paciente no encontrado')
      return
    }

    const consulta = {
      id: Date.now().toString(),
      pacienteId: nuevaConsulta.pacienteId,
      pacienteNombre: paciente.nombre,
      fecha: nuevaConsulta.fecha,
      hora: nuevaConsulta.hora,
      tipo: nuevaConsulta.tipo,
      duracion: nuevaConsulta.duracion,
      notas: nuevaConsulta.notas,
      estado: 'programada' as const
    }

    setConsultas([...consultas, consulta])

    // Crear notificaciones
    const notificacionNutriologo = {
      id: Date.now().toString(),
      tipo: 'consulta',
      titulo: 'Nueva Consulta Programada',
      mensaje: `Consulta con ${paciente.nombre} el ${nuevaConsulta.fecha} a las ${nuevaConsulta.hora}`,
      fecha: new Date().toISOString(),
      leido: false,
      relacionado: consulta.id
    }

    const notificacionPaciente = {
      id: (Date.now() + 1).toString(),
      tipo: 'consulta',
      titulo: 'Consulta Programada',
      mensaje: `Tienes una consulta con ${nutriologo.nombre} el ${nuevaConsulta.fecha} a las ${nuevaConsulta.hora}`,
      fecha: new Date().toISOString(),
      leido: false,
      relacionado: consulta.id,
      pacienteId: paciente.id
    }

    // Guardar notificaciones
    const notificacionesNutriologo = JSON.parse(localStorage.getItem('athletixy_notificaciones_nutriologo') || '[]')
    notificacionesNutriologo.push(notificacionNutriologo)
    localStorage.setItem('athletixy_notificaciones_nutriologo', JSON.stringify(notificacionesNutriologo))

    const notificacionesPacientes = JSON.parse(localStorage.getItem('athletixy_notificaciones_pacientes') || '{}')
    if (!notificacionesPacientes[paciente.id]) {
      notificacionesPacientes[paciente.id] = []
    }
    notificacionesPacientes[paciente.id].push(notificacionPaciente)
    localStorage.setItem('athletixy_notificaciones_pacientes', JSON.stringify(notificacionesPacientes))

    // Programar notificaciones futuras (24h antes y 1h antes)
    const fechaConsulta = new Date(`${nuevaConsulta.fecha}T${nuevaConsulta.hora}`)
    const notificacion24h = new Date(fechaConsulta.getTime() - 24 * 60 * 60 * 1000)
    const notificacion1h = new Date(fechaConsulta.getTime() - 60 * 60 * 1000)

    if (notificacion24h > new Date()) {
      setTimeout(() => {
        const notif24h = {
          id: (Date.now() + 2).toString(),
          tipo: 'recordatorio',
          titulo: 'Recordatorio: Consulta Mañana',
          mensaje: `Consulta con ${paciente.nombre} mañana a las ${nuevaConsulta.hora}`,
          fecha: new Date().toISOString(),
          leido: false,
          relacionado: consulta.id
        }
        const notifs = JSON.parse(localStorage.getItem('athletixy_notificaciones_nutriologo') || '[]')
        notifs.push(notif24h)
        localStorage.setItem('athletixy_notificaciones_nutriologo', JSON.stringify(notifs))
      }, notificacion24h.getTime() - Date.now())
    }

    setModalConsulta(false)
    setNuevaConsulta({
      pacienteId: '',
      fecha: '',
      hora: '',
      tipo: 'presencial',
      duracion: '30',
      notas: ''
    })
    setFechaSeleccionada(null)
  }

  const bloquearFecha = (fecha: Date) => {
    const fechaStr = formatearFecha(fecha)
    if (!fechasBloqueadas.includes(fechaStr)) {
      setFechasBloqueadas([...fechasBloqueadas, fechaStr])
    }
  }

  const desbloquearFecha = (fecha: Date) => {
    const fechaStr = formatearFecha(fecha)
    setFechasBloqueadas(fechasBloqueadas.filter(f => f !== fechaStr))
  }

  const eliminarConsulta = (id: string) => {
    setConsultas(consultas.filter(c => c.id !== id))
  }

  // Funciones para nuevo paciente
  const crearNuevoPaciente = () => {
    if (!nuevoPaciente.nombre || !nuevoPaciente.email) {
      alert('Por favor completa el nombre y email del paciente')
      return
    }

    // Verificar si el email ya existe
    if ((pacientes || []).some(p => p?.email?.toLowerCase() === nuevoPaciente.email.toLowerCase())) {
      alert('Ya existe un paciente con este email')
      return
    }

    const paciente: Paciente = {
      id: Date.now().toString(),
      nombre: nuevoPaciente.nombre,
      email: nuevoPaciente.email,
      telefono: nuevoPaciente.telefono || undefined,
      fechaRegistro: new Date().toISOString().split('T')[0],
      tipo: nuevoPaciente.tipo,
      planActivo: 'Básico',
      ultimaConsulta: '',
      estado: 'activo',
      objetivos: [],
      progreso: { peso: 0, pesoObjetivo: 0, grasaCorporal: 0, musculo: 0 }
    }

    setPacientes([...pacientes, paciente])
    
    // Seleccionar el nuevo paciente en el modal de consulta
    setNuevaConsulta({
      ...nuevaConsulta,
      pacienteId: paciente.id
    })
    
    // Cerrar modal de nuevo paciente
    setModalNuevoPaciente(false)
    setNuevoPaciente({
      nombre: '',
      email: '',
      telefono: '',
      tipo: 'app'
    })
  }

  // Consultas próximas
  const consultasProximas = consultas
    .filter(c => c.estado === 'programada' && new Date(c.fecha) >= new Date())
    .sort((a, b) => {
      const fechaA = new Date(`${a.fecha}T${a.hora}`)
      const fechaB = new Date(`${b.fecha}T${b.hora}`)
      return fechaA.getTime() - fechaB.getTime()
    })
    .slice(0, 5)

  // Filtrar pacientes
  const pacientesFiltrados = (pacientes || []).filter(p => {
    if (!p || !p.nombre || !p.email) return false
    const coincideBusqueda = p.nombre.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
                             p.email.toLowerCase().includes(busquedaPaciente.toLowerCase())
    const coincideFiltro = filtroPacientes === 'todos' ||
                          (filtroPacientes === 'existentes' && p.tipo === 'existente') ||
                          (filtroPacientes === 'app' && p.tipo === 'app')
    return coincideBusqueda && coincideFiltro
  })

  const abrirModalAsignar = (paciente: Paciente) => {
    setPacienteSeleccionado(paciente)
    setNuevoPlan({
      nombre: `Plan Nutricional - ${paciente.nombre}`,
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: '',
      calorias: '',
      proteinas: '',
      carbohidratos: '',
      grasas: '',
      objetivos: []
    })
    setModalAsignarPlan(true)
  }

  const guardarPlan = () => {
    if (!pacienteSeleccionado) return

    const plan: PlanNutricional = {
      id: Date.now().toString(),
      pacienteId: pacienteSeleccionado.id,
      nombre: nuevoPlan.nombre,
      fechaInicio: nuevoPlan.fechaInicio,
      fechaFin: nuevoPlan.fechaFin,
      calorias: parseInt(nuevoPlan.calorias),
      macros: {
        proteinas: parseInt(nuevoPlan.proteinas),
        carbohidratos: parseInt(nuevoPlan.carbohidratos),
        grasas: parseInt(nuevoPlan.grasas)
      },
      objetivos: nuevoPlan.objetivos,
      estado: 'activo'
    }

    setPlanesNutricionales([...planesNutricionales, plan])
    setModalAsignarPlan(false)
    setPacienteSeleccionado(null)
  }

  const toggleObjetivo = (objetivo: string) => {
    if (nuevoPlan.objetivos.includes(objetivo)) {
      setNuevoPlan({
        ...nuevoPlan,
        objetivos: nuevoPlan.objetivos.filter(o => o !== objetivo)
      })
    } else {
      setNuevoPlan({
        ...nuevoPlan,
        objetivos: [...nuevoPlan.objetivos, objetivo]
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black mb-2">Panel del Nutriólogo</h1>
          <p className="text-gray-600">Gestión de pacientes y planes nutricionales</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border-2 border-gray-200 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-black">{nutriologo.nombre}</p>
                <p className="text-xs text-gray-600">{nutriologo.especialidad}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de Vistas */}
      <div className="flex gap-2 border-b-2 border-gray-200">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'pacientes', label: 'Pacientes', icon: Users },
          { id: 'asignaciones', label: 'Asignaciones', icon: Target },
          { id: 'calendario', label: 'Calendario', icon: Calendar }
        ].map((vista) => {
          const Icon = vista.icon
          return (
            <button
              key={vista.id}
              onClick={() => setVistaActiva(vista.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition border-b-2 -mb-[2px] ${
                vistaActiva === vista.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              <Icon className="w-4 h-4" />
              {vista.label}
            </button>
          )
        })}
      </div>

      {/* Vista Dashboard */}
      {vistaActiva === 'dashboard' && (
        <div className="space-y-8">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-black" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Pacientes</p>
              <p className="text-3xl font-bold text-black">{estadisticas.totalPacientes}</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <UserCheck className="w-6 h-6 text-black" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Pacientes Activos</p>
              <p className="text-3xl font-bold text-black">{estadisticas.pacientesActivos}</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <UserPlus className="w-6 h-6 text-black" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">De la App</p>
              <p className="text-3xl font-bold text-black">{estadisticas.pacientesApp}</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-black" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Planes Activos</p>
              <p className="text-3xl font-bold text-black">{estadisticas.planesActivos}</p>
            </div>
          </div>

          {/* Consultas Próximas y Resumen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Consultas Próximas */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-black mb-6">Próximas Consultas</h2>
              <div className="space-y-4">
                {consultasProximas.length > 0 ? (
                  consultasProximas.map((consulta) => (
                    <div
                      key={consulta.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-semibold text-black">{consulta.pacienteNombre}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{consulta.fecha}</span>
                          <span>•</span>
                          <Clock className="w-4 h-4" />
                          <span>{consulta.hora}</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            consulta.tipo === 'virtual' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {consulta.tipo === 'virtual' ? 'Virtual' : 'Presencial'}
                          </span>
                        </div>
                      </div>
                      {consulta.tipo === 'virtual' ? (
                        <Video className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Users className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No hay consultas programadas</p>
                )}
              </div>
            </div>

            {/* Resumen de Pacientes */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-black mb-6">Distribución de Pacientes</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-black" />
                    <div>
                      <p className="font-semibold text-black">Pacientes Existentes</p>
                      <p className="text-sm text-gray-600">Pacientes previos a la app</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-black">{estadisticas.pacientesExistentes}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-5 h-5 text-black" />
                    <div>
                      <p className="font-semibold text-black">Pacientes de la App</p>
                      <p className="text-sm text-gray-600">Contratados mediante Athletixy</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-black">{estadisticas.pacientesApp}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-black" />
                    <div>
                      <p className="font-semibold text-black">Consultas Este Mes</p>
                      <p className="text-sm text-gray-600">Total de consultas realizadas</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-black">{estadisticas.consultasEsteMes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista Pacientes */}
      {vistaActiva === 'pacientes' && (
        <div className="space-y-6">
          {/* Filtros y Búsqueda */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar paciente por nombre o email..."
                  value={busquedaPaciente}
                  onChange={(e) => setBusquedaPaciente(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFiltroPacientes('todos')}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    filtroPacientes === 'todos'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFiltroPacientes('existentes')}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    filtroPacientes === 'existentes'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Existentes
                </button>
                <button
                  onClick={() => setFiltroPacientes('app')}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    filtroPacientes === 'app'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  De la App
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Pacientes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacientesFiltrados.map((paciente) => (
              <div
                key={paciente.id}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {paciente.nombre.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-black">{paciente.nombre}</p>
                      <p className="text-xs text-gray-600">{paciente.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    paciente.tipo === 'app'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {paciente.tipo === 'app' ? 'App' : 'Existente'}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold text-black">{paciente.planActivo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Última consulta:</span>
                    <span className="text-black">{paciente.ultimaConsulta}</span>
                  </div>
                  {paciente.proximaConsulta && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Próxima:</span>
                      <span className="text-black font-semibold">{paciente.proximaConsulta}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {paciente.objetivos.map((obj, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {obj}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => abrirModalAsignar(paciente)}
                    className="flex-1 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition text-sm font-medium"
                  >
                    Asignar Plan
                  </button>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pacientesFiltrados.length === 0 && (
            <div className="text-center py-12 bg-white border-2 border-gray-200 rounded-xl">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron pacientes</p>
            </div>
          )}
        </div>
      )}

      {/* Vista Asignaciones */}
      {vistaActiva === 'asignaciones' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black">Planes Nutricionales Asignados</h2>
            <button
              onClick={() => setVistaActiva('pacientes')}
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium"
            >
              <Plus className="w-4 h-4" />
              Asignar Nuevo Plan
            </button>
          </div>

          {planesNutricionales.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {planesNutricionales.map((plan) => {
                const paciente = (pacientes || []).find(p => p?.id === plan.pacienteId)
                return (
                  <div
                    key={plan.id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-black mb-1">{plan.nombre}</h3>
                        <p className="text-sm text-gray-600">{paciente?.nombre}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        plan.estado === 'activo'
                          ? 'bg-green-100 text-green-700'
                          : plan.estado === 'completado'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {plan.estado}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Calorías</p>
                        <p className="text-lg font-bold text-black">{plan.calorias} kcal</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Período</p>
                        <p className="text-sm text-black">{plan.fechaInicio} - {plan.fechaFin}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-xs text-gray-600 mb-2">Macronutrientes</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Proteínas:</span>
                          <span className="font-semibold text-black">{plan.macros.proteinas}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Carbohidratos:</span>
                          <span className="font-semibold text-black">{plan.macros.carbohidratos}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Grasas:</span>
                          <span className="font-semibold text-black">{plan.macros.grasas}g</span>
                        </div>
                      </div>
                    </div>

                    {plan.objetivos.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {plan.objetivos.map((obj, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {obj}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium">
                        Editar
                      </button>
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border-2 border-gray-200 rounded-xl">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No hay planes asignados</p>
              <button
                onClick={() => setVistaActiva('pacientes')}
                className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium"
              >
                Asignar Primer Plan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Vista Calendario */}
      {vistaActiva === 'calendario' && (
        <div className="space-y-6">
          {/* Header del Calendario */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-black mb-2">Calendario de Consultas</h2>
                <p className="text-gray-600 text-sm">Gestiona tus consultas y bloquea fechas no disponibles</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setModalBloquearFecha(true)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium"
                >
                  Bloquear Fecha
                </button>
                <button
                  onClick={() => abrirModalConsulta()}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition text-sm font-medium"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Nueva Consulta
                </button>
              </div>
            </div>

            {/* Navegación del Mes */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => cambiarMes('anterior')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-bold text-black capitalize">
                {mesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={() => cambiarMes('siguiente')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Calendario */}
            <div className="grid grid-cols-7 gap-2">
              {/* Días de la semana */}
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((dia) => (
                <div key={dia} className="text-center font-semibold text-gray-700 py-2 text-sm">
                  {dia}
                </div>
              ))}

              {/* Días del mes */}
              {obtenerDiasDelMes().map((dia, index) => {
                if (!dia) {
                  return <div key={`empty-${index}`} className="aspect-square"></div>
                }

                const tieneConsultas = tieneConsulta(dia)
                const bloqueada = estaBloqueada(dia)
                const esHoy = formatearFecha(dia) === formatearFecha(new Date())
                const consultasDelDia = obtenerConsultasDelDia(dia)

                return (
                  <div
                    key={dia.getTime()}
                    onClick={() => {
                      if (!bloqueada) {
                        abrirModalConsulta(dia)
                      }
                    }}
                    className={`aspect-square border-2 rounded-lg p-2 cursor-pointer transition ${
                      bloqueada
                        ? 'bg-red-50 border-red-300 cursor-not-allowed'
                        : esHoy
                        ? 'bg-black text-white border-black'
                        : tieneConsultas
                        ? 'bg-green-50 border-green-300 hover:border-green-500'
                        : 'bg-white border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-semibold ${esHoy ? 'text-white' : 'text-black'}`}>
                        {dia.getDate()}
                      </span>
                      {bloqueada && (
                        <X className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                    {tieneConsultas && (
                      <div className="space-y-1">
                        {consultasDelDia.slice(0, 2).map((consulta) => (
                          <div
                            key={consulta.id}
                            className={`text-xs px-1 py-0.5 rounded ${
                              esHoy ? 'bg-white/20 text-white' : 'bg-green-200 text-green-800'
                            }`}
                            title={`${consulta.pacienteNombre} - ${consulta.hora}`}
                          >
                            {consulta.hora}
                          </div>
                        ))}
                        {consultasDelDia.length > 2 && (
                          <div className={`text-xs ${esHoy ? 'text-white/80' : 'text-gray-600'}`}>
                            +{consultasDelDia.length - 2} más
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Leyenda */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-black rounded"></div>
                <span className="text-gray-600">Hoy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border-2 border-green-300 rounded"></div>
                <span className="text-gray-600">Con consultas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border-2 border-red-300 rounded"></div>
                <span className="text-gray-600">Bloqueada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div>
                <span className="text-gray-600">Disponible</span>
              </div>
            </div>
          </div>

          {/* Lista de Consultas del Mes */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Consultas de {mesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h3>
            <div className="space-y-3">
              {consultas
                .filter(c => {
                  const fechaConsulta = new Date(c.fecha)
                  return fechaConsulta.getMonth() === mesActual.getMonth() && 
                         fechaConsulta.getFullYear() === mesActual.getFullYear() &&
                         c.estado === 'programada'
                })
                .sort((a, b) => {
                  const fechaA = new Date(`${a.fecha}T${a.hora}`)
                  const fechaB = new Date(`${b.fecha}T${b.hora}`)
                  return fechaA.getTime() - fechaB.getTime()
                })
                .map((consulta) => (
                  <div
                    key={consulta.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-black p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-black">{consulta.pacienteNombre}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span>{consulta.fecha}</span>
                          <span>•</span>
                          <span>{consulta.hora}</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded ${
                            consulta.tipo === 'virtual' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {consulta.tipo === 'virtual' ? 'Virtual' : 'Presencial'}
                          </span>
                          <span>•</span>
                          <span>{consulta.duracion} min</span>
                        </div>
                        {consulta.notas && (
                          <p className="text-xs text-gray-500 mt-1">{consulta.notas}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => eliminarConsulta(consulta.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                        title="Eliminar consulta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              {consultas.filter(c => {
                const fechaConsulta = new Date(c.fecha)
                return fechaConsulta.getMonth() === mesActual.getMonth() && 
                       fechaConsulta.getFullYear() === mesActual.getFullYear() &&
                       c.estado === 'programada'
              }).length === 0 && (
                <p className="text-center text-gray-600 py-8">No hay consultas programadas este mes</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Consulta */}
      {modalConsulta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-black">Nueva Consulta</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {fechaSeleccionada ? `Fecha: ${fechaSeleccionada.toLocaleDateString('es-ES')}` : 'Programar consulta'}
                </p>
              </div>
              <button
                onClick={() => {
                  setModalConsulta(false)
                  setFechaSeleccionada(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Paciente *</label>
                  <button
                    onClick={() => setModalNuevoPaciente(true)}
                    className="flex items-center gap-1 text-sm text-black hover:text-gray-700 font-medium"
                  >
                    <UserPlus className="w-4 h-4" />
                    Agregar Paciente
                  </button>
                </div>
                <select
                  value={nuevaConsulta.pacienteId}
                  onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, pacienteId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Seleccionar paciente</option>
                  {(pacientes || []).map((paciente) => (
                    <option key={paciente?.id} value={paciente?.id}>
                      {paciente?.nombre} - {paciente?.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>
                  <input
                    type="date"
                    value={nuevaConsulta.fecha}
                    onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, fecha: e.target.value })}
                    min={formatearFecha(new Date())}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora *</label>
                  <input
                    type="time"
                    value={nuevaConsulta.hora}
                    onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, hora: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Consulta</label>
                  <select
                    value={nuevaConsulta.tipo}
                    onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, tipo: e.target.value as 'presencial' | 'virtual' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duración (minutos)</label>
                  <select
                    value={nuevaConsulta.duracion}
                    onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, duracion: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas (Opcional)</label>
                <textarea
                  value={nuevaConsulta.notas}
                  onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, notas: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Notas adicionales sobre la consulta..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => {
                    setModalConsulta(false)
                    setFechaSeleccionada(null)
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarConsulta}
                  className="flex-1 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium"
                >
                  Programar Consulta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Paciente */}
      {modalNuevoPaciente && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black">Agregar Nuevo Paciente</h3>
              <button
                onClick={() => {
                  setModalNuevoPaciente(false)
                  setNuevoPaciente({
                    nombre: '',
                    email: '',
                    telefono: '',
                    tipo: 'app'
                  })
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  value={nuevoPaciente.nombre}
                  onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nombre: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={nuevoPaciente.email}
                  onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="ejemplo@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono (Opcional)</label>
                <input
                  type="tel"
                  value={nuevoPaciente.telefono}
                  onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, telefono: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="+52 555 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Paciente</label>
                <select
                  value={nuevoPaciente.tipo}
                  onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, tipo: e.target.value as 'existente' | 'app' })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="app">Nuevo de la App</option>
                  <option value="existente">Paciente Existente</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => {
                    setModalNuevoPaciente(false)
                    setNuevoPaciente({
                      nombre: '',
                      email: '',
                      telefono: '',
                      tipo: 'app'
                    })
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={crearNuevoPaciente}
                  className="flex-1 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium"
                >
                  Crear Paciente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bloquear Fecha */}
      {modalBloquearFecha && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black">Bloquear Fecha</h3>
              <button
                onClick={() => setModalBloquearFecha(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Fecha</label>
                <input
                  type="date"
                  value={fechaSeleccionada ? formatearFecha(fechaSeleccionada) : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setFechaSeleccionada(new Date(e.target.value))
                    }
                  }}
                  min={formatearFecha(new Date())}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {fechaSeleccionada && estaBloqueada(fechaSeleccionada) && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Esta fecha ya está bloqueada. ¿Deseas desbloquearla?
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => setModalBloquearFecha(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Cancelar
                </button>
                {fechaSeleccionada && (
                  <button
                    onClick={() => {
                      if (estaBloqueada(fechaSeleccionada)) {
                        desbloquearFecha(fechaSeleccionada)
                      } else {
                        bloquearFecha(fechaSeleccionada)
                      }
                      setModalBloquearFecha(false)
                      setFechaSeleccionada(null)
                    }}
                    className={`flex-1 px-6 py-3 rounded-lg transition font-medium ${
                      estaBloqueada(fechaSeleccionada)
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                  >
                    {estaBloqueada(fechaSeleccionada) ? 'Desbloquear' : 'Bloquear'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Asignar Plan */}
      {modalAsignarPlan && pacienteSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-black">Asignar Plan Nutricional</h3>
                <p className="text-gray-600 text-sm mt-1">Paciente: {pacienteSeleccionado.nombre}</p>
              </div>
              <button
                onClick={() => setModalAsignarPlan(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Plan</label>
                <input
                  type="text"
                  value={nuevoPlan.nombre}
                  onChange={(e) => setNuevoPlan({ ...nuevoPlan, nombre: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                  <input
                    type="date"
                    value={nuevoPlan.fechaInicio}
                    onChange={(e) => setNuevoPlan({ ...nuevoPlan, fechaInicio: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                  <input
                    type="date"
                    value={nuevoPlan.fechaFin}
                    onChange={(e) => setNuevoPlan({ ...nuevoPlan, fechaFin: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calorías Diarias</label>
                <input
                  type="number"
                  value={nuevoPlan.calorias}
                  onChange={(e) => setNuevoPlan({ ...nuevoPlan, calorias: e.target.value })}
                  placeholder="Ej: 2500"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Macronutrientes (gramos)</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Proteínas</label>
                    <input
                      type="number"
                      value={nuevoPlan.proteinas}
                      onChange={(e) => setNuevoPlan({ ...nuevoPlan, proteinas: e.target.value })}
                      placeholder="g"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Carbohidratos</label>
                    <input
                      type="number"
                      value={nuevoPlan.carbohidratos}
                      onChange={(e) => setNuevoPlan({ ...nuevoPlan, carbohidratos: e.target.value })}
                      placeholder="g"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Grasas</label>
                    <input
                      type="number"
                      value={nuevoPlan.grasas}
                      onChange={(e) => setNuevoPlan({ ...nuevoPlan, grasas: e.target.value })}
                      placeholder="g"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Objetivos del Plan</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Pérdida de grasa', 'Ganancia muscular', 'Mantenimiento', 'Rendimiento deportivo', 'Aumento de peso', 'Definición'].map((obj) => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => toggleObjetivo(obj)}
                      className={`py-2 px-3 rounded-lg border-2 font-medium transition text-sm text-left ${
                        nuevoPlan.objetivos.includes(obj)
                          ? 'border-black bg-gray-100 text-black'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => setModalAsignarPlan(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarPlan}
                  className="flex-1 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium"
                >
                  Asignar Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
