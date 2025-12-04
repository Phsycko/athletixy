'use client'

import { ShoppingBag, Star, Search, Filter, Heart, ShoppingCart, TrendingUp } from 'lucide-react'

export default function MarketplacePage() {
  const categorias = ['Todo', 'Suplementos', 'Ropa', 'Equipamiento', 'Accesorios', 'Nutrición']

  const productosDestacados = [
    {
      nombre: 'Proteína de Suero Premium',
      marca: 'NutriPro',
      precio: 899,
      precioAnterior: 1099,
      rating: 4.8,
      reviews: 234,
      categoria: 'Suplementos',
      descuento: 18,
      bestseller: true,
    },
    {
      nombre: 'Mancuernas Ajustables 20kg',
      marca: 'FitGear',
      precio: 2499,
      precioAnterior: null,
      rating: 4.9,
      reviews: 156,
      categoria: 'Equipamiento',
      descuento: 0,
      bestseller: false,
    },
    {
      nombre: 'Shaker con Compartimentos',
      marca: 'AthleticWear',
      precio: 299,
      precioAnterior: 399,
      rating: 4.6,
      reviews: 89,
      categoria: 'Accesorios',
      descuento: 25,
      bestseller: false,
    },
    {
      nombre: 'Creatina Monohidratada 500g',
      marca: 'PowerMax',
      precio: 449,
      precioAnterior: null,
      rating: 4.9,
      reviews: 312,
      categoria: 'Suplementos',
      descuento: 0,
      bestseller: true,
    },
    {
      nombre: 'Playera Dry-Fit Pro',
      marca: 'AthleticWear',
      precio: 599,
      precioAnterior: 799,
      rating: 4.7,
      reviews: 178,
      categoria: 'Ropa',
      descuento: 25,
      bestseller: false,
    },
    {
      nombre: 'Cinturón de Levantamiento',
      marca: 'StrongLift',
      precio: 1299,
      precioAnterior: null,
      rating: 5.0,
      reviews: 92,
      categoria: 'Equipamiento',
      descuento: 0,
      bestseller: true,
    },
    {
      nombre: 'BCAA 2:1:1 300g',
      marca: 'NutriPro',
      precio: 549,
      precioAnterior: 699,
      rating: 4.7,
      reviews: 201,
      categoria: 'Suplementos',
      descuento: 21,
      bestseller: false,
    },
    {
      nombre: 'Rodilleras Deportivas',
      marca: 'FitGear',
      precio: 799,
      precioAnterior: null,
      rating: 4.8,
      reviews: 134,
      categoria: 'Accesorios',
      descuento: 0,
      bestseller: false,
    },
    {
      nombre: 'Pre-Workout Energía+',
      marca: 'PowerMax',
      precio: 749,
      precioAnterior: 899,
      rating: 4.6,
      reviews: 267,
      categoria: 'Suplementos',
      descuento: 17,
      bestseller: true,
    },
  ]

  const ofertas = [
    { titulo: 'Descuento 25% en Ropa Deportiva', valido: '5 días' },
    { titulo: 'Envío Gratis en pedidos +$1000', valido: 'Permanente' },
    { titulo: '2x1 en Accesorios Seleccionados', valido: '3 días' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black mb-2">Marketplace</h1>
          <p className="text-gray-600">Productos premium para atletas</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition shadow-lg">
          <ShoppingCart className="w-5 h-5" />
          <span>Carrito (0)</span>
        </button>
      </div>

      {/* Ofertas Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ofertas.map((oferta, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 text-black"
          >
            <p className="font-semibold mb-2">{oferta.titulo}</p>
            <p className="text-sm text-black/80">Válido: {oferta.valido}</p>
          </div>
        ))}
      </div>

      {/* Búsqueda y Filtros */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-lg transition border-2 border-gray-200">
            <Filter className="w-5 h-5" />
            Filtros
          </button>
        </div>
      </div>

      {/* Categorías */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categorias.map((cat, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              index === 0
                ? 'bg-white text-black'
                : 'bg-white text-gray-600 hover:bg-gray-200 hover:text-black border-2 border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosDestacados.map((producto, index) => (
          <div
            key={index}
            className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-600 transition-all hover:shadow-xl group"
          >
            {/* Imagen placeholder */}
            <div className="relative h-56 bg-gradient-to-br from-primary-600/20 to-purple-600/20 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-gray-600" />
              {producto.descuento > 0 && (
                <div className="absolute top-3 right-3 bg-red-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                  -{producto.descuento}%
                </div>
              )}
              {producto.bestseller && (
                <div className="absolute top-3 left-3 bg-yellow-500 text-dark-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Bestseller
                </div>
              )}
              <button className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition">
                <Heart className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-3">
                <span className="text-gray-700 text-xs font-medium">{producto.marca}</span>
                <h3 className="text-black font-semibold mt-1 group-hover:text-gray-700 transition">
                  {producto.nombre}
                </h3>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-black text-sm font-semibold">{producto.rating}</span>
                </div>
                <span className="text-gray-600 text-xs">({producto.reviews} reseñas)</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-black">${producto.precio}</span>
                {producto.precioAnterior && (
                  <span className="text-gray-600 text-sm line-through">${producto.precioAnterior}</span>
                )}
              </div>

              <button className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition font-medium flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Agregar al Carrito
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Información Adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
          <div className="bg-green-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-black font-semibold mb-2">Envío Gratis</h3>
          <p className="text-gray-600 text-sm">En compras mayores a $1000</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
          <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-black font-semibold mb-2">Calidad Premium</h3>
          <p className="text-gray-600 text-sm">Productos verificados y certificados</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
          <div className="bg-purple-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-black font-semibold mb-2">Devoluciones Fáciles</h3>
          <p className="text-gray-600 text-sm">30 días para devolver tu compra</p>
        </div>
      </div>
    </div>
  )
}

