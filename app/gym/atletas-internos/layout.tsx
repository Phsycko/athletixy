'use client'

import { useEffect, useState } from "react";

export default function AthleteInternLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isVerifying === false) return;

    const verifySession = () => {
      try {
        const session = localStorage.getItem("athletixy_session");
        if (!session) {
          setIsVerifying(false);
          setTimeout(() => window.location.href = '/', 100);
          return;
        }

        const data = JSON.parse(session);
        if (!data.loggedIn || data.role !== "ATHLETE_INTERNO") {
          setIsVerifying(false);
          setTimeout(() => window.location.href = '/', 100);
          return;
        }

        setUser(data);
        setIsVerifying(false);
      } catch (error) {
        console.error('Error parsing session:', error);
        localStorage.removeItem('athletixy_session');
        setIsVerifying(false);
        setTimeout(() => window.location.href = '/', 100);
      }
    };

    verifySession();
  }, [isVerifying]);

  if (isVerifying || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-zinc-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
