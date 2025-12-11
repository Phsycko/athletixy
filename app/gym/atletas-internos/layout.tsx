'use client'

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";

export default function AthleteInternLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsChecking(false);
      return;
    }

    const checkAuth = () => {
      try {
        const sessionStr = localStorage.getItem("athletixy_session");
        
        if (!sessionStr) {
          console.log('No hay sesión en localStorage');
          setIsChecking(false);
          window.location.href = '/';
          return;
        }

        const session = JSON.parse(sessionStr);
        console.log('Sesión encontrada:', { loggedIn: session?.loggedIn, role: session?.role });
        
        const role = session?.role || '';
        const normalizedRole = role.toUpperCase();
        
        if (session?.loggedIn && normalizedRole === 'ATHLETE_INTERNO') {
          console.log('Sesión válida para ATHLETE_INTERNO');
          setIsAuthorized(true);
          setIsChecking(false);
        } else {
          console.log('Sesión inválida o rol incorrecto:', { loggedIn: session?.loggedIn, role: normalizedRole });
          setIsChecking(false);
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        localStorage.removeItem('athletixy_session');
        setIsChecking(false);
        window.location.href = '/';
      }
    };

    // Pequeño delay para asegurar que localStorage esté disponible
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-zinc-100 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-zinc-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-zinc-400">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
