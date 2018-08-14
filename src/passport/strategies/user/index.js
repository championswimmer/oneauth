/**
 * Created by championswimmer on 08/03/17.
 */

const localStrategy = require('./strategy-local')

const fbStrategy = require('./strategy-facebook')

const twitterStrategy = require('./strategy-twitter')

const githubStrategy = require('./strategy-github')

const lmsStrategy = require('./strategy-lms')

const googleStrategy = require('./strategy-google')

const linkedinStrategy = require('./strategy-linkedin')

module.exports = {localStrategy, fbStrategy, twitterStrategy, githubStrategy, googleStrategy, linkedinStrategy, lmsStrategy}
