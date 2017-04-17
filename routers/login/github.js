/**
 * Created by piyush0 on 17/04/17.
 */


const router = require('express').Router();
const passport = require('../../passport/passporthandler');

router.get('/', passport.authenticate('github'));

router.get('/callback', passport.authenticate('github', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/users/me'
}));

module.exports = router;