/**
 * Created by championswimmer on 13/03/17.
 */
const router = require('express').Router()
const publicroute = require('./pages/public')
    , userroute = require('./pages/user')
    , clientroute = require('./pages/client')
const makeGaEvent = require('../utils/ga').makeGaEvent


router.use(function (req, res, next) {
    // One '!' doesn't cancel the other'!'. This is not wrong code. Learn JS
    res.locals.loggedIn = !!req.user
    next()
})

router.use('/', makeGaEvent('view', 'page', '/'), publicroute)
router.use('/users', makeGaEvent('view', 'page', '/users'), userroute)
router.use('/clients', makeGaEvent('view', 'page', '/clients'), clientroute)


module.exports = router