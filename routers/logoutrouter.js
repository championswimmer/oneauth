/**
 * Created by piyush0 on 23/04/17.
 */
const router = require('express').Router();
const makeGaEvent = require('../utils/ga').makeGaEvent


router.get('/', makeGaEvent('submit', 'form', 'logout'), function (req, res){
    req.user = null;
    req.logout();
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

module.exports = router;