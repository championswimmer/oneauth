const router = require('express').Router()
const passport = require('../../passport/passporthandler')

router.get('/', passport.authorize('google'))

router.get('/callback', passport.authorize('google', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/users/me'
}))

module.exports = router