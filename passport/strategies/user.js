/**
 * Created by championswimmer on 08/03/17.
 */
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter-email').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const models = require('../../db/models').models;

const secrets = require('../../secrets.json');
const config = require('../../config.json');
const passutils = require('../../utils/password');

/**
 * This is to authenticate _users_ using a username and password
 * via a simple post request
 */
const localStrategy = new LocalStrategy(function (username, password, cb) {
    models.UserLocal.findOne({
        include: [{model: models.User, where: {username: username}}],
    }).then(function(userLocal) {
        if (!userLocal) {
            return cb(null, false);
        }

        passutils.compare2hash(password, userLocal.password)
            .then(function(match) {
                if (match) {
                    return cb(null, userLocal.user.get());
                } else {
                    return cb(null, false);
                }
            })
            .catch(function (err) {
                console.trace(err.message);
                return cb(null, false, {message: err})
            });

    });

});

/**
 * This is to authenticate _users_ using their
 * Facebook accounts
 */
const fbStrategy = new FacebookStrategy({
    clientID: secrets.FB_CLIENT_ID,
    clientSecret: secrets.FB_CLIENT_SECRET,
    callbackURL: config.SERVER_URL + config.FACEBOOK_CALLBACK,
    profileFields: ['id', 'name', 'picture', 'email']
}, function (authToken, refreshToken, profile, cb) {
    let profileJson = profile._json;

    models.UserFacebook.findCreateFind({
        include: [models.User],
        where: {id: profileJson.id},
        defaults: {
            id: profileJson.id,
            accessToken: authToken,
            refreshToken: refreshToken,
            user: {
                firstname: profileJson.first_name,
                lastname: profileJson.last_name,
                email: profileJson.email,
                photo: profileJson.picture.data.url
            }
        }
    }).spread(function(userFacebook, created) {
        //TODO: Check 'created' == true to see if first time user
        if (!userFacebook) {
            return cb(null, false);
        }
        return cb(null, userFacebook.user.get())
    });

});

const twitterStrategy = new TwitterStrategy({
        consumerKey: secrets.TWITTER_CONSUMER_KEY,
        consumerSecret: secrets.TWITTER_CONSUMER_SECRET,
        callbackURL: config.SERVER_URL + config.TWITTER_CALLBACK
},
    function(token, tokenSecret, profile, cb) {
        let profileJson = profile._json;

        models.UserTwitter.findCreateFind({
            include: [models.User],
            where: {id: profileJson.id},
            defaults: {
                id: profileJson.id,
                token: token,
                tokenSecret: tokenSecret,
                user: {
                    username: profileJson.screen_name,
                    firstname: profileJson.name.split(' ')[0],
                    lastname: profileJson.name.split(' ').pop(),
                    email: profileJson.email,
                    photo: profileJson.profile_image_url_https.replace('_normal', '_400x400')
                }
            }
        }).spread(function(userTwitter, created) {
            //TODO: Check created == true for first time
            if (!userTwitter) {
                return cb(null, false);
            }

            return cb(null, userTwitter.user.get())
        })
});

module.exports = {localStrategy, fbStrategy, twitterStrategy};