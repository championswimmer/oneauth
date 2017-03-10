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
 * Generates a _refresh token_ or a _grant code_
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

        done(null, false)

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