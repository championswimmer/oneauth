/**
 * Created by championswimmer on 10/03/17.
 *
 * This is the /api/v1 path
 */
const router = require('express').Router();

router.use((req, res, next) => {
    res.set('access-control-allow-headers', 'X-Requested-With,content-type,Authorization')
    res.set('access-control-allow-methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.set('access-control-allow-origin', req.get('origin'))
    next()
})

router.use('/users', require('./users'));
router.use('/clients', require('./clients'));

module.exports = router;