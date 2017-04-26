/**
 * Created by championswimmer on 27/04/17.
 */

const util = require('util')
    , Strategy = require('passport-strategy')
    , request = require('request');

const LOGIN_PATH = "https://api.codingblocks.com/login/login_user";
const USERINFO_PATH = "https://api.codingblocks.com/students/basic_profile";

/**
 *
 * @param {Object} options
 * @param {Strategy~verifyCallback} verify
 * @constructor
 */
function LmsStrategy(options, verify) {
    if (!options) { throw new TypeError('LmsStrategy requires a option object'); }

    if (!verify) { throw new TypeError('LocalStrategy requires a verify callback'); }

    this._instituteId = options.instituteId;
    this._applicationId = options.applicationId;
    this._deviceId = options.deviceId;


    Strategy.call(this);

    this.name = 'lms';
    this._verify = verify;
    this._passReqToCallback = options.passReqToCallback;
}


util.inherits(LmsStrategy, Strategy);

/**
 *
 * @param {Object} req
 * @param {Object} options

 */
Strategy.prototype.authenticate = function(req, options) {
    options = options || {};
    let roll_number = req.body.username;
    let password = req.body.password;

    let self = this;


    if (!roll_number || !password) {
        return self.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
    }

    /**
     * @callback Strategy~verifiedCallback
     * @param {Error} err
     * @param {Object} user
     * @param {Object} info
     * @returns {*}
     */
    function verified(err, user, info) {
        if (err) { return self.error(err); }
        if (!user) { return self.fail(info); }
        self.success(user, info);
    }

    request.post(LOGIN_PATH, {
        headers: {
            "institute-id": self._instituteId
        },
        form: {
            "application_id": self._applicationId,
            "device_id": self._deviceId,
            "password": password,
            "roll_number": roll_number
        }
    }, function (err, resp, body) {
        if (err || resp.statusCode != 200) {
            return self.fail(err, 500)
        }

        if (resp.statusCode == 200) {
            let accessToken = JSON.parse(body).access_token;
            request.get(USERINFO_PATH, {
                headers: {
                    "institute-id": self._instituteId,
                    "access-token": accessToken
            }
            }, function (error, response, userdata) {
                if (err || resp.statusCode != 200) {
                    return self.fail(err, 500)
                }
                if (resp.statusCode == 200) {
                    try {
                        if (self._passReqToCallback) {

                            self._verify(req, accessToken, userdata, verified);
                        } else {
                            /**
                             * @callback Strategy~verifyCallback
                             * @param {String} accessToken
                             * @param {Object} userdata
                             * @param {Strategy~verifiedCallback} verified
                             */
                            self._verify(accessToken, userdata, verified);
                        }
                    } catch (ex) {
                        return self.error(ex);
                    }
                }
            })
        }
    })
};


exports = module.exports = LmsStrategy;
exports.Strategy = LmsStrategy;

/**
 * @callback Strategy~verifyCallback
 * @param {String} accessToken
 * @param {Object} userdata
 * @param {Strategy~verifiedCallback} verified
 */

/**
 * @callback Strategy~verifiedCallback
 * @param {Error} err
 * @param {Object} user
 * @param {Object} info
 * @returns {*}
 */