# Guía de Inicio Rápido - Ulises Tours

## 🚀 Configuración Inicial

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Base de Datos

Crear archivo `.env` en la raíz del proyecto:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ulises_tours?schema=public"
JWT_SECRET="tu-clave-secreta-aqui"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Inicializar Base de Datos
```bash
# Generar Prisma Client
npm run db:generate

# Crear tablas en la base de datos
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed
```

### 4. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔐 Credenciales por Defecto

Después de ejecutar el seed:

- **Admin**: admin@ulisestours.com / admin123
- **Guía**: guia@ulisestours.com / admin123

## 📋 Estructura de Rutas

### Públicas
- `/` - Página de inicio
- `/tours` - Lista de tours
- `/tours/[id]` - Detalle de tour
- `/vehiculos` - Flota de vehículos
- `/precios` - Planes y precios
- `/galeria` - Galería de imágenes
- `/disponibilidad` - Calendario de disponibilidad
- `/reservar` - Proceso de reserva
- `/contacto` - Formulario de contacto
- `/canales` - Canales de venta

### Panel de Administración
- `/admin/login` - Login del guía
- `/admin` - Dashboard
- `/admin/reservations` - Gestión de reservas
- `/admin/tours` - Gestión de tours
- `/admin/messages` - Mensajes centralizados

## 🔧 Configuración de Servicios Externos

### Stripe (Pagos)
1. Crear cuenta en https://stripe.com
2. Obtener claves API
3. Agregar al `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
```

### Mercado Pago
1. Crear cuenta en https://www.mercadopago.com
2. Obtener Access Token
3. Agregar al `.env`:
```env
MERCADOPAGO_ACCESS_TOKEN=tu_token_aqui
```

### Twilio (WhatsApp)
1. Crear cuenta en https://www.twilio.com
2. Configurar WhatsApp Sandbox
3. Agregar al `.env`:
```env
TWILIO_ACCOUNT_SID=tu_sid
TWILIO_AUTH_TOKEN=tu_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+tu_numero
```

### Email (SMTP)
Configurar credenciales SMTP en `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
SMTP_FROM=noreply@ulisestours.com
```

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm start` - Ejecutar en producción
- `npm run db:generate` - Generar Prisma Client
- `npm run db:push` - Sincronizar esquema
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:studio` - Abrir Prisma Studio
- `npm run db:seed` - Poblar base de datos

## 🎨 Personalización

### Colores
Editar `tailwind.config.ts` para cambiar la paleta de colores.

### Contenido
- Tours: Editar desde el panel de administración o directamente en la base de datos
- Imágenes: Subir a `/public` o usar URLs externas
- Textos: Editar componentes en `/components` y páginas en `/app`

## 🐛 Solución de Problemas

### Error de conexión a base de datos
- Verificar que PostgreSQL esté corriendo
- Verificar `DATABASE_URL` en `.env`
- Ejecutar `npm run db:push`

### Error de autenticación
- Verificar `JWT_SECRET` en `.env`
- Limpiar localStorage del navegador

### Errores de build
- Ejecutar `npm run db:generate`
- Verificar que todas las dependencias estén instaladas
- Limpiar `.next` y `node_modules`, luego reinstalar

## 📞 Soporte

Para problemas o preguntas, revisar la documentación completa en `README.md`

