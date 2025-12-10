'use client'

import { useEffect } from 'react';

export default function AthleteInternDashboard() {
  useEffect(() => {
    // Forzar recarga de caché si es necesario
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem("athletixy_session");
      if (!session) {
        window.location.href = '/';
      }
    }
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 min-h-screen">
      <h1 className="text-2xl font-bold text-black dark:text-zinc-100 mb-2">Mi Panel</h1>
      <p className="text-gray-500 dark:text-zinc-400">
        Bienvenido atleta interno del gimnasio.
      </p>
    </div>
  );
}
