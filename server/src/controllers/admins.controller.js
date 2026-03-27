// TODO: replace with real DB queries

function getAll(_req, res) {
  res.json({ data: { admins: [] } });
}

function create(req, res) {
  res.status(201).json({ data: { admin: req.body } });
}

function remove(req, res) {
  res.json({ message: 'Deleted' });
}

module.exports = { getAll, create, remove };
