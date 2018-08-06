
config = {
  "FACEBOOK_CALLBACK": "/login/facebook/callback",
  "FACEBOOK_LOGIN_SCOPES": ["email", "public_profile"],
  "TWITTER_CALLBACK": "/login/twitter/callback",
  "GITHUB_CALLBACK": "/login/github/callback",
  "GOOGLE_CALLBACK": "/login/google/callback",
  "LINKEDIN_CALLBACK": "/connect/linkedin/callback",
  "GRANT_TOKEN_SIZE": 32,
  "AUTH_TOKEN_SIZE": 64,
  "BCRYPT_SALT_ROUNDS": 8,
  "DEBUG": false,
  "NEWRELIC_LOG_LEVEL": "info",
  "EMAIL_SENDER_ADDR": "info@codingblocks.com",
  "WELCOME_EMAIL": "51913645-587b-419c-af40-79fc10553451",
  "FORGOT_USER_EMAIL": "a7e8ca83-0b5f-4ec8-b7cb-a3dbd2839c46",
  "FORGOT_PASS_EMAIL":"64d80a73-194d-4988-a581-87fbcf5457c7",
  "VERIFY_EMAIL" :"3e470c46-5d2b-471e-992e-4820f1599de3"
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
    if(process.env.SENDGRID_API_KEY) {
      config.SECRETS.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
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
