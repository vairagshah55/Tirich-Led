// TODO: replace with real DB queries

function getAll(_req, res) {
  res.json({ data: { products: [] } });
}

function getOne(req, res) {
  res.json({ data: { product: { id: req.params.id } } });
}

function create(req, res) {
  res.status(201).json({ data: { product: req.body } });
}

function update(req, res) {
  res.json({ data: { product: { id: req.params.id, ...req.body } } });
}

function remove(req, res) {
  res.json({ message: 'Deleted' });
}

module.exports = { getAll, getOne, create, update, remove };
