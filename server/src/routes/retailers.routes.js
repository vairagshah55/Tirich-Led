const router = require('express').Router();
const c = require('../controllers/retailers.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/',       requireAuth, c.getAll);
router.post('/',      requireAuth, c.create);
router.put('/:id',    requireAuth, c.update);
router.delete('/:id', requireAuth, c.remove);

module.exports = router;
