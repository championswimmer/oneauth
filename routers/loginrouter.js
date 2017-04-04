/**
 * Created by championswimmer on 08/03/17.
 */
const router = require('express').Router();

router.use('/', require('./login/local'));
router.use('/facebook', require('./login/facebook'));
router.use('/twitter', require('./login/twitter'));

module.exports = router;