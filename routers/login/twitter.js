/**
 * Created by championswimmer on 05/04/17.
 */

const router = require('express').Router();
const passport = require('../../passport/passporthandler');

router.get('/', passport.authenticate('twitter'));

router.get('/callback', passport.authenticate('twitter', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/users/me'
}));

module.exports = router;