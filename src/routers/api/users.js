/**
 * Created by championswimmer on 10/03/17.
 *
 * This is the /api/v1/users path
 */
const router = require('express').Router()
const cel = require('connect-ensure-login')
const passport = require('../../passport/passporthandler')
const models = require('../../db/models').models

const Raven = require('raven');
const { findUserById , findUserForTrustedClient, findAllUsersWithFilter} = require('../../controllers/user');
const { deleteAuthToken } = require('../../controllers/oauth');
const  { findAllAddresses } = require('../../controllers/demographics');

router.get('/',
  passport.authenticate('bearer', {session: false}),
  async function (req, res) {
    // Send the user his own object if the token is user scoped
    if (req.user && !req.authInfo.clientOnly && req.user.id) {
      if (req.params.id == req.user.id) {
        return res.send(req.user)
      }
    }

    let trustedClient = req.client && req.client.trusted
    try {
      let users = await findAllUsersWithFilter(trustedClient, req.query);
      if (!users) {
        throw new Error("User not found")
      }
      if (!Array.isArray(users)) {
        users = [users]
      }
      res.send(users)
    } catch (error) {
      res.send('Unknown user or unauthorized request')
    }
  }
)


router.get('/me',
    // Frontend clients can use this API via session (using the '.codingblocks.com' cookie)
    passport.authenticate(['bearer', 'session']),
    async function (req, res) {

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
                        case 'linkedin':
                            includes.push({model: models.UserLinkedin, attributes: {exclude: ["token","tokenSecret"]}})
                            break
                        case 'lms':
                            includes.push({ model: models.UserLms, attributes: {exclude: ["accessToken"]}})
                            break
                        case 'demographic':
                            includes.push({ model: models.Demographic, include: [models.College] })
                            break
                    }
                }
            }
            try {
                const user = await findUserById(req.user.id,includes);
                if (!user) {
                    throw new Error("User not found")
                }
                res.send(user)
            } catch (error) {
                res.send('Unknown user or unauthorized request')
            }
        } else {
            return res.status(403).json({error: 'Unauthorized'})
        }
    })

router.get('/me/address',
    // Frontend clients can use this API via session (using the '.codingblocks.com' cookie)
    passport.authenticate(['bearer', 'session']),
    async function (req, res) {
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
                        case 'linkedin':
                            includes.push({model: models.UserLinkedin, attributes: {exclude: ["token","tokenSecret"]}})
                            break
                        case 'lms':
                            includes.push({ model: models.UserLms, attributes: {exclude: ["accessToken"]}})
                            break
                    }
                }
            }
            try {
                const user = await findUserById(req.user.id,includes);
                if (!user) {
                    throw new Error("User not found")
                }
                res.send(user)
            } catch (error) {
                res.send('Unknown user or unauthorized request')
            }
        } else {
            return res.sendStatus(403)
        }
    })

router.get('/me/logout',
    passport.authenticate('bearer', {session: false}),
    async function (req, res) {
        if (req.user && req.user.id) {
            let token = req.header('Authorization').split(' ')[1];
            try {
                const del = await deleteAuthToken(token)
                res.status(202).send({
                    'user_id': req.user.id,
                    'logout': "success"
                })
            } catch (error) {
                res.status(501).send(error)
            }
        } else {
            res.status(403).send("Unauthorized")
        }
    }
)

router.get('/:id',
    passport.authenticate('bearer', {session: false}),
    async function (req, res) {
        // Send the user his own object if the token is user scoped
        if (req.user && !req.authInfo.clientOnly && req.user.id) {
            if (req.params.id == req.user.id) {
                return res.send(req.user)
            }
        }
        let trustedClient = req.client && req.client.trusted
        try {
            const user = await findUserForTrustedClient(trustedClient, req.params.id);
            if (!user) {
                throw new Error("User not found")
            }
            res.send(user)
        } catch (error) {
            res.send('Unknown user or unauthorized request')
        }
    }
)
router.get('/:id/address',
    // Only for server-to-server calls, no session auth
    passport.authenticate('bearer', {session: false}),
    async function (req, res) {
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
        try {
            const addresses = await findAllAddresses(req.params.id, includes)
            return res.json(addresses)
        } catch (error) {
            Raven.captureException(error)
            req.flash('error', 'Something went wrong trying to query address database')
            return res.status(500).json({error: error.message})
        }
    }
)




module.exports = router
