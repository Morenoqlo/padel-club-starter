-- ============================================================
-- SEED DATA — Demo content for development
-- ============================================================

-- ── Products ──────────────────────────────────────────────────
INSERT INTO products (name, slug, description, price, compare_at_price, images, category, tags, is_active, is_featured) VALUES
  (
    'Paletero Oficial PPC',
    'paletero-oficial-ppc',
    'Paletero premium con espacio para 2 palas, bolsillo para ropa y refuerzo impermeable. Diseño exclusivo del club.',
    49900,
    59900,
    ARRAY['https://placehold.co/800x800/0A0A0A/22C55E?text=Paletero'],
    'accesorios',
    ARRAY['paletero', 'bolso', 'premium'],
    TRUE,
    TRUE
  ),
  (
    'Camiseta Técnica PPC',
    'camiseta-tecnica-ppc',
    'Camiseta técnica de alta transpiración con logo bordado. Material 100% poliéster reciclado.',
    24900,
    NULL,
    ARRAY['https://placehold.co/800x800/0A0A0A/22C55E?text=Camiseta'],
    'ropa',
    ARRAY['camiseta', 'ropa técnica'],
    TRUE,
    TRUE
  ),
  (
    'Grip Pro Pack x3',
    'grip-pro-pack-x3',
    'Pack de 3 grips premium antideslizantes. Absorción de sudor máxima para sesiones intensas.',
    12900,
    NULL,
    ARRAY['https://placehold.co/800x800/0A0A0A/22C55E?text=Grip'],
    'accesorios',
    ARRAY['grip', 'accesorios'],
    TRUE,
    FALSE
  ),
  (
    'Gorra PPC Edition',
    'gorra-ppc-edition',
    'Gorra de tela técnica con visera curva. Logo del club bordado. Talla única ajustable.',
    19900,
    NULL,
    ARRAY['https://placehold.co/800x800/0A0A0A/22C55E?text=Gorra'],
    'accesorios',
    ARRAY['gorra', 'accesorios'],
    TRUE,
    FALSE
  ),
  (
    'Toalla de Cancha PPC',
    'toalla-cancha-ppc',
    'Toalla de microfibra 50x100cm. Secado rápido y suavidad premium. Logo del club.',
    14900,
    NULL,
    ARRAY['https://placehold.co/800x800/0A0A0A/22C55E?text=Toalla'],
    'accesorios',
    ARRAY['toalla', 'accesorios'],
    TRUE,
    FALSE
  );

-- ── Product variants ──────────────────────────────────────────
INSERT INTO product_variants (product_id, name, value, price_modifier, stock_quantity, is_active)
SELECT id, 'Talla', 'XS', 0, 10, TRUE FROM products WHERE slug = 'camiseta-tecnica-ppc'
UNION ALL
SELECT id, 'Talla', 'S', 0, 15, TRUE FROM products WHERE slug = 'camiseta-tecnica-ppc'
UNION ALL
SELECT id, 'Talla', 'M', 0, 20, TRUE FROM products WHERE slug = 'camiseta-tecnica-ppc'
UNION ALL
SELECT id, 'Talla', 'L', 0, 20, TRUE FROM products WHERE slug = 'camiseta-tecnica-ppc'
UNION ALL
SELECT id, 'Talla', 'XL', 0, 10, TRUE FROM products WHERE slug = 'camiseta-tecnica-ppc'
UNION ALL
SELECT id, 'Color', 'Negro', 0, 25, TRUE FROM products WHERE slug = 'paletero-oficial-ppc'
UNION ALL
SELECT id, 'Color', 'Verde', 2000, 10, TRUE FROM products WHERE slug = 'paletero-oficial-ppc';

-- ── Events ────────────────────────────────────────────────────
INSERT INTO events (title, slug, description, event_date, event_end_date, category, price, max_participants, is_active, is_featured, image_url) VALUES
  (
    'Torneo Verano PPC 2026',
    'torneo-verano-ppc-2026',
    'El torneo más esperado del año. Categorías A, B y C. Premios para todos los ganadores y cena de clausura.',
    '2026-02-15 09:00:00+00',
    '2026-02-16 20:00:00+00',
    'tournament',
    35000,
    64,
    TRUE,
    TRUE,
    'https://placehold.co/1200x600/0A0A0A/22C55E?text=Torneo+Verano'
  ),
  (
    'Noche de Pádel + BBQ',
    'noche-padel-bbq',
    'Jornada social con partidos mixtos, BBQ y música. Ven con tu pareja o te asignamos una.',
    '2026-03-08 19:00:00+00',
    '2026-03-08 23:00:00+00',
    'social',
    15000,
    40,
    TRUE,
    TRUE,
    'https://placehold.co/1200x600/0A0A0A/22C55E?text=Noche+BBQ'
  ),
  (
    'Clínica con Pro',
    'clinica-pro-marzo',
    'Aprende técnicas avanzadas con jugadores de nivel profesional. Cupos limitados.',
    '2026-03-22 10:00:00+00',
    '2026-03-22 14:00:00+00',
    'clinic',
    45000,
    16,
    TRUE,
    FALSE,
    'https://placehold.co/1200x600/0A0A0A/22C55E?text=Clinica+Pro'
  );

-- ── Classes ───────────────────────────────────────────────────
INSERT INTO classes (name, slug, description, level, instructor, schedule, duration_minutes, price_per_session, price_monthly, max_students, is_active, is_featured) VALUES
  (
    'Academia Principiantes',
    'academia-principiantes',
    'Aprende las bases del pádel desde cero. Técnica, reglas y primeros rallies. Sin experiencia previa necesaria.',
    'beginner',
    'María González',
    '[{"day": "Lunes", "time": "09:00"}, {"day": "Miércoles", "time": "09:00"}]',
    60,
    12000,
    45000,
    8,
    TRUE,
    TRUE
  ),
  (
    'Intermedio — Técnica y Táctica',
    'intermedio-tecnica-tactica',
    'Mejora tu técnica, trabaja posicionamiento y aprende tácticas de juego para partidos competitivos.',
    'intermediate',
    'Carlos Ruiz',
    '[{"day": "Martes", "time": "19:00"}, {"day": "Jueves", "time": "19:00"}]',
    90,
    18000,
    65000,
    6,
    TRUE,
    TRUE
  ),
  (
    'Alto Rendimiento',
    'alto-rendimiento',
    'Para jugadores avanzados que buscan competir. Trabajo físico, mental y técnico de alto nivel.',
    'advanced',
    'Diego Fernández',
    '[{"day": "Lunes", "time": "07:00"}, {"day": "Miércoles", "time": "07:00"}, {"day": "Viernes", "time": "07:00"}]',
    120,
    25000,
    90000,
    4,
    TRUE,
    FALSE
  );

-- ── Gallery ───────────────────────────────────────────────────
INSERT INTO gallery_items (title, image_url, category, is_featured, sort_order) VALUES
  ('Cancha 1 — Interior', 'https://placehold.co/800x600/0A0A0A/FFFFFF?text=Cancha+Interior', 'instalaciones', TRUE, 1),
  ('Cancha 5 — Exterior', 'https://placehold.co/800x600/0A0A0A/FFFFFF?text=Cancha+Exterior', 'instalaciones', TRUE, 2),
  ('Torneo Verano 2025', 'https://placehold.co/800x600/0A0A0A/FFFFFF?text=Torneo', 'eventos', TRUE, 3),
  ('Academia Infantil', 'https://placehold.co/800x600/0A0A0A/FFFFFF?text=Academia', 'clases', TRUE, 4),
  ('Área Social', 'https://placehold.co/800x600/0A0A0A/FFFFFF?text=Area+Social', 'instalaciones', FALSE, 5),
  ('Pro Shop', 'https://placehold.co/800x600/0A0A0A/FFFFFF?text=Pro+Shop', 'instalaciones', FALSE, 6);

-- ── Testimonials ──────────────────────────────────────────────
INSERT INTO testimonials (author_name, author_role, content, rating, is_active, sort_order) VALUES
  (
    'Andrés Morales',
    'Socio desde 2023',
    'El mejor club de la ciudad sin duda. Las canchas son de primera, el ambiente increíble y la organización de torneos es impecable.',
    5, TRUE, 1
  ),
  (
    'Valentina Soto',
    'Alumna Academia',
    'Empecé desde cero en la academia y en 3 meses ya estoy jugando torneos. Los instructores son extraordinarios.',
    5, TRUE, 2
  ),
  (
    'Rodrigo Peña',
    'Socio desde 2022',
    'Llevo 2 años jugando aquí y nunca me ha fallado. La app de reservas funciona perfecto y siempre hay disponibilidad.',
    5, TRUE, 3
  ),
  (
    'Carolina López',
    'Jugadora competitiva',
    'Las canchas de indoor son las mejores que he jugado en Chile. Iluminación perfecta, superficie excelente.',
    5, TRUE, 4
  );

-- ── FAQ ───────────────────────────────────────────────────────
INSERT INTO faq (question, answer, category, sort_order, is_active) VALUES
  ('¿Cómo reservo una cancha?', 'Puedes reservar a través de nuestra app oficial o en el link de reservas de la web. También puedes llamarnos o escribirnos por WhatsApp.', 'reservas', 1, TRUE),
  ('¿Con cuánta anticipación puedo reservar?', 'Puedes reservar hasta 7 días de anticipación. Los socios premium tienen acceso preferente con 10 días de anticipación.', 'reservas', 2, TRUE),
  ('¿Qué pasa si necesito cancelar?', 'Puedes cancelar sin costo hasta 4 horas antes. Cancelaciones tardías tienen un cargo del 50%.', 'reservas', 3, TRUE),
  ('¿Tienen equipamiento para arrendar?', 'Sí, tenemos palas y pelotas disponibles para arriendo en recepción por un valor de $5.000 por sesión.', 'instalaciones', 4, TRUE),
  ('¿Ofrecen clases para niños?', 'Sí, tenemos academia infantil desde los 6 años. Contáctanos para conocer horarios y disponibilidad.', 'clases', 5, TRUE),
  ('¿Tienen estacionamiento?', 'Sí, contamos con estacionamiento gratuito con capacidad para 40 vehículos. Acceso por Calle Lateral.', 'instalaciones', 6, TRUE),
  ('¿Cómo me inscribo en un torneo?', 'Los torneos se publican en la web y redes sociales. La inscripción se realiza online con pago incluido.', 'torneos', 7, TRUE),
  ('¿Cuál es el horario del club?', 'Lunes a viernes: 07:00 a 23:00. Sábados y domingos: 08:00 a 22:00. Festivos: 09:00 a 20:00.', 'general', 8, TRUE);

-- ── Site Settings ─────────────────────────────────────────────
INSERT INTO site_settings (key, value) VALUES
  ('hero_title', '"Tu cancha te espera"'),
  ('hero_subtitle', '"Reserva en segundos. Juega siempre."'),
  ('booking_url', '"https://reservas.padelproclub.com"'),
  ('sections_visibility', '{"hero": true, "benefits": true, "courts": true, "classes": true, "events": true, "gallery": true, "merch": true, "testimonials": true, "faq": true}'),
  ('social_links', '{"instagram": "https://instagram.com/padelproclub", "facebook": "https://facebook.com/padelproclub", "tiktok": "https://tiktok.com/@padelproclub"}'),
  ('contact_info', '{"phone": "+56 9 1234 5678", "email": "contacto@padelproclub.com", "whatsapp": "+56912345678"}');
