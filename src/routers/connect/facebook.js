/**
 * Created by championswimmer on 08/03/17.
 */
const router = require('express').Router();
const passport = require('../../passport/passporthandler');

const config = require('../../../config');

router.get('/', passport.authorize('facebook', {
    scope: config.FACEBOOK_LOGIN_SCOPES
}));


router.get('/callback', passport.authorize('facebook', {
    scope: config.FACEBOOK_LOGIN_SCOPES,
    failureRedirect: '/login',
    successReturnToOrRedirect: '/users/me'
}));

module.exports = router;