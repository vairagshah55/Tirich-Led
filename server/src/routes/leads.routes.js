const router = require('express').Router();
const c = require('../controllers/leads.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.post('/',              c.create);          // public — submit lead
router.get('/verify/:phone',  c.verify);          // public — check if phone exists
router.get('/',               requireAuth, c.getAll); // admin-only listing

module.exports = router;
