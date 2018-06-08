/**
 * These are authentication strategies to authenticate the user.
 * For example - when user logs in with username+password
 * Or when we logs in via SSO like Facebook/Twitter etc.
 *
 * Created by championswimmer on 10/03/17.
 */

const BasicStrategy = require('passport-http').BasicStrategy
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
const models = require('../../db/models').models


/**
 * Used as the #verify callback in the client strategies
 * @param clientId
 * @param clientSecret
 * @param done
 */
const verifyClient = function (clientId, clientSecret, done) {
    models.Client.findOne({
        where: {id: clientId}
    }).then(function (client) {
        if (!client) {
            return done(null, false)
        }
        if (client.secret != clientSecret) {
            return done(null, false)
        }

        return done(null, client)
    }).catch((err) => console.log(err))
}

/**
 * This is used to authenticate a _client_ with
 * Authorization: Basic <base64(clientId:clientSecret)>
 */
const basicStrategy = new BasicStrategy(verifyClient)

const clientPasswordStrategy = new ClientPasswordStrategy(verifyClient)


module.exports = {basicStrategy, clientPasswordStrategy}
