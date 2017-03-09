/**
 * Created by championswimmer on 10/03/17.
 */
const router = require('express').Router();
const cel = require('connect-ensure-login');


router.get('/me',
    cel.ensureLoggedIn('/login'),
    function(req,res) {
       if (req.user) {
           res.send(req.user)
       }
    }
);

module.exports = router;