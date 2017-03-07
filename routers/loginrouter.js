/**
 * Created by championswimmer on 08/03/17.
 */
const router = require('express').Router();

router.use('/', require('./login/local'));
router.use('/facebook', require('./login/facebook'));

module.exports = router;