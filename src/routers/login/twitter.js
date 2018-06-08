/**
 * Created by championswimmer on 05/04/17.
 */

const router = require('express').Router()
const passport = require('../../passport/passporthandler')
const debug = require('debug')('oauth:login:twitter')

function authnOrAuthzTwitter(req, res, next) {
    if (!req.isAuthenticated()) {
        if (config.DEBUG) debug("Authn Twitter = = = = = ")
        passport.authenticate('twitter', {
            failureRedirect: '/login',
            successReturnToOrRedirect: '/users/me',
            failureFlash: true
        })(req, res, next)
    } else {
        if (config.DEBUG) debug("Authz Twitter = = = = = = ")
        passport.authorize('twitter', {
            //TODO: Add failure flash (could not connect your account to ...)
            failureRedirect: '/users/me',
            failureFlash: true
        })(req, res, next)
    }
}


router.get('/', passport.authenticate('twitter'))

router.get('/callback', authnOrAuthzTwitter, function (req, res, next) {
    res.redirect('/users/me')
})

module.exports = router
