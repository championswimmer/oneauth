/**
 * Created by championswimmer on 13/03/17.
 */
const router = require('express').Router();
const cel = require('connect-ensure-login');

const models = require('../../db/models').models;

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