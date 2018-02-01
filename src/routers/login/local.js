/**
 * Created by championswimmer on 08/03/17.
 */
const router = require('express').Router()
const passport = require('../../passport/passporthandler')

router.post('/', passport.authenticate(['local', 'lms'], {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/users/me',
    failureFlash: true
}))


module.exports = router
