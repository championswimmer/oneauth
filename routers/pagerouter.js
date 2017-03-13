/**
 * Created by championswimmer on 13/03/17.
 */
const router = require('express').Router();
const publicroute = require('./pages/public')
    , userroute = require('./pages/user')
    , clientroute = require('./pages/client');

router.use('/', publicroute);
router.use('/users', userroute);
router.use('/clients', clientroute);


module.exports = router;