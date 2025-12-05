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
    </div>
  )
}


