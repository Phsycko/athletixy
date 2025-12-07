'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GymPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir automáticamente al dashboard
    router.push('/gym/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
      <div className="text-center">
        <p className="text-gray-600 dark:text-zinc-400">Redirigiendo...</p>
      </div>
    </div>
  )
}

