const Raven = require('raven')
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy

const models = require('../../../db/models').models
const config = require('../../../../config')
const secrets = config.SECRETS

const passutils = require('../../../utils/password')
const debug = require('debug')('oauth:strategy:linkedin')

module.exports = new LinkedinStrategy({
    clientID: secrets.LINKEDIN_CLIENT_ID,
    clientSecret: secrets.LINKEDIN_CLIENT_SECRET,
    callbackURL: config.SERVER_URL + config.LINKEDIN_CALLBACK,
    passReqToCallback: true,
    scope: ['r_emailaddress', 'r_basicprofile']

}, async function (req, token, tokenSecret, profile, cb){

      let profileJson = profile._json
      let oldUser = req.user
      Raven.setContext({extra: {file: 'linkedinStrategy'}})

      try{
          if(oldUser){
              debug('User exists, is connecting Linkedin account')

              const linkedinAccount = await models.UserLinkedin.findOne({where:{id:profileJson.id}})
              if(linkedinAccount){
                  throw new Error('Your Linkedin account is already linked with codingblocks account Id: ' + lkaccount.dataValues.userId)
              } else {
                  const updated = await models.UserLinkedin.upsert({
                    id: profileJson.id,
                      token: token,
                      tokenSecret: tokenSecret,
                      username: profileJson.formattedName,
                      profile: profileJson.publicProfileUrl,
                      userId: oldUser.id
                  })
                   const user = await models.User.findById(oldUser.id)

                   if (user) {
                      return cb(null, user.get())
                  } else {
                      return cb(null, false, {message: "Could not retrieve existing Linkedin linked account"})
                  }
              }
          } else {

              let userLinkedin = await models.UserLinkedin.findOne({
                  include: [models.User],
                  where: {id: profileJson.id}
              })
               if (!userLinkedin) {
                  const existingUsers = await models.User.findAll({
                      include: [{
                          model: models.UserLinkedin,
                          attributes: ['id'],
                          required: false
                      }],
                      where: {
                          email: profileJson.email,
                          '$userlinkedin.id$': {$eq: null}
                      }
                  })
                  if (existingUsers && existingUsers.length > 0) {

                      let oldIds = existingUsers.map(eu => eu.id).join(',')
                      return cb(null, false, {
                          message: `
                      Your email id "${profileJson.email}" is already used in the following Coding Blocks Account(s):
                      [ ${oldIds} ]
                      Please log into your old account and connect Linkedin in it instead.
                      Use 'Forgot Password' option if you do not remember password of old account`
                      })
                  }

                  const existCount = await models.User.count({where: {username: profileJson.login}})

                  userLinkedin = await models.UserLinkedin.create({
                      id: profileJson.id,
                      token: token,
                      tokenSecret: tokenSecret,
                      username:profileJson.formattedName,
                      profile: profileJson.publicProfileUrl,
                      user: {
                          firstname: profileJson.firstName,
                          lastname: profileJson.lastName,
                          email: profileJson.emailAddress,
                          photo: profileJson.pictureUrl
                      }
                  }, {
                      include: [models.User],
                  })
                  if (!userLinkedin) {
                      console.log('here')
                      return cb(null, false, {message: 'Authentication Failed'})
                  }
               }

               return cb(null, userLinkedin.user.get())
          }
      } catch (err){
          Raven.captureException(err)
          cb(null, false, {message: err.message})
      }
  }
)
