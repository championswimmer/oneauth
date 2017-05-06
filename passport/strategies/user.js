/**
 * Created by championswimmer on 08/03/17.
 */
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter-email').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const models = require('../../db/models').models;

const secrets = require('../../secrets.json');
const config = require('../../config');
const passutils = require('../../utils/password');

const LmsStrategy = require('./custom/passport-lms').Strategy;

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
                return cb(err, false, {message: err})
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
    profileFields: ['id', 'name', 'picture', 'email'],
    passReqToCallBack: true
}, function (req, authToken, refreshToken, profile, cb) {
    let profileJson = profile._json;
    console.log(profileJson);

    models.UserFacebook.findCreateFind({
        include: [models.User],
        where: {id: profileJson.id},
        defaults: {
            id: profileJson.id,
            accessToken: authToken,
            refreshToken: refreshToken,
            photo: profileJson.picture.data.url,
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
    });

});

/**
 * Authenticate _users_ using their Twitter accounts
 */
const twitterStrategy = new TwitterStrategy({
    consumerKey: secrets.TWITTER_CONSUMER_KEY,
    consumerSecret: secrets.TWITTER_CONSUMER_SECRET,
    callbackURL: config.SERVER_URL + config.TWITTER_CALLBACK,
    passReqToCallBack: true
}, function(req, token, tokenSecret, profile, cb) {
        let profileJson = profile._json;
        if (typeof tokenSecret == 'object') {
            tokenSecret = tokenSecret.user_id || "";
        }

        models.UserTwitter.findCreateFind({
            include: [models.User],
            where: {id: profileJson.id},
            defaults: {
                id: profileJson.id,
                token: token,
                tokenSecret: tokenSecret,
                username: profileJson.screen_name,
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

/**
 * Authenticate _users_ using their Github Accounts
 */
const githubStrategy = new GithubStrategy({
    clientID: secrets.GITHUB_CONSUMER_KEY,
    clientSecret: secrets.GITHUB_CONSUMER_SECRET,
    callbackURL: config.SERVER_URL + config.GITHUB_CALLBACK,
    passReqToCallBack: true
}, function(req, token, tokenSecret, profile, cb) {
        let profileJson = profile._json;

        if (config.DEBUG) {
            console.log("req, token, tokenSecret, profile = = = = = ");
            console.log(token);
            console.log(tokenSecret);
            console.log(profileJson);
        }

        models.UserGithub.findCreateFind({
            include: [models.User],
            where: {id: profileJson.id},
            defaults: {
                id: profileJson.id,
                token: token || tokenSecret.access_token,
                tokenSecret: typeof tokenSecret == 'string' ? tokenSecret : "",
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

const lmsStrategy = new LmsStrategy({
    instituteId: secrets.LMS_INSTITUTE_ID,
    applicationId: secrets.LMS_APPLICATION_ID,
    deviceId: secrets.LMS_DEVICE_ID
}, function (accessToken, profile, cb) {
    let profileJson = JSON.parse(profile);

    models.UserLms.findCreateFind({
        include: [models.User],
        where: {id: profileJson.id},
        defaults: {
            id: profileJson.id,
            roll_number: profileJson.roll_number,
            accessToken: accessToken,
            course_identifier: profileJson.course_identifier,
            user: {
                username: profileJson.roll_number,
                firstname: profileJson.name.split(' ')[0],
                lastname: profileJson.name.split(' ').pop(),
                email: profileJson.email,
                photo: profileJson.photo ? profileJson.photo.url : ""
            }
        }
    }).spread(function(userLms, created) {
        //TODO: Check created == true for first time
        if (!userLms) {
            return cb(null, false);
        }

        return cb(null, userLms.user.get())
    })
});

module.exports = {localStrategy, fbStrategy, twitterStrategy, githubStrategy, lmsStrategy};