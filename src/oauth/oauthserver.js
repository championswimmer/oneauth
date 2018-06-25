/**
 * Created by championswimmer on 10/03/17.
 */
const oauth = require('oauth2orize')
    , cel = require('connect-ensure-login')

const models = require('../db/models').models
    , generator = require('../utils/generator')
    , passport = require('../passport/passporthandler')
    , config = require('../../config')
    , debug = require('debug')('oauth:oauthserver')

const server = oauth.createServer()

server.serializeClient(function (client, done) {
    return done(null, client.id)
})

server.deserializeClient(function (clientId, done) {
    models.Client.findOne({
        where: {id: clientId}
    }).then(function (client) {
        return done(null, client)
    }).catch(err => debug(err))
})

/**
 * Generates a  _grant code_
 * that has to be exchanged for an access token later
 */
server.grant(oauth.grant.code(
    function (client, redirectURL, user, ares, done) {
        debug('oauth: getting grant code for ' + client.id + ' and ' + user.id)
        models.GrantCode.create({
            code: generator.genNcharAlphaNum(config.GRANT_TOKEN_SIZE),
            clientId: client.id,
            userId: user.id
        }).then(function (grantCode) {
            return done(null, grantCode.code)
        }).catch(function (err) {
            return done(err)
        })
    }
))
/**
 * Generate refresh token
 */
server.grant(oauth.grant.token(
    function (client, user, ares, done) {
        models.AuthToken.create({
            token: generator.genNcharAlphaNum(config.AUTH_TOKEN_SIZE),
            scope: ['*'],
            explicit: false,
            clientId: client.id,
            userId: user.id
        }).then(function (authToken) {
            return done(null, authToken.token)
        }).catch(function (err) {
            return done(err)
        })

    }
))

/**
 * Exchange **grant code** to get access token
 */
server.exchange(oauth.exchange.code(
    function (client, code, redirectURI, done) {
        debug('oneauth: exchange')
        models.GrantCode.findOne({
            where: {code: code},
            include: [models.Client]
        }).then(function (grantCode) {
            if (!grantCode) {
                return done(null, false) // Grant code does not exist
            }
            if (client.id !== grantCode.client.id) {
                return done(null, false) //Wrong Client ID
            }
            let callbackMatch = false
            for (url of client.callbackURL) {
                if (redirectURI.startsWith(url)) callbackMatch = true
            }
            if (!callbackMatch) {
                return done(null, false) // Wrong redirect URI
            }

            models.AuthToken.findCreateFind({
                where: {
                    clientId: grantCode.clientId,
                    userId: grantCode.userId,
                    explicit: true
                },
                defaults: {
                    token: generator.genNcharAlphaNum(config.AUTH_TOKEN_SIZE),
                    scope: ['*'],
                    explicit: true,
                    clientId: grantCode.clientId,
                    userId: grantCode.userId
                }
            }).spread(function (authToken, created) {
                return done(null, authToken.token)
            }).catch(function (err) {
                return done(err)
            })

            //Make sure to delete the grant code
            //so it cannot be reused
            grantCode.destroy()

        }).catch(err => debug(err))
    }
))

//TODO: Implement all the other types of tokens and grants !

const authorizationMiddleware = [
    cel.ensureLoggedIn('/login'),
    server.authorization(function (clientId, callbackURL, done) {
        debug('oauth: authorize')
        models.Client.findOne({
            where: {id: clientId}
        }).then(function (client) {
            if (!client) {
                return done(null, false)
            }
            debug(callbackURL)
            // We validate that callbackURL matches with any one registered in DB
            for (url of client.callbackURL) {
                if (callbackURL.startsWith(url)) {
                    return done(null, client, callbackURL)
                }
            }
            return done(null, false)
        }).catch(err => debug(err))
    }, function (client, user, done) {
        // Auto approve if this is trusted client
        if (client.trusted) {
            return done(null, true)
        }
        models.AuthToken.findOne({
            where: {
                clientId: client.id,
                userId: user.id
            }
        }).then(function (authToken) {
            if (!authToken) {
                return done(null, false)
            } else {
                return done(null, true)
            }
        }).catch(function (err) {
            return done(err)
        })

    }),
    function (req, res) {
        res.render("authdialog", {
            transactionID: req.oauth2.transactionID,
            user: req.user,
            client: req.oauth2.client
        })
    }
]

// Exchange the client id and password/secret for an access token. The callback accepts the
// `client`, which is exchanging the client's id and password/secret from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the client who authorized the code.

server.exchange(oauth.exchange.clientCredentials((client, scope, done) => {
  // Validate the client
  models.Client.findOne({
      where: {id: client.get().id}
  })
 .then((localClient) => {
    if (!localClient) {
        return done(null, false);
    }
     if (localClient.get().secret !== client.get().secret) {
         // Password (secret) of client is wrong
         return done(null, false);
     }

     if (!localClient.get().trusted) {
         // Client is not trusted
         return done(null, false);
     }

     // Everything validated, return the token
     const token = generator.genNcharAlphaNum(config.AUTH_TOKEN_SIZE)
     // Pass in a null for user id since there is no user with this grant type
     return models.AuthToken.create({
         token: generator.genNcharAlphaNum(config.AUTH_TOKEN_SIZE),
         scope: ['*'],
         explicit: false,
         clientId: client.get().id,
         userId: null // This is a client scoped token, so no related user here
     }).then((Authtoken) => {
      return done(null , Authtoken.get().token)
     })
       .catch((err) => {
         return done(err)
     });
 }).catch((err) => {
     return done(err)
 })
}));

const decisionMiddleware = [
    cel.ensureLoggedIn('/login'),
    server.decision()
]

const tokenMiddleware = [
    passport.authenticate(['basic', 'oauth2-client-password'], {session: false}),
    server.token(),
    server.errorHandler()
]
module.exports = {
    Middlewares: {tokenMiddleware, decisionMiddleware, authorizationMiddleware}
}
