/**
 * Created by championswimmer on 08/03/17.
 */
const router = require('express').Router();
const passport = require('../../passport/passporthandler');

router.post('/', passport.authorize(['local', 'lms'], {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/users/me'
}));


module.exports = router;