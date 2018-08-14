/**
 * Created by championswimmer on 08/03/17.
 */
const passport = require('passport')

const UserStrategies = require('./strategies/user')
    , ClientStrategies = require('./strategies/client')
    , ApiStrategies = require('./strategies/api')
    , debug = require('debug')('oauth:passporthandler')

const models = require('../db/models').models
const { findUserById } = require('../controllers/user')
const { findClientById } = require('../controllers/clients')

const config = require('../../config')

passport.use(UserStrategies.localStrategy)
passport.use(UserStrategies.fbStrategy)
passport.use(UserStrategies.twitterStrategy)
passport.use(UserStrategies.githubStrategy)
passport.use(UserStrategies.googleStrategy)
passport.use(UserStrategies.linkedinStrategy)
passport.use(UserStrategies.lmsStrategy)

passport.use(ClientStrategies.basicStrategy)
passport.use(ClientStrategies.clientPasswordStrategy)

passport.use(ApiStrategies.bearerStrategy)


passport.serializeUser(function (userOrClient, cb) {
    debug('Serialize : ')
    debug(userOrClient)
    if (userOrClient && userOrClient.username) {
        return cb(null, {
            id: userOrClient.id,
            type: 'user'
        })
    }
    if (userOrClient && userOrClient.callbackURL) {
        return cb(null, {
            id: userOrClient.id,
            type: 'client'
        })
    }
    return (cb(new Error("Neither user nor client for serialization")))

})

passport.deserializeUser(async (idHash, cb) => {
    debug('Deserialize : ')
    debug(idHash)
    try {
        if (idHash.type === 'user') {
            const user = await findUserById(idHash.id)
            if (process.env.ONEAUTH_DEV === 'localhost') {
                user.role = 'admin'
            }
            return cb(null, user)
        }
        if (idHash.type === 'client') {
            const client = await findClientById(idHash.id)
            return cb(null, client)
        }
    } catch (err) {
        return cb(err)
    }
})

passport.transformAuthInfo((info, done) => done(null, info))

module.exports = passport
