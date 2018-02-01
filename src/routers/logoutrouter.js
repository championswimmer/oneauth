/**
 * Created by piyush0 on 23/04/17.
 */
const router = require('express').Router()
const Raven = require('raven')
const config = require('../../config')
const makeGaEvent = require('../utils/ga').makeGaEvent

router.get('/', makeGaEvent('submit', 'form', 'logout'), function (req, res) {
    const redirectUrl = req.query.redirect || req.session.returnTo || '/login'
    req.user = null
    req.logout()
    req.session.destroy(function (err) {
        if (err) Raven.captureException(err)
        res.clearCookie('oneauth', {path: '/', domain: 'account.codingblocks.com', httpOnly: true})
        res.clearCookie('oneauth', {path: '/', domain: config.COOKIE_DOMAIN, httpOnly: true})
        res.redirect(redirectUrl)
    })
})

module.exports = router