/**
 * Created by bhavyaagg on 19/05/18.
 */
const router = require('express').Router()
const cel = require('connect-ensure-login')

const models = require('../../db/models').models

router.get('/',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        models.AuthToken.findAll({
            where: {userId: req.user.id},
            include: [models.Client]
        }).then(function (apps) {
            return res.render('apps/all', {apps: apps})
        }).catch(function (err) {
            res.send("No clients registered")
        })
    }
)

router.get('/:clientId/delete',cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        models.AuthToken.findOne({
            where: {
                userId: req.user.id,
                clientId: +req.params.clientId
            }
        }).then(function (token) {
            if (!token) {
                return res.send("Invalid App")
            }
            if (token.userId != req.user.id) {
                return res.send("Unauthorized user")
            }
            token.destroy();

            return res.redirect('/apps/')
        })
    }
)



module.exports = router
