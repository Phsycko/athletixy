'use client'

import { useState, useEffect } from 'react'
import { 
  Dumbbell, 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Search,
  Filter,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Star,
  Activity
} from 'lucide-react'

export default function RutinasEjerciciosPage() {
  const [ejercicios, setEjercicios] = useState<any[]>([])
  const [rutinas, setRutinas] = useState<any[]>([])
  const [mostrarModalEjercicio, setMostrarModalEjercicio] = useState(false)
  const [mostrarModalRutina, setMostrarModalRutina] = useState(false)
  const [ejercicioEditando, setEjercicioEditando] = useState<any>(null)
  const [rutinaEditando, setRutinaEditando] = useState<any>(null)
  const [busquedaEjercicios, setBusquedaEjercicios] = useState('')
  const [busquedaRutinas, setBusquedaRutinas] = useState('')
  const [filtroGrupoMuscular, setFiltroGrupoMuscular] = useState('Todos')
  const [tabActivo, setTabActivo] = useState<'ejercicios' | 'rutinas'>('ejercicios')
  const [mostrarModalGenerarIA, setMostrarModalGenerarIA] = useState(false)
  const [mostrarModalLesion, setMostrarModalLesion] = useState(false)
  const [atletaConLesion, setAtletaConLesion] = useState<any>(null)
  const [atletaSeleccionadoIA, setAtletaSeleccionadoIA] = useState<any>(null)
  const [generacionIA, setGeneracionIA] = useState({
    descripcion: ''
  })
  const [lesionOtra, setLesionOtra] = useState('')
  const [ejerciciosGenerados, setEjerciciosGenerados] = useState<any[]>([])
  const [generando, setGenerando] = useState(false)
  const [atletasDisponibles, setAtletasDisponibles] = useState<any[]>([])
  const [detallesLesiones, setDetallesLesiones] = useState<{[key: string]: string}>({})

  const [nuevoEjercicio, setNuevoEjercicio] = useState({
    nombre: '',
    descripcion: '',
    grupoMuscular: '',
    tipo: '',
    maquina: ''
  })

  const [nuevaRutina, setNuevaRutina] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    ejercicios: [] as any[]
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const session = localStorage.getItem('athletixy_session')
      if (!session) return
      const sessionData = JSON.parse(session)
      if (!sessionData.coachId) return

      // Cargar ejercicios
      const ejerciciosStr = localStorage.getItem(`gym_ejercicios_coach_${sessionData.coachId}`)
      if (ejerciciosStr) {
        setEjercicios(JSON.parse(ejerciciosStr))
      }

      // Cargar rutinas
      const rutinasStr = localStorage.getItem(`gym_rutinas_coach_${sessionData.coachId}`)
      if (rutinasStr) {
        setRutinas(JSON.parse(rutinasStr))
      }

      // Cargar atletas asignados
      const coachesInternos = localStorage.getItem('gym_coaches_internos')
      if (coachesInternos) {
        const coaches = JSON.parse(coachesInternos)
        const coach = coaches.find((c: any) => c.id === sessionData.coachId)
        if (coach && coach.atletas) {
          setAtletasDisponibles(coach.atletas || [])
          
          // Verificar si hay atletas con lesiones activas
          const atletasConLesiones = coach.atletas.filter((a: any) => 
            a.lesiones && a.lesiones.some((l: any) => l.activa === true)
          )
          if (atletasConLesiones.length > 0) {
            // Mostrar alerta para el primer atleta con lesión activa
            const atleta = atletasConLesiones[0]
            const lesionActiva = atleta.lesiones.find((l: any) => l.activa === true)
            if (lesionActiva) {
              setTimeout(() => {
                setAtletaConLesion({ atleta, lesion: lesionActiva })
                setMostrarModalLesion(true)
              }, 1000)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }, [])

  const gruposMusculares = [
    'Todos',
    'Pecho',
    'Espalda',
    'Hombros',
    'Bíceps',
    'Tríceps',
    'Antebrazos',
    'Femoral',
    'Cuádriceps',
    'Glúteo',
    'Pantorrillas',
    'Core',
    'Cardio'
  ]

  const tiposEjercicio = [
    'Fuerza',
    'Hipertrofia',
    'Resistencia',
    'Cardio',
    'Flexibilidad',
    'Potencia'
  ]

  const lesionesComunes = [
    'Hombro',
    'Rodilla',
    'Espalda baja',
    'Cuello',
    'Codo',
    'Muñeca',
    'Tobillo',
    'Cadera',
    'Otra'
  ]

  // Cargar maquinaria del gimnasio
  const cargarMaquinaria = () => {
    try {
      const maquinariaStr = localStorage.getItem('gym_maquinaria')
      if (maquinariaStr) {
        return JSON.parse(maquinariaStr)
      }
      return []
    } catch {
      return []
    }
  }

  const [maquinariaDisponible, setMaquinariaDisponible] = useState<string[]>(cargarMaquinaria())

  // Función para generar ejercicios con IA (simulada)
  const generarEjerciciosIA = () => {
    if (!generacionIA.descripcion.trim()) {
      alert('Por favor describe el ejercicio que necesitas')
      return
    }

    setGenerando(true)
    setEjerciciosGenerados([])

    // Simular delay de IA
    setTimeout(() => {
      try {
        const descripcionLower = generacionIA.descripcion.toLowerCase()
        
        // Detectar grupo muscular mencionado en la descripción
        let grupoMuscularDetectado = ''
        for (const grupo of gruposMusculares) {
          if (grupo !== 'Todos' && descripcionLower.includes(grupo.toLowerCase())) {
            grupoMuscularDetectado = grupo
            break
          }
        }
        
        // Si no se detecta, usar "Todos" para buscar en todos los grupos
        if (!grupoMuscularDetectado) {
          grupoMuscularDetectado = 'Todos'
        }

        // Base de ejercicios por grupo muscular
        const ejerciciosBase: any = {
          'Pecho': [
            { nombre: 'Press de banca', tipo: 'Fuerza', maquina: 'Barra', musculos: ['Pectoral mayor', 'Deltoides anterior', 'Tríceps'] },
          { nombre: 'Press inclinado', tipo: 'Hipertrofia', maquina: 'Mancuernas', musculos: ['Pectoral superior', 'Deltoides anterior'] },
          { nombre: 'Aperturas con mancuernas', tipo: 'Hipertrofia', maquina: 'Mancuernas', musculos: ['Pectoral mayor'] },
          { nombre: 'Fondos en paralelas', tipo: 'Fuerza', maquina: 'Paralelas', musculos: ['Pectoral inferior', 'Tríceps'] },
          { nombre: 'Press con máquina Smith', tipo: 'Fuerza', maquina: 'Máquina Smith', musculos: ['Pectoral mayor', 'Deltoides'] },
            { nombre: 'Cruce de poleas', tipo: 'Hipertrofia', maquina: 'Máquina de poleas', musculos: ['Pectoral mayor'] }
          ],
          'Espalda': [
            { nombre: 'Dominadas', tipo: 'Fuerza', maquina: 'Barra', musculos: ['Dorsales', 'Bíceps', 'Romboides'] },
            { nombre: 'Remo con barra', tipo: 'Fuerza', maquina: 'Barra', musculos: ['Dorsales', 'Romboides', 'Trapecio'] },
            { nombre: 'Jalón al pecho', tipo: 'Hipertrofia', maquina: 'Máquina de poleas', musculos: ['Dorsales', 'Bíceps'] },
            { nombre: 'Remo con mancuerna', tipo: 'Hipertrofia', maquina: 'Mancuernas', musculos: ['Dorsales', 'Romboides'] },
            { nombre: 'Peso muerto', tipo: 'Fuerza', maquina: 'Barra', musculos: ['Dorsales', 'Glúteos', 'Femoral'] },
            { nombre: 'Remo en máquina', tipo: 'Hipertrofia', maquina: 'Máquina de remo', musculos: ['Dorsales', 'Romboides'] }
          ],
          'Hombros': [
            { nombre: 'Press militar', tipo: 'Fuerza', maquina: 'Barra', musculos: ['Deltoides', 'Tríceps'] },
            { nombre: 'Elevaciones laterales', tipo: 'Hipertrofia', maquina: 'Mancuernas', musculos: ['Deltoides medio'] },
            { nombre: 'Elevaciones frontales', tipo: 'Hipertrofia', maquina: 'Mancuernas', musculos: ['Deltoides anterior'] },
            { nombre: 'Vuelos posteriores', tipo: 'Hipertrofia', maquina: 'Mancuernas', musculos: ['Deltoides posterior', 'Romboides'] },
            { nombre: 'Press Arnold', tipo: 'Hipertrofia', maquina: 'Mancuernas', musculos: ['Deltoides completo'] },
            { nombre: 'Elevación lateral en máquina', tipo: 'Hipertrofia', maquina: 'Máquina de hombros', musculos: ['Deltoides medio'] }
          ],
          'Femoral': [
            { nombre: 'Curl de femoral', tipo: 'Hipertrofia', maquina: 'Máquina de curl', musculos: ['Femoral', 'Glúteos'] },
            { nombre: 'Peso muerto rumano', tipo: 'Fuerza', maquina: 'Barra', musculos: ['Femoral', 'Glúteos', 'Espalda baja'] },
            { nombre: 'Curl nórdico', tipo: 'Fuerza', maquina: 'Ninguna', musculos: ['Femoral'] },
            { nombre: 'Buenos días', tipo: 'Fuerza', maquina: 'Barra', musculos: ['Femoral', 'Glúteos'] },
            { nombre: 'Curl de femoral acostado', tipo: 'Hipertrofia', maquina: 'Máquina', musculos: ['Femoral'] }
          ],
          'Cuádriceps': [
            { nombre: 'Sentadillas', tipo: 'Fuerza', maquina: 'Barra', musculos: ['Cuádriceps', 'Glúteos', 'Femoral'] },
            { nombre: 'Prensa de piernas', tipo: 'Fuerza', maquina: 'Máquina de prensa', musculos: ['Cuádriceps', 'Glúteos'] },
            { nombre: 'Extensiones de cuádriceps', tipo: 'Hipertrofia', maquina: 'Máquina de extensión', musculos: ['Cuádriceps'] },
            { nombre: 'Zancadas', tipo: 'Fuerza', maquina: 'Mancuernas', musculos: ['Cuádriceps', 'Glúteos'] },
            { nombre: 'Sentadilla frontal', tipo: 'Fuerza', maquina: 'Barra', musculos: ['Cuádriceps'] },
            { nombre: 'Hack squat', tipo: 'Fuerza', maquina: 'Máquina', musculos: ['Cuádriceps', 'Glúteos'] }
          ],
          'Glúteo': [
            { nombre: 'Hip thrust', tipo: 'Fuerza', maquina: 'Barra', musculos: ['Glúteos', 'Femoral'] },
            { nombre: 'Patada de glúteo', tipo: 'Hipertrofia', maquina: 'Máquina de poleas', musculos: ['Glúteos'] },
            { nombre: 'Sentadilla búlgara', tipo: 'Fuerza', maquina: 'Mancuernas', musculos: ['Glúteos', 'Cuádriceps'] },
            { nombre: 'Puente de glúteo', tipo: 'Fuerza', maquina: 'Ninguna', musculos: ['Glúteos', 'Femoral'] },
            { nombre: 'Sentadilla sumo', tipo: 'Fuerza', maquina: 'Barra', musculos: ['Glúteos', 'Cuádriceps'] },
            { nombre: 'Peso muerto sumo', tipo: 'Fuerza', maquina: 'Barra', musculos: ['Glúteos', 'Femoral'] }
          ],
          'Pantorrillas': [
            { nombre: 'Elevación de talones', tipo: 'Hipertrofia', maquina: 'Máquina', musculos: ['Pantorrillas'] },
            { nombre: 'Elevación de talones de pie', tipo: 'Hipertrofia', maquina: 'Máquina', musculos: ['Pantorrillas'] },
            { nombre: 'Elevación de talones sentado', tipo: 'Hipertrofia', maquina: 'Máquina', musculos: ['Pantorrillas'] },
            { nombre: 'Elevación de talones con mancuernas', tipo: 'Hipertrofia', maquina: 'Mancuernas', musculos: ['Pantorrillas'] },
            { nombre: 'Elevación de talones en prensa', tipo: 'Hipertrofia', maquina: 'Máquina de prensa', musculos: ['Pantorrillas'] }
          ],
          'Bíceps': [
            { nombre: 'Curl de bíceps', tipo: 'Hipertrofia', maquina: 'Mancuernas', musculos: ['Bíceps'] },
            { nombre: 'Curl con barra', tipo: 'Hipertrofia', maquina: 'Barra', musculos: ['Bíceps'] },
            { nombre: 'Martillo', tipo: 'Hipertrofia', maquina: 'Mancuernas', musculos: ['Bíceps', 'Antebrazo'] },
            { nombre: 'Curl concentrado', tipo: 'Hipertrofia', maquina: 'Mancuerna', musculos: ['Bíceps'] },
            { nombre: 'Curl predicador', tipo: 'Hipertrofia', maquina: 'Barra', musculos: ['Bíceps'] }
          ],
          'Tríceps': [
            { nombre: 'Tríceps en polea', tipo: 'Hipertrofia', maquina: 'Máquina de poleas', musculos: ['Tríceps'] },
            { nombre: 'Fondos en banco', tipo: 'Fuerza', maquina: 'Banco', musculos: ['Tríceps', 'Deltoides anterior'] },
            { nombre: 'Extensión de tríceps', tipo: 'Hipertrofia', maquina: 'Mancuernas', musculos: ['Tríceps'] },
            { nombre: 'Press francés', tipo: 'Hipertrofia', maquina: 'Barra', musculos: ['Tríceps'] },
            { nombre: 'Extensiones de tríceps en polea', tipo: 'Hipertrofia', maquina: 'Polea', musculos: ['Tríceps'] }
          ],
          'Antebrazos': [
            { nombre: 'Curl de muñeca', tipo: 'Hipertrofia', maquina: 'Barra', musculos: ['Antebrazos'] },
            { nombre: 'Curl de muñeca inverso', tipo: 'Hipertrofia', maquina: 'Barra', musculos: ['Antebrazos'] },
            { nombre: 'Martillo', tipo: 'Hipertrofia', maquina: 'Mancuernas', musculos: ['Bíceps', 'Antebrazos'] },
            { nombre: 'Farmer walk', tipo: 'Fuerza', maquina: 'Mancuernas', musculos: ['Antebrazos', 'Trapecio'] },
            { nombre: 'Curl de muñeca con mancuerna', tipo: 'Hipertrofia', maquina: 'Mancuerna', musculos: ['Antebrazos'] }
          ],
          'Core': [
            { nombre: 'Plancha', tipo: 'Fuerza', maquina: 'Ninguna', musculos: ['Abdominales', 'Oblicuos'] },
            { nombre: 'Abdominales', tipo: 'Resistencia', maquina: 'Ninguna', musculos: ['Abdominales'] },
            { nombre: 'Mountain climbers', tipo: 'Cardio', maquina: 'Ninguna', musculos: ['Abdominales', 'Deltoides'] },
            { nombre: 'Russian twists', tipo: 'Resistencia', maquina: 'Ninguna', musculos: ['Oblicuos', 'Abdominales'] },
            { nombre: 'Elevación de piernas', tipo: 'Fuerza', maquina: 'Ninguna', musculos: ['Abdominales inferiores'] },
            { nombre: 'Dead bug', tipo: 'Estabilización', maquina: 'Ninguna', musculos: ['Core completo'] }
          ],
          'Cardio': [
            { nombre: 'Correr en cinta', tipo: 'Cardio', maquina: 'Cinta de correr', musculos: ['Cuádriceps', 'Pantorrillas', 'Cardiovascular'] },
            { nombre: 'Bicicleta estática', tipo: 'Cardio', maquina: 'Bicicleta estática', musculos: ['Cuádriceps', 'Femoral', 'Cardiovascular'] },
            { nombre: 'Elíptica', tipo: 'Cardio', maquina: 'Elíptica', musculos: ['Cuádriceps', 'Femoral', 'Pantorrillas', 'Cardiovascular'] },
            { nombre: 'Remo', tipo: 'Cardio', maquina: 'Máquina de remo', musculos: ['Espalda', 'Cuádriceps', 'Femoral', 'Cardiovascular'] }
          ]
        }
        
        // Buscar ejercicios que coincidan con la descripción
        let ejerciciosEncontrados: any[] = []
        
        if (grupoMuscularDetectado === 'Todos') {
          // Buscar en todos los grupos
          Object.keys(ejerciciosBase).forEach(grupo => {
            const ejerciciosGrupo = ejerciciosBase[grupo] || []
            ejerciciosEncontrados.push(...ejerciciosGrupo)
          })
        } else {
          ejerciciosEncontrados = ejerciciosBase[grupoMuscularDetectado] || []
        }

        // Filtrar ejercicios que coincidan con palabras clave de la descripción
        const palabrasClave = descripcionLower.split(' ').filter((p: string) => p.length > 3)
        let ejerciciosFiltrados = ejerciciosEncontrados.filter((ej: any) => {
          const nombreEj = ej.nombre.toLowerCase()
          const musculosEj = ej.musculos.join(' ').toLowerCase()
          const maquinaEj = ej.maquina.toLowerCase()
          
          return palabrasClave.some((palabra: string) => 
            nombreEj.includes(palabra) || 
            musculosEj.includes(palabra) || 
            maquinaEj.includes(palabra)
          )
        })

        // Si no hay coincidencias exactas, usar los primeros ejercicios del grupo detectado
        if (ejerciciosFiltrados.length === 0 && grupoMuscularDetectado !== 'Todos') {
          ejerciciosFiltrados = ejerciciosEncontrados.slice(0, 5)
        } else if (ejerciciosFiltrados.length === 0) {
          // Si no hay grupo detectado, generar ejercicios genéricos basados en la descripción
          ejerciciosFiltrados = [
            {
              nombre: generacionIA.descripcion.split(' ').slice(0, 3).join(' '),
              tipo: 'Hipertrofia',
              maquina: 'Mancuernas',
              musculos: [grupoMuscularDetectado || 'General']
            }
          ]
        }

        // Crear ejercicios adaptados
        const ejerciciosAdaptados = ejerciciosFiltrados.slice(0, 5).map((ej: any, index: number) => {
          return {
            id: `ej_${Date.now()}_${index}`,
            nombre: ej.nombre || generacionIA.descripcion,
            descripcion: `Ejercicio generado basado en: "${generacionIA.descripcion}". ${ej.descripcion || `Trabaja ${ej.musculos?.join(', ') || 'músculos objetivo'}.`}`,
            grupoMuscular: grupoMuscularDetectado !== 'Todos' ? grupoMuscularDetectado : (ej.musculos?.[0] || 'General'),
            tipo: ej.tipo || 'Hipertrofia',
            maquina: ej.maquina || 'Mancuernas'
          }
        })

        setEjerciciosGenerados(ejerciciosAdaptados)
        setGenerando(false)
      } catch (error) {
        console.error('Error generando ejercicios:', error)
        setGenerando(false)
        alert('Error al generar ejercicios. Por favor intenta de nuevo.')
      }
    }, 1500)
  }

  const ejerciciosFiltrados = ejercicios.filter((ej) => {
    const coincideBusqueda = ej.nombre.toLowerCase().includes(busquedaEjercicios.toLowerCase()) ||
                            ej.descripcion?.toLowerCase().includes(busquedaEjercicios.toLowerCase())
    const coincideGrupo = !filtroGrupoMuscular || filtroGrupoMuscular === '' || filtroGrupoMuscular === 'Todos' || ej.grupoMuscular === filtroGrupoMuscular
    return coincideBusqueda && coincideGrupo
  })

  const rutinasFiltradas = rutinas.filter((rut) => {
    return rut.nombre.toLowerCase().includes(busquedaRutinas.toLowerCase()) ||
           rut.descripcion?.toLowerCase().includes(busquedaRutinas.toLowerCase())
  })

  const handleGuardarEjercicio = () => {
    try {
      const session = localStorage.getItem('athletixy_session')
      if (!session) return
      const sessionData = JSON.parse(session)
      if (!sessionData.coachId) return

      if (ejercicioEditando) {
        // Editar ejercicio existente
        const ejerciciosActualizados = ejercicios.map((ej) =>
          ej.id === ejercicioEditando.id ? { ...ejercicioEditando, ...nuevoEjercicio } : ej
        )
        setEjercicios(ejerciciosActualizados)
        localStorage.setItem(`gym_ejercicios_coach_${sessionData.coachId}`, JSON.stringify(ejerciciosActualizados))
      } else {
        // Crear nuevo ejercicio
        const ejercicioId = `ejercicio_${Date.now()}`
        const ejercicioCompleto = {
          id: ejercicioId,
          ...nuevoEjercicio,
          fechaCreacion: new Date().toISOString()
        }
        const ejerciciosActualizados = [...ejercicios, ejercicioCompleto]
        setEjercicios(ejerciciosActualizados)
        localStorage.setItem(`gym_ejercicios_coach_${sessionData.coachId}`, JSON.stringify(ejerciciosActualizados))
      }

      setNuevoEjercicio({ nombre: '', descripcion: '', grupoMuscular: '', tipo: '', maquina: '' })
      setEjercicioEditando(null)
      setMostrarModalEjercicio(false)
    } catch (error) {
      console.error('Error saving exercise:', error)
      alert('Error al guardar el ejercicio')
    }
  }

  const handleEliminarEjercicio = (ejercicioId: string) => {
    if (!confirm('¿Estás seguro de eliminar este ejercicio?')) return

    try {
      const session = localStorage.getItem('athletixy_session')
      if (!session) return
      const sessionData = JSON.parse(session)
      if (!sessionData.coachId) return

      const ejerciciosActualizados = ejercicios.filter((ej) => ej.id !== ejercicioId)
      setEjercicios(ejerciciosActualizados)
      localStorage.setItem(`gym_ejercicios_coach_${sessionData.coachId}`, JSON.stringify(ejerciciosActualizados))
    } catch (error) {
      console.error('Error deleting exercise:', error)
      alert('Error al eliminar el ejercicio')
    }
  }

  const handleGuardarRutina = () => {
    try {
      const session = localStorage.getItem('athletixy_session')
      if (!session) return
      const sessionData = JSON.parse(session)
      if (!sessionData.coachId) return

      const nombreRutina = nuevaRutina.nombre?.trim() || 'Nueva Rutina'

      if (rutinaEditando) {
        // Editar rutina existente
        const rutinasActualizadas = rutinas.map((rut) =>
          rut.id === rutinaEditando.id ? { ...rutinaEditando, nombre: nombreRutina, descripcion: nuevaRutina.descripcion, duracion: nuevaRutina.duracion, ejercicios: nuevaRutina.ejercicios } : rut
        )
        setRutinas(rutinasActualizadas)
        localStorage.setItem(`gym_rutinas_coach_${sessionData.coachId}`, JSON.stringify(rutinasActualizadas))
      } else {
        // Crear nueva rutina
        const rutinaId = `rutina_${Date.now()}`
        const rutinaCompleta = {
          id: rutinaId,
          nombre: nombreRutina,
          descripcion: nuevaRutina.descripcion || '',
          duracion: nuevaRutina.duracion || '',
          ejercicios: nuevaRutina.ejercicios || [],
          fechaCreacion: new Date().toISOString()
        }
        const rutinasActualizadas = [...rutinas, rutinaCompleta]
        setRutinas(rutinasActualizadas)
        localStorage.setItem(`gym_rutinas_coach_${sessionData.coachId}`, JSON.stringify(rutinasActualizadas))
      }

      setNuevaRutina({ nombre: '', descripcion: '', duracion: '', ejercicios: [] })
      setRutinaEditando(null)
      setMostrarModalRutina(false)
    } catch (error) {
      console.error('Error saving routine:', error)
      alert('Error al guardar la rutina')
    }
  }

  const handleEliminarRutina = (rutinaId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta rutina?')) return

    try {
      const session = localStorage.getItem('athletixy_session')
      if (!session) return
      const sessionData = JSON.parse(session)
      if (!sessionData.coachId) return

      const rutinasActualizadas = rutinas.filter((rut) => rut.id !== rutinaId)
      setRutinas(rutinasActualizadas)
      localStorage.setItem(`gym_rutinas_coach_${sessionData.coachId}`, JSON.stringify(rutinasActualizadas))
    } catch (error) {
      console.error('Error deleting routine:', error)
      alert('Error al eliminar la rutina')
    }
  }

  const handleEditarEjercicio = (ejercicio: any) => {
    setEjercicioEditando(ejercicio)
    setNuevoEjercicio({
      nombre: ejercicio.nombre || '',
      descripcion: ejercicio.descripcion || '',
      grupoMuscular: ejercicio.grupoMuscular || '',
      tipo: ejercicio.tipo || '',
      maquina: ejercicio.maquina || ''
    })
    setMostrarModalEjercicio(true)
  }

  const handleEditarRutina = (rutina: any) => {
    setRutinaEditando(rutina)
    setNuevaRutina({
      nombre: rutina.nombre || '',
      descripcion: rutina.descripcion || '',
      duracion: rutina.duracion || '',
      ejercicios: rutina.ejercicios || []
    })
    setMostrarModalRutina(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-100">Rutinas y Ejercicios</h1>
          <p className="text-gray-500 dark:text-zinc-500 mt-1">Gestiona tus ejercicios y rutinas personalizadas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-gray-200 dark:border-zinc-800">
        <button
          onClick={() => setTabActivo('ejercicios')}
          className={`px-6 py-3 font-medium transition ${
            tabActivo === 'ejercicios'
              ? 'border-b-2 border-black dark:border-zinc-100 text-black dark:text-zinc-100'
              : 'text-gray-500 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-100'
          }`}
        >
          <Dumbbell className="w-4 h-4 inline mr-2" />
          Ejercicios ({ejercicios.length})
        </button>
        <button
          onClick={() => setTabActivo('rutinas')}
          className={`px-6 py-3 font-medium transition ${
            tabActivo === 'rutinas'
              ? 'border-b-2 border-black dark:border-zinc-100 text-black dark:text-zinc-100'
              : 'text-gray-500 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-100'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Rutinas ({rutinas.length})
        </button>
      </div>

      {/* Tab de Ejercicios */}
      {tabActivo === 'ejercicios' && (
        <div className="space-y-4">
          {/* Barra de búsqueda y botones de acción */}
          <div className="flex gap-3 items-start">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar ejercicios..."
                value={busquedaEjercicios}
                onChange={(e) => setBusquedaEjercicios(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
              />
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => {
                  setEjercicioEditando(null)
                  setNuevoEjercicio({ nombre: '', descripcion: '', grupoMuscular: '', tipo: '', maquina: '' })
                  setMostrarModalEjercicio(true)
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium whitespace-nowrap shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Nuevo Ejercicio
              </button>
              <button
                onClick={() => {
                  // Cargar maquinaria del gimnasio
                  const maquinaria = cargarMaquinaria()
                  
                  // Inicializar el modal con datos disponibles
                  setGeneracionIA({
                    descripcion: ''
                  })
                  setAtletaSeleccionadoIA(null)
                  setEjerciciosGenerados([])
                  setLesionOtra('')
                  setDetallesLesiones({})
                  setMostrarModalGenerarIA(true)
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium whitespace-nowrap shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                <span>Generar con IA</span>
                <Star className="w-5 h-5 text-amber-400 dark:text-amber-500" fill="currentColor" />
              </button>
            </div>
          </div>
          
          {/* Filtro visual de grupos musculares - Barra horizontal scrollable */}
          <div 
            className="w-full overflow-x-auto pb-2 mb-4" 
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <style jsx global>{`
              .overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="flex gap-2.5 min-w-max px-1">
              {gruposMusculares.map((grupo) => {
                const isActive = filtroGrupoMuscular === grupo || (!filtroGrupoMuscular && grupo === 'Todos')
                return (
                  <button
                    key={grupo}
                    onClick={() => setFiltroGrupoMuscular(grupo === 'Todos' ? '' : grupo)}
                    className={`flex flex-col items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl transition flex-shrink-0 ${
                      isActive
                        ? 'bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg'
                        : 'bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:border-black dark:hover:border-zinc-100'
                    }`}
                    style={{ minWidth: '65px', maxWidth: '75px' }}
                  >
                    {grupo === 'Todos' ? (
                      <Dumbbell className={`w-6 h-6 ${isActive ? 'text-white dark:text-zinc-900' : 'text-gray-400 dark:text-zinc-500'}`} />
                    ) : grupo === 'Cardio' ? (
                      <Activity className={`w-6 h-6 ${isActive ? 'text-white dark:text-zinc-900' : 'text-gray-400 dark:text-zinc-500'}`} />
                    ) : grupo === 'Pecho' ? (
                      <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://my.lyfta.app/icons/muscles/ic_chip_chest_b.svg" 
                          alt="Pecho"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : grupo === 'Espalda' ? (
                      <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://my.lyfta.app/icons/muscles/ic_chip_back_b.svg" 
                          alt="Espalda"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : grupo === 'Hombros' ? (
                      <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://my.lyfta.app/icons/muscles/ic_chip_shoulders_b.svg" 
                          alt="Hombros"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : grupo === 'Bíceps' ? (
                      <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://my.lyfta.app/icons/muscles/chip_biceps_b.svg" 
                          alt="Bíceps"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : grupo === 'Tríceps' ? (
                      <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://my.lyfta.app/icons/muscles/chip_triceps_b.svg" 
                          alt="Tríceps"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : grupo === 'Antebrazos' ? (
                      <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://my.lyfta.app/icons/muscles/ic_chip_forearms_b.svg" 
                          alt="Antebrazos"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : grupo === 'Femoral' ? (
                      <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://my.lyfta.app/icons/muscles/chip_hamstrings_b.svg" 
                          alt="Femoral"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : grupo === 'Cuádriceps' ? (
                      <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://my.lyfta.app/icons/muscles/chip_quadriceps_b.svg" 
                          alt="Cuádriceps"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : grupo === 'Glúteo' ? (
                      <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://my.lyfta.app/icons/muscles/ic_chip_hips_b.svg" 
                          alt="Glúteo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : grupo === 'Pantorrillas' ? (
                      <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://my.lyfta.app/icons/muscles/ic_chip_calves_b.svg" 
                          alt="Pantorrillas"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : grupo === 'Core' ? (
                      <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://my.lyfta.app/icons/muscles/chip_abs_b.svg" 
                          alt="Core"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : grupo === 'Glúteos' ? (
                      <div className={`w-6 h-6 flex items-center justify-center ${isActive ? 'text-white dark:text-zinc-900' : 'text-gray-400 dark:text-zinc-500'}`}>
                        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                          <ellipse cx="12" cy="14" rx="4.5" ry="3.5" fill="currentColor" />
                        </svg>
                      </div>
                    ) : (
                      <Dumbbell className={`w-6 h-6 ${isActive ? 'text-white dark:text-zinc-900' : 'text-gray-400 dark:text-zinc-500'}`} />
                    )}
                    <span className={`text-[10px] font-semibold whitespace-nowrap text-center leading-tight ${isActive ? 'text-white dark:text-zinc-900' : 'text-gray-600 dark:text-zinc-400'}`} style={{ maxWidth: '70px' }}>
                      {grupo}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Lista de Ejercicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ejerciciosFiltrados.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl">
                <Dumbbell className="w-16 h-16 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-zinc-500 text-lg mb-2">
                  {ejercicios.length === 0 ? 'No hay ejercicios creados' : 'No se encontraron ejercicios'}
                </p>
                <p className="text-sm text-gray-400 dark:text-zinc-600">
                  {ejercicios.length === 0 ? 'Crea tu primer ejercicio para comenzar' : 'Intenta con otra búsqueda o filtro'}
                </p>
              </div>
            ) : (
              ejerciciosFiltrados.map((ejercicio) => (
                <div key={ejercicio.id} className="p-6 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-black dark:text-zinc-100 mb-1">{ejercicio.nombre}</h3>
                      {ejercicio.descripcion && (
                        <p className="text-sm text-gray-500 dark:text-zinc-500 line-clamp-2">{ejercicio.descripcion}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ejercicio.grupoMuscular && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium">
                        {ejercicio.grupoMuscular}
                      </span>
                    )}
                    {ejercicio.tipo && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium">
                        {ejercicio.tipo}
                      </span>
                    )}
                    {ejercicio.maquina && (
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium">
                        {ejercicio.maquina}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditarEjercicio(ejercicio)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarEjercicio(ejercicio.id)}
                      className="px-4 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab de Rutinas */}
      {tabActivo === 'rutinas' && (
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar rutinas..."
                value={busquedaRutinas}
                onChange={(e) => setBusquedaRutinas(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
              />
            </div>
            <button
              onClick={() => {
                setRutinaEditando(null)
                setNuevaRutina({ nombre: '', descripcion: '', duracion: '', ejercicios: [] })
                setMostrarModalRutina(true)
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Nueva Rutina
            </button>
          </div>

          {/* Lista de Rutinas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rutinasFiltradas.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl">
                <BookOpen className="w-16 h-16 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-zinc-500 text-lg mb-2">
                  {rutinas.length === 0 ? 'No hay rutinas creadas' : 'No se encontraron rutinas'}
                </p>
                <p className="text-sm text-gray-400 dark:text-zinc-600">
                  {rutinas.length === 0 ? 'Crea tu primera rutina para comenzar' : 'Intenta con otra búsqueda'}
                </p>
              </div>
            ) : (
              rutinasFiltradas.map((rutina) => (
                <div key={rutina.id} className="p-6 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-black dark:text-zinc-100 mb-1">{rutina.nombre}</h3>
                      {rutina.descripcion && (
                        <p className="text-sm text-gray-500 dark:text-zinc-500 line-clamp-2 mb-2">{rutina.descripcion}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-zinc-500">
                        {rutina.duracion && (
                          <span>Duración: {rutina.duracion}</span>
                        )}
                        <span>{rutina.ejercicios?.length || 0} ejercicios</span>
                      </div>
                    </div>
                  </div>
                  {rutina.ejercicios && rutina.ejercicios.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-600 dark:text-zinc-400 mb-2">Ejercicios:</p>
                      <div className="flex flex-wrap gap-1">
                        {rutina.ejercicios.slice(0, 3).map((ej: any, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded text-xs">
                            {ej.nombre}
                          </span>
                        ))}
                        {rutina.ejercicios.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded text-xs">
                            +{rutina.ejercicios.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditarRutina(rutina)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarRutina(rutina.id)}
                      className="px-4 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal Crear/Editar Ejercicio */}
      {mostrarModalEjercicio && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-2xl w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-zinc-100">
                {ejercicioEditando ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
              </h2>
              <button
                onClick={() => {
                  setMostrarModalEjercicio(false)
                  setEjercicioEditando(null)
                  setNuevoEjercicio({ nombre: '', descripcion: '', grupoMuscular: '', tipo: '', maquina: '' })
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Nombre del Ejercicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nuevoEjercicio.nombre}
                  onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, nombre: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Ej: Press de banca"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Descripción
                </label>
                <textarea
                  value={nuevoEjercicio.descripcion}
                  onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, descripcion: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Descripción del ejercicio..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                    Grupo Muscular
                  </label>
                  <select
                    value={nuevoEjercicio.grupoMuscular}
                    onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, grupoMuscular: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  >
                    <option value="">Seleccionar...</option>
                    {gruposMusculares.filter(g => g !== 'Todos').map((grupo) => (
                      <option key={grupo} value={grupo}>{grupo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                    Tipo de Ejercicio
                  </label>
                  <select
                    value={nuevoEjercicio.tipo}
                    onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, tipo: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  >
                    <option value="">Seleccionar...</option>
                    {tiposEjercicio.map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Máquina o Equipo
                </label>
                <input
                  type="text"
                  value={nuevoEjercicio.maquina}
                  onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, maquina: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Ej: Barra, Mancuernas, Máquina Smith"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-6">
              <button
                onClick={() => {
                  setMostrarModalEjercicio(false)
                  setEjercicioEditando(null)
                  setNuevoEjercicio({ nombre: '', descripcion: '', grupoMuscular: '', tipo: '', maquina: '' })
                }}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarEjercicio}
                className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
              >
                {ejercicioEditando ? 'Actualizar' : 'Crear'} Ejercicio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar Rutina */}
      {mostrarModalRutina && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-3xl w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-zinc-100">
                {rutinaEditando ? 'Editar Rutina' : 'Nueva Rutina'}
              </h2>
              <button
                onClick={() => {
                  setMostrarModalRutina(false)
                  setRutinaEditando(null)
                  setNuevaRutina({ nombre: '', descripcion: '', duracion: '', ejercicios: [] })
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Nombre de la Rutina
                </label>
                <input
                  type="text"
                  value={nuevaRutina.nombre}
                  onChange={(e) => setNuevaRutina({...nuevaRutina, nombre: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Ej: Rutina de hipertrofia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Descripción
                </label>
                <textarea
                  value={nuevaRutina.descripcion}
                  onChange={(e) => setNuevaRutina({...nuevaRutina, descripcion: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Descripción de la rutina..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Duración
                </label>
                <input
                  type="text"
                  value={nuevaRutina.duracion}
                  onChange={(e) => setNuevaRutina({...nuevaRutina, duracion: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Ej: 4 semanas, 2 meses"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Ejercicios
                </label>
                {ejercicios.length === 0 ? (
                  <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700 text-center">
                    <p className="text-sm text-gray-500 dark:text-zinc-500">
                      Primero crea ejercicios para agregarlos a la rutina
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {ejercicios.map((ejercicio: any) => {
                      const estaAgregado = nuevaRutina.ejercicios.some((e: any) => e.id === ejercicio.id)
                      const ejercicioEnRutina = nuevaRutina.ejercicios.find((e: any) => e.id === ejercicio.id)

                      return (
                        <div key={ejercicio.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                          <div className="flex-1">
                            <p className="font-medium text-black dark:text-zinc-100">{ejercicio.nombre}</p>
                            <p className="text-xs text-gray-500 dark:text-zinc-500">{ejercicio.grupoMuscular} • {ejercicio.tipo}</p>
                          </div>
                          {estaAgregado ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                placeholder="Series"
                                value={ejercicioEnRutina?.series || ''}
                                onChange={(e) => {
                                  const ejerciciosActualizados = nuevaRutina.ejercicios.map((e: any) =>
                                    e.id === ejercicio.id ? {...e, series: e.target.value} : e
                                  )
                                  setNuevaRutina({...nuevaRutina, ejercicios: ejerciciosActualizados})
                                }}
                                className="w-20 px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded text-black dark:text-zinc-100 text-sm"
                              />
                              <input
                                type="number"
                                placeholder="Reps"
                                value={ejercicioEnRutina?.repeticiones || ''}
                                onChange={(e) => {
                                  const ejerciciosActualizados = nuevaRutina.ejercicios.map((e: any) =>
                                    e.id === ejercicio.id ? {...e, repeticiones: e.target.value} : e
                                  )
                                  setNuevaRutina({...nuevaRutina, ejercicios: ejerciciosActualizados})
                                }}
                                className="w-20 px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded text-black dark:text-zinc-100 text-sm"
                              />
                              <button
                                onClick={() => {
                                  setNuevaRutina({
                                    ...nuevaRutina,
                                    ejercicios: nuevaRutina.ejercicios.filter((e: any) => e.id !== ejercicio.id)
                                  })
                                }}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                              >
                                Quitar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setNuevaRutina({
                                  ...nuevaRutina,
                                  ejercicios: [...nuevaRutina.ejercicios, {
                                    id: ejercicio.id,
                                    nombre: ejercicio.nombre,
                                    series: '',
                                    repeticiones: ''
                                  }]
                                })
                              }}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
                            >
                              Agregar
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-6">
              <button
                onClick={() => {
                  setMostrarModalRutina(false)
                  setRutinaEditando(null)
                  setNuevaRutina({ nombre: '', descripcion: '', duracion: '', ejercicios: [] })
                }}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarRutina}
                className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
              >
                {rutinaEditando ? 'Actualizar' : 'Crear'} Rutina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Generar Ejercicios con IA */}
      {mostrarModalGenerarIA && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-3xl w-full border-2 border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-black dark:bg-zinc-100 p-2 rounded-lg relative">
                  <Sparkles className="w-6 h-6 text-white dark:text-zinc-900" />
                  <Star className="w-3 h-3 absolute -top-0.5 -right-0.5 text-amber-400 dark:text-amber-500" fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black dark:text-zinc-100">Generar Ejercicios con IA</h2>
                  <p className="text-sm text-gray-500 dark:text-zinc-500">Personaliza los ejercicios según tus necesidades</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMostrarModalGenerarIA(false)
                  setGeneracionIA({ descripcion: '' })
                  setEjerciciosGenerados([])
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Campo de texto simple */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                  Describe el ejercicio que necesitas <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={generacionIA.descripcion}
                  onChange={(e) => setGeneracionIA({...generacionIA, descripcion: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-100"
                  placeholder="Ej: Press de banca para pecho, Curl de bíceps con mancuernas, Sentadilla para piernas, Ejercicio de hombro para lesión de manguito rotador..."
                />
                <p className="text-xs text-gray-500 dark:text-zinc-500 mt-2">
                  Escribe el nombre del ejercicio o describe lo que necesitas. La IA generará ejercicios basados en tu descripción.
                </p>
              </div>

              {/* Botón Generar */}
              <button
                onClick={generarEjerciciosIA}
                disabled={generando || !generacionIA.descripcion.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white disabled:bg-gray-400 dark:disabled:bg-gray-500 text-white dark:text-zinc-900 disabled:text-white dark:disabled:text-zinc-900 rounded-lg transition font-medium shadow-lg disabled:cursor-not-allowed relative"
              >
                {generando ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white dark:border-zinc-900 border-t-transparent rounded-full animate-spin" />
                    Generando ejercicios...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generar Ejercicios con IA</span>
                    <Star className="w-5 h-5 text-amber-400 dark:text-amber-500" fill="currentColor" />
                  </>
                )}
              </button>

              {/* Ejercicios Generados */}
              {ejerciciosGenerados.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-black dark:text-zinc-100">
                      Ejercicios Generados ({ejerciciosGenerados.length})
                    </h3>
                    <button
                      onClick={() => {
                        // Guardar todos los ejercicios generados
                        try {
                          const session = localStorage.getItem('athletixy_session')
                          if (!session) return
                          const sessionData = JSON.parse(session)
                          if (!sessionData.coachId) return

                          const ejerciciosActualizados = [...ejercicios, ...ejerciciosGenerados]
                          setEjercicios(ejerciciosActualizados)
                          localStorage.setItem(`gym_ejercicios_coach_${sessionData.coachId}`, JSON.stringify(ejerciciosActualizados))

                          setEjerciciosGenerados([])
                          setMostrarModalGenerarIA(false)
                          setGeneracionIA({ descripcion: '' })
                        } catch (error) {
                          console.error('Error guardando ejercicios:', error)
                          alert('Error al guardar los ejercicios')
                        }
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm"
                    >
                      Guardar Todos
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {ejerciciosGenerados.map((ejercicio: any) => (
                      <div key={ejercicio.id} className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-black dark:text-zinc-100">{ejercicio.nombre}</p>
                              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                                IA
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-zinc-500 mb-2">{ejercicio.descripcion}</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                                {ejercicio.grupoMuscular}
                              </span>
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">
                                {ejercicio.tipo}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                                {ejercicio.maquina}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              try {
                                const session = localStorage.getItem('athletixy_session')
                                if (!session) return
                                const sessionData = JSON.parse(session)
                                if (!sessionData.coachId) return

                                const ejerciciosActualizados = [...ejercicios, ejercicio]
                                setEjercicios(ejerciciosActualizados)
                                localStorage.setItem(`gym_ejercicios_coach_${sessionData.coachId}`, JSON.stringify(ejerciciosActualizados))

                                setEjerciciosGenerados(ejerciciosGenerados.filter((e: any) => e.id !== ejercicio.id))
                              } catch (error) {
                                console.error('Error guardando ejercicio:', error)
                                alert('Error al guardar el ejercicio')
                              }
                            }}
                            className="px-3 py-1 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition text-sm font-medium ml-2"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Notificación de Lesión */}
      {mostrarModalLesion && atletaConLesion && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[120] p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full border-2 border-orange-200 dark:border-orange-800 shadow-2xl">
            <div className="text-center mb-6">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-zinc-100 mb-2">
                Lesión Registrada
              </h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm">
                Tu atleta <span className="font-semibold text-black dark:text-zinc-100">{atletaConLesion.atleta.nombre}</span> presenta la siguiente lesión:
              </p>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800 mb-6">
              <p className="font-semibold text-orange-900 dark:text-orange-100 mb-2">{atletaConLesion.lesion.tipo}</p>
              {atletaConLesion.lesion.descripcion && (
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">{atletaConLesion.lesion.descripcion}</p>
              )}
              {atletaConLesion.lesion.fecha && (
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Registrada el: {atletaConLesion.lesion.fecha}
                </p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                <input
                  type="radio"
                  name="estadoLesion"
                  value="sanada"
                  className="w-4 h-4 text-green-600"
                />
                <div>
                  <p className="text-sm font-medium text-black dark:text-zinc-100">Lesión ya sanada</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">Marcar como recuperada y continuar con entrenamiento normal</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border-2 border-gray-200 dark:border-zinc-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                <input
                  type="radio"
                  name="estadoLesion"
                  value="activa"
                  defaultChecked
                  className="w-4 h-4 text-orange-600"
                />
                <div>
                  <p className="text-sm font-medium text-black dark:text-zinc-100">Seguir con protocolo de lesión</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">Mantener restricciones y ejercicios adaptados</p>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setMostrarModalLesion(false)
                  setAtletaConLesion(null)
                }}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-100 rounded-lg transition font-medium"
              >
                Más Tarde
              </button>
              <button
                onClick={async () => {
                  try {
                    const session = localStorage.getItem('athletixy_session')
                    if (!session) return
                    const sessionData = JSON.parse(session)
                    if (!sessionData.coachId) return

                    const coachesInternos = localStorage.getItem('gym_coaches_internos')
                    if (!coachesInternos) return

                    const coaches = JSON.parse(coachesInternos)
                    const coachIndex = coaches.findIndex((c: any) => c.id === sessionData.coachId)
                    if (coachIndex === -1) return

                    const coach = coaches[coachIndex]
                    const atletaIndex = coach.atletas.findIndex((a: any) => a.id === atletaConLesion.atleta.id)
                    if (atletaIndex === -1) return

                    const estadoSeleccionado = (document.querySelector('input[name="estadoLesion"]:checked') as HTMLInputElement)?.value
                    
                    if (estadoSeleccionado === 'sanada') {
                      // Marcar lesión como sanada
                      if (!coach.atletas[atletaIndex].lesiones) {
                        coach.atletas[atletaIndex].lesiones = []
                      }
                      const lesionIndex = coach.atletas[atletaIndex].lesiones.findIndex((l: any) => l.id === atletaConLesion.lesion.id)
                      if (lesionIndex !== -1) {
                        coach.atletas[atletaIndex].lesiones[lesionIndex].activa = false
                        coach.atletas[atletaIndex].lesiones[lesionIndex].fechaSanacion = new Date().toISOString().split('T')[0]
                      }
                    }

                    coaches[coachIndex] = coach
                    localStorage.setItem('gym_coaches_internos', JSON.stringify(coaches))

                    setMostrarModalLesion(false)
                    setAtletaConLesion(null)
                  } catch (error) {
                    console.error('Error actualizando lesión:', error)
                    alert('Error al actualizar el estado de la lesión')
                  }
                }}
                className="flex-1 px-4 py-3 bg-black dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition font-medium"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

