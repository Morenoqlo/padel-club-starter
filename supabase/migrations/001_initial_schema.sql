-- ============================================================
-- PADEL CLUB STARTER — INITIAL DATABASE SCHEMA
-- ============================================================
-- Migration: 001_initial_schema
-- Description: Full schema for sports club starter kit
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for full-text search

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE order_status AS ENUM (
  'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 'paid', 'failed', 'refunded'
);

CREATE TYPE payment_provider AS ENUM (
  'stripe', 'mercadopago', 'transbank'
);

CREATE TYPE class_level AS ENUM (
  'beginner', 'intermediate', 'advanced', 'all'
);

CREATE TYPE event_category AS ENUM (
  'tournament', 'social', 'workshop', 'clinic', 'other'
);

-- ============================================================
-- PRODUCTS
-- ============================================================

CREATE TABLE products (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  price           NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price >= 0),
  images          TEXT[] DEFAULT '{}',
  category        TEXT NOT NULL,
  tags            TEXT[] DEFAULT '{}',
  is_active       BOOLEAN DEFAULT TRUE,
  is_featured     BOOLEAN DEFAULT FALSE,
  stock_quantity  INTEGER,
  sku             TEXT UNIQUE,
  metadata        JSONB DEFAULT '{}'
);

CREATE TABLE product_variants (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,         -- e.g. "Talla"
  value           TEXT NOT NULL,         -- e.g. "M", "L", "Rojo"
  price_modifier  NUMERIC(10, 2) DEFAULT 0,
  stock_quantity  INTEGER,
  sku             TEXT,
  is_active       BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- ORDERS
-- ============================================================

CREATE TABLE orders (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  customer_email      TEXT NOT NULL,
  customer_name       TEXT NOT NULL,
  customer_phone      TEXT,
  status              order_status DEFAULT 'pending',
  payment_status      payment_status DEFAULT 'pending',
  payment_provider    payment_provider,
  payment_intent_id   TEXT UNIQUE,
  subtotal            NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost       NUMERIC(10, 2) DEFAULT 0,
  tax                 NUMERIC(10, 2) DEFAULT 0,
  total               NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  shipping_address    JSONB,
  notes               TEXT,
  metadata            JSONB DEFAULT '{}'
);

CREATE TABLE order_items (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products(id),
  variant_id      UUID REFERENCES product_variants(id),
  product_name    TEXT NOT NULL,
  variant_name    TEXT,
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  unit_price      NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  total_price     NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

-- ============================================================
-- GALLERY
-- ============================================================

CREATE TABLE gallery_items (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  title       TEXT,
  description TEXT,
  image_url   TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'general',
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order  INTEGER DEFAULT 0,
  metadata    JSONB DEFAULT '{}'
);

-- ============================================================
-- EVENTS
-- ============================================================

CREATE TABLE events (
  id                   UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at           TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at           TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  title                TEXT NOT NULL,
  slug                 TEXT NOT NULL UNIQUE,
  description          TEXT,
  content              TEXT,
  image_url            TEXT,
  event_date           TIMESTAMPTZ NOT NULL,
  event_end_date       TIMESTAMPTZ,
  location             TEXT,
  category             event_category DEFAULT 'other',
  price                NUMERIC(10, 2),
  max_participants     INTEGER,
  current_participants INTEGER DEFAULT 0,
  registration_url     TEXT,
  is_active            BOOLEAN DEFAULT TRUE,
  is_featured          BOOLEAN DEFAULT FALSE,
  metadata             JSONB DEFAULT '{}'
);

-- ============================================================
-- CLASSES / ACADEMY
-- ============================================================

CREATE TABLE classes (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  description         TEXT,
  level               class_level DEFAULT 'all',
  instructor          TEXT,
  instructor_bio      TEXT,
  instructor_image    TEXT,
  schedule            JSONB DEFAULT '[]',
  duration_minutes    INTEGER DEFAULT 60,
  price_per_session   NUMERIC(10, 2),
  price_monthly       NUMERIC(10, 2),
  max_students        INTEGER,
  image_url           TEXT,
  is_active           BOOLEAN DEFAULT TRUE,
  is_featured         BOOLEAN DEFAULT FALSE,
  metadata            JSONB DEFAULT '{}'
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================

CREATE TABLE testimonials (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  author_name   TEXT NOT NULL,
  author_role   TEXT,
  author_image  TEXT,
  content       TEXT NOT NULL,
  rating        INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_active     BOOLEAN DEFAULT TRUE,
  sort_order    INTEGER DEFAULT 0
);

-- ============================================================
-- FAQ
-- ============================================================

CREATE TABLE faq (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  category    TEXT DEFAULT 'general',
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- SITE SETTINGS (key-value store for admin editable content)
-- ============================================================

CREATE TABLE site_settings (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_by  UUID REFERENCES auth.users(id)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_active ON events(is_active) WHERE is_active = TRUE;

CREATE INDEX idx_classes_slug ON classes(slug);
CREATE INDEX idx_classes_level ON classes(level);

CREATE INDEX idx_gallery_category ON gallery_items(category);
CREATE INDEX idx_gallery_featured ON gallery_items(is_featured);
CREATE INDEX idx_gallery_sort ON gallery_items(sort_order);

CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_intent ON orders(payment_intent_id);

CREATE INDEX idx_faq_category ON faq(category);
CREATE INDEX idx_faq_sort ON faq(sort_order);

-- ============================================================
-- TRIGGERS — auto update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read for active content
CREATE POLICY "public_read_active_products"
  ON products FOR SELECT USING (is_active = TRUE);

CREATE POLICY "public_read_product_variants"
  ON product_variants FOR SELECT USING (is_active = TRUE);

CREATE POLICY "public_read_active_gallery"
  ON gallery_items FOR SELECT USING (TRUE);

CREATE POLICY "public_read_active_events"
  ON events FOR SELECT USING (is_active = TRUE);

CREATE POLICY "public_read_active_classes"
  ON classes FOR SELECT USING (is_active = TRUE);

CREATE POLICY "public_read_active_testimonials"
  ON testimonials FOR SELECT USING (is_active = TRUE);

CREATE POLICY "public_read_active_faq"
  ON faq FOR SELECT USING (is_active = TRUE);

CREATE POLICY "public_read_site_settings"
  ON site_settings FOR SELECT USING (TRUE);

-- Orders: users can read their own orders
CREATE POLICY "users_read_own_orders"
  ON orders FOR SELECT
  USING (customer_email = auth.jwt() ->> 'email');

-- Admins: full access via service role (bypasses RLS)
-- Service role key is used server-side for admin operations
