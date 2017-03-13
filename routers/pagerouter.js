/**
 * Created by championswimmer on 13/03/17.
 */
const router = require('express').Router();
const publicroute = require('./pages/public');

router.use('/', publicroute);


module.exports = router;