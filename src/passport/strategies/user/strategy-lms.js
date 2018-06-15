/**
 * Created by championswimmer on 07/05/17.
 */
const Raven = require('raven')
const LmsStrategy = require('./../custom/passport-lms').Strategy
const models = require('../../../db/models').models

const config = require('../../../../config')
const secrets = config.SECRETS
const passutils = require('../../../utils/password')


module.exports = new LmsStrategy({
    instituteId: secrets.LMS_INSTITUTE_ID,
    applicationId: secrets.LMS_APPLICATION_ID,
    deviceId: secrets.LMS_DEVICE_ID
}, async function (accessToken, profile, cb) {
    let profileJson = JSON.parse(profile)
    Raven.setContext({extra: {file: 'lmsstrategy'}})
    try{
        const [userLms, created] = await models.UserLms.findCreateFind({
            include: [models.User],
            where: {id: profileJson.id},
            defaults: {
                id: profileJson.id,
                roll_number: profileJson.roll_number,
                accessToken: accessToken,
                course_identifier: profileJson.course_identifier,
                courses: profileJson.courses,
                user: {
                    username: profileJson.roll_number,
                    firstname: profileJson.name.split(' ')[0],
                    lastname: profileJson.name.split(' ').pop(),
                    email: profileJson.email,
                    photo: profileJson.photo ? profileJson.photo.url : ""
                }
            }
        })
        if (!userLms) {
            return cb(null, false, {message: 'Authentication Failed'})
        }

        return cb(null, userLms.user.get())

    }catch(err){
        Raven.captureException(err)
        return cb(null, false, {message: 'Could not create account'})
    }
})
