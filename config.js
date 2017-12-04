
config = {
  "FACEBOOK_CALLBACK": "/login/facebook/callback",
  "FACEBOOK_LOGIN_SCOPES": ["email", "public_profile"],
  "TWITTER_CALLBACK": "/login/twitter/callback",
  "GITHUB_CALLBACK": "/login/github/callback",
  "GRANT_TOKEN_SIZE": 32,
  "AUTH_TOKEN_SIZE": 64,
  "BCRYPT_SALT_ROUNDS": 8,
  "DEBUG": false,
  "NEWRELIC_LOG_LEVEL": "info"
};

config.DEPLOY_CONFIG = process.env.ONEAUTH_DEV || 'production';

switch (config.DEPLOY_CONFIG) {


  case 'localhost':
    config.SERVER_URL = 'http://localhost:3838'
    config.DEBUG = true
    config.SECRETS = require('./secrets-sample.json')
    break;



  case 'heroku':
    config.SERVER_URL = 'https://oneauth.herokuapp.com'
    config.DEBUG = true
    config.SECRETS = require('./secrets-sample.json')
    if (process.env.SENTRY_DSN) {
      config.SECRETS.SENTRY_DSN = process.env.SENTRY_DSN
    }
    if (process.env.NEW_RELIC_LICENSE_KEY) {
      config.SECRETS.NEWRELIC_LICENSE_KEY = process.env.NEW_RELIC_LICENSE_KEY
    }
    config.NEWRELIC_LOG_LEVEL = 'trace'
    break;



  case 'production': default:
  config.SERVER_URL = 'https://account.codingblocks.com'
  config.SECRETS = require('./secrets.json')
  config.COOKIE_DOMAIN = '.codingblocks.com'
  break;
}

module.exports = config;
