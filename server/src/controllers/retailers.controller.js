// TODO: replace with real DB queries

function getAll(_req, res) {
  res.json({ data: { retailers: [] } });
}

function create(req, res) {
  res.status(201).json({ data: { retailer: req.body } });
}

function update(req, res) {
  res.json({ data: { retailer: { id: req.params.id, ...req.body } } });
}

function remove(req, res) {
  res.json({ message: 'Deleted' });
}

module.exports = { getAll, create, update, remove };
