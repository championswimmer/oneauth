/**
 * Created by championswimmer on 07/05/17.
 */
const Raven = require('raven')
const FacebookStrategy = require('passport-facebook').Strategy;

const models = require('../../../db/models').models;

const secrets = require('../../../secrets.json');
const config = require('../../../config');
const passutils = require('../../../utils/password');


/**
 * This is to authenticate _users_ using their
 * Facebook accounts
 */

module.exports = new FacebookStrategy({
    clientID: secrets.FB_CLIENT_ID,
    clientSecret: secrets.FB_CLIENT_SECRET,
    callbackURL: config.SERVER_URL + config.FACEBOOK_CALLBACK,
    profileFields: ['id', 'name', 'picture', 'email'],
    passReqToCallback: true,
}, function (req, authToken, refreshToken, profile, cb) {
    let profileJson = profile._json;
    let oldUser = req.user;

    if (oldUser) {
        if (config.DEBUG) console.log('User exists, is connecting Facebook account');
        models.UserFacebook.upsert({
            id: profileJson.id,
            accessToken: authToken,
            refreshToken: refreshToken,
            photo: "https://graph.facebook.com/" + profileJson.id + "/picture?type=large",
            userId: oldUser.id
        }).then(function (updated) {
            return models.User.findById(oldUser.id)
        }).then(function (user) {
            return cb(null, user.get())
        }).catch((err) => Raven.captureException(err))
    } else {
        models.UserFacebook.findCreateFind({
            include: [models.User],
            where: {id: profileJson.id},
            defaults: {
                id: profileJson.id,
                accessToken: authToken,
                refreshToken: refreshToken,
                photo: "https://graph.facebook.com/" + profileJson.id + "/picture?type=large",
                user: {
                    firstname: profileJson.first_name,
                    lastname: profileJson.last_name,
                    email: profileJson.email,
                    photo: "https://graph.facebook.com/" + profileJson.id + "/picture?type=large"
                }
            }
        }).spread(function(userFacebook, created) {
            //TODO: Check 'created' == true to see if first time user
            if (!userFacebook) {
                return cb(null, false);
            }
            return cb(null, userFacebook.user.get())
        }).catch((err) => Raven.captureException(err))
    }



});