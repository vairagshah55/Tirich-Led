const pool = require('../db/pool');

async function getAll(req, res, next) {
  try {
    const { category, active = 'true' } = req.query;
    const conditions = ['is_active = $1'];
    const values     = [active !== 'false'];

    if (category) {
      conditions.push(`category_slug = $${values.length + 1}`);
      values.push(category);
    }

    const { rows } = await pool.query(
      `SELECT * FROM products WHERE ${conditions.join(' AND ')} ORDER BY category, name`,
      values
    );
    res.json({ data: { products: rows } });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE slug = $1 OR id::text = $1',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.json({ data: { product: rows[0] } });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { slug, name, category, category_slug, tagline, wattage, cri, cct, ip, lifespan, description, image_path, features } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO products (slug, name, category, category_slug, tagline, wattage, cri, cct, ip, lifespan, description, image_path, features)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [slug, name, category, category_slug, tagline, wattage, cri, cct, ip, lifespan, description, image_path, JSON.stringify(features || [])]
    );
    res.status(201).json({ data: { product: rows[0] } });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const fields = ['slug','name','category','category_slug','tagline','wattage','cri','cct','ip','lifespan','description','image_path','features','is_active'];
    const updates = [];
    const values  = [];

    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        values.push(f === 'features' ? JSON.stringify(req.body[f]) : req.body[f]);
        updates.push(`${f} = $${values.length}`);
      }
    });

    if (!updates.length) return res.status(400).json({ message: 'No fields to update' });

    values.push(req.params.id);
    const { rows } = await pool.query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (!rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.json({ data: { product: rows[0] } });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove };
