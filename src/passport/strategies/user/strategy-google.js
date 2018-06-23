const Raven = require('raven')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const models = require('../../../db/models').models

const config = require('../../../../config')
const secrets = config.SECRETS
const passutils = require('../../../utils/password')
const debug = require('debug')('oauth:strategies:google')

module.exports = new GoogleStrategy({
        clientID: secrets.GOOGLE_CLIENT_ID,
        clientSecret: secrets.GOOGLE_CLIENT_SECRET,
        callbackURL: config.SERVER_URL + config.GOOGLE_CALLBACK,
        passReqToCallback: true,
        scope: ['email', 'profile']
    }, async function (req, accessToken, refreshToken, profile, cb) {
        let profileJson = profile._json
        let oldUser = req.user
        profileJson.email = profileJson.emails[0].value
        profileJson.username = profileJson.emails[0].value.split('@')[0] //Pre-@ part of first email
        Raven.setContext({extra: {file: 'googlestrategy'}})
        try {
            if (oldUser) {
                debug('User exists, is connecting Google account')
                /*
                This means an already logged in users is trying to
                connect Google to his account. Let us see if there
                are any connections to his Google already
                */
                const glaccount = await models.UserGoogle.findOne({where: {id: profileJson.id}})
                if (glaccount) {
                    throw new Error('Your Google account is already linked with codingblocks account Id: ' + glaccount.dataValues.userId)
                } else {
                    const updated = await models.UserGoogle.upsert({
                        id: profileJson.id,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        username: profileJson.username,
                        userId: oldUser.id
                    })

                    const user = await models.User.findById(oldUser.id)
                    if (user) {
                        cb(null, user.get())
                    } else {
                        return cb(null, false, {message: "Could not retrieve existing Google linked account"})
                    }
                }
            } else {
                /*
                This means either -
                    a. This is a new signup via Google
                    b. Someone is trying to login via Google
                 */

                let userGoogle = await models.UserGoogle.findOne({
                    include: [models.User],
                    where: {id: profileJson.id},
                })
                /*
                If userGoogle exists then
                Case (a): login
                 */

                if (!userGoogle) {
                    /*
                    Case (b): New Signup
                    First ensure there aren't already users with the same email
                    id that comes from Google
                     */

                    const existingUsers = await models.User.findAll({
                        include: [{
                            model: models.UserGoogle,
                            attributes: ['id'],
                            required: false
                        }],
                        where: {
                            email: profileJson.email,
                            '$usergoogle.id$': {$eq: null}
                        }
                    })
                    if (existingUsers && existingUsers.length > 0) {
                        let oldIds = existingUsers.map(eu => eu.id).join(',')
                        return cb(null, false, {
                            message: `
                    Your email id "${profileJson.email}" is already used in the following Coding Blocks Account(s): 
                    [ ${oldIds} ]
                    Please log into your old account and connect Google in it instead.
                    Use 'Forgot Password' option if you do not remember password of old account`
                        })
                    }

                    /* Check if users with same username exist. Modify username accordingly */
                    const existCount = await models.User.count({where: {username: profileJson.username}})

                    userGoogle = await models.UserGoogle.create({
                        id: profileJson.id,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        username: profileJson.username,
                        user: {
                            username: existCount === 0 ? profileJson.username : profileJson.username + '-g',
                            firstname: profileJson.name.givenName,
                            lastname: profileJson.name.familyName,
                            photo: profileJson.image.url,
                            email: profileJson.emails[0].value,
                            verifiedemail: profileJson.emails[0].value
                        }
                    }, {
                        include: [models.User],
                    })

                    if (!userGoogle) {
                        return cb(null, false, {message: 'Authentication Failed'})
                    }
                }
                return cb(null, userGoogle.user.get())
            }
        } catch (err) {
            Raven.captureException(err)
            cb(null, false, {message: err.message})
        }
    }
)