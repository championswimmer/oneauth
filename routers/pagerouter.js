/**
 * Created by championswimmer on 13/03/17.
 */
const router = require('express').Router();
const publicroute = require('./pages/public')
    , userroute = require('./pages/user')
    , clientroute = require('./pages/client');

router.use(function (req, res, next) {
    // One '!' doesn't cancel the other'!'. This is not wrong code. Learn JS
    res.locals.loggedIn = !!req.user;
    next();
});

router.use('/', publicroute);
router.use('/users', userroute);
router.use('/clients', clientroute);


module.exports = router;