/**
 * Created by championswimmer on 07/05/17.
 */
const Raven = require('raven')
const GithubStrategy = require('passport-github2').Strategy

const models = require('../../../db/models').models

const config = require('../../../../config')
const secrets = config.SECRETS
const passutils = require('../../../utils/password')
const debug = require('debug')('oauth:strategies:github')

/**
 * Authenticate _users_ using their Github Accounts
 */

module.exports = new GithubStrategy({
    clientID: secrets.GITHUB_CONSUMER_KEY,
    clientSecret: secrets.GITHUB_CONSUMER_SECRET,
    callbackURL: config.SERVER_URL + config.GITHUB_CALLBACK,
    passReqToCallback: true
}, async function (req, token, tokenSecret, profile, cb) {
    let profileJson = profile._json
    let oldUser = req.user
    Raven.setContext({extra: {file: 'githubstrategy'}})
    try{
        if(oldUser){
            debug('User exists, is connecting Github account')
            const ghaccount =  await models.UserGithub.findOne({where: {id: profileJson.id}})
            if (ghaccount) {
                throw new Error('Your Github account is already linked with codingblocks account Id: ' + ghaccount.dataValues.userId)
            }else{
                const updated = await models.UserGithub.upsert({
                    id: profileJson.id,
                    token: token,
                    tokenSecret: tokenSecret,
                    username: profileJson.login,
                    userId: oldUser.id
                })

                const user = await models.User.findById(oldUser.id)

                if(user){
                    return cb(null, user.get())
                }else{
                    return cb(null, false, {message: "Could not retrieve existing Github linked account"})
                }
            }
        }else{
            const existCount = await models.User.count({where: {username: profileJson.login}})

            const [userGithub, created] = await models.UserGithub.findCreateFind({
                include: [models.User],
                where: {id: profileJson.id},
                defaults: {
                    id: profileJson.id,
                    token: token,
                    tokenSecret: tokenSecret,
                    username: profileJson.login,
                    user: {
                        username: existCount === 0 ? profileJson.login : profileJson.login + "-gh",
                        firstname: profileJson.name ? profileJson.name.split(' ')[0] : profileJson.login,
                        lastname: profileJson.name ? profileJson.name.split(' ').pop() : profileJson.login,
                        email: profileJson.email,
                        photo: profileJson.avatar_url
                    }
                }
            })

            if (!userGithub) {
                return cb(null, false, {message: 'Authentication Failed'})
            }
            return cb(null, userGithub.user.get())
        }
    }catch (err) {
        Raven.captureException(err)
        cb(null, false, {message: err.message})
    }

})
