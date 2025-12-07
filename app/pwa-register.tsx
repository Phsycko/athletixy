'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Agregar meta tags para PWA
      const manifestLink = document.createElement('link')
      manifestLink.rel = 'manifest'
      manifestLink.href = '/manifest.json'
      document.head.appendChild(manifestLink)

      const themeColor = document.createElement('meta')
      themeColor.name = 'theme-color'
      themeColor.content = '#000000'
      document.head.appendChild(themeColor)

      const appleCapable = document.createElement('meta')
      appleCapable.name = 'apple-mobile-web-app-capable'
      appleCapable.content = 'yes'
      document.head.appendChild(appleCapable)

      const appleStatusBar = document.createElement('meta')
      appleStatusBar.name = 'apple-mobile-web-app-status-bar-style'
      appleStatusBar.content = 'default'
      document.head.appendChild(appleStatusBar)

      const appleTitle = document.createElement('meta')
      appleTitle.name = 'apple-mobile-web-app-title'
      appleTitle.content = 'Athletixy'
      document.head.appendChild(appleTitle)

      // Registrar service worker
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
              console.log('SW registered: ', registration)
            })
            .catch((registrationError) => {
              console.log('SW registration failed: ', registrationError)
            })
        })
      }
    }
  }, [])

  return null
}

