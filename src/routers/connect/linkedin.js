const router = require('express').Router()
const passport = require('../../passport/passporthandler')

const config = require('../../../config')
const debug = require('debug')('oauth:connect:linkedin')

function authenticateOrAuthorizeLinkedIn(req, res, next) {

    if (!req.isAuthenticated()) {
        passport.authenticate('linkedin', {
            failureRedirect: '/login',
            successReturnToOrRedirect: '/users/me',
            failureFlash: true
        })(req, res, next)
    } else {
        passport.authorize('linkedin', {
            failureRedirect: '/users/me',
            failureFlash: true
        })(req, res, next)
    }
}

router.get('/', passport.authorize('linkedin'))

router.get('/callback',authenticateOrAuthorizeLinkedIn ,function (req,res) {
    res.redirect('/users/me')
})

module.exports = router;
