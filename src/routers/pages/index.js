/**
 * Created by championswimmer on 13/03/17.
 */
const router = require('express').Router()
const publicroute = require('./public')
    , userroute = require('./user')
    , clientroute = require('./client')
    , forgotroute = require('./forgot')
const makeGaEvent = require('../../utils/ga').makeGaEvent


router.use(function (req, res, next) {
    // One '!' doesn't cancel the other'!'. This is not wrong code. Learn JS
    res.locals.loggedIn = !!req.user
    next()
})

router.use('/', makeGaEvent('view', 'page', '/'), publicroute)
router.use('/users', makeGaEvent('view', 'page', '/users'), userroute)
router.use('/clients', makeGaEvent('view', 'page', '/clients'), clientroute)
router.use('/forgot', makeGaEvent('view', 'page', '/forgot'), forgotroute)


module.exports = router