'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Agregar meta tags para PWA solo si no existen
      if (!document.querySelector('link[rel="manifest"]')) {
        const manifestLink = document.createElement('link')
        manifestLink.rel = 'manifest'
        manifestLink.href = '/manifest.json'
        document.head.appendChild(manifestLink)
      }

      if (!document.querySelector('meta[name="theme-color"]')) {
        const themeColor = document.createElement('meta')
        themeColor.name = 'theme-color'
        themeColor.content = '#000000'
        document.head.appendChild(themeColor)
      }

      if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
        const appleCapable = document.createElement('meta')
        appleCapable.name = 'apple-mobile-web-app-capable'
        appleCapable.content = 'yes'
        document.head.appendChild(appleCapable)
      }

      if (!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')) {
        const appleStatusBar = document.createElement('meta')
        appleStatusBar.name = 'apple-mobile-web-app-status-bar-style'
        appleStatusBar.content = 'default'
        document.head.appendChild(appleStatusBar)
      }

      if (!document.querySelector('meta[name="apple-mobile-web-app-title"]')) {
        const appleTitle = document.createElement('meta')
        appleTitle.name = 'apple-mobile-web-app-title'
        appleTitle.content = 'Athletixy'
        document.head.appendChild(appleTitle)
      }

      /**
       * SERVICE WORKER DESACTIVADO
       * Eliminar el SW evita bloqueos y errores de rutas cacheadas.
       * Lo activaremos más adelante cuando la app esté estable.
       */
      // if ('serviceWorker' in navigator) {
      //   window.addEventListener('load', () => {
      //     navigator.serviceWorker
      //       .register('/sw.js')
      //       .then((registration) => {
      //         console.log('SW registered: ', registration)
      //       })
      //       .catch((registrationError) => {
      //         console.log('SW registration failed: ', registrationError)
      //       })
      //   })
      // }
    }
  }, [])

  return null
}

