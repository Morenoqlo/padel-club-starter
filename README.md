# 🎾 Padel Club Starter Kit

> Starter kit profesional y reutilizable para clubes deportivos tipo pádel.
> Diseñado para ser vendido como plantilla premium a múltiples clientes.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 (App Router) + TypeScript |
| Estilos | Tailwind CSS + shadcn/ui |
| Animaciones | Framer Motion |
| Backend | Supabase (DB + Auth + Storage) |
| Base de datos | PostgreSQL (via Supabase) |
| Pagos | Stripe / MercadoPago / Transbank |
| Estado global | Zustand |
| Formularios | React Hook Form + Zod |
| Emails | Resend (configurar) |
| Deploy | Vercel |

---

## Estructura del Proyecto

```
padel-club-starter/
├── app/
│   ├── (marketing)/          # Páginas públicas
│   │   ├── page.tsx          # Home
│   │   ├── club/             # Sobre el club
│   │   ├── reservas/         # Página de reservas
│   │   ├── clases/           # Academia
│   │   ├── eventos/          # Torneos y eventos
│   │   ├── galeria/          # Galería
│   │   ├── tienda/           # Tienda online
│   │   ├── producto/[slug]/  # Detalle de producto
│   │   ├── contacto/         # Contacto
│   │   ├── faq/              # FAQ
│   │   └── legal/            # Términos y privacidad
│   ├── admin/                # Panel de administración
│   │   ├── login/            # Login admin
│   │   ├── productos/        # CRUD productos
│   │   ├── galeria/          # CRUD galería
│   │   ├── eventos/          # CRUD eventos
│   │   ├── clases/           # CRUD clases
│   │   ├── faq/              # CRUD FAQ
│   │   └── configuracion/    # Configuración del sitio
│   ├── api/
│   │   ├── contact/          # Endpoint formulario contacto
│   │   ├── checkout/         # Endpoint checkout multi-proveedor
│   │   └── webhooks/stripe/  # Webhook Stripe
│   ├── sitemap.ts            # Sitemap dinámico
│   └── robots.ts             # Robots.txt
├── components/
│   ├── ui/                   # Componentes base (shadcn)
│   ├── sections/             # Secciones del home
│   ├── layout/               # Navbar, Footer
│   ├── shared/               # Cards, Cart, etc.
│   └── admin/                # Componentes admin
├── config/
│   ├── brand.ts              # ⭐ CONFIG PRINCIPAL DEL CLIENTE
│   ├── navigation.ts         # Navegación
│   └── site.ts               # Config SEO
├── hooks/                    # Custom hooks
├── lib/
│   ├── supabase/             # Clientes Supabase
│   ├── payments/             # Stripe, MercadoPago, Transbank
│   ├── utils.ts              # Utilidades
│   └── validations.ts        # Schemas Zod
├── services/                 # Consultas a DB
├── types/                    # TypeScript types
└── supabase/
    ├── migrations/           # Schema SQL
    └── seed.sql              # Datos demo
```

---

## Instalación Rápida

```bash
# 1. Clonar o descomprimir el starter
cd padel-club-starter

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase

# 4. Aplicar schema de base de datos
supabase db push
# o directamente en el SQL Editor de Supabase

# 5. Insertar datos de demo (opcional)
# Ejecutar supabase/seed.sql en el SQL Editor

# 6. Iniciar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Variables de Entorno Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://tuclub.com
```

Ver `.env.example` para la lista completa.

---

## Páginas Incluidas

| Página | Ruta | Descripción |
|--------|------|-------------|
| Home | `/` | Hero + todas las secciones |
| Club | `/club` | Sobre el club, equipo, instalaciones |
| Reservas | `/reservas` | CTA a sistema externo |
| Clases | `/clases` | Academia y programas |
| Eventos | `/eventos` | Torneos y actividades |
| Galería | `/galeria` | Fotos del club |
| Tienda | `/tienda` | Productos y merch |
| Producto | `/producto/[slug]` | Detalle con variantes |
| Contacto | `/contacto` | Formulario + mapa |
| FAQ | `/faq` | Preguntas frecuentes |
| Legal | `/legal` | Términos y privacidad |
| Admin | `/admin` | Panel de gestión |

---

## Comandos

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Producción local
npm run type-check   # Verificar TypeScript
npm run lint         # ESLint
npm run db:migrate   # Aplicar migraciones
npm run db:seed      # Insertar datos demo
```
