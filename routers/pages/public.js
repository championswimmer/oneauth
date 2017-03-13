/**
 * Created by championswimmer on 13/03/17.
 */

const router = require('express').Router();

router.get('/login', function(req, res, next) {
    res.render('login', {title: "Login | OneAuth"})
});
router.get('/signup', function(req, res, next) {
    res.render('signup', {title: "Signup | OneAuth"})
});
router.get('/addclient', function(req, res, next) {
    res.render('addclient', {title: "Add New Client | OneAuth"})
});


module.exports = router;