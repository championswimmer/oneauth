/**
 * Created by championswimmer on 10/03/17.
 */
const router = require('express').Router();
const secrets = require('../../secrets.json');
const models = require('../../db/models').models;
const generator = require('../../utils/generator');

router.post('/add', function (req, res) {
    if (req.body.adminkey != secrets.ADMIN_KEY) {
        return res.send({status: 403, message: 'Unauthorized'})
    }

    models.Client.create({
        id: generator.genNdigitNum(10),
        secret: generator.genNcharAlphaNum(64),
        name: req.body.clientname,
        domain: req.body.domain.replace(/ /g, '').split(';'),
        callbackURL: req.body.callback.replace(/ /g, '').split(';')
    }).then(function(client) {
        res.send(client)
    })
});


module.exports = router;