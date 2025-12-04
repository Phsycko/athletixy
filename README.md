# Athletixy - Plataforma de Gestión para Atletas

Aplicación web completa para la gestión integral de atletas, construida con Next.js, TypeScript y Tailwind CSS.

## 🚀 Características

### Sistema de Autenticación
- Login seguro con credenciales
- Sesión persistente con localStorage
- Protección de rutas del dashboard

### Dashboard Completo
- **Dietas**: Plan nutricional personalizado con macronutrientes
- **Rutinas**: Planificación de entrenamientos semanales
- **Membresías**: Gestión de planes y pagos
- **Progreso**: Seguimiento detallado de peso, medidas y rendimiento
- **Recetas**: Opciones saludables con información nutricional
- **Nutriólogo**: Consultas y seguimiento nutricional
- **Coach**: Sesiones de entrenamiento personalizado
- **Comunidad**: Red social para atletas
- **Marketplace**: Tienda de productos deportivos
- **Notificaciones**: Centro de notificaciones en tiempo real
- **Soporte**: Sistema de tickets y ayuda
- **Ajustes**: Configuración de cuenta y preferencias

## 🛠️ Tecnologías

- **Next.js 14**: Framework de React
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos modernos y responsivos
- **Lucide React**: Iconos profesionales
- **Date-fns**: Manejo de fechas

## 📦 Instalación

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

3. **Abrir en el navegador:**
```
http://localhost:3000
```

## 🎨 Diseño

La aplicación utiliza una paleta monocromática limpia:
- Fondo principal: Blanco puro (#ffffff)
- Elementos: Blancos con bordes grises
- Acentos: Negro para elementos activos
- Estados: Verde (éxito), Rojo (error), Amarillo (advertencia)
- Textos: Negro y grises oscuros para máximo contraste

## 📱 Responsive

Totalmente responsive con breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔐 Autenticación

Para acceder al dashboard, usa cualquier email y contraseña válidos en la página de login. La aplicación guardará la sesión localmente.

## 🏗️ Estructura del Proyecto

```
ATHLETIXY/
├── app/
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx             # Layout raíz
│   ├── page.tsx               # Página de login
│   └── dashboard/
│       ├── layout.tsx         # Layout del dashboard con navegación
│       ├── page.tsx           # Dashboard principal
│       ├── dietas/
│       ├── rutinas/
│       ├── membresias/
│       ├── progreso/
│       ├── recetas/
│       ├── nutriologo/
│       ├── coach/
│       ├── comunidad/
│       ├── marketplace/
│       ├── notificaciones/
│       ├── soporte/
│       └── ajustes/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🚀 Scripts Disponibles

- `npm run dev` - Ejecuta en modo desarrollo
- `npm run build` - Construye para producción
- `npm start` - Ejecuta la versión de producción
- `npm run lint` - Ejecuta el linter

## 📈 Características Destacadas

### Dashboard Interactivo
- Estadísticas en tiempo real
- Gráficos de progreso
- Calendario de actividades
- Objetivos semanales

### Gestión Nutricional
- Planes de dieta personalizados
- Tracking de macronutrientes
- Recetario completo
- Consultas con nutriólogo

### Entrenamiento Profesional
- Rutinas personalizadas
- Seguimiento de ejercicios
- Sesiones con coach personal
- Registro de récords personales

### Comunidad Activa
- Feed social
- Grupos y eventos
- Compartir progreso
- Interacción con otros atletas

### Marketplace Integrado
- Productos deportivos
- Suplementos premium
- Ropa y equipamiento
- Ofertas exclusivas

## 🎯 Próximas Mejoras

- Integración con API backend
- Autenticación con OAuth
- Gráficos interactivos (Chart.js)
- Notificaciones push
- Chat en tiempo real
- Integración con wearables
- Exportación de datos
- App móvil nativa

## 📝 Notas

Esta es una versión frontend completa con datos simulados. Para un entorno de producción, se recomienda:
- Implementar un backend con base de datos
- Sistema de autenticación robusto (JWT, OAuth)
- API RESTful o GraphQL
- Almacenamiento de imágenes en cloud
- Sistema de pagos integrado

## 📄 Licencia

© 2025 Athletixy. Todos los derechos reservados.

## 🤝 Soporte

Para soporte técnico o preguntas:
- Email: soporte@athletixy.com
- Teléfono: +52 55 1234 5678

---

Desarrollado con ❤️ para atletas profesionales

