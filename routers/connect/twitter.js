/**
 * Created by championswimmer on 05/04/17.
 */

const router = require('express').Router();
const passport = require('../../passport/passporthandler');

router.get('/', passport.authorize('twitter'));

router.get('/callback', passport.authorize('twitter', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/users/me'
}));

module.exports = router;