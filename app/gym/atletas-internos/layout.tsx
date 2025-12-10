'use client'

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
          setIsChecking(false);
          setIsAuthorized(false);
          window.location.href = '/';
          return;
        }

        const session = JSON.parse(sessionStr);
        const role = session?.role || '';
        
        // Normalizar el rol para comparación
        const normalizedRole = role.toUpperCase();
        
        if (session?.loggedIn && normalizedRole === 'ATHLETE_INTERNO') {
          setIsAuthorized(true);
          setIsChecking(false);
        } else {
          setIsChecking(false);
          setIsAuthorized(false);
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        localStorage.removeItem('athletixy_session');
        setIsChecking(false);
        setIsAuthorized(false);
        window.location.href = '/';
      }
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-zinc-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
