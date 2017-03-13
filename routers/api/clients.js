/**
 * Created by championswimmer on 10/03/17.
 */
const router = require('express').Router();
const secrets = require('../../secrets.json');
const models = require('../../db/models').models;
const generator = require('../../utils/generator');

const urlutils = require('../../utils/urlutils');

router.post('/add', function (req, res) {
    if (req.body.adminkey != secrets.ADMIN_KEY) {
        return res.send({status: 403, message: 'Unauthorized'})
    }

    let clientName = req.body.clientname;
    let clientDomains = req.body.domain.replace(/ /g, '').split(';');
    let clientCallbacks = req.body.callback.replace(/ /g, '').split(';');

    //Make sure all urls have http in them
    clientDomains.forEach(function (url, i, arr) {
        arr[i] = urlutils.prefixHttp(url)
    });
    clientCallbacks.forEach(function (url, i, arr) {
        arr[i] = urlutils.prefixHttp(url)
    });


    models.Client.create({
        id: generator.genNdigitNum(10),
        secret: generator.genNcharAlphaNum(64),
        name: clientName,
        domain: clientDomains,
        callbackURL: clientCallbacks
    }).then(function(client) {
        res.send(client)
    })
});


module.exports = router;