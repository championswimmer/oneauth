const router = require('express').Router()
const passport = require('../../passport/passporthandler')

const config = require('../../../config')
const debug = require('debug')('oauth:connect:linkedin')


router.get('/', passport.authorize('linkedin'))

router.get('/callback', passport.authorize('linkedin',{
    failureRedirect: '/users/me',
    failureFlash: true
  }), function (req,res) {
        res.redirect('/users/me')
    })

module.exports = router;
