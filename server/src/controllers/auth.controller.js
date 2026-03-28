const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool   = require('../db/pool');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function setTokenCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   7 * 24 * 60 * 60 * 1000,
  });
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const { rows } = await pool.query(
      'SELECT id, email, password_hash, role, name FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    setTokenCookie(res, token);

    const { password_hash: _pw, ...userData } = user;
    res.json({ data: { user: userData, token } });
  } catch (err) {
    next(err);
  }
}

async function logout(_req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
}

async function me(req, res, next) {
  try {
    const { rows } = await pool.query(
      'SELECT id, email, role, name, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'User not found' });
    res.json({ data: { user: rows[0] } });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, logout, me };
