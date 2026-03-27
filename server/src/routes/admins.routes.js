const router = require('express').Router();
const c = require('../controllers/admins.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/',       requireAuth, c.getAll);
router.post('/',      requireAuth, c.create);
router.delete('/:id', requireAuth, c.remove);

module.exports = router;
