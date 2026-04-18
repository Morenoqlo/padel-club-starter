# 🎨 Guía de Personalización para Nuevos Clientes

Esta guía explica cómo adaptar el starter kit para un nuevo cliente
en el menor tiempo posible.

---

## Tiempo estimado de personalización: 2-4 horas

---

## Paso 1 — Configuración central (15 min)

Edita **`config/brand.ts`** — este es el único archivo que necesitas tocar
para la mayoría de los cambios de branding.

```ts
export const brandConfig = {
  name: "Nombre del Club",           // ← Cambia esto
  shortName: "NC",                    // ← Siglas para nav/logo
  tagline: "Tu tagline aquí",         // ← Frase principal
  description: "Descripción...",      // ← Para SEO y meta tags

  colors: {
    primary: "#000000",               // ← Color principal
    accent: "#22C55E",                // ← Color de acento (verde por defecto)
  },

  contact: {
    email: "contacto@tuclub.com",
    phone: "+56 9 XXXX XXXX",
    whatsapp: "+569XXXXXXXX",
  },

  location: {
    address: "Tu dirección",
    city: "Tu ciudad",
  },

  booking: {
    externalUrl: "https://tu-sistema-de-reservas.com",
    provider: "Playtomic",            // Nombre del sistema
  },

  social: {
    instagram: "https://instagram.com/tuclub",
    facebook: "https://facebook.com/tuclub",
  },
}
```

---

## Paso 2 — Variables de entorno (10 min)

```bash
cp .env.example .env.local
```

Rellena:
- `NEXT_PUBLIC_SUPABASE_URL` — URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Clave anon de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — Clave de servicio (solo server)
- `NEXT_PUBLIC_SITE_URL` — Dominio final del cliente

---

## Paso 3 — Base de datos (20 min)

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor**
3. Pega y ejecuta `supabase/migrations/001_initial_schema.sql`
4. Pega y ejecuta `supabase/seed.sql` (datos de ejemplo)
5. Crea un usuario admin en **Authentication > Users**

---

## Paso 4 — Contenido (30-60 min)

### Desde el Admin Panel (`/admin`)
- Subir productos y merch
- Subir fotos a la galería
- Crear eventos y torneos
- Actualizar FAQ

### Imágenes y assets
- Reemplaza `/public/logo.svg` con el logo del cliente
- Reemplaza `/public/og-image.jpg` (1200x630px)
- Reemplaza las URLs de imágenes placeholder en el hero

---

## Paso 5 — Colores personalizados (5 min)

Edita las variables CSS en `app/globals.css`:

```css
:root {
  --accent: 142 71% 45%;   /* HSL del color acento */
  --primary: 0 0% 4%;      /* HSL del color principal */
}
```

O bien actualiza `config/brand.ts` y aplícalos vía Tailwind extend.

---

## Paso 6 — Pagos (30-60 min)

### Stripe
1. Crear cuenta en stripe.com
2. Agregar keys en `.env.local`
3. Configurar webhook apuntando a `/api/webhooks/stripe`

### MercadoPago
1. Crear cuenta en mercadopago.cl
2. Agregar credentials en `.env.local`

### Transbank (solo Chile)
1. Solicitar credenciales en transbank.cl
2. Agregar en `.env.local`
3. Cambiar `TRANSBANK_ENVIRONMENT=production`

---

## Paso 7 — Deploy (15 min)

### Vercel (recomendado)
```bash
npm i -g vercel
vercel
```

Agrega las variables de entorno en el dashboard de Vercel.

### Variables que DEBES agregar en Vercel
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
```

---

## Checklist de entrega al cliente

- [ ] `config/brand.ts` actualizado con datos reales
- [ ] `.env.local` con todas las credenciales
- [ ] Schema de DB aplicado
- [ ] Datos demo reemplazados por datos reales
- [ ] Logo y og-image actualizados
- [ ] Sistema de reservas vinculado
- [ ] Admin panel probado (login, crear producto, subir foto)
- [ ] Formulario de contacto probado
- [ ] Sitemap generado correctamente
- [ ] Deploy en Vercel o servidor del cliente
- [ ] Dominio personalizado configurado

---

## Adaptar a otro deporte

Para adaptar el starter a otro deporte (tenis, fútbol, golf, etc.):

1. En `config/brand.ts`:
   ```ts
   sport: {
     name: "Tenis",
     icon: "🎾",
     courtName: "cancha",
   }
   ```

2. Actualizar textos en las sections si son muy específicos de pádel

3. Cambiar imágenes del hero y galería

El resto de la lógica (reservas, tienda, eventos, admin) funciona igual para cualquier deporte.
