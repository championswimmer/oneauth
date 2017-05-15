/**
 * Created by championswimmer on 10/03/17.
 *
 * This is the /api/v1/clients path
 */
const router = require('express').Router();
const secrets = require('../../secrets.json');
const models = require('../../db/models').models;
const generator = require('../../utils/generator');

const urlutils = require('../../utils/urlutils');

router.post('/add', function (req, res) {
    if (!req.user) {
        return res.send("Only logged in users can make clients")
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
        callbackURL: clientCallbacks,
        userId: req.user.id
    }).then(function(client) {
        res.redirect('/clients/' + client.id)
    })
});

router.put('/edit/:id', function(req, res){
    if(!req.user){
        return res.send("Only logged in users can edit clients")
    }

    let clientId  = req.params.clientid;
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

    models.Client.update({
        name : clientName,
        domain : clientDomains,
        callbackURL : clientCallbacks
    },{
        where : { id : clientId}
    }).then(function(client){
        res.redirect('/clients/'+client.id)
    });

});


module.exports = router;