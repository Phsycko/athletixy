'use client'

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AtletaInternoLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<"checking" | "allowed" | "denied">("checking")

  useEffect(() => {
    try {
      const raw = localStorage.getItem("athletixy_session")
      if (!raw) return setStatus("denied")

      const session = JSON.parse(raw)

      // Aceptar tanto ATLETA_INTERNO como ATHLETE_INTERNO para compatibilidad
      const role = session.role?.toUpperCase()
      if (!session.loggedIn || (role !== "ATLETA_INTERNO" && role !== "ATHLETE_INTERNO")) {
        setStatus("denied")
        return
      }

      // Validación mínima adicional
      if (!session.userId) {
        setStatus("denied")
        return
      }

      setStatus("allowed")
    } catch (err) {
      console.error("Error leyendo sesión ATLETA_INTERNO:", err)
      setStatus("denied")
    }
  }, [])

  useEffect(() => {
    if (status === "denied") router.replace("/")
  }, [status, router])

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (status === "allowed") {
    return <div>{children}</div>
  }

  return null
}

