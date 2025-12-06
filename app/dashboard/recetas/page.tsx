'use client'

import { useState } from 'react'
import { ChefHat, Clock, Flame, Users, Search, Plus, ArrowRight, X, Check, Dumbbell, ShoppingCart, Sparkles, Crown, Lock, Trash2, AlertCircle } from 'lucide-react'

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
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  
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
      preparacion: ['Precalienta el horno a 180Â°C', 'Coloca el salmón y vegetales en bandeja', 'Rocía con aceite y especias', 'Hornea por 25 minutos'],
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

  const mostrarAlerta = (mensaje: string) => {
    setAlertMessage(mensaje)
    setShowAlert(true)
  }

  const guardarReceta = () => {
    if (!nuevaReceta.nombre.trim()) {
      mostrarAlerta('Por favor ingresa el nombre de la receta')
      return
    }
    if (nuevaReceta.ingredientes.filter(i => i.trim()).length === 0) {
      mostrarAlerta('Por favor agrega al menos un ingrediente')
      return
    }
    if (nuevaReceta.preparacion.filter(p => p.trim()).length === 0) {
      mostrarAlerta('Por favor agrega al menos un paso de preparación')
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
      mostrarAlerta('Por favor escribe el nombre de la receta primero')
      return
    }

    setGenerandoRecetaIA(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const nombre = nuevaReceta.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
    
    // =====================================================
    // BASE DE DATOS DE RECETAS COMPLETAS PREDEFINIDAS
    // =====================================================
    type RecetaDB = {
      keywords: string[]
      ingredientes: string[]
      preparacion: string[]
      tiempo: number
      calorias: number
      proteina: number
      porciones: number
    }

    const recetasDB: RecetaDB[] = [
      // ============ BOWLS Y DESAYUNOS DULCES ============
      {
        keywords: ['bowl', 'frutos rojos', 'yogurt', 'yogur', 'yogurth', 'berries'],
        ingredientes: ['200g de yogurt natural o griego', '80g de fresas frescas', '60g de arándanos', '50g de frambuesas', '50g de moras', '40g de granola', '1 cucharada de miel', '10g de semillas de chía'],
        preparacion: ['Lava todas las frutas frescas', 'Corta las fresas en mitades o cuartos', 'Coloca el yogurt como base en un bowl', 'Distribuye las frutas de forma decorativa', 'Añade la granola crujiente', 'Rocía con miel al gusto', 'Espolvorea las semillas de chía', 'Sirve inmediatamente'],
        tiempo: 10, calorias: 380, proteina: 18, porciones: 1
      },
      {
        keywords: ['avena', 'frutas', 'desayuno'],
        ingredientes: ['80g de avena', '250ml de leche', '1 plátano maduro', '50g de fresas', '30g de arándanos', '1 cucharada de miel', '1 pizca de canela', '20g de nueces picadas'],
        preparacion: ['Calienta la leche en una olla', 'Añade la avena y cocina 5-7 minutos revolviendo', 'Agrega la canela mientras cocina', 'Sirve en un bowl', 'Corta el plátano en rodajas y las fresas', 'Decora con las frutas y nueces', 'Rocía con miel', 'Sirve caliente'],
        tiempo: 15, calorias: 450, proteina: 15, porciones: 1
      },
      {
        keywords: ['hotcakes', 'pancakes', 'panqueques', 'hot cakes'],
        ingredientes: ['200g de harina', '2 huevos', '250ml de leche', '30g de mantequilla derretida', '2 cucharadas de azúcar', '1 cucharadita de polvo para hornear', '1 pizca de sal', 'Miel o maple para servir', 'Frutas frescas al gusto'],
        preparacion: ['Mezcla la harina, azúcar, polvo para hornear y sal', 'En otro bowl bate los huevos con la leche', 'Combina los ingredientes secos con los líquidos', 'Añade la mantequilla derretida y mezcla bien', 'Calienta un sartén antiadherente a fuego medio', 'Vierte porciones de masa y cocina hasta que salgan burbujas', 'Voltea y cocina 1-2 minutos más', 'Sirve con miel y frutas'],
        tiempo: 25, calorias: 520, proteina: 14, porciones: 4
      },
      {
        keywords: ['waffles', 'waffle', 'gofres'],
        ingredientes: ['250g de harina', '2 huevos', '300ml de leche', '60g de mantequilla derretida', '3 cucharadas de azúcar', '2 cucharaditas de polvo para hornear', '1 cucharadita de vainilla', 'Frutas y crema batida para servir'],
        preparacion: ['Precalienta la wafflera', 'Mezcla los ingredientes secos en un bowl', 'Bate los huevos con leche, mantequilla y vainilla', 'Combina todo hasta obtener una masa homogénea', 'Vierte en la wafflera caliente', 'Cocina hasta que estén dorados (3-5 min)', 'Sirve con frutas frescas y crema batida', 'Añade miel o maple al gusto'],
        tiempo: 20, calorias: 480, proteina: 12, porciones: 4
      },
      {
        keywords: ['smoothie', 'batido', 'licuado', 'proteina'],
        ingredientes: ['1 plátano congelado', '150g de fresas', '200ml de leche de almendras', '1 scoop de proteína (opcional)', '1 cucharada de mantequilla de maní', '1 cucharada de miel', 'Hielo al gusto'],
        preparacion: ['Añade el plátano y fresas a la licuadora', 'Agrega la leche de almendras', 'Añade la proteína y mantequilla de maní', 'Agrega el hielo', 'Licúa hasta obtener consistencia suave', 'Prueba y ajusta dulzor con miel', 'Sirve inmediatamente', 'Decora con fruta picada si deseas'],
        tiempo: 5, calorias: 350, proteina: 28, porciones: 1
      },
      {
        keywords: ['acai', 'açaí', 'acai bowl'],
        ingredientes: ['100g de pulpa de açaí congelada', '1 plátano congelado', '100ml de leche de coco', '50g de granola', '30g de coco rallado', '50g de fresas', '30g de arándanos', '1 cucharada de miel'],
        preparacion: ['Licúa el açaí con plátano y leche de coco', 'La mezcla debe quedar espesa como helado', 'Vierte en un bowl', 'Añade la granola en un lado', 'Coloca las frutas de forma decorativa', 'Espolvorea el coco rallado', 'Rocía con miel', 'Sirve inmediatamente'],
        tiempo: 10, calorias: 420, proteina: 8, porciones: 1
      },
      {
        keywords: ['french toast', 'tostadas francesas', 'torrijas'],
        ingredientes: ['4 rebanadas de pan brioche', '2 huevos', '100ml de leche', '1 cucharadita de canela', '1 cucharadita de vainilla', '30g de mantequilla', 'Azúcar glass para decorar', 'Frutas frescas y miel para servir'],
        preparacion: ['Bate los huevos con leche, canela y vainilla', 'Sumerge cada rebanada de pan en la mezcla', 'Deja que absorba bien por ambos lados', 'Calienta la mantequilla en un sartén', 'Cocina el pan 2-3 minutos por lado hasta dorar', 'Espolvorea con azúcar glass', 'Sirve con frutas frescas', 'Añade miel al gusto'],
        tiempo: 15, calorias: 450, proteina: 14, porciones: 2
      },

      // ============ HUEVOS Y DESAYUNOS SALADOS ============
      {
        keywords: ['huevos revueltos', 'huevo revuelto', 'scrambled'],
        ingredientes: ['3 huevos', '30ml de leche', '20g de mantequilla', 'Sal al gusto', 'Pimienta al gusto', 'Cebollín picado para decorar'],
        preparacion: ['Bate los huevos con la leche, sal y pimienta', 'Derrite la mantequilla en sartén a fuego bajo', 'Vierte los huevos batidos', 'Revuelve suavemente con espátula', 'Cocina hasta que estén cremosos (no secos)', 'Retira del fuego cuando aún estén húmedos', 'Decora con cebollín', 'Sirve inmediatamente'],
        tiempo: 8, calorias: 280, proteina: 18, porciones: 1
      },
      {
        keywords: ['huevos estrellados', 'huevo estrellado', 'huevo frito', 'huevos fritos'],
        ingredientes: ['2 huevos', '2 cucharadas de aceite', 'Sal al gusto', 'Pimienta al gusto'],
        preparacion: ['Calienta el aceite en sartén a fuego medio', 'Rompe los huevos con cuidado en el sartén', 'Cocina sin mover hasta que la clara esté blanca', 'Sazona con sal y pimienta', 'Para yema suave: 2-3 minutos', 'Para yema cocida: 4-5 minutos', 'Retira con espátula', 'Sirve inmediatamente'],
        tiempo: 5, calorias: 220, proteina: 12, porciones: 1
      },
      {
        keywords: ['omelette', 'omelet', 'tortilla francesa'],
        ingredientes: ['3 huevos', '50g de jamón picado', '30g de queso rallado', '20g de mantequilla', '1/4 de cebolla picada', 'Sal y pimienta al gusto'],
        preparacion: ['Bate los huevos con sal y pimienta', 'Derrite la mantequilla en sartén antiadherente', 'Saltea la cebolla y jamón brevemente', 'Vierte los huevos y deja que cuajen por debajo', 'Añade el queso en el centro', 'Dobla el omelette por la mitad', 'Cocina 30 segundos más', 'Sirve inmediatamente'],
        tiempo: 10, calorias: 380, proteina: 26, porciones: 1
      },
      {
        keywords: ['huevos benedictinos', 'eggs benedict', 'benedictine'],
        ingredientes: ['2 huevos', '1 muffin inglés', '2 rebanadas de jamón o tocino', '60ml de salsa holandesa', 'Vinagre blanco', 'Cebollín para decorar', 'Sal y pimienta'],
        preparacion: ['Hierve agua con un chorrito de vinagre', 'Crea un remolino y añade los huevos para pochar', 'Cocina 3-4 minutos para yema líquida', 'Tuesta el muffin inglés', 'Calienta el jamón o tocino', 'Coloca jamón sobre cada mitad del muffin', 'Añade el huevo pochado encima', 'Cubre con salsa holandesa y cebollín'],
        tiempo: 20, calorias: 520, proteina: 24, porciones: 1
      },
      {
        keywords: ['chilaquiles', 'chilaquil'],
        ingredientes: ['200g de totopos', '400ml de salsa verde o roja', '100g de pollo deshebrado', '100g de crema', '80g de queso fresco', '1/4 de cebolla en aros', 'Cilantro fresco', '2 huevos estrellados (opcional)'],
        preparacion: ['Calienta la salsa en un sartén amplio', 'Añade los totopos y mezcla bien', 'Cocina 2-3 minutos hasta que absorban salsa', 'Agrega el pollo deshebrado', 'Sirve en plato hondo', 'Decora con crema, queso y cebolla', 'Añade cilantro fresco', 'Acompaña con huevos estrellados'],
        tiempo: 15, calorias: 580, proteina: 32, porciones: 2
      },

      // ============ CARNES Y PROTEÃNAS ============
      {
        keywords: ['pollo', 'pechuga', 'grilled chicken', 'pollo a la plancha'],
        ingredientes: ['2 pechugas de pollo (400g)', '2 cucharadas de aceite de oliva', '2 dientes de ajo picados', '1 cucharadita de paprika', '1 cucharadita de orégano', 'Jugo de 1 limón', 'Sal y pimienta al gusto'],
        preparacion: ['Aplana las pechugas para grosor uniforme', 'Mezcla aceite, ajo, paprika, orégano y limón', 'Marina el pollo mínimo 30 minutos', 'Calienta un sartén o grill a fuego alto', 'Cocina 6-7 minutos por lado', 'Verifica que esté bien cocido por dentro', 'Deja reposar 5 minutos antes de cortar', 'Sirve con ensalada o vegetales'],
        tiempo: 25, calorias: 350, proteina: 52, porciones: 2
      },
      {
        keywords: ['bistec', 'steak', 'carne asada', 'res'],
        ingredientes: ['400g de bistec de res', '2 cucharadas de aceite', '3 dientes de ajo', '1 rama de romero', '30g de mantequilla', 'Sal gruesa', 'Pimienta negra molida'],
        preparacion: ['Saca la carne del refrigerador 30 min antes', 'Sazona generosamente con sal y pimienta', 'Calienta el sartén a fuego muy alto', 'Añade aceite y coloca el bistec', 'Cocina 3-4 min por lado (término medio)', 'Añade mantequilla, ajo y romero al final', 'Baña la carne con la mantequilla derretida', 'Deja reposar 5 minutos antes de servir'],
        tiempo: 20, calorias: 480, proteina: 45, porciones: 2
      },
      {
        keywords: ['tacos', 'taco', 'carne'],
        ingredientes: ['300g de carne para tacos', '8 tortillas de maíz', '1 cebolla picada', '1 manojo de cilantro', '2 limones', 'Salsa verde y roja', 'Sal al gusto'],
        preparacion: ['Sazona la carne con sal', 'Cocina en sartén caliente hasta dorar', 'Pica finamente la cebolla y cilantro', 'Calienta las tortillas en comal', 'Arma los tacos con carne', 'Añade cebolla y cilantro', 'Exprime limón al gusto', 'Acompaña con salsas'],
        tiempo: 20, calorias: 450, proteina: 35, porciones: 2
      },
      {
        keywords: ['hamburguesa', 'burger', 'hamburgesa'],
        ingredientes: ['400g de carne molida de res', '2 panes para hamburguesa', '2 rebanadas de queso americano', '4 hojas de lechuga', '4 rodajas de tomate', '1/2 cebolla en aros', 'Ketchup y mostaza', 'Sal y pimienta'],
        preparacion: ['Forma 2 tortitas con la carne, sazona', 'Calienta sartén o grill a fuego alto', 'Cocina las tortitas 4-5 min por lado', 'Añade el queso al final para que se derrita', 'Tuesta los panes ligeramente', 'Arma: pan, lechuga, carne con queso, tomate', 'Añade cebolla y salsas al gusto', 'Tapa con el pan superior'],
        tiempo: 20, calorias: 650, proteina: 42, porciones: 2
      },
      {
        keywords: ['albondigas', 'albondiga', 'meatballs'],
        ingredientes: ['500g de carne molida mixta', '1/2 taza de pan molido', '1 huevo', '1/4 de cebolla picada finamente', '2 dientes de ajo picados', '500ml de salsa de tomate', 'Orégano, sal y pimienta', 'Perejil para decorar'],
        preparacion: ['Mezcla carne, pan molido, huevo, cebolla, ajo y especias', 'Forma bolitas del tamaño deseado', 'Fríe las albóndigas hasta dorar por fuera', 'Calienta la salsa de tomate', 'Añade las albóndigas a la salsa', 'Cocina a fuego bajo 20 minutos', 'Verifica que estén cocidas por dentro', 'Sirve con arroz o pasta'],
        tiempo: 40, calorias: 520, proteina: 38, porciones: 4
      },

      // ============ PESCADOS Y MARISCOS ============
      {
        keywords: ['salmon', 'salmón'],
        ingredientes: ['2 filetes de salmón (400g)', '2 cucharadas de aceite de oliva', '2 dientes de ajo picados', 'Jugo de 1 limón', '1 cucharadita de eneldo', 'Sal y pimienta al gusto', 'Rodajas de limón para decorar'],
        preparacion: ['Precalienta el horno a 200Â°C', 'Sazona el salmón con sal, pimienta y eneldo', 'Coloca en bandeja con aceite de oliva', 'Añade el ajo picado encima', 'Exprime el jugo de limón', 'Hornea 12-15 minutos', 'El salmón debe estar rosado por dentro', 'Sirve con rodajas de limón'],
        tiempo: 20, calorias: 420, proteina: 46, porciones: 2
      },
      {
        keywords: ['salmon con esparrago', 'salmon esparrago', 'salmón con espárragos', 'salmon y esparragos'],
        ingredientes: ['2 filetes de salmón (400g)', '1 manojo de espárragos (250g)', '3 cucharadas de aceite de oliva', '3 dientes de ajo picados', 'Jugo de 1 limón', 'Sal y pimienta', 'Eneldo fresco'],
        preparacion: ['Precalienta el horno a 200Â°C', 'Corta los extremos duros de los espárragos', 'Coloca salmón y espárragos en bandeja', 'Rocía con aceite de oliva', 'Sazona con sal, pimienta y ajo', 'Exprime limón sobre todo', 'Hornea 15-18 minutos', 'Decora con eneldo y sirve'],
        tiempo: 25, calorias: 480, proteina: 48, porciones: 2
      },
      {
        keywords: ['camarones', 'camaron', 'gambas', 'shrimp'],
        ingredientes: ['400g de camarones limpios', '4 cucharadas de mantequilla', '4 dientes de ajo picados', '1/4 taza de vino blanco', 'Jugo de 1 limón', 'Perejil fresco picado', 'Sal y pimienta', 'Hojuelas de chile (opcional)'],
        preparacion: ['Limpia y desena los camarones', 'Derrite la mantequilla a fuego medio', 'Saltea el ajo hasta que esté fragante', 'Añade los camarones en una sola capa', 'Cocina 2 minutos, voltea', 'Agrega vino y limón', 'Cocina 2-3 minutos más hasta que estén rosados', 'Sirve con perejil encima'],
        tiempo: 15, calorias: 320, proteina: 42, porciones: 2
      },
      {
        keywords: ['ceviche', 'cebiche'],
        ingredientes: ['500g de pescado blanco fresco', '1 taza de jugo de limón', '1/2 cebolla morada en juliana', '2 tomates picados', '1 pepino picado', '1 chile serrano picado', 'Cilantro fresco', 'Sal y pimienta', 'Aguacate para servir'],
        preparacion: ['Corta el pescado en cubos pequeños', 'Coloca en bowl y cubre con jugo de limón', 'Refrigera 30-45 minutos hasta que esté "cocido"', 'Escurre el exceso de limón', 'Mezcla con cebolla, tomate, pepino y chile', 'Añade cilantro picado', 'Sazona con sal y pimienta', 'Sirve con aguacate y tostadas'],
        tiempo: 45, calorias: 250, proteina: 35, porciones: 4
      },
      {
        keywords: ['atun', 'atún', 'tuna'],
        ingredientes: ['2 filetes de atún (300g)', '2 cucharadas de aceite de sésamo', '2 cucharadas de salsa de soya', '1 cucharada de miel', 'Semillas de sésamo', 'Jengibre rallado', 'Cebollín picado'],
        preparacion: ['Mezcla soya, miel, sésamo y jengibre', 'Marina el atún 15 minutos', 'Calienta sartén a fuego muy alto', 'Sella el atún 1-2 min por lado (sellado)', 'El centro debe quedar rosado', 'Corta en rebanadas', 'Espolvorea semillas de sésamo', 'Decora con cebollín'],
        tiempo: 20, calorias: 350, proteina: 45, porciones: 2
      },
      {
        keywords: ['pescado empanizado', 'pescado frito', 'fish and chips'],
        ingredientes: ['4 filetes de pescado blanco', '1 taza de harina', '2 huevos batidos', '1.5 tazas de pan molido', 'Aceite para freír', 'Sal y pimienta', 'Limones para servir', 'Salsa tártara'],
        preparacion: ['Sazona el pescado con sal y pimienta', 'Prepara 3 platos: harina, huevo, pan molido', 'Pasa cada filete por harina, huevo y pan molido', 'Calienta abundante aceite a 180Â°C', 'Fríe el pescado 3-4 minutos por lado', 'Escurre en papel absorbente', 'Sirve con limón', 'Acompaña con salsa tártara'],
        tiempo: 25, calorias: 450, proteina: 38, porciones: 4
      },

      // ============ PASTAS ============
      {
        keywords: ['pasta', 'espagueti', 'spaghetti', 'carbonara'],
        ingredientes: ['400g de espagueti', '200g de tocino o panceta', '4 yemas de huevo', '100g de queso parmesano rallado', '2 dientes de ajo', 'Pimienta negra', 'Sal para el agua'],
        preparacion: ['Hierve agua con sal y cocina la pasta al dente', 'Corta el tocino en cubos y fríe hasta crujiente', 'Mezcla yemas con parmesano y pimienta', 'Reserva 1 taza del agua de cocción', 'Escurre la pasta y añade al sartén con tocino', 'Retira del fuego y añade la mezcla de huevo', 'Mezcla rápidamente añadiendo agua si necesita', 'Sirve con más parmesano y pimienta'],
        tiempo: 25, calorias: 680, proteina: 28, porciones: 4
      },
      {
        keywords: ['lasana', 'lasagna', 'lasaña'],
        ingredientes: ['12 láminas de lasaña', '500g de carne molida', '700ml de salsa de tomate', '500ml de bechamel', '200g de queso mozzarella', '1 cebolla picada', '3 dientes de ajo', 'Orégano, sal y pimienta'],
        preparacion: ['Sofríe cebolla y ajo, añade carne hasta dorar', 'Agrega salsa de tomate y cocina 15 min', 'Prepara la bechamel', 'En refractario: salsa, pasta, carne, bechamel', 'Repite las capas 3 veces', 'Termina con bechamel y mozzarella', 'Hornea a 180Â°C por 35-40 minutos', 'Deja reposar 10 min antes de servir'],
        tiempo: 60, calorias: 720, proteina: 38, porciones: 6
      },
      {
        keywords: ['alfredo', 'fettuccine', 'pasta blanca'],
        ingredientes: ['400g de fettuccine', '300ml de crema para batir', '100g de mantequilla', '150g de queso parmesano', '2 dientes de ajo', 'Sal, pimienta y nuez moscada', 'Perejil para decorar'],
        preparacion: ['Cocina la pasta al dente en agua con sal', 'Derrite mantequilla con ajo a fuego bajo', 'Añade la crema y calienta sin hervir', 'Incorpora el parmesano poco a poco', 'Sazona con sal, pimienta y nuez moscada', 'Añade la pasta escurrida a la salsa', 'Mezcla bien hasta cubrir toda la pasta', 'Sirve con perejil y más parmesano'],
        tiempo: 25, calorias: 750, proteina: 22, porciones: 4
      },
      {
        keywords: ['bolognesa', 'boloñesa', 'ragu'],
        ingredientes: ['400g de espagueti', '400g de carne molida', '1 cebolla picada', '2 zanahorias ralladas', '2 tallos de apio picados', '400ml de salsa de tomate', '100ml de vino tinto', 'Ajo, orégano, sal y pimienta'],
        preparacion: ['Sofríe cebolla, zanahoria y apio 5 min', 'Añade la carne y cocina hasta dorar', 'Agrega el ajo y el vino, deja reducir', 'Incorpora la salsa de tomate', 'Sazona y cocina a fuego bajo 30 min', 'Cocina la pasta al dente', 'Sirve la pasta con la salsa encima', 'Añade parmesano rallado'],
        tiempo: 45, calorias: 620, proteina: 32, porciones: 4
      },

      // ============ ARROZ ============
      {
        keywords: ['arroz con leche', 'arroz dulce'],
        ingredientes: ['200g de arroz', '1 litro de leche entera', '150g de azúcar', '1 rama de canela', 'Cáscara de 1 limón', '1 pizca de sal', 'Canela en polvo para decorar', 'Pasas (opcional)'],
        preparacion: ['Lava el arroz y escúrrelo', 'Hierve la leche con canela y cáscara de limón', 'Añade el arroz y la pizca de sal', 'Cocina a fuego bajo 35-40 minutos', 'Revuelve frecuentemente para evitar que se pegue', 'Agrega el azúcar y las pasas', 'Retira canela y cáscara de limón', 'Sirve tibio o frío con canela espolvoreada'],
        tiempo: 50, calorias: 320, proteina: 8, porciones: 6
      },
      {
        keywords: ['arroz blanco', 'arroz'],
        ingredientes: ['2 tazas de arroz', '4 tazas de agua', '2 cucharadas de aceite', '1/4 de cebolla', '2 dientes de ajo', '1 cucharadita de sal'],
        preparacion: ['Lava el arroz hasta que el agua salga clara', 'Calienta aceite y sofríe cebolla y ajo', 'Añade el arroz y fríe 2 minutos', 'Agrega el agua caliente y sal', 'Cuando hierva, baja el fuego al mínimo', 'Tapa y cocina 18-20 minutos', 'Deja reposar 5 minutos tapado', 'Esponja con tenedor y sirve'],
        tiempo: 25, calorias: 200, proteina: 4, porciones: 4
      },
      {
        keywords: ['arroz con pollo', 'arroz pollo'],
        ingredientes: ['2 tazas de arroz', '400g de pollo en piezas', '4 tazas de caldo de pollo', '1 cebolla', '3 dientes de ajo', '1 pimiento', '100g de chícharos', 'Comino, sal y pimienta'],
        preparacion: ['Dora las piezas de pollo, reserva', 'Sofríe cebolla, ajo y pimiento', 'Añade el arroz y sofríe 2 min', 'Agrega el caldo caliente y especias', 'Coloca el pollo encima', 'Tapa y cocina a fuego bajo 20 min', 'Añade los chícharos los últimos 5 min', 'Deja reposar y sirve'],
        tiempo: 40, calorias: 480, proteina: 35, porciones: 4
      },
      {
        keywords: ['paella', 'arroz con mariscos'],
        ingredientes: ['300g de arroz para paella', '200g de camarones', '200g de mejillones', '150g de calamares', '1 pimiento rojo', '1 cebolla', '3 dientes de ajo', '1 litro de caldo de pescado', 'Azafrán, pimentón, sal'],
        preparacion: ['Sofríe cebolla, ajo y pimiento en paellera', 'Añade calamares y cocina 3 min', 'Agrega pimentón y arroz, sofríe', 'Vierte el caldo caliente con azafrán', 'Distribuye uniformemente sin revolver', 'Cocina 10 min a fuego alto', 'Añade camarones y mejillones', 'Baja el fuego y cocina 10 min más'],
        tiempo: 45, calorias: 520, proteina: 38, porciones: 4
      },

      // ============ SOPAS Y CALDOS ============
      {
        keywords: ['sopa', 'caldo de pollo', 'consome'],
        ingredientes: ['1 pollo entero o 6 piezas', '3 litros de agua', '2 zanahorias', '2 papas', '1 calabaza', '1/4 de col', '1 cebolla', 'Cilantro, sal y pimienta', 'Arroz o fideos (opcional)'],
        preparacion: ['Hierve el pollo en agua con cebolla y sal', 'Retira la espuma que se forme', 'Cocina 40 min hasta que el pollo esté suave', 'Retira el pollo y deshebra', 'Añade las verduras cortadas al caldo', 'Cocina hasta que estén suaves', 'Regresa el pollo deshebrado', 'Sirve con cilantro, limón y chile'],
        tiempo: 60, calorias: 320, proteina: 35, porciones: 6
      },
      {
        keywords: ['crema', 'sopa crema', 'cream soup'],
        ingredientes: ['500g de verdura principal (brócoli/champiñones/espinaca)', '1 cebolla', '2 dientes de ajo', '500ml de caldo de pollo', '200ml de crema', '30g de mantequilla', 'Sal, pimienta, nuez moscada'],
        preparacion: ['Sofríe cebolla y ajo en mantequilla', 'Añade la verdura principal y saltea', 'Agrega el caldo y cocina 15 min', 'Licúa hasta obtener textura suave', 'Regresa a la olla y añade la crema', 'Calienta sin hervir', 'Sazona con sal, pimienta y nuez moscada', 'Sirve con crema y crutones'],
        tiempo: 30, calorias: 280, proteina: 10, porciones: 4
      },

      // ============ ENSALADAS ============
      {
        keywords: ['ensalada', 'salad', 'cesar', 'caesar'],
        ingredientes: ['1 lechuga romana', '100g de crutones', '50g de queso parmesano', '200g de pechuga de pollo', 'Aderezo césar', 'Jugo de limón', 'Sal y pimienta'],
        preparacion: ['Cocina y corta el pollo en tiras', 'Lava y corta la lechuga en trozos', 'Coloca la lechuga en un bowl grande', 'Añade los crutones', 'Agrega el pollo en tiras', 'Vierte el aderezo césar', 'Espolvorea el parmesano rallado', 'Mezcla y sirve inmediatamente'],
        tiempo: 20, calorias: 380, proteina: 32, porciones: 2
      },
      {
        keywords: ['guacamole', 'guac'],
        ingredientes: ['3 aguacates maduros', '1/2 cebolla picada finamente', '2 tomates picados', '1 chile serrano picado', 'Jugo de 2 limones', 'Cilantro fresco picado', 'Sal al gusto'],
        preparacion: ['Corta los aguacates y extrae la pulpa', 'Machaca con tenedor dejando algunos trozos', 'Añade la cebolla y tomate', 'Agrega el chile picado', 'Exprime el jugo de limón', 'Mezcla con cilantro', 'Sazona con sal', 'Sirve con totopos'],
        tiempo: 10, calorias: 240, proteina: 3, porciones: 4
      },

      // ============ POSTRES ============
      {
        keywords: ['flan', 'flan de huevo', 'flan casero'],
        ingredientes: ['6 huevos', '1 lata de leche condensada', '1 lata de leche evaporada', '1 cucharadita de vainilla', '1 taza de azúcar para caramelo', '1/4 taza de agua'],
        preparacion: ['Prepara el caramelo: derrite azúcar con agua', 'Vierte en el molde y distribuye', 'Licúa huevos, leches y vainilla', 'Cuela la mezcla', 'Vierte sobre el caramelo', 'Hornea a baño maría a 180Â°C por 1 hora', 'Deja enfriar completamente', 'Refrigera y desmolda para servir'],
        tiempo: 90, calorias: 280, proteina: 8, porciones: 8
      },
      {
        keywords: ['brownie', 'brownies'],
        ingredientes: ['200g de chocolate oscuro', '150g de mantequilla', '3 huevos', '200g de azúcar', '100g de harina', '1 cucharadita de vainilla', '1 pizca de sal', 'Nueces picadas (opcional)'],
        preparacion: ['Derrite chocolate con mantequilla a baño maría', 'Bate huevos con azúcar hasta esponjar', 'Incorpora el chocolate derretido', 'Añade harina cernida, vainilla y sal', 'Agrega las nueces si deseas', 'Vierte en molde engrasado', 'Hornea a 180Â°C por 25-30 minutos', 'Deja enfriar antes de cortar'],
        tiempo: 45, calorias: 320, proteina: 5, porciones: 12
      },
      {
        keywords: ['pastel', 'cake', 'bizcocho', 'torta'],
        ingredientes: ['250g de harina', '200g de azúcar', '4 huevos', '125g de mantequilla', '200ml de leche', '1 sobre de polvo para hornear', '1 cucharadita de vainilla', 'Betún o frosting al gusto'],
        preparacion: ['Precalienta el horno a 180Â°C', 'Bate mantequilla con azúcar hasta cremosa', 'Añade los huevos uno a uno', 'Incorpora vainilla', 'Mezcla harina con polvo para hornear', 'Alterna harina y leche a la mezcla', 'Vierte en molde engrasado y enharinado', 'Hornea 35-40 min, decora al enfriar'],
        tiempo: 60, calorias: 350, proteina: 6, porciones: 12
      },
      {
        keywords: ['gelatina', 'jello'],
        ingredientes: ['2 sobres de gelatina sin sabor', '1/2 taza de agua fría', '2 tazas de jugo o leche caliente', '1/2 taza de azúcar', 'Frutas picadas (opcional)', 'Crema batida para servir'],
        preparacion: ['Hidrata la gelatina en agua fría 5 min', 'Calienta el jugo o leche con azúcar', 'Añade la gelatina hidratada y mezcla', 'Revuelve hasta disolver completamente', 'Si deseas, añade frutas al molde', 'Vierte la mezcla en el molde', 'Refrigera 4 horas mínimo', 'Desmolda y sirve con crema'],
        tiempo: 20, calorias: 120, proteina: 4, porciones: 6
      },

      // ============ COMIDA MEXICANA ============
      {
        keywords: ['enchiladas', 'enchilada'],
        ingredientes: ['12 tortillas de maíz', '500g de pollo deshebrado', '500ml de salsa roja o verde', '200g de crema', '150g de queso fresco', '1 cebolla en aros', 'Aceite para freír'],
        preparacion: ['Pasa las tortillas por aceite caliente', 'Rellena cada tortilla con pollo', 'Enrolla y coloca en refractario', 'Baña con la salsa caliente', 'Añade crema y queso encima', 'Hornea 10 min a 180°C', 'Decora con cebolla', 'Sirve caliente'],
        tiempo: 35, calorias: 520, proteina: 35, porciones: 4
      },
      {
        keywords: ['pozole', 'posole'],
        ingredientes: ['500g de maíz pozolero', '500g de carne de cerdo', '3 chiles guajillo', '2 chiles ancho', '1 cebolla', '4 dientes de ajo', 'Orégano, lechuga, rábanos, tostadas'],
        preparacion: ['Cuece el maíz hasta que reviente', 'Cuece la carne en trozos', 'Licua los chiles con ajo y cebolla', 'Fríe la salsa y añade al caldo', 'Agrega el maíz y carne', 'Cocina 30 min más', 'Sirve con lechuga, rábanos, orégano', 'Acompaña con tostadas'],
        tiempo: 120, calorias: 450, proteina: 30, porciones: 8
      },
      {
        keywords: ['tamales', 'tamal'],
        ingredientes: ['1kg de masa de maíz', '300g de manteca', '500g de carne de cerdo', '500ml de salsa roja o verde', 'Hojas de maíz', 'Caldo de pollo', 'Sal y polvo para hornear'],
        preparacion: ['Bate la manteca hasta esponjar', 'Agrega la masa poco a poco', 'Añade caldo, sal y polvo para hornear', 'Unta masa en hojas de maíz', 'Rellena con carne y salsa', 'Envuelve y cierra', 'Cocina al vapor 1.5 horas', 'Sirve calientes'],
        tiempo: 120, calorias: 350, proteina: 15, porciones: 20
      },
      {
        keywords: ['quesadilla', 'quesadillas'],
        ingredientes: ['4 tortillas de harina grandes', '200g de queso Oaxaca', '100g de champiñones', '1 chile poblano', 'Crema y guacamole para servir'],
        preparacion: ['Asa el chile y córtalo en rajas', 'Saltea los champiñones', 'Calienta tortilla en comal', 'Añade queso, rajas y champiñones', 'Dobla por la mitad', 'Cocina hasta que el queso derrita', 'Sirve con crema y guacamole', 'Corta en triángulos'],
        tiempo: 15, calorias: 380, proteina: 18, porciones: 2
      },
      {
        keywords: ['burrito', 'burritos'],
        ingredientes: ['4 tortillas de harina grandes', '300g de carne asada', '200g de frijoles refritos', '150g de arroz', '100g de queso', 'Crema, guacamole, pico de gallo'],
        preparacion: ['Calienta la tortilla', 'Unta frijoles en el centro', 'Añade arroz, carne, queso', 'Agrega crema, guacamole, pico de gallo', 'Dobla los lados hacia adentro', 'Enrolla apretando bien', 'Puedes dorar en plancha', 'Sirve entero o en mitades'],
        tiempo: 20, calorias: 650, proteina: 40, porciones: 4
      },
      {
        keywords: ['tostadas', 'tostada'],
        ingredientes: ['8 tostadas de maíz', '400g de pollo deshebrado', '200g de frijoles refritos', 'Lechuga picada', 'Crema, queso fresco', 'Salsa verde o roja'],
        preparacion: ['Unta frijoles en cada tostada', 'Añade el pollo deshebrado', 'Agrega lechuga picada', 'Añade crema y queso', 'Rocía con salsa al gusto', 'Sirve inmediatamente', 'Puedes añadir aguacate', 'Decora con rábanos'],
        tiempo: 15, calorias: 320, proteina: 25, porciones: 4
      },
      {
        keywords: ['sopes', 'sope'],
        ingredientes: ['500g de masa de maíz', '300g de carne deshebrada', '200g de frijoles refritos', 'Lechuga, crema, queso', 'Salsa verde o roja', 'Aceite para freír'],
        preparacion: ['Forma discos gruesos con la masa', 'Cuece en comal por ambos lados', 'Pellizca las orillas para formar borde', 'Fríe ligeramente en aceite', 'Unta frijoles', 'Añade carne, lechuga, crema', 'Agrega queso y salsa', 'Sirve calientes'],
        tiempo: 30, calorias: 380, proteina: 22, porciones: 6
      },
      {
        keywords: ['gorditas', 'gordita'],
        ingredientes: ['500g de masa de maíz', '300g de chicharrón prensado', '200g de frijoles', 'Queso fresco', 'Crema y salsa', 'Sal al gusto'],
        preparacion: ['Mezcla la masa con sal', 'Forma bolas y aplana', 'Cuece en comal por ambos lados', 'Abre por la mitad como pan', 'Rellena con chicharrón y frijoles', 'Añade queso y crema', 'Agrega salsa al gusto', 'Sirve calientes'],
        tiempo: 25, calorias: 420, proteina: 18, porciones: 6
      },
      {
        keywords: ['flautas', 'flauta', 'tacos dorados'],
        ingredientes: ['12 tortillas de maíz', '400g de pollo deshebrado', 'Aceite para freír', 'Lechuga, crema, queso', 'Salsa verde', 'Palillos de dientes'],
        preparacion: ['Rellena tortillas con pollo', 'Enrolla apretado y asegura con palillo', 'Fríe en aceite caliente hasta dorar', 'Escurre en papel absorbente', 'Coloca en plato', 'Cubre con crema y queso', 'Añade lechuga y salsa', 'Sirve calientes'],
        tiempo: 25, calorias: 450, proteina: 28, porciones: 4
      },
      {
        keywords: ['molletes', 'mollete'],
        ingredientes: ['4 bolillos', '200g de frijoles refritos', '200g de queso manchego rallado', 'Pico de gallo', 'Jalapeños en escabeche'],
        preparacion: ['Corta bolillos a la mitad', 'Unta frijoles generosamente', 'Cubre con queso rallado', 'Hornea hasta gratinar', 'Añade pico de gallo encima', 'Acompaña con jalapeños', 'Sirve calientes', 'Puedes añadir chorizo'],
        tiempo: 15, calorias: 380, proteina: 18, porciones: 4
      },
      {
        keywords: ['huevos rancheros'],
        ingredientes: ['4 huevos', '4 tortillas de maíz', '300ml de salsa ranchera', '100g de frijoles refritos', 'Queso fresco', 'Aguacate'],
        preparacion: ['Calienta las tortillas', 'Fríe los huevos estrellados', 'Calienta la salsa', 'Coloca tortilla, frijoles, huevo', 'Baña con salsa ranchera', 'Añade queso y aguacate', 'Sirve inmediatamente', 'Acompaña con más tortillas'],
        tiempo: 15, calorias: 420, proteina: 22, porciones: 2
      },
      {
        keywords: ['huevos divorciados'],
        ingredientes: ['4 huevos', '4 tortillas', '200ml de salsa verde', '200ml de salsa roja', 'Frijoles refritos', 'Queso y crema'],
        preparacion: ['Fríe los huevos estrellados', 'Calienta ambas salsas por separado', 'Coloca 2 huevos por plato', 'Baña uno con salsa verde', 'Baña otro con salsa roja', 'Separa con frijoles en medio', 'Añade queso y crema', 'Sirve con tortillas'],
        tiempo: 15, calorias: 450, proteina: 24, porciones: 2
      },
      {
        keywords: ['migas', 'migas con huevo'],
        ingredientes: ['4 huevos', '4 tortillas en trozos', '1 tomate picado', '1/4 cebolla picada', '1 chile serrano', 'Aceite, sal, cilantro'],
        preparacion: ['Fríe los trozos de tortilla', 'Añade cebolla y chile', 'Agrega tomate y saltea', 'Bate los huevos con sal', 'Vierte sobre la mezcla', 'Revuelve hasta cocinar', 'Añade cilantro fresco', 'Sirve con salsa'],
        tiempo: 15, calorias: 380, proteina: 18, porciones: 2
      },
      {
        keywords: ['machaca', 'machaca con huevo'],
        ingredientes: ['200g de carne seca machaca', '4 huevos', '1 tomate', '1/4 cebolla', '1 chile serrano', 'Aceite, tortillas de harina'],
        preparacion: ['Deshebra la machaca', 'Saltea cebolla, chile y tomate', 'Añade la machaca', 'Bate los huevos', 'Agrega a la sartén', 'Revuelve hasta cocinar', 'Sirve con tortillas de harina', 'Acompaña con salsa'],
        tiempo: 20, calorias: 420, proteina: 35, porciones: 2
      },
      {
        keywords: ['cochinita pibil', 'cochinita'],
        ingredientes: ['1kg de carne de cerdo', '200g de achiote', 'Jugo de 4 naranjas agrias', '1/2 taza de vinagre', 'Hojas de plátano', 'Cebolla morada encurtida'],
        preparacion: ['Licua achiote con jugo y vinagre', 'Marina la carne toda la noche', 'Envuelve en hojas de plátano', 'Hornea a 160°C por 3 horas', 'Deshebra la carne', 'Sirve en tortillas', 'Añade cebolla encurtida', 'Acompaña con habanero'],
        tiempo: 200, calorias: 450, proteina: 40, porciones: 8
      },
      {
        keywords: ['carnitas'],
        ingredientes: ['1kg de carne de cerdo', '1 naranja', '500ml de aceite o manteca', 'Leche evaporada', 'Sal, pimienta, comino', 'Tortillas, cilantro, cebolla'],
        preparacion: ['Corta carne en cubos grandes', 'Fríe en manteca o aceite', 'Añade jugo de naranja y leche', 'Cocina hasta dorar', 'El líquido debe evaporarse', 'Desmenuza la carne', 'Sirve en tortillas', 'Añade cilantro, cebolla, salsa'],
        tiempo: 90, calorias: 520, proteina: 42, porciones: 6
      },
      {
        keywords: ['birria', 'birria de res'],
        ingredientes: ['1kg de carne de res', '5 chiles guajillo', '3 chiles ancho', '1 cebolla', '6 dientes de ajo', 'Especias: comino, orégano, clavo', 'Tortillas para tacos'],
        preparacion: ['Cuece la carne hasta suavizar', 'Licua chiles con especias', 'Mezcla con el caldo', 'Cocina la carne en la salsa', 'Deja reducir el consomé', 'Deshebra la carne', 'Sirve tacos con consomé aparte', 'Sumerge el taco y come'],
        tiempo: 180, calorias: 480, proteina: 45, porciones: 8
      },
      {
        keywords: ['mole', 'mole poblano'],
        ingredientes: ['1kg de pollo en piezas', 'Pasta de mole 250g', '50g de chocolate', '2 cucharadas de ajonjolí', 'Arroz rojo para acompañar', 'Tortillas'],
        preparacion: ['Cuece el pollo con sal', 'Disuelve el mole en caldo', 'Añade el chocolate', 'Cocina 20 min a fuego bajo', 'Baña el pollo con el mole', 'Espolvorea ajonjolí', 'Sirve con arroz rojo', 'Acompaña con tortillas'],
        tiempo: 45, calorias: 550, proteina: 40, porciones: 6
      },
      {
        keywords: ['chiles rellenos', 'chile relleno'],
        ingredientes: ['6 chiles poblanos', '300g de queso Oaxaca', '4 huevos', '1/2 taza de harina', 'Salsa de tomate', 'Aceite para freír'],
        preparacion: ['Asa los chiles y pélalos', 'Haz una abertura y retira semillas', 'Rellena con queso', 'Pasa por harina', 'Cubre con huevo batido', 'Fríe hasta dorar', 'Baña con salsa de tomate', 'Sirve calientes'],
        tiempo: 40, calorias: 380, proteina: 20, porciones: 6
      },
      {
        keywords: ['elote', 'elotes', 'esquites'],
        ingredientes: ['4 elotes', 'Mayonesa', 'Crema', 'Queso cotija', 'Chile en polvo', 'Limón'],
        preparacion: ['Hierve los elotes 15-20 min', 'O asa en el carbón', 'Inserta palito de madera', 'Unta mayonesa y crema', 'Espolvorea queso y chile', 'Exprime limón', 'Para esquites: desgrana y sirve en vaso', 'Añade los mismos ingredientes'],
        tiempo: 25, calorias: 280, proteina: 8, porciones: 4
      },
      {
        keywords: ['torta', 'torta mexicana', 'torta de jamon'],
        ingredientes: ['1 telera o bolillo', '100g de jamón', '50g de queso', 'Frijoles refritos', 'Aguacate', 'Jitomate, lechuga, cebolla', 'Mayonesa, jalapeños'],
        preparacion: ['Corta el pan a la mitad', 'Unta frijoles y mayonesa', 'Añade jamón y queso', 'Agrega aguacate en rebanadas', 'Coloca jitomate, lechuga, cebolla', 'Añade jalapeños al gusto', 'Cierra y presiona', 'Puedes calentar en plancha'],
        tiempo: 10, calorias: 480, proteina: 22, porciones: 1
      },
      {
        keywords: ['sincronizada', 'sincronizadas'],
        ingredientes: ['2 tortillas de harina', '100g de queso manchego', '50g de jamón', 'Salsa, guacamole'],
        preparacion: ['Coloca queso en una tortilla', 'Añade jamón encima', 'Cubre con más queso', 'Tapa con otra tortilla', 'Cocina en sartén por ambos lados', 'El queso debe derretirse', 'Corta en triángulos', 'Sirve con salsa y guacamole'],
        tiempo: 10, calorias: 420, proteina: 24, porciones: 1
      },

      // ============ COMIDA ITALIANA ============
      {
        keywords: ['pizza', 'pizza casera', 'pizza margarita'],
        ingredientes: ['500g de harina', '7g de levadura', '300ml de agua tibia', 'Salsa de tomate', 'Mozzarella', 'Albahaca fresca', 'Aceite de oliva'],
        preparacion: ['Mezcla harina, levadura, agua y sal', 'Amasa 10 minutos', 'Deja reposar 1 hora', 'Estira la masa fina', 'Añade salsa de tomate', 'Cubre con mozzarella', 'Hornea a 250°C 10-12 min', 'Añade albahaca fresca'],
        tiempo: 90, calorias: 280, proteina: 12, porciones: 8
      },
      {
        keywords: ['risotto', 'risotto de hongos', 'risotto champinones'],
        ingredientes: ['300g de arroz arborio', '200g de champiñones', '1 cebolla', '150ml de vino blanco', '1L de caldo de pollo', '50g de parmesano', 'Mantequilla'],
        preparacion: ['Saltea cebolla en mantequilla', 'Añade champiñones', 'Agrega el arroz y tuesta', 'Vierte el vino y deja evaporar', 'Añade caldo poco a poco', 'Revuelve constantemente 18-20 min', 'Añade parmesano y mantequilla', 'Sirve cremoso'],
        tiempo: 35, calorias: 420, proteina: 14, porciones: 4
      },
      {
        keywords: ['gnocchi', 'ñoquis'],
        ingredientes: ['1kg de papas', '300g de harina', '1 huevo', 'Sal', 'Salsa de tomate o pesto', 'Parmesano rallado'],
        preparacion: ['Cuece las papas con cáscara', 'Pela y haz puré', 'Mezcla con harina, huevo y sal', 'Forma rollos y corta en trozos', 'Marca con tenedor', 'Hierve en agua con sal', 'Retira cuando floten', 'Sirve con salsa y parmesano'],
        tiempo: 45, calorias: 350, proteina: 10, porciones: 4
      },
      {
        keywords: ['ravioli', 'ravioles'],
        ingredientes: ['Para masa: 300g harina, 3 huevos', 'Relleno: 250g ricotta, espinaca', 'Salsa de mantequilla y salvia', 'Parmesano rallado'],
        preparacion: ['Haz la masa y deja reposar', 'Prepara el relleno', 'Estira la masa muy fina', 'Coloca porciones de relleno', 'Cubre y sella', 'Corta los ravioles', 'Hierve 3-4 minutos', 'Sirve con salsa de mantequilla'],
        tiempo: 60, calorias: 380, proteina: 16, porciones: 4
      },
      {
        keywords: ['tiramisu', 'tiramisú'],
        ingredientes: ['500g de mascarpone', '4 huevos', '100g de azúcar', '300ml de café frío', '200g de galletas savoiardi', 'Cacao en polvo', 'Amaretto (opcional)'],
        preparacion: ['Separa claras y yemas', 'Bate yemas con azúcar', 'Añade mascarpone', 'Monta las claras e incorpora', 'Remoja galletas en café', 'Alterna capas de galleta y crema', 'Termina con crema', 'Refrigera 4 horas, espolvorea cacao'],
        tiempo: 30, calorias: 380, proteina: 8, porciones: 8
      },
      {
        keywords: ['minestrone', 'sopa minestrone'],
        ingredientes: ['200g de pasta pequeña', 'Variedad de verduras', '400g de tomate', 'Frijoles blancos', 'Caldo de verduras', 'Albahaca, parmesano'],
        preparacion: ['Sofríe cebolla, zanahoria, apio', 'Añade calabacín, ejotes', 'Agrega tomate y caldo', 'Cocina 20 min', 'Añade pasta y frijoles', 'Cocina hasta que la pasta esté lista', 'Sirve con albahaca', 'Añade parmesano rallado'],
        tiempo: 40, calorias: 280, proteina: 12, porciones: 6
      },
      {
        keywords: ['pesto', 'pasta al pesto'],
        ingredientes: ['400g de pasta', '100g de albahaca fresca', '50g de piñones', '50g de parmesano', '2 dientes de ajo', '150ml de aceite de oliva'],
        preparacion: ['Licua albahaca, piñones, ajo', 'Añade parmesano', 'Agrega aceite poco a poco', 'Cocina la pasta al dente', 'Reserva agua de cocción', 'Mezcla pasta con pesto', 'Añade agua si necesita', 'Sirve con más parmesano'],
        tiempo: 20, calorias: 520, proteina: 16, porciones: 4
      },
      {
        keywords: ['ossobuco', 'osobuco'],
        ingredientes: ['4 cortes de ossobuco', 'Harina para enharinar', '1 cebolla, 2 zanahorias, 2 apio', '400ml de vino blanco', '400g de tomate', 'Caldo de res', 'Gremolata: perejil, ajo, limón'],
        preparacion: ['Enharina y dora el ossobuco', 'Retira y sofríe verduras', 'Añade vino y deja reducir', 'Agrega tomate y caldo', 'Regresa la carne', 'Cocina a fuego bajo 2 horas', 'Prepara gremolata picando todo', 'Sirve con gremolata encima'],
        tiempo: 150, calorias: 480, proteina: 45, porciones: 4
      },
      {
        keywords: ['bruschetta', 'bruscheta'],
        ingredientes: ['1 baguette', '4 tomates maduros', '1/4 taza de albahaca', '2 dientes de ajo', 'Aceite de oliva extra virgen', 'Sal y pimienta', 'Vinagre balsámico'],
        preparacion: ['Corta el pan en rebanadas', 'Tuesta ligeramente', 'Frota con ajo', 'Pica tomate y albahaca', 'Mezcla con aceite, sal, pimienta', 'Coloca la mezcla sobre el pan', 'Rocía con balsámico', 'Sirve inmediatamente'],
        tiempo: 15, calorias: 180, proteina: 5, porciones: 6
      },
      {
        keywords: ['carpaccio', 'carpaccio de res'],
        ingredientes: ['300g de filete de res', 'Aceite de oliva', 'Jugo de limón', 'Alcaparras', 'Parmesano en láminas', 'Rúcula', 'Sal y pimienta'],
        preparacion: ['Congela la carne 30 min', 'Corta en láminas muy finas', 'Extiende en plato frío', 'Rocía aceite y limón', 'Sazona con sal y pimienta', 'Añade alcaparras', 'Coloca rúcula y parmesano', 'Sirve frío'],
        tiempo: 45, calorias: 220, proteina: 25, porciones: 4
      },

      // ============ COMIDA ASIÁTICA ============
      {
        keywords: ['sushi', 'sushi roll', 'maki'],
        ingredientes: ['300g de arroz para sushi', '4 hojas de nori', '200g de salmón o atún', 'Pepino, aguacate', 'Vinagre de arroz', 'Salsa de soya, wasabi, jengibre'],
        preparacion: ['Cocina y sazona el arroz', 'Coloca nori en esterilla', 'Extiende arroz en el nori', 'Añade pescado y verduras', 'Enrolla apretando', 'Corta en 8 piezas', 'Sirve con soya y wasabi', 'Acompaña con jengibre'],
        tiempo: 45, calorias: 320, proteina: 18, porciones: 4
      },
      {
        keywords: ['ramen', 'ramen japones'],
        ingredientes: ['400g de fideos ramen', '1L de caldo de cerdo o pollo', '200g de chashu (cerdo)', '2 huevos marinados', 'Nori, cebollín, brotes', 'Salsa de soya, mirin'],
        preparacion: ['Prepara el caldo con huesos', 'Cocina los fideos', 'Marina los huevos en soya', 'Corta el chashu en rebanadas', 'Coloca fideos en bowl', 'Vierte el caldo caliente', 'Añade los toppings', 'Sirve inmediatamente'],
        tiempo: 60, calorias: 580, proteina: 35, porciones: 4
      },
      {
        keywords: ['pad thai', 'padthai'],
        ingredientes: ['300g de fideos de arroz', '200g de camarones', '2 huevos', '100g de tofu', 'Brotes de soya', 'Cacahuates, limón, cilantro', 'Salsa pad thai'],
        preparacion: ['Remoja los fideos', 'Saltea camarones y tofu', 'Añade huevo revuelto', 'Agrega fideos y salsa', 'Saltea a fuego alto', 'Añade brotes de soya', 'Sirve con cacahuates', 'Exprime limón y añade cilantro'],
        tiempo: 25, calorias: 450, proteina: 28, porciones: 4
      },
      {
        keywords: ['curry', 'curry japones', 'kare'],
        ingredientes: ['500g de carne de res o pollo', '2 papas', '2 zanahorias', '1 cebolla', '1 bloque de curry japonés', 'Arroz blanco'],
        preparacion: ['Corta carne y verduras', 'Sofríe la cebolla', 'Añade carne y dora', 'Agrega papas y zanahorias', 'Cubre con agua', 'Cocina 20 min', 'Añade el curry y mezcla', 'Sirve sobre arroz'],
        tiempo: 40, calorias: 520, proteina: 32, porciones: 4
      },
      {
        keywords: ['arroz frito', 'fried rice', 'arroz chino'],
        ingredientes: ['400g de arroz cocido frío', '2 huevos', '100g de jamón o cerdo', '1/2 taza de chícharos', '2 cebollines', 'Salsa de soya', 'Aceite de sésamo'],
        preparacion: ['Bate y cocina los huevos', 'Retira y reserva', 'Saltea jamón y verduras', 'Añade el arroz frío', 'Cocina a fuego alto', 'Agrega salsa de soya', 'Incorpora el huevo', 'Añade aceite de sésamo'],
        tiempo: 15, calorias: 380, proteina: 18, porciones: 4
      },
      {
        keywords: ['teriyaki', 'pollo teriyaki'],
        ingredientes: ['500g de muslos de pollo', '100ml de salsa de soya', '50ml de mirin', '50ml de sake', '2 cucharadas de azúcar', 'Arroz y verduras para acompañar'],
        preparacion: ['Mezcla soya, mirin, sake, azúcar', 'Cocina el pollo hasta dorar', 'Añade la salsa teriyaki', 'Cocina hasta que espese', 'Baña el pollo constantemente', 'Corta en trozos', 'Sirve sobre arroz', 'Añade semillas de sésamo'],
        tiempo: 25, calorias: 420, proteina: 38, porciones: 4
      },
      {
        keywords: ['gyoza', 'dumplings', 'empanaditas chinas'],
        ingredientes: ['300g de carne de cerdo', '100g de col picada', '2 cebollines', 'Jengibre rallado', 'Pasta para gyoza', 'Salsa de soya y vinagre'],
        preparacion: ['Mezcla cerdo, col, cebollín, jengibre', 'Coloca relleno en la pasta', 'Dobla y sella los bordes', 'Dora la base en sartén', 'Añade agua y tapa', 'Cocina hasta que el agua se evapore', 'Sirve con salsa de soya y vinagre', 'Añade chile al gusto'],
        tiempo: 35, calorias: 280, proteina: 18, porciones: 20
      },
      {
        keywords: ['pho', 'sopa pho', 'pho vietnamita'],
        ingredientes: ['1.5L de caldo de res', '300g de fideos de arroz', '200g de carne de res en láminas', 'Brotes de soya, albahaca thai', 'Limón, jalapeño, cilantro', 'Salsa hoisin, sriracha'],
        preparacion: ['Prepara caldo con huesos y especias', 'Cuece los fideos', 'Coloca fideos en bowl', 'Añade carne cruda en láminas', 'Vierte caldo hirviendo', 'La carne se cocina con el calor', 'Añade brotes, hierbas, limón', 'Sirve con salsas aparte'],
        tiempo: 45, calorias: 380, proteina: 28, porciones: 4
      },
      {
        keywords: ['spring rolls', 'rollos primavera', 'rollitos'],
        ingredientes: ['12 hojas de arroz', '200g de camarones cocidos', 'Fideos de arroz', 'Lechuga, zanahoria, pepino', 'Menta y cilantro', 'Salsa de maní'],
        preparacion: ['Cocina los fideos', 'Remoja las hojas de arroz', 'Coloca lechuga, fideos, verduras', 'Añade camarones y hierbas', 'Enrolla apretando', 'Dobla los lados', 'Sirve con salsa de maní', 'Come frescos'],
        tiempo: 30, calorias: 180, proteina: 12, porciones: 12
      },
      {
        keywords: ['bibimbap', 'arroz coreano'],
        ingredientes: ['400g de arroz', '200g de carne de res', 'Espinaca, zanahoria, calabacín', 'Brotes de soya', 'Huevo frito', 'Gochujang (pasta de chile)', 'Aceite de sésamo'],
        preparacion: ['Cocina el arroz', 'Saltea cada verdura por separado', 'Cocina la carne marinada', 'Coloca arroz en bowl', 'Arregla verduras y carne encima', 'Corona con huevo frito', 'Añade gochujang', 'Mezcla todo antes de comer'],
        tiempo: 40, calorias: 520, proteina: 30, porciones: 4
      },
      {
        keywords: ['katsu', 'tonkatsu', 'milanesa japonesa'],
        ingredientes: ['4 chuletas de cerdo', 'Harina, huevo, panko', 'Aceite para freír', 'Salsa tonkatsu', 'Col rallada', 'Arroz blanco'],
        preparacion: ['Aplana las chuletas', 'Pasa por harina, huevo, panko', 'Fríe en aceite caliente', 'Cocina hasta dorar', 'Escurre en papel', 'Corta en tiras', 'Sirve sobre arroz', 'Acompaña con col y salsa'],
        tiempo: 25, calorias: 480, proteina: 35, porciones: 4
      },
      {
        keywords: ['dim sum', 'siu mai', 'har gow'],
        ingredientes: ['Masa para dim sum', '200g de camarón', '200g de cerdo', 'Jengibre, cebollín', 'Salsa de soya', 'Aceite de sésamo'],
        preparacion: ['Pica camarón y cerdo', 'Mezcla con jengibre y cebollín', 'Sazona con soya y sésamo', 'Rellena la masa', 'Forma los dumplings', 'Cocina al vapor 10 min', 'Sirve con soya', 'Acompaña con té'],
        tiempo: 45, calorias: 250, proteina: 20, porciones: 20
      },

      // ============ COMIDA AMERICANA ============
      {
        keywords: ['mac and cheese', 'macarrones con queso'],
        ingredientes: ['400g de macarrones', '400g de queso cheddar', '500ml de leche', '50g de mantequilla', '3 cucharadas de harina', 'Pan molido para gratinar'],
        preparacion: ['Cocina la pasta al dente', 'Derrite mantequilla, añade harina', 'Agrega leche poco a poco', 'Añade queso hasta derretir', 'Mezcla con la pasta', 'Coloca en refractario', 'Cubre con pan molido', 'Gratina hasta dorar'],
        tiempo: 30, calorias: 580, proteina: 25, porciones: 6
      },
      {
        keywords: ['hot dog', 'perro caliente', 'hotdog'],
        ingredientes: ['4 salchichas', '4 panes para hot dog', 'Mostaza, ketchup', 'Cebolla picada', 'Pepinillos', 'Chucrut (opcional)'],
        preparacion: ['Hierve o asa las salchichas', 'Calienta los panes', 'Coloca salchicha en pan', 'Añade mostaza y ketchup', 'Agrega cebolla y pepinillos', 'Añade chucrut si deseas', 'Sirve calientes', 'Acompaña con papas fritas'],
        tiempo: 10, calorias: 350, proteina: 14, porciones: 4
      },
      {
        keywords: ['wings', 'alitas', 'buffalo wings'],
        ingredientes: ['1kg de alitas de pollo', '100g de mantequilla', '150ml de salsa picante', 'Ajo en polvo', 'Salsa ranch o blue cheese', 'Apio en bastones'],
        preparacion: ['Hornea las alitas a 200°C', 'Voltea a mitad de cocción', 'Cocina hasta crujientes (40 min)', 'Derrite mantequilla con salsa', 'Añade ajo en polvo', 'Mezcla alitas con la salsa', 'Sirve con ranch', 'Acompaña con apio'],
        tiempo: 50, calorias: 420, proteina: 32, porciones: 4
      },
      {
        keywords: ['ribs', 'costillas bbq', 'costillas a la bbq'],
        ingredientes: ['1kg de costillas de cerdo', 'Dry rub: paprika, ajo, cebolla', 'Azúcar morena', 'Salsa BBQ', 'Vinagre de manzana'],
        preparacion: ['Retira la membrana de las costillas', 'Aplica el dry rub generosamente', 'Refrigera toda la noche', 'Hornea a 135°C por 3 horas', 'Envuelve en aluminio a mitad', 'Barniza con salsa BBQ', 'Asa 10 min más', 'Corta y sirve'],
        tiempo: 200, calorias: 550, proteina: 38, porciones: 4
      },
      {
        keywords: ['pulled pork', 'cerdo deshebrado', 'cerdo desmenuzado'],
        ingredientes: ['1.5kg de espaldilla de cerdo', 'Dry rub BBQ', '500ml de salsa BBQ', 'Vinagre de manzana', 'Panes para hamburguesa', 'Coleslaw'],
        preparacion: ['Aplica dry rub a la carne', 'Cocina lento a 120°C por 8 horas', 'O en olla lenta por 10 horas', 'Deshebra con tenedores', 'Mezcla con salsa BBQ', 'Sirve en panes', 'Añade coleslaw encima', 'Disfruta'],
        tiempo: 480, calorias: 450, proteina: 40, porciones: 8
      },
      {
        keywords: ['philly cheesesteak', 'cheesesteak'],
        ingredientes: ['500g de carne de res en láminas', '1 cebolla en juliana', '1 pimiento verde', '200g de queso provolone o cheez whiz', '4 panes hoagie', 'Sal y pimienta'],
        preparacion: ['Saltea cebolla y pimiento', 'Retira y reserva', 'Cocina la carne en láminas', 'Sazona con sal y pimienta', 'Añade las verduras', 'Coloca queso encima', 'Deja derretir', 'Sirve en los panes'],
        tiempo: 20, calorias: 520, proteina: 35, porciones: 4
      },
      {
        keywords: ['club sandwich', 'sandwich club'],
        ingredientes: ['3 rebanadas de pan tostado', '100g de pavo o pollo', '3 tiras de tocino', 'Lechuga, tomate', 'Mayonesa', 'Queso americano'],
        preparacion: ['Tuesta el pan', 'Unta mayonesa', 'Primera capa: pavo y queso', 'Segunda capa de pan', 'Añade tocino, lechuga, tomate', 'Tercera capa de pan', 'Asegura con palillos', 'Corta en triángulos'],
        tiempo: 15, calorias: 480, proteina: 28, porciones: 1
      },
      {
        keywords: ['blt', 'sandwich blt'],
        ingredientes: ['2 rebanadas de pan', '4 tiras de tocino', 'Lechuga', 'Tomate en rebanadas', 'Mayonesa'],
        preparacion: ['Fríe el tocino crujiente', 'Tuesta el pan', 'Unta mayonesa en ambos lados', 'Coloca lechuga', 'Añade tomate', 'Coloca el tocino', 'Cierra el sandwich', 'Corta a la mitad'],
        tiempo: 10, calorias: 380, proteina: 15, porciones: 1
      },
      {
        keywords: ['grilled cheese', 'queso fundido sandwich'],
        ingredientes: ['2 rebanadas de pan', '100g de queso cheddar', '30g de mantequilla', 'Opcional: jamón, tomate'],
        preparacion: ['Unta mantequilla en el pan por fuera', 'Coloca queso entre las rebanadas', 'Calienta sartén a fuego medio', 'Cocina hasta dorar', 'Voltea con cuidado', 'Cocina el otro lado', 'El queso debe derretirse', 'Corta y sirve'],
        tiempo: 10, calorias: 450, proteina: 18, porciones: 1
      },
      {
        keywords: ['meatloaf', 'pastel de carne'],
        ingredientes: ['750g de carne molida', '1/2 taza de pan molido', '1 huevo', '1/4 taza de leche', '1 cebolla picada', 'Salsa de tomate para cubrir'],
        preparacion: ['Mezcla todos los ingredientes', 'Forma un rectángulo', 'Coloca en molde para pan', 'Cubre con salsa de tomate', 'Hornea a 180°C por 1 hora', 'Deja reposar 10 min', 'Rebana y sirve', 'Acompaña con puré de papa'],
        tiempo: 75, calorias: 380, proteina: 32, porciones: 6
      },
      {
        keywords: ['clam chowder', 'sopa de almejas'],
        ingredientes: ['500g de almejas', '200g de tocino', '2 papas', '1 cebolla', '500ml de crema', '500ml de caldo', 'Tomillo'],
        preparacion: ['Cocina el tocino crujiente', 'Sofríe cebolla en la grasa', 'Añade papas y caldo', 'Cocina hasta que ablanden', 'Agrega las almejas', 'Añade crema y tomillo', 'No dejes hervir', 'Sirve con galletas'],
        tiempo: 35, calorias: 420, proteina: 22, porciones: 4
      },

      // ============ COMIDA ESPAÑOLA ============
      {
        keywords: ['tortilla espanola', 'tortilla de patatas', 'tortilla española'],
        ingredientes: ['6 huevos', '500g de papas', '1 cebolla', '200ml de aceite de oliva', 'Sal'],
        preparacion: ['Corta papas en láminas finas', 'Fríe en aceite a fuego medio', 'Añade cebolla a mitad', 'Cocina hasta que estén blandas', 'Escurre y mezcla con huevo batido', 'Cuaja en sartén por ambos lados', 'Voltea con plato', 'Sirve tibia o fría'],
        tiempo: 40, calorias: 320, proteina: 15, porciones: 6
      },
      {
        keywords: ['gazpacho'],
        ingredientes: ['1kg de tomates maduros', '1 pepino', '1 pimiento verde', '2 dientes de ajo', '100ml de aceite de oliva', 'Vinagre de jerez', 'Pan del día anterior'],
        preparacion: ['Pela tomates y pepino', 'Corta todas las verduras', 'Añade ajo, aceite, vinagre', 'Agrega pan remojado', 'Licúa hasta suave', 'Cuela si deseas', 'Refrigera bien frío', 'Sirve con tropezones'],
        tiempo: 20, calorias: 180, proteina: 4, porciones: 6
      },
      {
        keywords: ['patatas bravas', 'papas bravas'],
        ingredientes: ['600g de papas', 'Aceite para freír', 'Salsa brava: tomate, pimentón, cayena', 'Alioli: ajo, aceite, huevo'],
        preparacion: ['Corta papas en cubos', 'Fríe hasta dorar', 'Prepara salsa brava picante', 'Prepara alioli', 'Coloca papas en plato', 'Cubre con salsa brava', 'Añade alioli encima', 'Sirve calientes'],
        tiempo: 30, calorias: 380, proteina: 6, porciones: 4
      },
      {
        keywords: ['croquetas', 'croqueta', 'croquetas de jamon'],
        ingredientes: ['100g de jamón serrano', '50g de mantequilla', '50g de harina', '500ml de leche', 'Nuez moscada', 'Huevo y pan molido'],
        preparacion: ['Derrite mantequilla, añade harina', 'Agrega leche poco a poco', 'Cocina la bechamel espesa', 'Añade jamón picado', 'Enfría varias horas', 'Forma croquetas', 'Pasa por huevo y pan molido', 'Fríe hasta dorar'],
        tiempo: 60, calorias: 280, proteina: 12, porciones: 20
      },
      {
        keywords: ['pulpo a la gallega', 'pulpo'],
        ingredientes: ['1kg de pulpo', 'Papas cocidas', 'Pimentón', 'Aceite de oliva', 'Sal gruesa'],
        preparacion: ['Congela el pulpo antes', 'Hierve agua con cebolla', 'Sumerge pulpo 3 veces', 'Cuece 45 min a fuego bajo', 'Corta en rodajas', 'Coloca sobre papas', 'Añade pimentón y aceite', 'Espolvorea sal gruesa'],
        tiempo: 60, calorias: 250, proteina: 32, porciones: 4
      },
      {
        keywords: ['fabada', 'fabada asturiana'],
        ingredientes: ['500g de fabes (alubias)', '200g de chorizo', '200g de morcilla', '200g de tocino', 'Azafrán', 'Laurel'],
        preparacion: ['Remoja las fabes toda la noche', 'Cuece con laurel', 'Añade el tocino', 'Agrega chorizo y morcilla', 'Añade azafrán', 'Cocina a fuego bajo 2 horas', 'No revuelvas, solo mueve la olla', 'Sirve muy caliente'],
        tiempo: 150, calorias: 580, proteina: 35, porciones: 6
      },
      {
        keywords: ['gambas al ajillo'],
        ingredientes: ['500g de gambas', '8 dientes de ajo', '1 chile seco', '150ml de aceite de oliva', 'Perejil', 'Pan para mojar'],
        preparacion: ['Pela las gambas', 'Lamina el ajo', 'Calienta aceite en cazuela', 'Fríe ajo hasta dorar', 'Añade el chile troceado', 'Agrega las gambas', 'Cocina 3-4 minutos', 'Sirve con perejil y pan'],
        tiempo: 15, calorias: 320, proteina: 28, porciones: 4
      },
      {
        keywords: ['jamon serrano', 'jamon iberico', 'tabla de jamon'],
        ingredientes: ['300g de jamón serrano o ibérico', 'Pan con tomate', 'Aceite de oliva', 'Tomate rallado'],
        preparacion: ['Corta el jamón en lonchas finas', 'Tuesta rebanadas de pan', 'Frota tomate rallado', 'Rocía aceite de oliva', 'Coloca el jamón', 'Sirve a temperatura ambiente', 'Acompaña con aceitunas', 'Disfruta con vino'],
        tiempo: 10, calorias: 280, proteina: 25, porciones: 4
      },

      // ============ COMIDA FRANCESA ============
      {
        keywords: ['crepes', 'crepa', 'crepas'],
        ingredientes: ['250g de harina', '500ml de leche', '3 huevos', '50g de mantequilla', '1 cucharada de azúcar', 'Nutella, fruta, crema para rellenar'],
        preparacion: ['Mezcla harina, huevos, leche', 'Añade mantequilla derretida', 'Deja reposar 30 min', 'Calienta sartén antiadherente', 'Vierte una capa fina', 'Cocina por ambos lados', 'Rellena con lo que desees', 'Dobla y sirve'],
        tiempo: 30, calorias: 280, proteina: 8, porciones: 10
      },
      {
        keywords: ['quiche', 'quiche lorraine'],
        ingredientes: ['1 masa para tarta', '200g de tocino', '200g de queso gruyère', '3 huevos', '300ml de crema', 'Nuez moscada'],
        preparacion: ['Forra molde con la masa', 'Hornea la base 10 min', 'Fríe el tocino', 'Bate huevos con crema', 'Añade nuez moscada', 'Coloca tocino y queso en la base', 'Vierte la mezcla de huevo', 'Hornea a 180°C 35 min'],
        tiempo: 55, calorias: 420, proteina: 18, porciones: 8
      },
      {
        keywords: ['ratatouille'],
        ingredientes: ['2 berenjenas', '2 calabacines', '2 tomates', '1 pimiento rojo', '1 cebolla', 'Ajo, hierbas provenzales', 'Aceite de oliva'],
        preparacion: ['Corta todo en rodajas', 'Sofríe cebolla y pimiento', 'Coloca en refractario', 'Alterna rodajas de verduras', 'Rocía con aceite y hierbas', 'Cubre con aluminio', 'Hornea a 180°C 45 min', 'Destapa los últimos 15 min'],
        tiempo: 60, calorias: 180, proteina: 4, porciones: 6
      },
      {
        keywords: ['sopa de cebolla', 'french onion soup'],
        ingredientes: ['4 cebollas grandes', '100g de mantequilla', '1L de caldo de res', '200ml de vino blanco', 'Pan baguette', 'Queso gruyère'],
        preparacion: ['Corta cebollas en juliana', 'Cocina en mantequilla 40 min', 'Deben caramelizarse', 'Añade vino y deja reducir', 'Agrega caldo y hierve', 'Sirve en bowls aptos para horno', 'Coloca pan y queso', 'Gratina hasta dorar'],
        tiempo: 60, calorias: 320, proteina: 12, porciones: 4
      },
      {
        keywords: ['croissant', 'croissants', 'cruasan'],
        ingredientes: ['500g de harina', '10g de sal', '80g de azúcar', '10g de levadura', '300ml de leche', '280g de mantequilla fría', 'Huevo para barnizar'],
        preparacion: ['Mezcla harina, sal, azúcar, levadura, leche', 'Amasa y refrigera 1 hora', 'Envuelve mantequilla en la masa', 'Haz 3 dobleces con reposo entre cada uno', 'Refrigera entre cada doblez', 'Corta en triángulos', 'Enrolla y da forma', 'Hornea a 200°C 15 min'],
        tiempo: 240, calorias: 320, proteina: 6, porciones: 12
      },
      {
        keywords: ['coq au vin', 'pollo al vino'],
        ingredientes: ['1 pollo en piezas', '750ml de vino tinto', '200g de tocino', '200g de champiñones', 'Cebollitas', 'Tomillo, laurel', 'Caldo de pollo'],
        preparacion: ['Marina el pollo en vino toda la noche', 'Dora las piezas', 'Fríe tocino, champiñones, cebollitas', 'Flamea con brandy', 'Añade el vino del marinado', 'Agrega caldo y hierbas', 'Cocina a fuego bajo 1.5 horas', 'La salsa debe espesar'],
        tiempo: 120, calorias: 480, proteina: 42, porciones: 6
      },
      {
        keywords: ['crème brûlée', 'creme brulee', 'crema quemada'],
        ingredientes: ['500ml de crema para batir', '5 yemas de huevo', '100g de azúcar', '1 vaina de vainilla', 'Azúcar para caramelizar'],
        preparacion: ['Calienta crema con vainilla', 'Bate yemas con azúcar', 'Vierte crema caliente sobre yemas', 'Cuela y vierte en moldes', 'Hornea a baño maría a 150°C 45 min', 'Refrigera varias horas', 'Espolvorea azúcar', 'Quema con soplete'],
        tiempo: 60, calorias: 380, proteina: 5, porciones: 6
      },

      // ============ BEBIDAS Y SMOOTHIES ============
      {
        keywords: ['margarita', 'coctel margarita'],
        ingredientes: ['60ml de tequila', '30ml de triple sec', '30ml de jugo de limón', 'Sal para escarchar', 'Hielo'],
        preparacion: ['Escarcha el vaso con limón y sal', 'Añade hielo a la coctelera', 'Agrega tequila, triple sec, limón', 'Agita vigorosamente', 'Cuela en el vaso', 'Decora con rodaja de limón', 'Sirve inmediatamente', 'Disfruta responsablemente'],
        tiempo: 5, calorias: 180, proteina: 0, porciones: 1
      },
      {
        keywords: ['mojito'],
        ingredientes: ['60ml de ron blanco', '30ml de jugo de limón', '2 cucharaditas de azúcar', '6 hojas de menta', 'Agua mineral', 'Hielo'],
        preparacion: ['Machaca menta con azúcar y limón', 'Añade el ron', 'Agrega hielo', 'Completa con agua mineral', 'Revuelve suavemente', 'Decora con menta', 'Sirve con popote', 'Disfruta'],
        tiempo: 5, calorias: 150, proteina: 0, porciones: 1
      },
      {
        keywords: ['michelada'],
        ingredientes: ['1 cerveza', 'Jugo de 2 limones', 'Salsa inglesa', 'Salsa picante', 'Sal y chile para escarchar', 'Hielo'],
        preparacion: ['Escarcha el tarro con limón y chamoy', 'Añade hielo', 'Agrega salsas y limón', 'Vierte la cerveza fría', 'Revuelve suavemente', 'Puedes añadir clamato', 'Decora con limón', 'Sirve fría'],
        tiempo: 5, calorias: 180, proteina: 1, porciones: 1
      },
      {
        keywords: ['agua fresca', 'agua de jamaica', 'jamaica'],
        ingredientes: ['100g de flor de jamaica', '1 taza de azúcar', '2 litros de agua', 'Hielo'],
        preparacion: ['Hierve 1L de agua', 'Añade la jamaica', 'Deja reposar 20 min', 'Cuela', 'Añade azúcar al gusto', 'Agrega el agua restante', 'Refrigera bien fría', 'Sirve con hielo'],
        tiempo: 30, calorias: 80, proteina: 0, porciones: 8
      },
      {
        keywords: ['horchata', 'agua de horchata'],
        ingredientes: ['1 taza de arroz', '1/2 taza de almendras', '1 raja de canela', 'Azúcar al gusto', '2 litros de agua', 'Vainilla'],
        preparacion: ['Remoja arroz y almendras toda la noche', 'Licua con canela y agua', 'Cuela muy bien', 'Añade azúcar y vainilla', 'Agrega más agua si necesita', 'Refrigera bien fría', 'Revuelve antes de servir', 'Sirve con hielo'],
        tiempo: 20, calorias: 120, proteina: 2, porciones: 8
      },
      {
        keywords: ['limonada', 'agua de limon'],
        ingredientes: ['1 taza de jugo de limón', '3/4 taza de azúcar', '6 tazas de agua fría', 'Hielo', 'Menta fresca (opcional)'],
        preparacion: ['Exprime los limones', 'Disuelve azúcar en 1 taza de agua caliente', 'Mezcla con el jugo de limón', 'Añade el agua fría', 'Prueba y ajusta dulzor', 'Refrigera bien fría', 'Sirve con hielo', 'Decora con menta'],
        tiempo: 10, calorias: 90, proteina: 0, porciones: 6
      },
      {
        keywords: ['smoothie verde', 'green smoothie', 'jugo verde'],
        ingredientes: ['1 taza de espinaca', '1 plátano', '1/2 mango', '1 taza de leche de almendras', '1 cucharada de miel', 'Hielo'],
        preparacion: ['Añade espinaca y leche a licuadora', 'Agrega plátano y mango', 'Añade miel y hielo', 'Licua hasta suave', 'Prueba y ajusta', 'Sirve inmediatamente', 'Decora con semillas', 'Disfruta nutritivo'],
        tiempo: 5, calorias: 220, proteina: 4, porciones: 1
      },
      {
        keywords: ['chocolate caliente', 'hot chocolate'],
        ingredientes: ['500ml de leche', '100g de chocolate oscuro', '2 cucharadas de azúcar', '1/2 cucharadita de canela', 'Crema batida', 'Malvaviscos'],
        preparacion: ['Calienta la leche sin hervir', 'Añade chocolate picado', 'Revuelve hasta derretir', 'Agrega azúcar y canela', 'Bate hasta espumar', 'Sirve en tazas', 'Corona con crema batida', 'Añade malvaviscos'],
        tiempo: 10, calorias: 280, proteina: 8, porciones: 2
      },
      {
        keywords: ['cafe latte', 'latte', 'cafe con leche'],
        ingredientes: ['1 shot de espresso', '200ml de leche', 'Azúcar al gusto', 'Canela o cocoa para decorar'],
        preparacion: ['Prepara el espresso', 'Calienta la leche', 'Espuma la leche', 'Vierte espresso en taza', 'Añade la leche espumada', 'Puedes hacer arte latte', 'Espolvorea canela o cocoa', 'Sirve caliente'],
        tiempo: 5, calorias: 120, proteina: 6, porciones: 1
      },

      // ============ SNACKS Y APERITIVOS ============
      {
        keywords: ['nachos', 'nachos con queso'],
        ingredientes: ['200g de totopos', '200g de queso cheddar', '100g de frijoles', 'Jalapeños', 'Crema, guacamole', 'Pico de gallo'],
        preparacion: ['Coloca totopos en refractario', 'Añade frijoles', 'Cubre con queso rallado', 'Hornea hasta gratinar', 'Añade jalapeños', 'Sirve con crema y guacamole', 'Añade pico de gallo', 'Come calientes'],
        tiempo: 15, calorias: 450, proteina: 15, porciones: 4
      },
      {
        keywords: ['palomitas', 'popcorn', 'palomitas de maiz'],
        ingredientes: ['100g de maíz palomero', '3 cucharadas de aceite', 'Sal o mantequilla', 'Opcional: chile, limón, queso'],
        preparacion: ['Calienta aceite en olla grande', 'Añade 3 granos de maíz', 'Cuando revienten, añade el resto', 'Tapa y agita constantemente', 'Espera a que dejen de reventar', 'Retira del fuego', 'Añade sal o mantequilla', 'Mezcla bien y sirve'],
        tiempo: 10, calorias: 150, proteina: 3, porciones: 4
      },
      {
        keywords: ['hummus'],
        ingredientes: ['400g de garbanzos cocidos', '3 cucharadas de tahini', '2 dientes de ajo', 'Jugo de 1 limón', '3 cucharadas de aceite de oliva', 'Comino, pimentón'],
        preparacion: ['Escurre los garbanzos', 'Licua con tahini, ajo, limón', 'Añade aceite poco a poco', 'Sazona con sal y comino', 'Licua hasta cremoso', 'Sirve en plato', 'Decora con pimentón y aceite', 'Acompaña con pan pita'],
        tiempo: 10, calorias: 180, proteina: 8, porciones: 6
      },
      {
        keywords: ['papas fritas', 'french fries', 'papas a la francesa'],
        ingredientes: ['4 papas grandes', 'Aceite para freír', 'Sal', 'Ketchup o mayonesa'],
        preparacion: ['Pela y corta papas en bastones', 'Remoja en agua fría 30 min', 'Seca muy bien', 'Fríe a 160°C hasta blanquear', 'Retira y deja enfriar', 'Fríe de nuevo a 190°C hasta dorar', 'Escurre y sala inmediatamente', 'Sirve calientes'],
        tiempo: 45, calorias: 320, proteina: 4, porciones: 4
      },
      {
        keywords: ['empanadas', 'empanada'],
        ingredientes: ['Masa para empanadas', '300g de carne molida', '1 cebolla', '1 huevo duro', 'Aceitunas', 'Comino, pimentón'],
        preparacion: ['Sofríe cebolla y carne', 'Sazona con especias', 'Deja enfriar', 'Añade huevo y aceitunas picadas', 'Rellena los discos de masa', 'Cierra y sella con tenedor', 'Hornea a 200°C 20 min', 'O fríe hasta dorar'],
        tiempo: 45, calorias: 280, proteina: 12, porciones: 12
      },
      {
        keywords: ['aros de cebolla', 'onion rings'],
        ingredientes: ['2 cebollas grandes', '1 taza de harina', '1 taza de cerveza', '1 huevo', 'Aceite para freír', 'Sal'],
        preparacion: ['Corta cebollas en aros gruesos', 'Mezcla harina, cerveza, huevo', 'La masa debe ser espesa', 'Calienta aceite a 180°C', 'Pasa aros por la masa', 'Fríe hasta dorar', 'Escurre en papel', 'Sala y sirve calientes'],
        tiempo: 25, calorias: 250, proteina: 5, porciones: 4
      },

      // ============ COMIDA SALUDABLE / FITNESS ============
      {
        keywords: ['poke bowl', 'poke', 'bowl hawaiano'],
        ingredientes: ['200g de atún fresco', '200g de arroz de sushi', 'Aguacate', 'Pepino', 'Edamame', 'Salsa de soya', 'Aceite de sésamo'],
        preparacion: ['Cocina y sazona el arroz', 'Corta el atún en cubos', 'Marina en soya y sésamo', 'Coloca arroz en bowl', 'Añade atún, aguacate, pepino', 'Agrega edamame', 'Decora con sésamo', 'Sirve frío'],
        tiempo: 25, calorias: 420, proteina: 35, porciones: 2
      },
      {
        keywords: ['ensalada griega', 'greek salad'],
        ingredientes: ['2 pepinos', '4 tomates', '1 cebolla morada', '200g de queso feta', 'Aceitunas kalamata', 'Aceite de oliva', 'Orégano'],
        preparacion: ['Corta pepino y tomate en cubos', 'Rebana cebolla en aros finos', 'Combina en ensaladera', 'Añade aceitunas', 'Coloca queso feta encima', 'Rocía aceite generosamente', 'Espolvorea orégano', 'No mezclar, servir así'],
        tiempo: 15, calorias: 280, proteina: 12, porciones: 4
      },
      {
        keywords: ['buddha bowl', 'bowl saludable'],
        ingredientes: ['Quinoa cocida', 'Garbanzos asados', 'Aguacate', 'Zanahoria rallada', 'Espinaca', 'Hummus', 'Semillas'],
        preparacion: ['Cocina la quinoa', 'Asa garbanzos con especias', 'Coloca quinoa en bowl', 'Añade verduras en secciones', 'Agrega aguacate en rebanadas', 'Coloca hummus al lado', 'Espolvorea semillas', 'Sirve con limón'],
        tiempo: 30, calorias: 380, proteina: 15, porciones: 2
      },
      {
        keywords: ['wrap saludable', 'wrap de pollo'],
        ingredientes: ['1 tortilla integral grande', '150g de pollo a la plancha', 'Lechuga', 'Tomate', 'Aguacate', 'Yogurt griego', 'Limón'],
        preparacion: ['Cocina el pollo y rebana', 'Mezcla yogurt con limón', 'Calienta la tortilla', 'Unta el aderezo de yogurt', 'Coloca lechuga y pollo', 'Añade tomate y aguacate', 'Enrolla apretando', 'Corta a la mitad'],
        tiempo: 15, calorias: 380, proteina: 35, porciones: 1
      },
      {
        keywords: ['salmon al horno', 'salmon con verduras'],
        ingredientes: ['2 filetes de salmón', 'Brócoli', 'Zanahorias', 'Aceite de oliva', 'Limón', 'Ajo', 'Eneldo'],
        preparacion: ['Precalienta horno a 200°C', 'Coloca salmón en bandeja', 'Rodea con verduras', 'Rocía aceite y limón', 'Sazona con ajo y eneldo', 'Hornea 15-18 minutos', 'El salmón debe estar rosado', 'Sirve caliente'],
        tiempo: 25, calorias: 420, proteina: 45, porciones: 2
      },
      {
        keywords: ['zoodles', 'espagueti de calabacin', 'pasta de calabaza'],
        ingredientes: ['3 calabacines', 'Salsa marinara o pesto', 'Parmesano rallado', 'Aceite de oliva', 'Ajo'],
        preparacion: ['Corta calabacín en espirales', 'Saltea ajo en aceite', 'Añade los zoodles', 'Cocina 3-4 minutos', 'No sobrecocinar', 'Añade la salsa', 'Sirve con parmesano', 'Opción baja en carbohidratos'],
        tiempo: 15, calorias: 180, proteina: 8, porciones: 2
      },
      {
        keywords: ['quinoa', 'ensalada de quinoa'],
        ingredientes: ['200g de quinoa', 'Pepino', 'Tomate cherry', 'Cebolla morada', 'Perejil', 'Limón', 'Aceite de oliva'],
        preparacion: ['Enjuaga la quinoa', 'Cuece en agua con sal 15 min', 'Deja enfriar', 'Pica las verduras', 'Mezcla todo', 'Aliña con limón y aceite', 'Sazona con sal', 'Sirve fría'],
        tiempo: 25, calorias: 280, proteina: 10, porciones: 4
      }
    ]

    // BUSCAR LA RECETA EN LA BASE DE DATOS
    let recetaEncontrada: RecetaDB | null = null
    let mejorCoincidencia = 0

    for (const receta of recetasDB) {
      let coincidencias = 0
      for (const keyword of receta.keywords) {
        if (nombre.includes(keyword)) {
          coincidencias++
        }
      }
      if (coincidencias > mejorCoincidencia) {
        mejorCoincidencia = coincidencias
        recetaEncontrada = receta
      }
    }

    // Si encontramos una receta, usarla directamente
    if (recetaEncontrada && mejorCoincidencia > 0) {
      setNuevaReceta({
        ...nuevaReceta,
        ingredientes: recetaEncontrada.ingredientes,
        preparacion: recetaEncontrada.preparacion,
        tiempo: recetaEncontrada.tiempo,
        calorias: recetaEncontrada.calorias,
        proteina: recetaEncontrada.proteina,
        porciones: recetaEncontrada.porciones
      })
      setGenerandoRecetaIA(false)
      return
    }

    // Si no se encontró receta en la base de datos, mostrar mensaje de receta no encontrada
    setNuevaReceta({
      ...nuevaReceta,
      ingredientes: ['Receta no encontrada en nuestra base de datos', 'Por favor intenta con otro nombre de receta', 'Ejemplos: bowl de frutos rojos, arroz con leche, pollo a la plancha, pasta carbonara'],
      preparacion: ['Escribe el nombre de una receta conocida', 'Presiona el botón de IA nuevamente'],
      tiempo: 0,
      calorias: 0,
      proteina: 0,
      porciones: 1
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

  // Filtrar recetas por categoría y búsqueda
  const recetasFiltradas = recetas.filter(receta => {
    const coincideCategoria = categoriaActiva === 'Todas' || receta.categoria === categoriaActiva
    const coincideBusqueda = receta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                             receta.ingredientes.some(ing => ing.toLowerCase().includes(busqueda.toLowerCase()))
    return coincideCategoria && coincideBusqueda
  })

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
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categorias.map((cat, index) => (
            <button
              key={index}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                categoriaActiva === cat
                  ? 'bg-black text-white'
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
        {recetasFiltradas.map((receta, index) => (
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
                        const texto = listaSupermercado.map(i => `â˜ ${i.producto} - ${i.cantidad}`).join('\n')
                        navigator.clipboard.writeText(texto)
                      }}
                      className="flex-1 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition text-sm"
                    >
                      ðŸ“‹ Copiar Lista
                    </button>
                    <button 
                      onClick={() => setMostrarLista(false)}
                      className="flex-1 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition text-sm"
                    >
                      âœ“ Listo
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

      {/* Modal de Alerta Estilizado */}
      {showAlert && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 border-gray-200 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black mb-2">Atención</h3>
                  <p className="text-gray-700 leading-relaxed">{alertMessage}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowAlert(false)}
                  className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


