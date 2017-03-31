/**
 * Created by championswimmer on 13/03/17.
 */
const router = require('express').Router();
const cel = require('connect-ensure-login');

const models = require('../../db/models').models;

router.get('/',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        models.Client.findAll({
            where: {userId: req.user.id}
        }).then(function(clients) {
            return res.render('client/all', {clients: clients})
        }).catch(function(err) {
            res.send("No clients registered")
        })
    }
);

router.get('/add',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        return res.render('client/add')
    }
);

router.get('/:id',
    cel.ensureLoggedIn('/login'),
    function(req, res, next) {
        models.Client.findOne({
            where: {id : req.params.id}
        }).then(function (client) {
            if (!client) {
                return res.send("Invalid Client Id")
            }
            if (client.userId != req.user.id) {
                return res.send("Unauthorized user")
            }

            return res.render('client/id', {client: client})
        })
    }
);

module.exports = router;