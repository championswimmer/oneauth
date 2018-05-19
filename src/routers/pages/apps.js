/**
 * Created by bhavyaagg on 19/05/18.
 */
const router = require('express').Router()
const cel = require('connect-ensure-login')

const models = require('../../db/models').models

router.get('/',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        models.GrantCode.findAll({
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
        models.GrantCode.findOne({
            where: {
                userId: req.user.id,
                clientId: +req.params.clientId
            }
        }).then(function (grantCode) {
            if (!grantCode) {
                return res.send("Invalid App")
            }
            if (grantCode.userId != req.user.id) {
                return res.send("Unauthorized user")
            }
            grantCode.destroy();

            return res.redirect('/apps/')
        })
    }
)



module.exports = router
