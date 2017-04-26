/**
 * Created by championswimmer on 10/03/17.
 *
 * This is the /api/v1/users path
 */
const router = require('express').Router();
const cel = require('connect-ensure-login');
const passport = require('../../passport/passporthandler');
const models = require('../../db/models').models;


router.get('/me',
    passport.authenticate('bearer', {session: false}),
    function(req,res) {

        if (req.user) {
            let includes = [];
            if (req.query.include) {
                let includedAccounts = req.query.include.split(',');
                for (ia of includedAccounts) {
                    switch (ia) {
                        case 'facebook': includes.push(models.UserFacebook); break;
                        case 'twitter': includes.push(models.UserTwitter); break;
                        case 'github': includes.push(models.UserGithub); break;
                        case 'lms': includes.push(models.UserLms); break;
                    }
                }
            }


            models.User.findOne({
                where: {id: req.user.id},
                include: includes
            }).then(function (user) {
                if (!user) {
                    throw err;
                }
                res.send(user);
            }).catch(function(err) {
                res.send('Unknown user or unauthorized request');
            })

        } else {
            return res.sendStatus(403)
        }

    });

router.get('/:id',
    passport.authenticate('bearer', {session: false}),
    function (req, res) {
        if (req.params.id == req.user.id) {
            return res.send(req.user)
        }
        models.User.findOne({
            where: {id: req.params.id}
        }).then(function (user) {
            if (!user) {
                throw err;
            }
            res.send(user);
        }).catch(function(err) {
            res.send('Unknown user or unauthorized request');
        })
    }
);

module.exports = router;