/**
 * Created by championswimmer on 10/03/17.
 *
 * This is the /api/v1/clients path
 */
const router = require('express').Router();
const secrets = require('../../secrets.json');
const models = require('../../db/models').models;
const generator = require('../../utils/generator');
const cel = require('connect-ensure-login');

const urlutils = require('../../utils/urlutils');

router.post('/add', function (req, res) {
    if (!req.user) {
        return res.status(403).send("Only logged in users can make clients")
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

router.post('/edit/:id', cel.ensureLoggedIn('/login'),
    function(req, res){
    let clientId  = parseInt(req.params.id);
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
        res.redirect('/clients/' + clientId)
    }).catch(function(error) {
        console.error(error)
    });

});


module.exports = router;
