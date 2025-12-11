'use client'

export default function AtletaInternoDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-zinc-100 mb-2">
          Dashboard del Atleta Interno
        </h1>
        <p className="text-gray-500 dark:text-zinc-400">
          Panel de control del atleta interno - Cargado correctamente
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-6">
        <p className="text-black dark:text-zinc-100">
          ✅ La página del atleta interno ha cargado correctamente sin errores.
        </p>
      </div>
    </div>
  )
}
