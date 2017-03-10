/**
 * Created by championswimmer on 10/03/17.
 */

const BasicStrategy = require('passport-http').BasicStrategy;
const models = require('../../db/models').models;

/**
 * This is used to authenticate a _client_ with
 * Authorization: Basic <base64(clientId:clientSecret)>
 */
const basicStrategy = new BasicStrategy(function (clientId, clientSecret, done) {
    models.Client.findOne({
        where: {id: clientId}
    }).then(function (client) {
        if (!client) {
            return done(null, false);
        }
        if (client.secret != clientSecret) {
            return done(null, false);
        }

        return done(null, client)
    })
});




module.exports = basicStrategy;