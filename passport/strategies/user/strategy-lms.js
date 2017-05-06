/**
 * Created by championswimmer on 07/05/17.
 */
const LmsStrategy = require('./../custom/passport-lms').Strategy;
const models = require('../../../db/models').models;

const secrets = require('../../../secrets.json');
const config = require('../../../config');
const passutils = require('../../../utils/password');


module.exports = new LmsStrategy({
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