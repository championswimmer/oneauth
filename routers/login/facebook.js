/**
 * Created by championswimmer on 08/03/17.
 */
const router = require('express').Router();
const passport = require('../../passport/passporthandler');

router.get('/', passport.authenticate('facebook', {scope: ['email']}));

router.get('/callback', passport.authenticate('facebook', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/profile'
}));

module.exports = router;