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
           res.send(req.user)
       } else {
           res.sendStatus(403)
       }
    }
);

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