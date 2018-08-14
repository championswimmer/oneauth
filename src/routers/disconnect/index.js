/**
 * Created by himank on 24/11/17.
 */

const router = require('express').Router()


router.use('/facebook', require('./facebook'))
router.use('/twitter', require('./twitter'))
router.use('/github', require('./github'))
router.use('/linkedin',require('./linkedin'))

module.exports = router
