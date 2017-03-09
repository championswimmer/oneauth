/**
 * Created by championswimmer on 08/03/17.
 */
const router = require('express').Router();
const passport = require('../../passport/passporthandler');

router.post('/', passport.authenticate('local', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/api/users/me'
}));


module.exports = router;