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
    await new Promise(resolve => setTimeout(resolve, 1500))

    const nombre = nuevaReceta.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
    
    // BASE DE DATOS COMPLETA DE INGREDIENTES
    const ingredientesDB: { [key: string]: { nombre: string, cantidad: string, calorias: number, proteina: number, tipo: string } } = {
      // ============ PROTEÍNAS ANIMALES ============
      'huevo': { nombre: 'Huevos', cantidad: '3 unidades', calorias: 210, proteina: 18, tipo: 'proteina' },
      'huevos': { nombre: 'Huevos', cantidad: '3 unidades', calorias: 210, proteina: 18, tipo: 'proteina' },
      'clara': { nombre: 'Claras de huevo', cantidad: '4 unidades', calorias: 60, proteina: 14, tipo: 'proteina' },
      'claras': { nombre: 'Claras de huevo', cantidad: '4 unidades', calorias: 60, proteina: 14, tipo: 'proteina' },
      'jamon': { nombre: 'Jamón', cantidad: '100g', calorias: 145, proteina: 21, tipo: 'proteina' },
      'tocino': { nombre: 'Tocino', cantidad: '80g', calorias: 420, proteina: 12, tipo: 'proteina' },
      'bacon': { nombre: 'Bacon', cantidad: '80g', calorias: 420, proteina: 12, tipo: 'proteina' },
      'pollo': { nombre: 'Pechuga de pollo', cantidad: '250g', calorias: 275, proteina: 55, tipo: 'proteina' },
      'pechuga': { nombre: 'Pechuga de pollo', cantidad: '250g', calorias: 275, proteina: 55, tipo: 'proteina' },
      'muslo': { nombre: 'Muslos de pollo', cantidad: '300g', calorias: 350, proteina: 45, tipo: 'proteina' },
      'alita': { nombre: 'Alitas de pollo', cantidad: '400g', calorias: 400, proteina: 40, tipo: 'proteina' },
      'alitas': { nombre: 'Alitas de pollo', cantidad: '400g', calorias: 400, proteina: 40, tipo: 'proteina' },
      'carne': { nombre: 'Carne de res', cantidad: '250g', calorias: 500, proteina: 50, tipo: 'proteina' },
      'res': { nombre: 'Carne de res', cantidad: '250g', calorias: 500, proteina: 50, tipo: 'proteina' },
      'bistec': { nombre: 'Bistec', cantidad: '200g', calorias: 400, proteina: 40, tipo: 'proteina' },
      'filete': { nombre: 'Filete', cantidad: '200g', calorias: 380, proteina: 42, tipo: 'proteina' },
      'cerdo': { nombre: 'Carne de cerdo', cantidad: '200g', calorias: 450, proteina: 40, tipo: 'proteina' },
      'costilla': { nombre: 'Costillas', cantidad: '300g', calorias: 600, proteina: 35, tipo: 'proteina' },
      'costillas': { nombre: 'Costillas', cantidad: '300g', calorias: 600, proteina: 35, tipo: 'proteina' },
      'chorizo': { nombre: 'Chorizo', cantidad: '100g', calorias: 300, proteina: 14, tipo: 'proteina' },
      'salchicha': { nombre: 'Salchichas', cantidad: '100g', calorias: 300, proteina: 12, tipo: 'proteina' },
      'longaniza': { nombre: 'Longaniza', cantidad: '100g', calorias: 320, proteina: 15, tipo: 'proteina' },
      'carnitas': { nombre: 'Carnitas', cantidad: '200g', calorias: 450, proteina: 35, tipo: 'proteina' },
      'barbacoa': { nombre: 'Barbacoa', cantidad: '200g', calorias: 400, proteina: 40, tipo: 'proteina' },
      'pastor': { nombre: 'Carne al pastor', cantidad: '200g', calorias: 380, proteina: 35, tipo: 'proteina' },
      
      // ============ PESCADOS Y MARISCOS ============
      'salmon': { nombre: 'Filete de salmón', cantidad: '200g', calorias: 400, proteina: 40, tipo: 'pescado' },
      'atun': { nombre: 'Atún', cantidad: '150g', calorias: 180, proteina: 40, tipo: 'pescado' },
      'pescado': { nombre: 'Filete de pescado', cantidad: '200g', calorias: 200, proteina: 40, tipo: 'pescado' },
      'tilapia': { nombre: 'Tilapia', cantidad: '200g', calorias: 200, proteina: 42, tipo: 'pescado' },
      'robalo': { nombre: 'Robalo', cantidad: '200g', calorias: 180, proteina: 38, tipo: 'pescado' },
      'mojarra': { nombre: 'Mojarra', cantidad: '250g', calorias: 200, proteina: 40, tipo: 'pescado' },
      'trucha': { nombre: 'Trucha', cantidad: '200g', calorias: 190, proteina: 38, tipo: 'pescado' },
      'bacalao': { nombre: 'Bacalao', cantidad: '200g', calorias: 160, proteina: 35, tipo: 'pescado' },
      'sardina': { nombre: 'Sardinas', cantidad: '150g', calorias: 250, proteina: 30, tipo: 'pescado' },
      'camaron': { nombre: 'Camarones', cantidad: '200g', calorias: 200, proteina: 40, tipo: 'marisco' },
      'camarones': { nombre: 'Camarones', cantidad: '200g', calorias: 200, proteina: 40, tipo: 'marisco' },
      'pulpo': { nombre: 'Pulpo', cantidad: '200g', calorias: 160, proteina: 30, tipo: 'marisco' },
      'calamar': { nombre: 'Calamar', cantidad: '200g', calorias: 170, proteina: 32, tipo: 'marisco' },
      'mejillon': { nombre: 'Mejillones', cantidad: '200g', calorias: 150, proteina: 24, tipo: 'marisco' },
      'mejillones': { nombre: 'Mejillones', cantidad: '200g', calorias: 150, proteina: 24, tipo: 'marisco' },
      'almeja': { nombre: 'Almejas', cantidad: '200g', calorias: 140, proteina: 25, tipo: 'marisco' },
      'almejas': { nombre: 'Almejas', cantidad: '200g', calorias: 140, proteina: 25, tipo: 'marisco' },
      'langosta': { nombre: 'Langosta', cantidad: '200g', calorias: 180, proteina: 35, tipo: 'marisco' },
      'cangrejo': { nombre: 'Cangrejo', cantidad: '150g', calorias: 140, proteina: 28, tipo: 'marisco' },
      'ostiones': { nombre: 'Ostiones', cantidad: '150g', calorias: 120, proteina: 20, tipo: 'marisco' },
      
      // ============ CARBOHIDRATOS ============
      'arroz': { nombre: 'Arroz', cantidad: '200g', calorias: 260, proteina: 5, tipo: 'carbohidrato' },
      'pasta': { nombre: 'Pasta', cantidad: '200g', calorias: 260, proteina: 8, tipo: 'carbohidrato' },
      'espagueti': { nombre: 'Espagueti', cantidad: '200g', calorias: 260, proteina: 8, tipo: 'carbohidrato' },
      'spaghetti': { nombre: 'Spaghetti', cantidad: '200g', calorias: 260, proteina: 8, tipo: 'carbohidrato' },
      'fideo': { nombre: 'Fideos', cantidad: '200g', calorias: 260, proteina: 8, tipo: 'carbohidrato' },
      'fideos': { nombre: 'Fideos', cantidad: '200g', calorias: 260, proteina: 8, tipo: 'carbohidrato' },
      'tallarines': { nombre: 'Tallarines', cantidad: '200g', calorias: 260, proteina: 8, tipo: 'carbohidrato' },
      'lasana': { nombre: 'Láminas de lasaña', cantidad: '200g', calorias: 280, proteina: 10, tipo: 'carbohidrato' },
      'papa': { nombre: 'Papas', cantidad: '300g', calorias: 230, proteina: 6, tipo: 'carbohidrato' },
      'papas': { nombre: 'Papas', cantidad: '300g', calorias: 230, proteina: 6, tipo: 'carbohidrato' },
      'patata': { nombre: 'Patatas', cantidad: '300g', calorias: 230, proteina: 6, tipo: 'carbohidrato' },
      'camote': { nombre: 'Camote', cantidad: '250g', calorias: 200, proteina: 4, tipo: 'carbohidrato' },
      'pure': { nombre: 'Puré de papa', cantidad: '200g', calorias: 180, proteina: 4, tipo: 'carbohidrato' },
      'pan': { nombre: 'Pan', cantidad: '100g', calorias: 265, proteina: 9, tipo: 'carbohidrato' },
      'tortilla': { nombre: 'Tortillas', cantidad: '4 unidades', calorias: 200, proteina: 5, tipo: 'carbohidrato' },
      'tortillas': { nombre: 'Tortillas', cantidad: '4 unidades', calorias: 200, proteina: 5, tipo: 'carbohidrato' },
      'avena': { nombre: 'Avena', cantidad: '80g', calorias: 300, proteina: 13, tipo: 'carbohidrato' },
      'quinoa': { nombre: 'Quinoa', cantidad: '150g', calorias: 180, proteina: 7, tipo: 'carbohidrato' },
      'cuscus': { nombre: 'Cuscús', cantidad: '150g', calorias: 170, proteina: 6, tipo: 'carbohidrato' },
      'lenteja': { nombre: 'Lentejas', cantidad: '150g', calorias: 230, proteina: 18, tipo: 'carbohidrato' },
      'lentejas': { nombre: 'Lentejas', cantidad: '150g', calorias: 230, proteina: 18, tipo: 'carbohidrato' },
      'garbanzo': { nombre: 'Garbanzos', cantidad: '150g', calorias: 270, proteina: 15, tipo: 'carbohidrato' },
      'garbanzos': { nombre: 'Garbanzos', cantidad: '150g', calorias: 270, proteina: 15, tipo: 'carbohidrato' },
      'frijol': { nombre: 'Frijoles', cantidad: '150g', calorias: 200, proteina: 14, tipo: 'carbohidrato' },
      'frijoles': { nombre: 'Frijoles', cantidad: '150g', calorias: 200, proteina: 14, tipo: 'carbohidrato' },
      
      // ============ VEGETALES ============
      'esparrago': { nombre: 'Espárragos', cantidad: '150g', calorias: 30, proteina: 3, tipo: 'vegetal' },
      'esparragos': { nombre: 'Espárragos', cantidad: '150g', calorias: 30, proteina: 3, tipo: 'vegetal' },
      'brocoli': { nombre: 'Brócoli', cantidad: '150g', calorias: 50, proteina: 4, tipo: 'vegetal' },
      'coliflor': { nombre: 'Coliflor', cantidad: '150g', calorias: 35, proteina: 3, tipo: 'vegetal' },
      'espinaca': { nombre: 'Espinacas', cantidad: '100g', calorias: 23, proteina: 3, tipo: 'vegetal' },
      'espinacas': { nombre: 'Espinacas', cantidad: '100g', calorias: 23, proteina: 3, tipo: 'vegetal' },
      'acelga': { nombre: 'Acelgas', cantidad: '100g', calorias: 20, proteina: 2, tipo: 'vegetal' },
      'kale': { nombre: 'Kale', cantidad: '100g', calorias: 35, proteina: 3, tipo: 'vegetal' },
      'lechuga': { nombre: 'Lechuga', cantidad: '100g', calorias: 15, proteina: 1, tipo: 'vegetal' },
      'arugula': { nombre: 'Arúgula', cantidad: '50g', calorias: 12, proteina: 1, tipo: 'vegetal' },
      'cebolla': { nombre: 'Cebolla', cantidad: '1 unidad', calorias: 40, proteina: 1, tipo: 'vegetal' },
      'ajo': { nombre: 'Ajo', cantidad: '3 dientes', calorias: 15, proteina: 1, tipo: 'vegetal' },
      'tomate': { nombre: 'Tomates', cantidad: '2 unidades', calorias: 35, proteina: 2, tipo: 'vegetal' },
      'jitomate': { nombre: 'Jitomates', cantidad: '2 unidades', calorias: 35, proteina: 2, tipo: 'vegetal' },
      'zanahoria': { nombre: 'Zanahorias', cantidad: '2 unidades', calorias: 50, proteina: 1, tipo: 'vegetal' },
      'zanahorias': { nombre: 'Zanahorias', cantidad: '2 unidades', calorias: 50, proteina: 1, tipo: 'vegetal' },
      'pimiento': { nombre: 'Pimiento', cantidad: '1 unidad', calorias: 30, proteina: 1, tipo: 'vegetal' },
      'pimientos': { nombre: 'Pimientos', cantidad: '2 unidades', calorias: 60, proteina: 2, tipo: 'vegetal' },
      'chile': { nombre: 'Chile', cantidad: '2 unidades', calorias: 20, proteina: 1, tipo: 'vegetal' },
      'jalapeno': { nombre: 'Jalapeño', cantidad: '2 unidades', calorias: 10, proteina: 0, tipo: 'vegetal' },
      'aguacate': { nombre: 'Aguacate', cantidad: '1 unidad', calorias: 240, proteina: 3, tipo: 'vegetal' },
      'pepino': { nombre: 'Pepino', cantidad: '1 unidad', calorias: 15, proteina: 1, tipo: 'vegetal' },
      'calabaza': { nombre: 'Calabaza', cantidad: '200g', calorias: 50, proteina: 2, tipo: 'vegetal' },
      'calabacin': { nombre: 'Calabacín', cantidad: '200g', calorias: 35, proteina: 2, tipo: 'vegetal' },
      'zucchini': { nombre: 'Zucchini', cantidad: '200g', calorias: 35, proteina: 2, tipo: 'vegetal' },
      'berenjena': { nombre: 'Berenjena', cantidad: '200g', calorias: 50, proteina: 2, tipo: 'vegetal' },
      'champinon': { nombre: 'Champiñones', cantidad: '150g', calorias: 30, proteina: 4, tipo: 'vegetal' },
      'champinones': { nombre: 'Champiñones', cantidad: '150g', calorias: 30, proteina: 4, tipo: 'vegetal' },
      'hongo': { nombre: 'Hongos', cantidad: '150g', calorias: 30, proteina: 4, tipo: 'vegetal' },
      'hongos': { nombre: 'Hongos', cantidad: '150g', calorias: 30, proteina: 4, tipo: 'vegetal' },
      'elote': { nombre: 'Elote', cantidad: '1 unidad', calorias: 90, proteina: 3, tipo: 'vegetal' },
      'maiz': { nombre: 'Maíz', cantidad: '100g', calorias: 90, proteina: 3, tipo: 'vegetal' },
      'chicharo': { nombre: 'Chícharos', cantidad: '100g', calorias: 80, proteina: 5, tipo: 'vegetal' },
      'chicharos': { nombre: 'Chícharos', cantidad: '100g', calorias: 80, proteina: 5, tipo: 'vegetal' },
      'ejote': { nombre: 'Ejotes', cantidad: '100g', calorias: 30, proteina: 2, tipo: 'vegetal' },
      'ejotes': { nombre: 'Ejotes', cantidad: '100g', calorias: 30, proteina: 2, tipo: 'vegetal' },
      'nopales': { nombre: 'Nopales', cantidad: '150g', calorias: 25, proteina: 2, tipo: 'vegetal' },
      'chayote': { nombre: 'Chayote', cantidad: '1 unidad', calorias: 40, proteina: 1, tipo: 'vegetal' },
      'betabel': { nombre: 'Betabel', cantidad: '150g', calorias: 65, proteina: 2, tipo: 'vegetal' },
      'apio': { nombre: 'Apio', cantidad: '2 tallos', calorias: 10, proteina: 0, tipo: 'vegetal' },
      'col': { nombre: 'Col', cantidad: '150g', calorias: 35, proteina: 2, tipo: 'vegetal' },
      'repollo': { nombre: 'Repollo', cantidad: '150g', calorias: 35, proteina: 2, tipo: 'vegetal' },
      
      // ============ LÁCTEOS ============
      'queso': { nombre: 'Queso', cantidad: '100g', calorias: 350, proteina: 25, tipo: 'lacteo' },
      'quesillo': { nombre: 'Quesillo/Oaxaca', cantidad: '100g', calorias: 300, proteina: 22, tipo: 'lacteo' },
      'panela': { nombre: 'Queso panela', cantidad: '100g', calorias: 250, proteina: 20, tipo: 'lacteo' },
      'parmesano': { nombre: 'Queso parmesano', cantidad: '50g', calorias: 200, proteina: 18, tipo: 'lacteo' },
      'mozzarella': { nombre: 'Mozzarella', cantidad: '100g', calorias: 280, proteina: 22, tipo: 'lacteo' },
      'cheddar': { nombre: 'Queso cheddar', cantidad: '100g', calorias: 400, proteina: 25, tipo: 'lacteo' },
      'crema': { nombre: 'Crema', cantidad: '100ml', calorias: 200, proteina: 2, tipo: 'lacteo' },
      'leche': { nombre: 'Leche', cantidad: '250ml', calorias: 150, proteina: 8, tipo: 'lacteo' },
      'yogurt': { nombre: 'Yogurt', cantidad: '150g', calorias: 90, proteina: 15, tipo: 'lacteo' },
      'yogur': { nombre: 'Yogur', cantidad: '150g', calorias: 90, proteina: 15, tipo: 'lacteo' },
      'mantequilla': { nombre: 'Mantequilla', cantidad: '30g', calorias: 215, proteina: 0, tipo: 'lacteo' },
      'requesón': { nombre: 'Requesón', cantidad: '100g', calorias: 170, proteina: 11, tipo: 'lacteo' },
      'requeson': { nombre: 'Requesón', cantidad: '100g', calorias: 170, proteina: 11, tipo: 'lacteo' },
      
      // ============ FRUTAS ============
      'platano': { nombre: 'Plátano', cantidad: '2 unidades', calorias: 180, proteina: 2, tipo: 'fruta' },
      'banana': { nombre: 'Banana', cantidad: '2 unidades', calorias: 180, proteina: 2, tipo: 'fruta' },
      'manzana': { nombre: 'Manzana', cantidad: '1 unidad', calorias: 95, proteina: 0, tipo: 'fruta' },
      'pera': { nombre: 'Pera', cantidad: '1 unidad', calorias: 100, proteina: 0, tipo: 'fruta' },
      'naranja': { nombre: 'Naranja', cantidad: '1 unidad', calorias: 60, proteina: 1, tipo: 'fruta' },
      'limon': { nombre: 'Limón', cantidad: '2 unidades', calorias: 20, proteina: 0, tipo: 'fruta' },
      'lima': { nombre: 'Lima', cantidad: '2 unidades', calorias: 20, proteina: 0, tipo: 'fruta' },
      'fresa': { nombre: 'Fresas', cantidad: '150g', calorias: 50, proteina: 1, tipo: 'fruta' },
      'fresas': { nombre: 'Fresas', cantidad: '150g', calorias: 50, proteina: 1, tipo: 'fruta' },
      'mora': { nombre: 'Moras', cantidad: '100g', calorias: 40, proteina: 1, tipo: 'fruta' },
      'moras': { nombre: 'Moras', cantidad: '100g', calorias: 40, proteina: 1, tipo: 'fruta' },
      'arandano': { nombre: 'Arándanos', cantidad: '100g', calorias: 55, proteina: 1, tipo: 'fruta' },
      'arandanos': { nombre: 'Arándanos', cantidad: '100g', calorias: 55, proteina: 1, tipo: 'fruta' },
      'frambuesa': { nombre: 'Frambuesas', cantidad: '100g', calorias: 50, proteina: 1, tipo: 'fruta' },
      'mango': { nombre: 'Mango', cantidad: '1 unidad', calorias: 100, proteina: 1, tipo: 'fruta' },
      'pina': { nombre: 'Piña', cantidad: '200g', calorias: 100, proteina: 1, tipo: 'fruta' },
      'papaya': { nombre: 'Papaya', cantidad: '200g', calorias: 80, proteina: 1, tipo: 'fruta' },
      'melon': { nombre: 'Melón', cantidad: '200g', calorias: 65, proteina: 1, tipo: 'fruta' },
      'sandia': { nombre: 'Sandía', cantidad: '200g', calorias: 60, proteina: 1, tipo: 'fruta' },
      'uva': { nombre: 'Uvas', cantidad: '150g', calorias: 100, proteina: 1, tipo: 'fruta' },
      'uvas': { nombre: 'Uvas', cantidad: '150g', calorias: 100, proteina: 1, tipo: 'fruta' },
      'durazno': { nombre: 'Durazno', cantidad: '2 unidades', calorias: 80, proteina: 2, tipo: 'fruta' },
      'coco': { nombre: 'Coco', cantidad: '100g', calorias: 350, proteina: 3, tipo: 'fruta' },
      'kiwi': { nombre: 'Kiwi', cantidad: '2 unidades', calorias: 85, proteina: 2, tipo: 'fruta' },
      
      // ============ CONDIMENTOS Y ESPECIAS ============
      'sal': { nombre: 'Sal', cantidad: 'al gusto', calorias: 0, proteina: 0, tipo: 'condimento' },
      'pimienta': { nombre: 'Pimienta negra', cantidad: 'al gusto', calorias: 0, proteina: 0, tipo: 'condimento' },
      'comino': { nombre: 'Comino', cantidad: '1 cucharadita', calorias: 8, proteina: 0, tipo: 'condimento' },
      'oregano': { nombre: 'Orégano', cantidad: '1 cucharadita', calorias: 5, proteina: 0, tipo: 'condimento' },
      'cilantro': { nombre: 'Cilantro fresco', cantidad: '1 manojo', calorias: 5, proteina: 0, tipo: 'condimento' },
      'perejil': { nombre: 'Perejil fresco', cantidad: '1 manojo', calorias: 5, proteina: 0, tipo: 'condimento' },
      'albahaca': { nombre: 'Albahaca fresca', cantidad: '10 hojas', calorias: 5, proteina: 0, tipo: 'condimento' },
      'romero': { nombre: 'Romero', cantidad: '1 rama', calorias: 5, proteina: 0, tipo: 'condimento' },
      'tomillo': { nombre: 'Tomillo', cantidad: '1 cucharadita', calorias: 5, proteina: 0, tipo: 'condimento' },
      'laurel': { nombre: 'Hojas de laurel', cantidad: '2 hojas', calorias: 0, proteina: 0, tipo: 'condimento' },
      'canela': { nombre: 'Canela', cantidad: '1 raja', calorias: 5, proteina: 0, tipo: 'condimento' },
      'curry': { nombre: 'Curry en polvo', cantidad: '1 cucharada', calorias: 20, proteina: 1, tipo: 'condimento' },
      'paprika': { nombre: 'Paprika', cantidad: '1 cucharadita', calorias: 10, proteina: 0, tipo: 'condimento' },
      'curcuma': { nombre: 'Cúrcuma', cantidad: '1 cucharadita', calorias: 10, proteina: 0, tipo: 'condimento' },
      'jengibre': { nombre: 'Jengibre', cantidad: '1 cucharada rallado', calorias: 5, proteina: 0, tipo: 'condimento' },
      
      // ============ ACEITES Y GRASAS ============
      'aceite': { nombre: 'Aceite de oliva', cantidad: '2 cucharadas', calorias: 240, proteina: 0, tipo: 'grasa' },
      'oliva': { nombre: 'Aceite de oliva', cantidad: '2 cucharadas', calorias: 240, proteina: 0, tipo: 'grasa' },
      'aceite de coco': { nombre: 'Aceite de coco', cantidad: '2 cucharadas', calorias: 240, proteina: 0, tipo: 'grasa' },
      
      // ============ SALSAS ============
      'salsa': { nombre: 'Salsa', cantidad: '100ml', calorias: 30, proteina: 1, tipo: 'salsa' },
      'soya': { nombre: 'Salsa de soya', cantidad: '2 cucharadas', calorias: 15, proteina: 2, tipo: 'salsa' },
      'soja': { nombre: 'Salsa de soya', cantidad: '2 cucharadas', calorias: 15, proteina: 2, tipo: 'salsa' },
      'teriyaki': { nombre: 'Salsa teriyaki', cantidad: '3 cucharadas', calorias: 45, proteina: 1, tipo: 'salsa' },
      'bbq': { nombre: 'Salsa BBQ', cantidad: '3 cucharadas', calorias: 70, proteina: 0, tipo: 'salsa' },
      'mayonesa': { nombre: 'Mayonesa', cantidad: '2 cucharadas', calorias: 180, proteina: 0, tipo: 'salsa' },
      'mostaza': { nombre: 'Mostaza', cantidad: '1 cucharada', calorias: 10, proteina: 0, tipo: 'salsa' },
      'ketchup': { nombre: 'Ketchup', cantidad: '2 cucharadas', calorias: 40, proteina: 0, tipo: 'salsa' },
      'catsup': { nombre: 'Catsup', cantidad: '2 cucharadas', calorias: 40, proteina: 0, tipo: 'salsa' },
      'vinagre': { nombre: 'Vinagre', cantidad: '1 cucharada', calorias: 5, proteina: 0, tipo: 'salsa' },
      
      // ============ DULCES/POSTRES ============
      'azucar': { nombre: 'Azúcar', cantidad: '100g', calorias: 400, proteina: 0, tipo: 'dulce' },
      'miel': { nombre: 'Miel', cantidad: '2 cucharadas', calorias: 120, proteina: 0, tipo: 'dulce' },
      'chocolate': { nombre: 'Chocolate', cantidad: '50g', calorias: 270, proteina: 4, tipo: 'dulce' },
      'vainilla': { nombre: 'Esencia de vainilla', cantidad: '1 cucharadita', calorias: 10, proteina: 0, tipo: 'dulce' },
      'harina': { nombre: 'Harina', cantidad: '200g', calorias: 700, proteina: 20, tipo: 'dulce' },
      
      // ============ FRUTOS SECOS ============
      'almendra': { nombre: 'Almendras', cantidad: '30g', calorias: 170, proteina: 6, tipo: 'fruto_seco' },
      'almendras': { nombre: 'Almendras', cantidad: '30g', calorias: 170, proteina: 6, tipo: 'fruto_seco' },
      'nuez': { nombre: 'Nueces', cantidad: '30g', calorias: 185, proteina: 4, tipo: 'fruto_seco' },
      'nueces': { nombre: 'Nueces', cantidad: '30g', calorias: 185, proteina: 4, tipo: 'fruto_seco' },
      'cacahuate': { nombre: 'Cacahuates', cantidad: '30g', calorias: 160, proteina: 7, tipo: 'fruto_seco' },
      'mani': { nombre: 'Maní', cantidad: '30g', calorias: 160, proteina: 7, tipo: 'fruto_seco' },
      'pistacho': { nombre: 'Pistachos', cantidad: '30g', calorias: 160, proteina: 6, tipo: 'fruto_seco' },
      'avellana': { nombre: 'Avellanas', cantidad: '30g', calorias: 175, proteina: 4, tipo: 'fruto_seco' },
      
      // ============ OTROS ============
      'proteina': { nombre: 'Proteína en polvo', cantidad: '1 scoop (30g)', calorias: 120, proteina: 24, tipo: 'suplemento' },
      'whey': { nombre: 'Whey protein', cantidad: '1 scoop (30g)', calorias: 120, proteina: 24, tipo: 'suplemento' },
    }

    // Detectar ingredientes mencionados en el nombre
    const ingredientesDetectados: string[] = []
    const tiposDetectados: string[] = []
    let caloriasTotal = 0
    let proteinaTotal = 0

    // Buscar cada ingrediente en el nombre
    for (const [key, value] of Object.entries(ingredientesDB)) {
      if (nombre.includes(key)) {
        // Evitar duplicados
        const palabraBase = value.nombre.toLowerCase().split(' ')[0]
        const yaExiste = ingredientesDetectados.some(i => i.toLowerCase().includes(palabraBase))
        if (!yaExiste) {
          ingredientesDetectados.push(`${value.cantidad} de ${value.nombre.toLowerCase()}`)
          tiposDetectados.push(value.tipo)
          caloriasTotal += value.calorias
          proteinaTotal += value.proteina
        }
      }
    }

    // Añadir ingredientes complementarios básicos
    if (ingredientesDetectados.length > 0) {
      // Añadir ajo si hay proteína o vegetal
      if ((tiposDetectados.includes('proteina') || tiposDetectados.includes('pescado') || tiposDetectados.includes('marisco')) && 
          !ingredientesDetectados.some(i => i.includes('ajo'))) {
        ingredientesDetectados.push('2 dientes de ajo picados')
        caloriasTotal += 10
      }
      // Añadir aceite si no hay
      if (!ingredientesDetectados.some(i => i.includes('aceite'))) {
        ingredientesDetectados.push('2 cucharadas de aceite de oliva')
        caloriasTotal += 240
      }
      // Añadir sal y pimienta
      ingredientesDetectados.push('Sal al gusto')
      ingredientesDetectados.push('Pimienta negra al gusto')
      
      // Añadir limón si es pescado/marisco
      if ((tiposDetectados.includes('pescado') || tiposDetectados.includes('marisco')) &&
          !ingredientesDetectados.some(i => i.includes('limón') || i.includes('limon'))) {
        ingredientesDetectados.push('Jugo de 1 limón')
        caloriasTotal += 10
      }
    }

    // Generar pasos de preparación inteligentes
    const pasosPreparacion: string[] = []
    
    if (ingredientesDetectados.length > 0) {
      pasosPreparacion.push('Lava y prepara todos los ingredientes')
      
      // Pasos específicos según el tipo de proteína
      if (tiposDetectados.includes('pescado')) {
        pasosPreparacion.push('Sazona el pescado con sal, pimienta y limón')
        pasosPreparacion.push('Calienta el aceite en una sartén a fuego medio-alto')
        pasosPreparacion.push('Cocina el pescado 3-4 minutos por cada lado hasta que esté dorado')
      } else if (tiposDetectados.includes('marisco')) {
        pasosPreparacion.push('Limpia bien los mariscos')
        pasosPreparacion.push('Calienta el aceite con el ajo hasta que esté fragante')
        pasosPreparacion.push('Añade los mariscos y cocina 3-5 minutos hasta que estén rosados')
      } else if (tiposDetectados.includes('proteina') && nombre.includes('huevo')) {
        pasosPreparacion.push('Bate los huevos con sal y pimienta')
        pasosPreparacion.push('Calienta el aceite o mantequilla en sartén antiadherente')
        if (tiposDetectados.some(t => ingredientesDetectados.some(i => i.includes('jamón') || i.includes('tocino') || i.includes('chorizo')))) {
          pasosPreparacion.push('Cocina primero la carne (jamón/tocino/chorizo) hasta dorar')
        }
        pasosPreparacion.push('Vierte los huevos y cocina revolviendo suavemente')
        if (ingredientesDetectados.some(i => i.includes('queso'))) {
          pasosPreparacion.push('Añade el queso y deja que se derrita')
        }
      } else if (tiposDetectados.includes('proteina')) {
        pasosPreparacion.push('Sazona la proteína con sal, pimienta y especias')
        pasosPreparacion.push('Calienta el aceite en una sartén a fuego medio-alto')
        pasosPreparacion.push('Cocina la proteína hasta que esté bien dorada y cocida por dentro')
      }
      
      // Pasos para vegetales
      if (tiposDetectados.includes('vegetal')) {
        const vegetales = ingredientesDetectados.filter(i => {
          const nombreLower = i.toLowerCase()
          return nombreLower.includes('espárrago') || nombreLower.includes('brócoli') || 
                 nombreLower.includes('espinaca') || nombreLower.includes('pimiento') ||
                 nombreLower.includes('calabacín') || nombreLower.includes('champiñon') ||
                 nombreLower.includes('zanahoria') || nombreLower.includes('cebolla')
        })
        if (vegetales.length > 0) {
          pasosPreparacion.push('Corta los vegetales en trozos uniformes')
          pasosPreparacion.push('Saltea los vegetales en la misma sartén 3-5 minutos hasta que estén tiernos pero crujientes')
        }
      }
      
      // Pasos para carbohidratos
      if (tiposDetectados.includes('carbohidrato')) {
        if (ingredientesDetectados.some(i => i.includes('arroz'))) {
          if (nombre.includes('leche')) {
            // Arroz con leche - reemplazar todo
            ingredientesDetectados.length = 0
            ingredientesDetectados.push('200g de arroz', '1 litro de leche', '150g de azúcar', '1 rama de canela', 'Cáscara de 1 limón', 'Canela en polvo para decorar')
            pasosPreparacion.length = 0
            pasosPreparacion.push('Lava el arroz y escúrrelo')
            pasosPreparacion.push('Hierve la leche con la canela y cáscara de limón')
            pasosPreparacion.push('Añade el arroz y cocina a fuego bajo 35-40 minutos revolviendo frecuentemente')
            pasosPreparacion.push('Agrega el azúcar y mezcla bien')
            pasosPreparacion.push('Retira la canela y cáscara, sirve tibio o frío con canela espolvoreada')
            caloriasTotal = 280
            proteinaTotal = 6
          } else {
            pasosPreparacion.push('Cocina el arroz aparte según las instrucciones del paquete')
          }
        }
        if (ingredientesDetectados.some(i => i.includes('pasta') || i.includes('espagueti') || i.includes('fideo'))) {
          pasosPreparacion.push('Cocina la pasta en agua con sal hasta que esté al dente')
        }
        if (ingredientesDetectados.some(i => i.includes('papa'))) {
          pasosPreparacion.push('Corta las papas y cocínalas hasta que estén tiernas')
        }
      }
      
      // Paso final
      if (!nombre.includes('leche') || !nombre.includes('arroz')) {
        pasosPreparacion.push('Combina todos los ingredientes, rectifica la sazón')
        pasosPreparacion.push('Sirve caliente y disfruta')
      }
    }

    // Si no se detectaron ingredientes
    if (ingredientesDetectados.length === 0) {
      ingredientesDetectados.push(
        'Ingredientes principales según tu receta',
        '2 cucharadas de aceite',
        'Sal y pimienta al gusto',
        'Condimentos de tu preferencia'
      )
      pasosPreparacion.push(
        'Prepara todos los ingredientes',
        'Cocina según el método que prefieras',
        'Sazona al gusto',
        'Sirve y disfruta'
      )
      caloriasTotal = 300
      proteinaTotal = 15
    }

    // Calcular tiempo
    let tiempo = 15
    if (tiposDetectados.includes('pescado') || tiposDetectados.includes('marisco')) tiempo = 20
    if (tiposDetectados.includes('proteina')) tiempo = 25
    if (ingredientesDetectados.some(i => i.includes('arroz')) && !nombre.includes('leche')) tiempo = 30
    if (nombre.includes('arroz') && nombre.includes('leche')) tiempo = 45
    if (nombre.includes('horno') || nombre.includes('horneado') || nombre.includes('asado')) tiempo = 40

    setNuevaReceta({
      ...nuevaReceta,
      ingredientes: ingredientesDetectados,
      preparacion: pasosPreparacion,
      tiempo: tiempo,
      calorias: Math.round(caloriasTotal),
      proteina: Math.round(proteinaTotal),
      porciones: 2
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

