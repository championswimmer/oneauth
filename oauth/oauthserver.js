/**
 * Created by championswimmer on 10/03/17.
 */
const oauth = require('oauth2orize')
    , cel = require('connect-ensure-login');

const models = require('../db/models').models
    , generator = require('../utils/generator')
    , passport = require('../passport/passporthandler')
    , config = require('../config.json');

const server = oauth.createServer();

server.serializeClient(function (client, done) {
    return done(null, client.id)
});

server.deserializeClient(function (clientId, done) {
    models.Client.findOne({
        where: {id: clientId}
    }).then(function (client) {
        return done(null, client)
    })
});

/**
 * Generates a  _grant code_
 * that has to be exchanged for an access token later
 */
server.grant( oauth.grant.code (
    function (client, redirectURL, user, ares, done) {
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
) );
/**
 * Generate refresh token
 */
server.grant( oauth.grant.token (
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
) );

/**
 * Exchange **grant code** to get access token
 */
server.exchange( oauth.exchange.code (
    function (client, code, redirectURI, done) {
        models.GrantCode.findOne({
            where: {code: code},
            include: [models.Client]
        }).then(function (grantCode) {
            if (!grantCode) {
                return done(null, false); // Grant code does not exist
            }
            if (client.id !== grantCode.client.id) {
                return done(null, false); //Wrong Client ID
            }
            let callbackMatch = false;
            for (url of client.callbackURL) {
                if (url === redirectURI) callbackMatch = true;
            }
            if (!callbackMatch) {
                return done(null, false); // Wrong redirect URI
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
            }).spread(function(authToken, created) {
                return done(null, authToken.token)
            }).catch(function(err) {
                return done(err)
            });

            //Make sure to delete the grant code
            //so it cannot be reused
            grantCode.destroy();

        })
    }
) );

//TODO: Implement all the other types of tokens and grants !

const authorizationMiddleware = [
    cel.ensureLoggedIn('/login'),
    server.authorization(function(clientId, callbackURL, done) {
        models.Client.findOne({
            where: {id: clientId}
        }).then(function(client) {
            if (!client) {
                return done(null, false)
            }
            console.log(callbackURL);
            for (url of client.callbackURL) {
                if (url == callbackURL) {
                    return done(null, client, callbackURL)
                }
            }
            return done(null, false)
        })
    }, function (client, user, done) {
        //TODO: Check if we can auto approve
        models.AuthToken.findOne({
            where: {
                clientId: client.id,
                userId: user.id
            }
        }).then(function(authToken) {
            if (!authToken) {
                return done(null, false)
            } else {
                return done(null, true)
            }
        }).catch(function(err) {
            return done(err)
        });

    }),
    function (req, res) {
        res.render("authdialog", {
            transactionID: req.oauth2.transactionID,
            user: req.user,
            client: req.oauth2.client
        })
    }
];

const decisionMiddleware = [
    cel.ensureLoggedIn('/login'),
    server.decision()
];

const tokenMiddleware = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
];

module.exports = {
    Middlewares: {tokenMiddleware, decisionMiddleware, authorizationMiddleware}
};