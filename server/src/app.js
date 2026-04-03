const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes      = require('./routes/auth.routes');
const productsRoutes  = require('./routes/products.routes');
const adminsRoutes    = require('./routes/admins.routes');
const retailersRoutes = require('./routes/retailers.routes');
const leadsRoutes     = require('./routes/leads.routes');

const app = express();

// ── Middleware ────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin(origin, cb) {
    // allow server-to-server / curl (no origin) + any listed origin
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(null, false);
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/products',  productsRoutes);
app.use('/api/v1/admins',    adminsRoutes);
app.use('/api/v1/retailers', retailersRoutes);
app.use('/api/v1/leads',     leadsRoutes);

// ── Health check ──────────────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => res.json({ status: 'ok' }));

// ── 404 ───────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Error handler ─────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
