/**
 * Created by piyush0 on 23/04/17.
 */
const router = require('express').Router();
const Raven = require('raven');

router.get('/', function (req, res){
	const redirectUrl = req.query.redirect || '/'
    req.user = null;
    req.logout();
    req.session.destroy(function (err) {
    	if (err) 
    		Raven.captureException(err)
    	
        res.redirect(redirectUrl);
    });
});

module.exports = router;