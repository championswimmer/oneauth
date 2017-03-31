/**
 * Created by championswimmer on 09/03/17.
 *
 * This is the /signup path
 */
const router = require('express').Router();
const models = require('../db/models').models;

router.post('/', function (req, res) {
    models.UserLocal.create({
        user: {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        },
        password: req.body.password

    }, {
        include: [models.User]
    }).then(function (user) {
        res.redirect('/login');
    })
});

module.exports = router;