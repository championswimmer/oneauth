const router = require('express').Router();
var seq=require('../db/models.js');

router.get('/', function(req, res, next) {
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
