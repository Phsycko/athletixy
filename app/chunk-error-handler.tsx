'use client'

if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    const target = e.target as HTMLScriptElement | HTMLLinkElement | null;
    if (target && 'src' in target && target.src && target.src.includes("/_next/static/chunks/")) {
      console.warn("Chunk perdido, recargando App...");
      window.location.reload();
    }
  }, true);
}

export default function ChunkErrorHandler() {
  return null;
}

