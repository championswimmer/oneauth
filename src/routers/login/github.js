/**
 * Created by piyush0 on 17/04/17.
 */


const router = require('express').Router()
const passport = require('../../passport/passporthandler')
const debug = require('debug')('oauth:login:github')

function authnOrAuthzGithub(req, res, next) {
    if (!req.isAuthenticated()) {
        if (config.DEBUG) debug("Authn Github = = = = = ")
        passport.authenticate('github', {
            failureRedirect: '/login',
            successReturnToOrRedirect: '/users/me',
            failureFlash: true
        })(req, res, next)
    } else {
        if (config.DEBUG) debug("Authz Github = = = = = = ")
        passport.authorize('github', {
            //TODO: Add failure flash
            failureRedirect: '/users/me',
            failureFlash: true
        })(req, res, next)
    }
}

router.get('/', passport.authenticate('github'))

router.get('/callback', authnOrAuthzGithub, function (req, res, next) {
    res.redirect('/users/me')
})

module.exports = router
