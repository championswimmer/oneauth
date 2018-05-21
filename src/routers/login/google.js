const router = require('express').Router()
const passport = require('../../passport/passporthandler')

function authnOrAuthzGoogle(req, res, next) {
    if (!req.isAuthenticated()) {
        if (config.DEBUG) console.log("Authn Google = = = = = ")
        passport.authenticate('google', {
            failureRedirect: '/login',
            successReturnToOrRedirect: '/users/me',
            failureFlash: true
        })(req, res, next)
    } else {
        if (config.DEBUG) console.log("Authz Google = = = = = = ")
        passport.authorize('google', {
            //TODO: Add failure flash
            failureRedirect: '/users/me',
            failureFlash: true
        })(req, res, next)
    }
}

router.get('/', passport.authenticate('google'))

router.get('/callback', authnOrAuthzGoogle, function (req, res, next) {
    res.redirect('/users/me')
})

module.exports = router
