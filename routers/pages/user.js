/**
 * Created by championswimmer on 13/03/17.
 */
const cel = require('connect-ensure-login');
const router = require('express').Router();

router.get('/me',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
    res.render('user/me', {user: req.user})
});

module.exports = router;