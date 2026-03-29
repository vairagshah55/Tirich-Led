-- ── Tirich LED — PostgreSQL Schema ───────────────────────────────────────────

-- Users (admins + retailers share this table, differentiated by role)
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'retailer')),
  name          VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id            SERIAL PRIMARY KEY,
  slug          VARCHAR(100) UNIQUE NOT NULL,
  name          VARCHAR(100) NOT NULL,
  category      VARCHAR(100) NOT NULL,
  category_slug VARCHAR(100) NOT NULL,
  tagline       TEXT,
  wattage       VARCHAR(100),
  cri           VARCHAR(50),
  cct           VARCHAR(100),
  ip            VARCHAR(20),
  lifespan      VARCHAR(50),
  description   TEXT,
  image_path    TEXT,
  features      JSONB        NOT NULL DEFAULT '[]',
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Retailers (extended profile linked to a user row with role = 'retailer')
CREATE TABLE IF NOT EXISTS retailers (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  phone        VARCHAR(50),
  address      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Leads (captured from product detail gate)
CREATE TABLE IF NOT EXISTS leads (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  phone          VARCHAR(50)  UNIQUE NOT NULL,
  city           VARCHAR(255) NOT NULL,
  business_type  VARCHAR(50)  NOT NULL CHECK (business_type IN ('led-showroom', 'electrical-shop', 'distributor', 'other')),
  business_other VARCHAR(255),
  designation    VARCHAR(50)  NOT NULL CHECK (designation IN ('owner', 'interior', 'architect')),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active     ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_users_role             ON users(role);
CREATE INDEX IF NOT EXISTS idx_leads_phone            ON leads(phone);
