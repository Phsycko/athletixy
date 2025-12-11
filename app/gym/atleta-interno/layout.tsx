'use client'

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AtletaInternoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsChecking(false)
      return
    }

    const checkSession = () => {
      try {
        const sessionStr = localStorage.getItem('athletixy_session')
        
        if (!sessionStr) {
          setIsChecking(false)
          setIsAuthorized(false)
          window.location.href = '/'
          return
        }

        const session = JSON.parse(sessionStr)
        
        if (!session.loggedIn) {
          setIsChecking(false)
          setIsAuthorized(false)
          window.location.href = '/'
          return
        }

        const role = session.role?.toUpperCase() || ''
        
        if (role !== 'ATLETA_INTERNO' && role !== 'ATHLETE_INTERNO') {
          setIsChecking(false)
          setIsAuthorized(false)
          window.location.href = '/'
          return
        }

        if (!session.userId) {
          setIsChecking(false)
          setIsAuthorized(false)
          window.location.href = '/'
          return
        }

        setIsAuthorized(true)
        setIsChecking(false)
      } catch (error) {
        console.error('Error verificando sesión:', error)
        localStorage.removeItem('athletixy_session')
        setIsChecking(false)
        setIsAuthorized(false)
        window.location.href = '/'
      }
    }

    checkSession()
  }, [])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-zinc-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

