/**
 * Created by championswimmer on 08/03/17.
 */
const router = require('express').Router()
const passport = require('../../passport/passporthandler')

const config = require('../../../config')
const debug = require('debug')('oauth:login:facebook')

function authnOrAuthzFacebook(req, res, next) {
    if (!req.isAuthenticated()) {
        if (config.DEBUG) debug("Authn Facebook = = = = = ")
        passport.authenticate('facebook', {
            scope: config.FACEBOOK_LOGIN_SCOPES,
            failureRedirect: '/login',
            successReturnToOrRedirect: '/users/me',
            failureFlash: true
        })(req, res, next)
    } else {
        if (config.DEBUG) debug("Authz Facebook = = = = = = ")
        passport.authorize('facebook', {
            //Add failure flash
            failureRedirect: '/users/me',
            failureFlash: true
        })(req, res, next)
    }
}

router.get('/', passport.authenticate('facebook', {scope: ['email']}))

router.get('/callback', authnOrAuthzFacebook, function (req, res, next) {
    //Add flash for success
    res.redirect('/users/me')
})

module.exports = router
