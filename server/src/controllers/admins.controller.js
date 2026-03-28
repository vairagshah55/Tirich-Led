const bcrypt = require('bcryptjs');
const pool   = require('../db/pool');

async function getAll(_req, res, next) {
  try {
    const { rows } = await pool.query(
      "SELECT id, email, name, created_at FROM users WHERE role = 'admin' ORDER BY created_at DESC"
    );
    res.json({ data: { admins: rows } });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password)
      return res.status(400).json({ message: 'email, name and password required' });

    const hash = bcrypt.hashSync(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO users (email, name, password_hash, role) VALUES ($1,$2,$3,'admin') RETURNING id, email, name, created_at",
      [email.toLowerCase(), name, hash]
    );
    res.status(201).json({ data: { admin: rows[0] } });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Email already exists' });
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM users WHERE id = $1 AND role = 'admin'",
      [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ message: 'Admin not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create, remove };
