const bcrypt = require('bcryptjs');
const pool   = require('../db/pool');

async function getAll(_req, res, next) {
  try {
    const { rows } = await pool.query(`
      SELECT u.id, u.email, u.name, u.created_at,
             r.id AS retailer_id, r.company_name, r.phone, r.address
      FROM   users u
      LEFT JOIN retailers r ON r.user_id = u.id
      WHERE  u.role = 'retailer'
      ORDER  BY u.created_at DESC
    `);
    res.json({ data: { retailers: rows } });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  const client = await pool.connect();
  try {
    const { email, name, password, company_name, phone, address } = req.body;
    if (!email || !name || !password)
      return res.status(400).json({ message: 'email, name and password required' });

    await client.query('BEGIN');

    const hash = bcrypt.hashSync(password, 10);
    const { rows: userRows } = await client.query(
      "INSERT INTO users (email, name, password_hash, role) VALUES ($1,$2,$3,'retailer') RETURNING id, email, name, created_at",
      [email.toLowerCase(), name, hash]
    );
    const user = userRows[0];

    const { rows: retRows } = await client.query(
      'INSERT INTO retailers (user_id, company_name, phone, address) VALUES ($1,$2,$3,$4) RETURNING *',
      [user.id, company_name || null, phone || null, address || null]
    );

    await client.query('COMMIT');
    res.status(201).json({ data: { retailer: { ...user, ...retRows[0] } } });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') return res.status(409).json({ message: 'Email already exists' });
    next(err);
  } finally {
    client.release();
  }
}

async function update(req, res, next) {
  const client = await pool.connect();
  try {
    const { name, company_name, phone, address } = req.body;
    await client.query('BEGIN');

    if (name) {
      await client.query("UPDATE users SET name=$1 WHERE id=$2 AND role='retailer'", [name, req.params.id]);
    }
    await client.query(
      `INSERT INTO retailers (user_id, company_name, phone, address)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id) DO UPDATE SET
         company_name = EXCLUDED.company_name,
         phone        = EXCLUDED.phone,
         address      = EXCLUDED.address`,
      [req.params.id, company_name || null, phone || null, address || null]
    );

    await client.query('COMMIT');
    res.json({ message: 'Updated' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

async function remove(req, res, next) {
  try {
    // Cascades to retailers table via FK
    const { rowCount } = await pool.query(
      "DELETE FROM users WHERE id = $1 AND role = 'retailer'",
      [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ message: 'Retailer not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create, update, remove };
