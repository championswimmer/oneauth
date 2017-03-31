/**
 * Created by championswimmer on 10/03/17.
 *
 * This is the /api/v1 path
 */
const router = require('express').Router();

router.use('/users', require('./api/users'));
router.use('/clients', require('./api/clients'));

module.exports = router;