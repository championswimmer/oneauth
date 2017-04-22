/**
 * Created by piyush0 on 23/04/17.
 */
const router = require('express').Router();

router.get('/', function (req, res){
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

module.exports = router;