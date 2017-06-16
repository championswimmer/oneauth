/**
 * Created by championswimmer on 13/03/17.
 */
const cel = require('connect-ensure-login');
const router = require('express').Router();

const models = require('../../db/models').models;

router.get('/me',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {

        models.User.findOne({
            where: {id: req.user.id},
            include: [
                models.UserGithub,
                models.UserFacebook,
                models.UserLms,
                models.UserTwitter
            ]
        }).then(function (user) {
            if (!user) {
                throw err;
            }
            return res.render('user/me', {user: user})
        }).catch(function(err) {
            res.redirect('/login')
        });

});

module.exports = router;