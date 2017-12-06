const router = require('express').Router();

router.get('/', function(req, res, next) {
    var seq=require('../db/models.js');
    seq.db.authenticate()
	.then(() => {
    res.send({
    	postgres: 'Connected'
    })
	})
   .catch(err => {
    res.send({
    	postgres: 'Not Connected'
    })
	});
   });

module.exports = router;