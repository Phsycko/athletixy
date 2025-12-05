'use client'

import { useState } from 'react'
import { ChefHat, Clock, Flame, Users, Search, Plus, ArrowRight, X, Check, Dumbbell, ShoppingCart, Sparkles, Crown, Lock, Trash2 } from 'lucide-react'

type Receta = {
  nombre: string
  categoria: string
  tiempo: number
  calorias: number
  proteina: number
  dificultad: string
  porciones: number
  ingredientes: string[]
  preparacion: string[]
}

type ItemSupermercado = {
  producto: string
  cantidad: string
  seccion: string
}

export default function RecetasPage() {
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [esPremium] = useState(true) // Cambiar a false para simular usuario básico
  const [listaSupermercado, setListaSupermercado] = useState<ItemSupermercado[]>([])
  const [generandoLista, setGenerandoLista] = useState(false)
  const [mostrarLista, setMostrarLista] = useState(false)
  const [modalNuevaReceta, setModalNuevaReceta] = useState(false)
  const [generandoRecetaIA, setGenerandoRecetaIA] = useState(false)
  
  const recetasIniciales: Receta[] = [
    {
      nombre: 'Bowl de Proteína con Quinoa',
      categoria: 'Almuerzo',
      tiempo: 25,
      calorias: 520,
      proteina: 45,
      dificultad: 'Fácil',
      porciones: 2,
      ingredientes: ['150g quinoa cocida', '200g pechuga de pollo', '100g espinaca', '50g aguacate', 'Tomate cherry'],
      preparacion: ['Cocina la quinoa según las instrucciones del paquete', 'Cocina la pechuga de pollo a la plancha', 'Mezcla todos los ingredientes en un bowl', 'Añade aderezo al gusto'],
    },
    {
      nombre: 'Batido Post-Entreno',
      categoria: 'Post-Entreno',
      tiempo: 5,
      calorias: 380,
      proteina: 35,
      dificultad: 'Muy Fácil',
      porciones: 1,
      ingredientes: ['1 scoop proteína de suero', '1 plátano', '200ml leche de almendras', '1 cucharada mantequilla de maní', 'Hielo'],
      preparacion: ['Añade todos los ingredientes a la licuadora', 'Licua hasta obtener consistencia suave', 'Sirve inmediatamente'],
    },
    {
      nombre: 'Avena Proteica con Frutas',
      categoria: 'Desayuno',
      tiempo: 15,
      calorias: 450,
      proteina: 30,
      dificultad: 'Fácil',
      porciones: 1,
      ingredientes: ['80g avena', '1 scoop proteína vainilla', '250ml leche', 'Frutos rojos', '1 cucharada miel'],
      preparacion: ['Cocina la avena con la leche', 'Añade la proteína y mezcla bien', 'Decora con frutos rojos y miel'],
    },
    {
      nombre: 'Salmón al Horno con Vegetales',
      categoria: 'Cena',
      tiempo: 35,
      calorias: 520,
      proteina: 42,
      dificultad: 'Media',
      porciones: 2,
      ingredientes: ['300g filete de salmón', 'Brócoli', 'Pimientos', 'Aceite de oliva', 'Limón y especias'],
      preparacion: ['Precalienta el horno a 180°C', 'Coloca el salmón y vegetales en bandeja', 'Rocía con aceite y especias', 'Hornea por 25 minutos'],
    },
    {
      nombre: 'Tortilla de Claras y Espinacas',
      categoria: 'Desayuno',
      tiempo: 10,
      calorias: 280,
      proteina: 32,
      dificultad: 'Fácil',
      porciones: 1,
      ingredientes: ['6 claras de huevo', '100g espinaca fresca', '50g queso bajo en grasa', 'Cebolla', 'Tomate'],
      preparacion: ['Saltea la espinaca y cebolla', 'Bate las claras y vierte en la sartén', 'Añade el queso y cocina hasta cuajar'],
    },
    {
      nombre: 'Wrap de Atún con Vegetales',
      categoria: 'Snacks',
      tiempo: 10,
      calorias: 320,
      proteina: 28,
      dificultad: 'Muy Fácil',
      porciones: 1,
      ingredientes: ['1 tortilla integral', '150g atún en agua', 'Lechuga', 'Tomate', 'Yogur griego'],
      preparacion: ['Mezcla el atún con yogur griego', 'Coloca los vegetales en la tortilla', 'Añade el atún y enrolla'],
    },
  ]
  
  const [recetas, setRecetas] = useState<Receta[]>(recetasIniciales)
  const [nuevaReceta, setNuevaReceta] = useState<Receta>({
    nombre: '',
    categoria: 'Almuerzo',
    tiempo: 0,
    calorias: 0,
    proteina: 0,
    dificultad: 'Fácil',
    porciones: 1,
    ingredientes: [''],
    preparacion: ['']
  })

  const abrirReceta = (receta: Receta) => {
    setRecetaSeleccionada(receta)
    setModalOpen(true)
  }

  const cerrarModal = () => {
    setModalOpen(false)
    setRecetaSeleccionada(null)
    setListaSupermercado([])
    setMostrarLista(false)
  }

  const cerrarModalNuevaReceta = () => {
    setModalNuevaReceta(false)
    setNuevaReceta({
      nombre: '',
      categoria: 'Almuerzo',
      tiempo: 0,
      calorias: 0,
      proteina: 0,
      dificultad: 'Fácil',
      porciones: 1,
      ingredientes: [''],
      preparacion: ['']
    })
  }

  const agregarIngrediente = () => {
    setNuevaReceta({
      ...nuevaReceta,
      ingredientes: [...nuevaReceta.ingredientes, '']
    })
  }

  const eliminarIngrediente = (index: number) => {
    if (nuevaReceta.ingredientes.length > 1) {
      setNuevaReceta({
        ...nuevaReceta,
        ingredientes: nuevaReceta.ingredientes.filter((_, i) => i !== index)
      })
    }
  }

  const actualizarIngrediente = (index: number, valor: string) => {
    const nuevosIngredientes = [...nuevaReceta.ingredientes]
    nuevosIngredientes[index] = valor
    setNuevaReceta({ ...nuevaReceta, ingredientes: nuevosIngredientes })
  }

  const agregarPaso = () => {
    setNuevaReceta({
      ...nuevaReceta,
      preparacion: [...nuevaReceta.preparacion, '']
    })
  }

  const eliminarPaso = (index: number) => {
    if (nuevaReceta.preparacion.length > 1) {
      setNuevaReceta({
        ...nuevaReceta,
        preparacion: nuevaReceta.preparacion.filter((_, i) => i !== index)
      })
    }
  }

  const actualizarPaso = (index: number, valor: string) => {
    const nuevosPasos = [...nuevaReceta.preparacion]
    nuevosPasos[index] = valor
    setNuevaReceta({ ...nuevaReceta, preparacion: nuevosPasos })
  }

  const guardarReceta = () => {
    if (!nuevaReceta.nombre.trim()) {
      alert('Por favor ingresa el nombre de la receta')
      return
    }
    if (nuevaReceta.ingredientes.filter(i => i.trim()).length === 0) {
      alert('Por favor agrega al menos un ingrediente')
      return
    }
    if (nuevaReceta.preparacion.filter(p => p.trim()).length === 0) {
      alert('Por favor agrega al menos un paso de preparación')
      return
    }

    const recetaLimpia: Receta = {
      ...nuevaReceta,
      ingredientes: nuevaReceta.ingredientes.filter(i => i.trim()),
      preparacion: nuevaReceta.preparacion.filter(p => p.trim())
    }

    setRecetas([...recetas, recetaLimpia])
    cerrarModalNuevaReceta()
  }

  const generarRecetaConIA = async () => {
    if (!nuevaReceta.nombre.trim()) {
      alert('Por favor escribe el nombre de la receta primero')
      return
    }

    setGenerandoRecetaIA(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Base de datos de recetas generadas por IA
    const recetasIA: { [key: string]: { ingredientes: string[], preparacion: string[], tiempo: number, calorias: number, proteina: number, porciones: number } } = {
      'default': {
        ingredientes: ['200g proteína principal', '150g carbohidrato', '100g vegetales', '2 cucharadas aceite de oliva', 'Sal y especias al gusto'],
        preparacion: ['Prepara todos los ingredientes y córtalos', 'Cocina la proteína a fuego medio por 5-7 minutos', 'Añade los vegetales y saltea por 3 minutos', 'Incorpora el carbohidrato y mezcla bien', 'Sazona al gusto y sirve caliente'],
        tiempo: 25, calorias: 450, proteina: 35, porciones: 2
      }
    }

    const nombreLower = nuevaReceta.nombre.toLowerCase()
    
    // Detectar tipo de receta y generar contenido apropiado
    let recetaGenerada = recetasIA['default']
    
    if (nombreLower.includes('pollo')) {
      recetaGenerada = {
        ingredientes: ['300g pechuga de pollo', '200g arroz integral', '150g brócoli', '1 diente de ajo', '2 cucharadas salsa de soya', 'Aceite de oliva', 'Sal y pimienta'],
        preparacion: ['Corta el pollo en cubos y sazona con sal y pimienta', 'Cocina el arroz según las instrucciones', 'En una sartén caliente, cocina el pollo hasta dorarlo', 'Añade el ajo y el brócoli, saltea 3 minutos', 'Agrega la salsa de soya y mezcla bien', 'Sirve sobre el arroz'],
        tiempo: 30, calorias: 520, proteina: 45, porciones: 2
      }
    } else if (nombreLower.includes('ensalada')) {
      recetaGenerada = {
        ingredientes: ['200g lechuga mixta', '150g pollo a la plancha', '100g tomate cherry', '50g queso feta', '30g nueces', 'Aderezo de limón y aceite'],
        preparacion: ['Lava y seca bien las lechugas', 'Corta el pollo en tiras', 'Parte los tomates por la mitad', 'Mezcla todo en un bowl grande', 'Añade el queso y las nueces', 'Aliña justo antes de servir'],
        tiempo: 15, calorias: 380, proteina: 32, porciones: 1
      }
    } else if (nombreLower.includes('batido') || nombreLower.includes('smoothie')) {
      recetaGenerada = {
        ingredientes: ['1 scoop proteína en polvo', '1 plátano maduro', '200ml leche de almendras', '1 cucharada mantequilla de maní', '5 cubos de hielo', '1 cucharadita miel'],
        preparacion: ['Añade la leche a la licuadora primero', 'Agrega el plátano y la proteína', 'Incorpora la mantequilla de maní y miel', 'Añade el hielo', 'Licua por 1-2 minutos hasta obtener consistencia suave', 'Sirve inmediatamente'],
        tiempo: 5, calorias: 350, proteina: 30, porciones: 1
      }
    } else if (nombreLower.includes('avena') || nombreLower.includes('oatmeal')) {
      recetaGenerada = {
        ingredientes: ['80g avena', '250ml leche', '1 scoop proteína vainilla', '1 plátano', 'Frutos rojos al gusto', '1 cucharada miel', 'Canela al gusto'],
        preparacion: ['Cocina la avena con la leche a fuego medio', 'Revuelve constantemente por 5 minutos', 'Retira del fuego y deja enfriar 2 minutos', 'Añade la proteína y mezcla bien', 'Decora con plátano, frutos rojos y miel', 'Espolvorea canela al gusto'],
        tiempo: 10, calorias: 420, proteina: 28, porciones: 1
      }
    } else if (nombreLower.includes('salmon') || nombreLower.includes('salmón') || nombreLower.includes('pescado')) {
      recetaGenerada = {
        ingredientes: ['300g filete de salmón', '200g espárragos', '150g papa', 'Jugo de 1 limón', '2 cucharadas aceite de oliva', 'Eneldo fresco', 'Sal y pimienta'],
        preparacion: ['Precalienta el horno a 200°C', 'Sazona el salmón con sal, pimienta y limón', 'Corta las papas en rodajas finas', 'Coloca todo en una bandeja para hornear', 'Rocía con aceite de oliva', 'Hornea por 20-25 minutos', 'Decora con eneldo fresco'],
        tiempo: 35, calorias: 480, proteina: 40, porciones: 2
      }
    }

    setNuevaReceta({
      ...nuevaReceta,
      ingredientes: recetaGenerada.ingredientes,
      preparacion: recetaGenerada.preparacion,
      tiempo: recetaGenerada.tiempo,
      calorias: recetaGenerada.calorias,
      proteina: recetaGenerada.proteina,
      porciones: recetaGenerada.porciones
    })

    setGenerandoRecetaIA(false)
  }

  const generarListaSupermercado = async () => {
    if (!recetaSeleccionada) return
    
    setGenerandoLista(true)
    
    // Simular procesamiento de IA
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generar lista inteligente basada en ingredientes
    const seccionesMap: { [key: string]: string } = {
      'pollo': 'Carnes y Aves',
      'pechuga': 'Carnes y Aves',
      'carne': 'Carnes y Aves',
      'salmón': 'Pescados y Mariscos',
      'atún': 'Pescados y Mariscos',
      'huevo': 'Lácteos y Huevos',
      'claras': 'Lácteos y Huevos',
      'leche': 'Lácteos y Huevos',
      'queso': 'Lácteos y Huevos',
      'yogur': 'Lácteos y Huevos',
      'quinoa': 'Granos y Cereales',
      'avena': 'Granos y Cereales',
      'arroz': 'Granos y Cereales',
      'tortilla': 'Panadería',
      'pan': 'Panadería',
      'espinaca': 'Frutas y Verduras',
      'aguacate': 'Frutas y Verduras',
      'tomate': 'Frutas y Verduras',
      'lechuga': 'Frutas y Verduras',
      'brócoli': 'Frutas y Verduras',
      'pimientos': 'Frutas y Verduras',
      'cebolla': 'Frutas y Verduras',
      'plátano': 'Frutas y Verduras',
      'frutos': 'Frutas y Verduras',
      'limón': 'Frutas y Verduras',
      'proteína': 'Suplementos',
      'scoop': 'Suplementos',
      'mantequilla': 'Despensa',
      'maní': 'Despensa',
      'miel': 'Despensa',
      'aceite': 'Despensa',
      'especias': 'Despensa',
      'hielo': 'Congelados',
    }

    const lista: ItemSupermercado[] = recetaSeleccionada.ingredientes.map(ingrediente => {
      let seccion = 'Otros'
      const ingLower = ingrediente.toLowerCase()
      
      for (const [keyword, sec] of Object.entries(seccionesMap)) {
        if (ingLower.includes(keyword)) {
          seccion = sec
          break
        }
      }
      
      // Extraer cantidad si existe
      const match = ingrediente.match(/^(\d+\w*\s*)/)
      const cantidad = match ? match[1].trim() : '1 unidad'
      const producto = match ? ingrediente.replace(match[1], '').trim() : ingrediente
      
      return {
        producto: producto.charAt(0).toUpperCase() + producto.slice(1),
        cantidad,
        seccion
      }
    })

    // Ordenar por sección
    lista.sort((a, b) => a.seccion.localeCompare(b.seccion))
    
    setListaSupermercado(lista)
    setMostrarLista(true)
    setGenerandoLista(false)
  }

  const categorias = ['Todas', 'Desayuno', 'Almuerzo', 'Cena', 'Snacks', 'Post-Entreno']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black mb-2">Recetas</h1>
          <p className="text-gray-600">Opciones saludables y deliciosas</p>
        </div>
        <button 
          onClick={() => setModalNuevaReceta(true)}
          className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nueva Receta
        </button>
      </div>

      {/* Buscador y Filtros */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
            <input
              type="text"
              placeholder="Buscar recetas..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categorias.map((cat, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                index === 0
                  ? 'bg-white text-black'
                  : 'bg-white text-gray-600 hover:bg-gray-200 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Recetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recetas.map((receta, index) => (
          <div
            key={index}
            className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-600 transition-all hover:shadow-xl group"
          >
            {/* Imagen placeholder con gradiente */}
            <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-black/30" />
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-white/20 text-gray-700 text-xs font-medium rounded-full">
                  {receta.categoria}
                </span>
                <span className="text-gray-600 text-xs">{receta.dificultad}</span>
              </div>

              <h3 className="text-black font-semibold text-lg mb-3 group-hover:text-gray-700 transition">
                {receta.nombre}
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-300">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Clock className="w-3 h-3" />
                  </div>
                  <p className="text-black text-sm font-semibold">{receta.tiempo}</p>
                  <p className="text-gray-600 text-xs">min</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Flame className="w-3 h-3" />
                  </div>
                  <p className="text-black text-sm font-semibold">{receta.calorias}</p>
                  <p className="text-gray-600 text-xs">kcal</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Users className="w-3 h-3" />
                  </div>
                  <p className="text-black text-sm font-semibold">{receta.porciones}</p>
                  <p className="text-gray-600 text-xs">porción</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Ingredientes:</p>
                  <ul className="space-y-1">
                    {receta.ingredientes.slice(0, 3).map((ing, idx) => (
                      <li key={idx} className="text-gray-600 text-xs flex items-center gap-2">
                        <span className="w-1 h-1 bg-white rounded-full"></span>
                        {ing}
                      </li>
                    ))}
                    {receta.ingredientes.length > 3 && (
                      <li className="text-gray-700 text-xs">
                        +{receta.ingredientes.length - 3} más...
                      </li>
                    )}
                  </ul>
                </div>

                <button 
                  onClick={() => abrirReceta(receta)}
                  className="w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-lg transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  Ver Receta Completa
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Receta Completa */}
      {modalOpen && recetaSeleccionada && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header con imagen */}
            <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <ChefHat className="w-20 h-20 text-white/20" />
              <button
                onClick={cerrarModal}
                className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                  {recetaSeleccionada.categoria}
                </span>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
              {/* Título y dificultad */}
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">{recetaSeleccionada.nombre}</h2>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  recetaSeleccionada.dificultad === 'Muy Fácil' ? 'bg-green-100 text-green-700' :
                  recetaSeleccionada.dificultad === 'Fácil' ? 'bg-blue-100 text-blue-700' :
                  recetaSeleccionada.dificultad === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {recetaSeleccionada.dificultad}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xl font-bold text-black">{recetaSeleccionada.tiempo}</p>
                  <p className="text-gray-500 text-xs">minutos</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-xl font-bold text-black">{recetaSeleccionada.calorias}</p>
                  <p className="text-gray-500 text-xs">kcal</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-xl font-bold text-black">{recetaSeleccionada.proteina}g</p>
                  <p className="text-gray-500 text-xs">proteína</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-xl font-bold text-black">{recetaSeleccionada.porciones}</p>
                  <p className="text-gray-500 text-xs">porciones</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Ingredientes */}
                <div>
                  <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </span>
                    Ingredientes
                  </h3>
                  <ul className="space-y-3">
                    {recetaSeleccionada.ingredientes.map((ingrediente, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                        {ingrediente}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preparación */}
                <div>
                  <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ChefHat className="w-4 h-4 text-blue-600" />
                    </span>
                    Preparación
                  </h3>
                  <ol className="space-y-4">
                    {recetaSeleccionada.preparacion.map((paso, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-gray-700 pt-0.5">{paso}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Botón Lista de Supermercado con IA */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                {esPremium ? (
                  <button
                    onClick={generarListaSupermercado}
                    disabled={generandoLista}
                    className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {generandoLista ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generando lista inteligente...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <ShoppingCart className="w-5 h-5" />
                        Generar Lista de Supermercado con IA
                        <span className="ml-1 px-2 py-0.5 bg-white/20 text-xs rounded-full font-bold">PREMIUM</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="relative">
                    <button
                      disabled
                      className="w-full py-4 bg-gray-100 border-2 border-gray-200 text-gray-400 rounded-xl font-semibold flex items-center justify-center gap-3 cursor-not-allowed"
                    >
                      <Lock className="w-5 h-5" />
                      <ShoppingCart className="w-5 h-5" />
                      Generar Lista de Supermercado con IA
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Solo Premium
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Lista de Supermercado Generada */}
              {mostrarLista && listaSupermercado.length > 0 && (
                <div className="mt-6 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-gray-700" />
                      Lista de Supermercado
                    </h3>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                      {listaSupermercado.length} items
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {Array.from(new Set(listaSupermercado.map(i => i.seccion))).map(seccion => (
                      <div key={seccion}>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">{seccion}</p>
                        <ul className="space-y-2">
                          {listaSupermercado.filter(i => i.seccion === seccion).map((item, idx) => (
                            <li key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500" />
                                <span className="text-gray-800">{item.producto}</span>
                              </div>
                              <span className="text-sm text-gray-500 font-medium">{item.cantidad}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-5 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        const texto = listaSupermercado.map(i => `☐ ${i.producto} - ${i.cantidad}`).join('\n')
                        navigator.clipboard.writeText(texto)
                      }}
                      className="flex-1 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition text-sm"
                    >
                      📋 Copiar Lista
                    </button>
                    <button 
                      onClick={() => setMostrarLista(false)}
                      className="flex-1 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition text-sm"
                    >
                      ✓ Listo
                    </button>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={cerrarModal}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cerrar
                </button>
                <button className="flex-1 py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Agregar a Mi Dieta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Receta */}
      {modalNuevaReceta && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-black">Nueva Receta</h2>
              </div>
              <button
                onClick={cerrarModalNuevaReceta}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Formulario */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-10rem)] space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la Receta</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej: Bowl de Proteína con Quinoa"
                    value={nuevaReceta.nombre}
                    onChange={(e) => setNuevaReceta({...nuevaReceta, nombre: e.target.value})}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {esPremium && (
                    <button
                      type="button"
                      onClick={generarRecetaConIA}
                      disabled={generandoRecetaIA}
                      className="px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-70"
                      title="Generar receta con IA"
                    >
                      {generandoRecetaIA ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                      <span className="hidden sm:inline">IA</span>
                    </button>
                  )}
                </div>
                {esPremium && (
                  <p className="text-xs text-gray-500 mt-1">Escribe el nombre y presiona IA para generar la receta automáticamente</p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                <select
                  value={nuevaReceta.categoria}
                  onChange={(e) => setNuevaReceta({...nuevaReceta, categoria: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  <option value="Desayuno">Desayuno</option>
                  <option value="Almuerzo">Almuerzo</option>
                  <option value="Cena">Cena</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Post-Entreno">Post-Entreno</option>
                </select>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tiempo (min)</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={nuevaReceta.tiempo || ''}
                    onChange={(e) => setNuevaReceta({...nuevaReceta, tiempo: Number(e.target.value)})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Calorías</label>
                  <input
                    type="number"
                    placeholder="450"
                    value={nuevaReceta.calorias || ''}
                    onChange={(e) => setNuevaReceta({...nuevaReceta, calorias: Number(e.target.value)})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Proteína (g)</label>
                  <input
                    type="number"
                    placeholder="35"
                    value={nuevaReceta.proteina || ''}
                    onChange={(e) => setNuevaReceta({...nuevaReceta, proteina: Number(e.target.value)})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Porciones</label>
                  <input
                    type="number"
                    placeholder="2"
                    value={nuevaReceta.porciones || ''}
                    onChange={(e) => setNuevaReceta({...nuevaReceta, porciones: Number(e.target.value)})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Ingredientes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">Ingredientes</label>
                  <button
                    type="button"
                    onClick={agregarIngrediente}
                    className="text-sm text-gray-600 hover:text-black font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {nuevaReceta.ingredientes.map((ingrediente, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Ingrediente ${idx + 1} (ej: 200g pechuga de pollo)`}
                        value={ingrediente}
                        onChange={(e) => actualizarIngrediente(idx, e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      />
                      {nuevaReceta.ingredientes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => eliminarIngrediente(idx)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preparación */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">Pasos de Preparación</label>
                  <button
                    type="button"
                    onClick={agregarPaso}
                    className="text-sm text-gray-600 hover:text-black font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Paso
                  </button>
                </div>
                <div className="space-y-2">
                  {nuevaReceta.preparacion.map((paso, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-2">
                        {idx + 1}
                      </span>
                      <textarea
                        placeholder={`Paso ${idx + 1} de la preparación`}
                        value={paso}
                        onChange={(e) => actualizarPaso(idx, e.target.value)}
                        rows={2}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black text-sm resize-none"
                      />
                      {nuevaReceta.preparacion.length > 1 && (
                        <button
                          type="button"
                          onClick={() => eliminarPaso(idx)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer con botones */}
            <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 px-6 py-4 flex gap-4">
              <button
                onClick={cerrarModalNuevaReceta}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={guardarReceta}
                className="flex-1 py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Guardar Receta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

