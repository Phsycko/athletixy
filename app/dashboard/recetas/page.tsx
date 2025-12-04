'use client'

import { ChefHat, Clock, Flame, Users, Search, Plus } from 'lucide-react'

export default function RecetasPage() {
  const categorias = ['Todas', 'Desayuno', 'Almuerzo', 'Cena', 'Snacks', 'Post-Entreno']

  const recetas = [
    {
      nombre: 'Bowl de Proteína con Quinoa',
      categoria: 'Almuerzo',
      tiempo: 25,
      calorias: 520,
      proteina: 45,
      dificultad: 'Fácil',
      porciones: 2,
      ingredientes: [
        '150g quinoa cocida',
        '200g pechuga de pollo',
        '100g espinaca',
        '50g aguacate',
        'Tomate cherry',
      ],
      preparacion: [
        'Cocina la quinoa según las instrucciones del paquete',
        'Cocina la pechuga de pollo a la plancha',
        'Mezcla todos los ingredientes en un bowl',
        'Añade aderezo al gusto',
      ],
    },
    {
      nombre: 'Batido Post-Entreno',
      categoria: 'Post-Entreno',
      tiempo: 5,
      calorias: 380,
      proteina: 35,
      dificultad: 'Muy Fácil',
      porciones: 1,
      ingredientes: [
        '1 scoop proteína de suero',
        '1 plátano',
        '200ml leche de almendras',
        '1 cucharada mantequilla de maní',
        'Hielo',
      ],
      preparacion: [
        'Añade todos los ingredientes a la licuadora',
        'Licua hasta obtener consistencia suave',
        'Sirve inmediatamente',
      ],
    },
    {
      nombre: 'Avena Proteica con Frutas',
      categoria: 'Desayuno',
      tiempo: 15,
      calorias: 450,
      proteina: 30,
      dificultad: 'Fácil',
      porciones: 1,
      ingredientes: [
        '80g avena',
        '1 scoop proteína vainilla',
        '250ml leche',
        'Frutos rojos',
        '1 cucharada miel',
      ],
      preparacion: [
        'Cocina la avena con la leche',
        'Añade la proteína y mezcla bien',
        'Decora con frutos rojos y miel',
      ],
    },
    {
      nombre: 'Salmón al Horno con Vegetales',
      categoria: 'Cena',
      tiempo: 35,
      calorias: 520,
      proteina: 42,
      dificultad: 'Media',
      porciones: 2,
      ingredientes: [
        '300g filete de salmón',
        'Brócoli',
        'Pimientos',
        'Aceite de oliva',
        'Limón y especias',
      ],
      preparacion: [
        'Precalienta el horno a 180°C',
        'Coloca el salmón y vegetales en bandeja',
        'Rocía con aceite y especias',
        'Hornea por 25 minutos',
      ],
    },
    {
      nombre: 'Tortilla de Claras y Espinacas',
      categoria: 'Desayuno',
      tiempo: 10,
      calorias: 280,
      proteina: 32,
      dificultad: 'Fácil',
      porciones: 1,
      ingredientes: [
        '6 claras de huevo',
        '100g espinaca fresca',
        '50g queso bajo en grasa',
        'Cebolla',
        'Tomate',
      ],
      preparacion: [
        'Saltea la espinaca y cebolla',
        'Bate las claras y vierte en la sartén',
        'Añade el queso y cocina hasta cuajar',
      ],
    },
    {
      nombre: 'Wrap de Atún con Vegetales',
      categoria: 'Snacks',
      tiempo: 10,
      calorias: 320,
      proteina: 28,
      dificultad: 'Muy Fácil',
      porciones: 1,
      ingredientes: [
        '1 tortilla integral',
        '150g atún en agua',
        'Lechuga',
        'Tomate',
        'Yogur griego',
      ],
      preparacion: [
        'Mezcla el atún con yogur griego',
        'Coloca los vegetales en la tortilla',
        'Añade el atún y enrolla',
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black mb-2">Recetas</h1>
          <p className="text-gray-600">Opciones saludables y deliciosas</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition shadow-lg">
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

                <button className="w-full py-2 bg-white hover:bg-white text-gray-600 hover:text-black rounded-lg transition text-sm font-medium">
                  Ver Receta Completa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

