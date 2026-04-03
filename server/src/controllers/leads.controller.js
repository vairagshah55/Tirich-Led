const pool = require('../db/pool');
const { notifyNewLead } = require('../utils/notify');

const VALID_BUSINESS = ['led-showroom', 'electrical-shop', 'distributor', 'other'];
const VALID_DESIGNATION = ['owner', 'interior', 'architect'];

async function create(req, res, next) {
  try {
    const { name, phone, city, business_type, business_other, designation } = req.body;

    if (!name || !phone || !city || !business_type || !designation)
      return res.status(400).json({ message: 'name, phone, city, business_type and designation are required' });

    if (!VALID_BUSINESS.includes(business_type))
      return res.status(400).json({ message: 'Invalid business type' });

    if (!VALID_DESIGNATION.includes(designation))
      return res.status(400).json({ message: 'Invalid designation' });

    if (business_type === 'other' && !business_other?.trim())
      return res.status(400).json({ message: 'Please specify your business type' });

    const { rows } = await pool.query(
      `INSERT INTO leads (name, phone, city, business_type, business_other, designation)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (phone) DO UPDATE SET
         name           = EXCLUDED.name,
         city           = EXCLUDED.city,
         business_type  = EXCLUDED.business_type,
         business_other = EXCLUDED.business_other,
         designation    = EXCLUDED.designation
       RETURNING *`,
      [
        name.trim(),
        phone.trim(),
        city.trim(),
        business_type,
        business_type === 'other' ? business_other.trim() : null,
        designation,
      ]
    );

    notifyNewLead(rows[0]);

    res.status(201).json({ data: { lead: rows[0] } });
  } catch (err) {
    next(err);
  }
}

async function verify(req, res, next) {
  try {
    const { phone } = req.params;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    const { rows } = await pool.query(
      'SELECT id, name, phone, city, business_type, designation FROM leads WHERE phone = $1',
      [phone.trim()]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: 'No record found with this number' });

    res.json({ data: { lead: rows[0] } });
  } catch (err) {
    next(err);
  }
}

async function getAll(_req, res, next) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM leads ORDER BY created_at DESC'
    );
    res.json({ data: { leads: rows } });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, verify, getAll };
