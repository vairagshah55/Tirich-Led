const router = require('express').Router();
const c = require('../controllers/products.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/',      c.getAll);
router.get('/:id',   c.getOne);
router.post('/',     requireAuth, c.create);
router.put('/:id',   requireAuth, c.update);
router.delete('/:id', requireAuth, c.remove);

module.exports = router;
