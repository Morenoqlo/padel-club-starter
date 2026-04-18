# 🚀 Guía de Deploy

## Deploy en Vercel (recomendado)

### Opción A — CLI
```bash
npm i -g vercel
vercel login
vercel
```

### Opción B — GitHub
1. Push a GitHub
2. Conectar repo en vercel.com
3. Agregar variables de entorno
4. Deploy automático

### Variables de entorno en Vercel
Agrega en **Settings > Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL        = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = eyJ...
SUPABASE_SERVICE_ROLE_KEY       = eyJ...
NEXT_PUBLIC_SITE_URL            = https://tuclub.cl
STRIPE_SECRET_KEY               = sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_WEBHOOK_SECRET           = whsec_...
RESEND_API_KEY                  = re_...
EMAIL_FROM                      = noreply@tuclub.cl
```

---

## Configurar Webhook de Stripe

1. En Stripe Dashboard > Developers > Webhooks
2. Agregar endpoint: `https://tuclub.cl/api/webhooks/stripe`
3. Eventos a escuchar:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copiar el Webhook Secret a `STRIPE_WEBHOOK_SECRET`

---

## Supabase en Producción

### Edge Functions (opcional)
Si usas Supabase Edge Functions para lógica adicional:
```bash
supabase functions deploy nombre-function
```

### Storage buckets
Crear en Supabase Dashboard > Storage:
- `gallery` — imágenes de galería (público)
- `products` — imágenes de productos (público)
- `avatars` — fotos de perfil (privado)

### RLS Policies
El schema incluye políticas RLS básicas. Verifica que:
- Lectura pública funciona para contenido activo
- El service role puede hacer operaciones del admin
- Las órdenes solo son visibles para el dueño

---

## Dominio personalizado

### En Vercel
1. Settings > Domains
2. Agregar dominio del cliente
3. Configurar DNS según instrucciones

### Configurar en Supabase
En Authentication > URL Configuration:
- Site URL: `https://tuclub.cl`
- Redirect URLs: `https://tuclub.cl/**`

---

## Performance checklist

- [ ] Imágenes en formato WebP/AVIF
- [ ] next/image para todas las imágenes
- [ ] ISR configurado (revalidate en páginas)
- [ ] Edge Runtime para APIs críticas
- [ ] Supabase connection pooling activado
- [ ] CDN de Vercel habilitado

---

## Monitoreo

### Vercel Analytics (gratis)
Agrega en `app/layout.tsx`:
```tsx
import { Analytics } from "@vercel/analytics/react";
// ...
<Analytics />
```

### Google Analytics
Agrega `NEXT_PUBLIC_GA_ID` en variables de entorno.
