/**
 * Created by championswimmer on 07/05/17.
 */
const GithubStrategy = require('passport-github2').Strategy;

const models = require('../../../db/models').models;

const secrets = require('../../../secrets.json');
const config = require('../../../config');
const passutils = require('../../../utils/password');

/**
 * Authenticate _users_ using their Github Accounts
 */

module.exports = new GithubStrategy({
    clientID: secrets.GITHUB_CONSUMER_KEY,
    clientSecret: secrets.GITHUB_CONSUMER_SECRET,
    callbackURL: config.SERVER_URL + config.GITHUB_CALLBACK,
    passReqToCallBack: true
}, function(req, token, tokenSecret, profile, cb) {
    let profileJson = profile._json;

    models.UserGithub.findCreateFind({
        include: [models.User],
        where: {id: profileJson.id},
        defaults: {
            id: profileJson.id,
            token: token || tokenSecret.access_token,
            tokenSecret: typeof tokenSecret == 'string' ? tokenSecret : "",
            username: profileJson.login,
            user: {
                username: profileJson.login,
                firstname: profileJson.name.split(' ')[0],
                lastname: profileJson.name.split(' ').pop(),
                email: profileJson.email,
                photo: profileJson.avatar_url
            }
        }
    }).spread(function(userGithub, created) {
        //TODO: Check created == true for first time
        if (!userGithub) {
            return cb(null, false);
        }
        return cb(null, userGithub.user.get())
    })
});