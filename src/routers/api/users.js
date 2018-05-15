/**
 * Created by championswimmer on 10/03/17.
 *
 * This is the /api/v1/users path
 */
const router = require('express').Router()
const cel = require('connect-ensure-login')
const passport = require('../../passport/passporthandler')
const models = require('../../db/models').models


router.get('/me',
    // Frontend clients can use this API via session (using the '.codingblocks.com' cookie)
    passport.authenticate(['bearer', 'session']),
    function (req, res) {

        if (req.user) {
            let includes = []
            if (req.query.include) {
                let includedAccounts = req.query.include.split(',')
                for (ia of includedAccounts) {
                    switch (ia) {
                        case 'facebook':
                            includes.push(models.UserFacebook)
                            break
                        case 'twitter':
                            includes.push(models.UserTwitter)
                            break
                        case 'github':
                            includes.push(models.UserGithub)
                            break
                        case 'lms':
                            includes.push(models.UserLms)
                            break
                    }
                }
            }


            models.User.findOne({
                where: {id: req.user.id},
                include: includes
            }).then(function (user) {
                if (!user) {
                    throw err
                }
                res.send(user)
            }).catch(function (err) {
                res.send('Unknown user or unauthorized request')
            })

        } else {
            return res.sendStatus(403)
        }

    })

router.get('/me/address',
    // Frontend clients can use this API via session (using the '.codingblocks.com' cookie)
    passport.authenticate(['bearer', 'session']),
    function (req, res) {

        if (req.user) {
            let includes = [{model: models.Demographic,
            include: [models.Address]
            }]
            if (req.query.include) {
                let includedAccounts = req.query.include.split(',')
                for (ia of includedAccounts) {
                    switch (ia) {
                        case 'facebook':
                            includes.push(models.UserFacebook)
                            break
                        case 'twitter':
                            includes.push(models.UserTwitter)
                            break
                        case 'github':
                            includes.push(models.UserGithub)
                            break
                        case 'lms':
                            includes.push(models.UserLms)
                            break
                    }
                }
            }


            models.User.findOne({
                where: {id: req.user.id},
                include: includes
            }).then(function (user) {
                console.log(user)
                if (!user) {
                    throw err
                }
                res.send(user)
            }).catch(function (err) {
                res.send('Unknown user or unauthorized request')
            })

        } else {
            return res.sendStatus(403)
        }

    })


router.get('/me/logout',
    passport.authenticate('bearer', {session: false}),
    function (req, res) {
        if (req.user) {
            models.AuthToken.destroy({
                where: {
                    token: req.header('Authorization').split(' ')[1]
                }
            }).then(function () {
                res.status(202).send({
                    'user_id': req.user.id,
                    'logout': 'success'
                })
            }).catch(function (err) {
                res.status(501).send(err)
            })
        } else {
            res.status(403).send("Unauthorized")
        }
    }
)

router.get('/:id',
    passport.authenticate('bearer', {session: false}),
    function (req, res) {
        if (req.params.id == req.user.id) {
            return res.send(req.user)
        }
        models.User.findOne({
            // Public API should expose only id, username and photo URL of users
            attributes: ['id', 'username', 'photo'],
            where: {id: req.params.id}
        }).then(function (user) {
            if (!user) {
                throw err
            }
            res.send(user)
        }).catch(function (err) {
            res.send('Unknown user or unauthorized request')
        })
    }
)

module.exports = router
