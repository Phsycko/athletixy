'use client'

import { useEffect, useState } from 'react';

export default function AthleteInternDashboard() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const session = localStorage.getItem("athletixy_session");
        if (session) {
          const data = JSON.parse(session);
          setUserData(data);
          console.log('Dashboard cargado para usuario:', data);
        }
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
      }
    }
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-100 mb-2">
          Mi Panel
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 mb-6">
          Bienvenido atleta interno del gimnasio.
        </p>
        
        {userData && (
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              <strong>Email:</strong> {userData.email}
            </p>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              <strong>Nombre:</strong> {userData.nombre}
            </p>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              <strong>Rol:</strong> {userData.role}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-100 mb-2">
              Mis Rutinas
            </h2>
            <p className="text-gray-500 dark:text-zinc-400">
              Próximamente podrás ver tus rutinas asignadas aquí.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-100 mb-2">
              Mi Progreso
            </h2>
            <p className="text-gray-500 dark:text-zinc-400">
              Próximamente podrás ver tu progreso aquí.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
