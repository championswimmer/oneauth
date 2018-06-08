/**
 * Created by championswimmer on 07/05/17.
 */
const Raven = require('raven')
const TwitterStrategy = require('passport-twitter-email').Strategy

const models = require('../../../db/models').models

const config = require('../../../../config')
const secrets = config.SECRETS
const passutils = require('../../../utils/password')
const debug = require('debug')('oauth:strategies:twitter')

/**
 * Authenticate _users_ using their Twitter accounts
 */

module.exports = new TwitterStrategy({
    consumerKey: secrets.TWITTER_CONSUMER_KEY,
    consumerSecret: secrets.TWITTER_CONSUMER_SECRET,
    callbackURL: config.SERVER_URL + config.TWITTER_CALLBACK,
    passReqToCallback: true
}, async function (req, token, tokenSecret, profile, cb) {

    let profileJson = profile._json
    let oldUser = req.user
    Raven.setContext({extra: {file: 'twitterstrategy'}})

    try {
        if (oldUser) {
            debug('User exists, is connecting Twitter account')

            const twaccount = await models.UserTwitter.findOne({where: {id: profileJson.id}})
            if (twaccount) {
                throw new Error('Your Twitter account is already linked with coding blocks account Id: ' + twaccount.dataValues.userId)
            } else {
                const updated = await models.UserTwitter.upsert({
                    id: profileJson.id,
                    token: token,
                    tokenSecret: tokenSecret,
                    username: profileJson.screen_name,
                    userId: oldUser.id
                })
                const user  = await models.User.findById(oldUser.id)
                if (user) {
                    return cb(null, user.get())
                } else {
                    return cb(null, false, {message: "Could not retrieve existing Twitter linked account"})
                }
            }

        } else { //new user
            debug('Creating new user with Twitter')

            /**
             * Check if any user with same username exists, if yes
             * we use a `username-t` policy
             */
            const existCount = await models.User.count({where: {username: profileJson.screen_name}})

            const [userTwitter, created] = await models.UserTwitter.findCreateFind({
                include: [models.User],
                where: {id: profileJson.id},
                defaults: {
                    id: profileJson.id,
                    token: token,
                    tokenSecret: tokenSecret,
                    username: profileJson.screen_name,
                    user: {
                        username: existCount === 0 ? profileJson.screen_name : profileJson.screen_name + "-t",
                        firstname: profileJson.name.split(' ')[0],
                        lastname: profileJson.name.split(' ').pop(),
                        email: profileJson.email || undefined,
                        photo: profileJson.profile_image_url_https.replace('_normal', '_400x400')
                    }
                }
            })

            if (!userTwitter) {
                return cb(null, false, {message: 'Authentication Failed'})
            }
            if (userTwitter.user) {
                return cb(null, userTwitter.user.get())
            }
            else {
                return cb(null, false, {message: 'Authentication Failed'})
            }

        }

    } catch (err) {
        Raven.captureException(err)
        cb(null, false, {message: err.message})
    }



})
