/**
 * Created by championswimmer on 07/05/17.
 */
const Raven = require('raven')
const FacebookStrategy = require('passport-facebook').Strategy;

const models = require('../../../db/models').models;

const config = require('../../../config');
const secrets = config.SECRETS;
const passutils = require('../../../utils/password');
const tracer = require('../../../utils/ddtracer').tracer


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
    // DATADOG TRACE: START SPAN
    const span = tracer.startSpan('passport.strategy.facebook')
    if (oldUser) {
        if (config.DEBUG)
            console.log('User exists, is connecting Facebook account');
        models.UserFacebook.findOne({where: {id: profileJson.id}})
            .then((fbaccount) => {
                if (fbaccount) {
                    throw new Error('Your Facebook account is already linked with codingblocks account Id: ' + fbaccount.dataValues.userId);
                }
                else {
                    models.UserFacebook.upsert({
                        id: profileJson.id,
                        accessToken: authToken,
                        refreshToken: refreshToken,
                        photo: "https://graph.facebook.com/" + profileJson.id + "/picture?type=large",
                        userId: oldUser.id
                    })
                        .then(function (updated) {
                            return models.User.findById(oldUser.id)
                        })
                        .then(function (user) {
                            // DATADOG TRACE: END SPAN
                            user.update({photo: "https://graph.facebook.com/" + profileJson.id + "/picture?type=large"});
                            setImmediate(() => {
                                span.addTags({
                                    type: 'web',
                                    'span.kind': 'server',
                                    userId: oldUser.id,
                                    newUser: false,
                                    facebookId: profileJson.id
                                })
                                span.finish()
                            })
                            return cb(null, user.get())
                        })
                        .catch((err) => {
                            Raven.captureException(err);
                            return cb(err, null)
                        })
                }
            })
            .catch((err) => {
                Raven.captureException(err);
                return cb(null, false, {message: err.message});
            })
    }
    else {

        models.UserFacebook.findCreateFind({
            include: [models.User],
            where: {id: profileJson.id},
            defaults: {
                id: profileJson.id,
                accessToken: authToken,
                refreshToken: refreshToken,
                photo: "https://graph.facebook.com/" + profileJson.id + "/picture?type=large",
                user: {
                    username: profileJson.first_name + '-' + profileJson.last_name + '-' + profileJson.id,
                    firstname: profileJson.first_name,
                    lastname: profileJson.last_name,
                    email: profileJson.email,
                    photo: "https://graph.facebook.com/" + profileJson.id + "/picture?type=large"
                }
            }
        }).spread(function (userFacebook, created) {
            //TODO: Check 'created' == true to see if first time user
            if (!userFacebook) {
                return cb(null, false, {message: 'Authentication Failed'});
            }
            // DATADOG TRACE: END SPAN
            setImmediate(() => {
                span.addTags({
                    type: 'web',
                    'span.kind': 'server',
                    userId: userFacebook.user.id,
                    newUser: true,
                    facebookId: profileJson.id
                })
                span.finish()
            })
            return cb(null, userFacebook.user.get())
        }).catch((err) => Raven.captureException(err))
    }


});
