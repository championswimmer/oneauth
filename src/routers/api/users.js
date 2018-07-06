/**
 * Created by championswimmer on 10/03/17.
 *
 * This is the /api/v1/users path
 */
const router = require('express').Router()
const cel = require('connect-ensure-login')
const passport = require('../../passport/passporthandler')
const models = require('../../db/models').models
const Raven = require('raven')

router.get('/me',
    // Frontend clients can use this API via session (using the '.codingblocks.com' cookie)
    passport.authenticate(['bearer', 'session']),
    function (req, res) {

        if (req.user && !req.authInfo.clientOnly && req.user.id) {
            let includes = []
            if (req.query.include) {
                let includedAccounts = req.query.include.split(',')
                for (ia of includedAccounts) {
                    switch (ia) {
                        case 'facebook':
                            includes.push({ model: models.UserFacebook, attributes: {exclude: ["accessToken","refreshToken"]}})
                            break
                        case 'twitter':
                            includes.push({ model: models.UserTwitter, attributes: {exclude: ["token","tokenSecret"]}})
                            break
                        case 'github':
                            includes.push({ model: models.UserGithub, attributes: {exclude: ["token","tokenSecret"]}})
                            break
                        case 'google':
                            includes.push({model: models.UserGoogle, attributes: {exclude: ["token","tokenSecret"]}})
                            break
                        case 'lms':
                            includes.push({ model: models.UserLms, attributes: {exclude: ["accessToken"]}})
                            break
                    }
                }
            }


            models.User.findOne({
                where: {id: req.user.id},
                include: includes
            }).then(function (user) {
                if (!user) {
                    throw new Error("User not found")
                }
                res.send(user)
            }).catch(function (err) {
                res.send('Unknown user or unauthorized request')
            })

        } else {
            return res.status(403).json({error: 'Unauthorized'})
        }

    })

router.get('/me/address',
    // Frontend clients can use this API via session (using the '.codingblocks.com' cookie)
    passport.authenticate(['bearer', 'session']),
    function (req, res) {
        if (req.user && req.user.id) {
            let includes = [{model: models.Demographic,
            include: [models.Address]
            }]
            if (req.query.include) {
                let includedAccounts = req.query.include.split(',')
                for (ia of includedAccounts) {
                    switch (ia) {
                        case 'facebook':
                            includes.push({ model: models.UserFacebook, attributes: {exclude: ["accessToken","refreshToken"]}})
                            break
                        case 'twitter':
                            includes.push({ model: models.UserTwitter, attributes: {exclude: ["token","tokenSecret"]}})
                            break
                        case 'github':
                            includes.push({ model: models.UserGithub, attributes: {exclude: ["token","tokenSecret"]}})
                            break
                        case 'google':
                            includes.push({model: models.UserGoogle, attributes: {exclude: ["token","tokenSecret"]}})
                            break
                        case 'lms':
                            includes.push({ model: models.UserLms, attributes: {exclude: ["accessToken"]}})
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
                    throw new Error("User not found")
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
        if (req.user && req.user.id) {
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
        // Send the user his own object if the token is user scoped
        if (req.user && !req.authInfo.clientOnly && req.user.id) {
            if (req.params.id == req.user.id) {
                return res.send(req.user)
            }
        }
        let trustedClient = req.client && req.client.trusted
        models.User.findOne({
            // Public API should expose only id, username and photo URL of users
            // But for trusted clients we will pull down our pants
            attributes: trustedClient ? undefined: ['id', 'username', 'photo'],
            where: {id: req.params.id}
        }).then(function (user) {
            if (!user) {
                throw new Error("User not found")
            }
            res.send(user)
        }).catch(function (err) {
            res.send('Unknown user or unauthorized request')
        })
    }
)
router.get('/:id/address',
    // Only for server-to-server calls, no session auth
    passport.authenticate('bearer', {session: false}),
    function (req, res) {
        let includes = [{model: models.Demographic,
            include: [{model: models.Address, include:[models.State, models.Country]}]
        }]

        if (!req.authInfo.clientOnly) {
            // If user scoped token

            // Scoped to some other user: Fuck off bro
            if (req.params.id != req.user.id) {
                return res.status(403).json({error: 'Unauthorized'})
            }
        } else {
            // If not user scoped

            // Check if trusted client or not
            if (!req.client.trusted) {
                return res.status(403).json({error: 'Unauthorized'})
            }
        }

        models.Address.findAll({
            where: {'$demographic.userId$': req.params.id},
            include: includes
        }).then(function (addresses) {
            return res.json(addresses)
        }).catch(function (err) {
            Raven.captureException(err)
            req.flash('error', 'Something went wrong trying to query address database')
            return res.status(500).json({error: err.message})
        })
    }
)

module.exports = router
