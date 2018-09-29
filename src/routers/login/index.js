/**
 * Created by championswimmer on 08/03/17.
 */
const router = require('express').Router()
const makeGaEvent = require('../../utils/ga').makeGaEvent
const { authLimiter } = require('../../middlewares/ratelimit')

router.use(authLimiter)
router.use('/', makeGaEvent('attempt', 'login', 'local'), require('./local'))
router.use('/facebook', makeGaEvent('attempt', 'login', 'facebook'), require('./facebook'))
router.use('/twitter', makeGaEvent('attempt', 'login', 'twitter'), require('./twitter'))
router.use('/github', makeGaEvent('attempt', 'login', 'github'), require('./github'))
router.use('/google', makeGaEvent('attempt', 'login', 'google'), require('./google'))


module.exports = router