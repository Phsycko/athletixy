'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AthleteInternLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("athletixy_session");
      if (!raw) {
        router.replace("/");
        return;
      }

      const data = JSON.parse(raw);

      if (!data.loggedIn || data.role !== "ATHLETE_INTERNO") {
        router.replace("/");
        return;
      }

      setUser(data);
    } catch (e) {
      router.replace("/");
    }
  }, [router]);

  if (!user) {
    return null; // evita pantalla blanca por error de render
  }

  return <>{children}</>;
}
