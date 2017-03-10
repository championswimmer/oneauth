/**
 * Created by championswimmer on 10/03/17.
 */
const oauth = require('oauth2orize')
    , cel = require('connect-ensure-login');

const models = require('../db/models').models
    , generator = require('../utils/generator')
    , passport = require('../passport/passporthandler');

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
            code: generator.genNcharAlphaNum(32),
            clientId: client.id,
            userId: user.id
        }).then(function (grantCode) {
            return done(null, grantCode.code)
        }).catch(function (err) {
            return done(err)
        })
    }
) );

const authorizationMiddleware = [
    cel.ensureLoggedIn('/login'),
    server.authorization(function(clientId, callbackURL, done) {
        models.Client.findOne({
            where: {id: clientId}
        }).then(function(client) {
            if (!client) {
                return done(null, false)
            }
            if (client.callbackURL != callbackURL) {
                return done(null, false)
            }
            return done(null, client, callbackURL)
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