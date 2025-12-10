'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AthleteInternLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem("athletixy_session");
    if (!session) return router.replace("/");

    const data = JSON.parse(session);
    if (!data.loggedIn || data.role !== "ATHLETE_INTERNO") {
      router.replace("/");
      return;
    }

    setUser(data);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return <>{children}</>;
}
