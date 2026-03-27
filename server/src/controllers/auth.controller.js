const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// TODO: replace with real DB lookup
const MOCK_USERS = [
  { id: 1, email: 'admin@tirichled.com', password: bcrypt.hashSync('admin123', 10), role: 'admin', name: 'Admin' },
];

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
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  const user = MOCK_USERS.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(user);
  setTokenCookie(res, token);

  const { password: _pw, ...userData } = user;
  res.json({ data: { user: userData, token } });
}

function logout(_req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
}

function me(req, res) {
  res.json({ data: { user: req.user } });
}

module.exports = { login, logout, me };
