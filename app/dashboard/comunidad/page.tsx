'use client'

import { Heart, MessageCircle, Share2, Plus, TrendingUp, Users, Image as ImageIcon, Video } from 'lucide-react'

export default function ComunidadPage() {
  const publicaciones = [
    {
      autor: 'Ana Torres',
      tiempo: 'Hace 2 horas',
      avatar: 'AT',
      contenido: '¡Nuevo récord personal en peso muerto! 130kg x 5 reps. El trabajo constante siempre da frutos 💪',
      imagen: true,
      likes: 47,
      comentarios: 12,
      compartidos: 3,
    },
    {
      autor: 'Jorge Ramírez',
      tiempo: 'Hace 4 horas',
      avatar: 'JR',
      contenido: 'Compartiendo mi progreso de 6 meses. De 92kg a 78kg manteniendo la masa muscular. Gracias al equipo de Athletixy por el apoyo constante.',
      imagen: true,
      likes: 156,
      comentarios: 28,
      compartidos: 15,
    },
    {
      autor: 'Laura Martínez',
      tiempo: 'Hace 8 horas',
      avatar: 'LM',
      contenido: '¿Alguien tiene tips para mejorar la técnica en sentadilla frontal? Estoy trabajando en mi movilidad de muñecas pero me cuesta mantener la barra.',
      imagen: false,
      likes: 23,
      comentarios: 31,
      compartidos: 2,
    },
    {
      autor: 'Diego Flores',
      tiempo: 'Hace 12 horas',
      avatar: 'DF',
      contenido: 'Primera competencia de CrossFit completada! No gané pero la experiencia fue increíble. Ya pensando en la próxima 🎯',
      imagen: true,
      likes: 89,
      comentarios: 19,
      compartidos: 7,
    },
    {
      autor: 'Sofía Núñez',
      tiempo: 'Ayer',
      avatar: 'SN',
      contenido: 'Receta rápida post-entreno: Batido de proteína con plátano, mantequilla de maní y avena. Simple pero efectivo!',
      imagen: true,
      likes: 134,
      comentarios: 24,
      compartidos: 42,
    },
  ]

  const gruposPopulares = [
    { nombre: 'Powerlifting México', miembros: 2847, nuevos: 12 },
    { nombre: 'Nutrición Deportiva', miembros: 4521, nuevos: 28 },
    { nombre: 'Runners Athletixy', miembros: 1893, nuevos: 8 },
    { nombre: 'Hipertrofia y Fitness', miembros: 3654, nuevos: 19 },
  ]

  const eventosCercanos = [
    { titulo: 'Torneo de Levantamiento', fecha: '15 Dic', participantes: 45 },
    { titulo: 'Maratón Virtual', fecha: '20 Dic', participantes: 128 },
    { titulo: 'Webinar: Nutrición', fecha: '22 Dic', participantes: 89 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black mb-2">Comunidad</h1>
          <p className="text-gray-600">Conecta con otros atletas</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition shadow-lg">
          <Plus className="w-5 h-5" />
          Nueva Publicación
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feed Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Crear Publicación */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold">AH</span>
              </div>
              <input
                type="text"
                placeholder="¿Qué estás logrando hoy?"
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 text-gray-600 hover:text-black rounded-lg transition text-sm border border-gray-300">
                <ImageIcon className="w-4 h-4" />
                Foto
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 text-gray-600 hover:text-black rounded-lg transition text-sm border border-gray-300">
                <Video className="w-4 h-4" />
                Video
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 text-gray-600 hover:text-black rounded-lg transition text-sm border border-gray-300">
                <TrendingUp className="w-4 h-4" />
                Progreso
              </button>
            </div>
          </div>

          {/* Publicaciones */}
          {publicaciones.map((post, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition">
              {/* Header de la publicación */}
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-black text-sm font-bold">{post.avatar}</span>
                  </div>
                  <div>
                    <p className="text-black font-semibold">{post.autor}</p>
                    <p className="text-gray-500 text-xs">{post.tiempo}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{post.contenido}</p>
              </div>

              {/* Imagen (simulada) */}
              {post.imagen && (
                <div className="h-80 bg-gradient-to-br from-primary-600/20 to-purple-600/20 flex items-center justify-center border-y border-gray-200">
                  <ImageIcon className="w-16 h-16 text-gray-600" />
                </div>
              )}

              {/* Acciones */}
              <div className="p-6 pt-4">
                <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
                  <span>{post.likes} me gusta</span>
                  <div className="flex gap-3">
                    <span>{post.comentarios} comentarios</span>
                    <span>{post.compartidos} compartidos</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-white rounded-lg transition text-gray-600 hover:text-red-400">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">Me gusta</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-white rounded-lg transition text-gray-600 hover:text-blue-400">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Comentar</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-white rounded-lg transition text-gray-600 hover:text-green-400">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Compartir</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Grupos Populares */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h2 className="text-black font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-700" />
              Grupos Populares
            </h2>
            <div className="space-y-3">
              {gruposPopulares.map((grupo, index) => (
                <div
                  key={index}
                  className="p-3 bg-white rounded-lg border border-gray-300 hover:border-gray-600 transition cursor-pointer"
                >
                  <p className="text-black font-medium text-sm mb-1">{grupo.nombre}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{grupo.miembros.toLocaleString()} miembros</span>
                    <span className="text-green-400">+{grupo.nuevos} hoy</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-gray-700 hover:text-primary-300 text-sm font-medium transition">
              Ver todos los grupos
            </button>
          </div>

          {/* Eventos Cercanos */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h2 className="text-black font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-700" />
              Eventos Cercanos
            </h2>
            <div className="space-y-3">
              {eventosCercanos.map((evento, index) => (
                <div
                  key={index}
                  className="p-3 bg-white rounded-lg border border-gray-300 hover:border-gray-600 transition cursor-pointer"
                >
                  <p className="text-black font-medium text-sm mb-1">{evento.titulo}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{evento.fecha}</span>
                    <span className="text-gray-700">{evento.participantes} inscritos</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-gray-700 hover:text-primary-300 text-sm font-medium transition">
              Ver todos los eventos
            </button>
          </div>

          {/* Sugerencias */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h2 className="text-black font-semibold mb-4">Atletas Sugeridos</h2>
            <div className="space-y-3">
              {['Martín López', 'Carmen Ruiz', 'Pablo Jiménez'].map((nombre, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-black text-xs font-bold">
                        {nombre.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-black text-sm font-medium">{nombre}</p>
                      <p className="text-gray-500 text-xs">Atleta</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-black hover:bg-gray-800 text-white text-xs rounded-lg transition">
                    Seguir
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

