# Ulises Tours - Plataforma de Reservas para Guías de Turistas

Plataforma web completa para gestión de tours, reservas, pagos y comunicación multi-canal.

## 🚀 Características

- **Frontend Moderno**: Next.js 14 con App Router, TailwindCSS, Framer Motion
- **Backend Robusto**: Node.js, API REST, PostgreSQL con Prisma ORM
- **Pagos**: Integración con Stripe y Mercado Pago
- **Calendario**: FullCalendar con disponibilidad en tiempo real
- **Notificaciones**: WhatsApp y Email automáticas
- **Panel de Administración**: Gestión completa de reservas, tours, vehículos y mensajes
- **Multi-canal**: Centralización de mensajes desde WhatsApp, Instagram, Facebook, Email, etc.
- **Responsive**: Diseño optimizado para móviles y tablets

## 📋 Requisitos Previos

- Node.js 20 o superior
- PostgreSQL 15 o superior
- npm o yarn

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd ULISES
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. Configurar la base de datos:
```bash
npx prisma generate
npx prisma db push
```

5. Crear usuario administrador (opcional):
```bash
npx prisma studio
# O usar un script de seed
```

6. Ejecutar en desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
ULISES/
├── app/                    # Next.js App Router
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   ├── contacto/          # Página de contacto
│   ├── disponibilidad/    # Calendario de disponibilidad
│   ├── galeria/           # Galería de imágenes
│   ├── precios/           # Página de precios
│   ├── reservar/          # Proceso de reserva
│   ├── tours/             # Lista y detalle de tours
│   └── vehiculos/         # Página de vehículos
├── components/            # Componentes React
├── lib/                   # Utilidades y helpers
├── prisma/               # Esquema de Prisma
└── public/               # Archivos estáticos
```

## 🔐 Autenticación

El panel de administración requiere autenticación JWT. Las credenciales se gestionan a través de la base de datos.

## 💳 Pagos

### Stripe
1. Crear cuenta en Stripe
2. Obtener las claves API
3. Configurar en `.env`

### Mercado Pago
1. Crear cuenta en Mercado Pago
2. Obtener Access Token
3. Configurar en `.env`

## 📱 Notificaciones

### WhatsApp (Twilio)
1. Crear cuenta en Twilio
2. Configurar WhatsApp Sandbox
3. Obtener credenciales
4. Configurar en `.env`

### Email (SMTP)
Configurar credenciales SMTP en `.env`

## 🗄️ Base de Datos

El esquema de Prisma incluye:
- Usuarios (guías)
- Clientes
- Tours
- Reservas
- Vehículos
- Disponibilidad
- Pagos
- Mensajes
- Notificaciones

## 📝 Scripts Disponibles

- `npm run dev` - Desarrollo
- `npm run build` - Construcción para producción
- `npm start` - Ejecutar en producción
- `npm run db:generate` - Generar Prisma Client
- `npm run db:push` - Sincronizar esquema con BD
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:studio` - Abrir Prisma Studio

## 🚀 Despliegue

### VPS

1. Clonar el repositorio en el servidor
2. Configurar `.env` con variables de producción
3. Instalar dependencias: `npm install`
4. Construir la aplicación: `npm run build`
5. Ejecutar en producción: `npm start`
6. Configurar reverse proxy (nginx) si es necesario

### Vercel/Netlify

1. Conectar repositorio
2. Configurar variables de entorno
3. Configurar base de datos PostgreSQL externa
4. Desplegar

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Soporte

Para soporte, contactar al equipo de desarrollo.

