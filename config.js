
config = {
    "FACEBOOK_CALLBACK": "/login/facebook/callback",
    "FACEBOOK_LOGIN_SCOPES": ["email", "public_profile"],
    "TWITTER_CALLBACK": "/login/twitter/callback",
    "GITHUB_CALLBACK": "/login/github/callback",
    "GRANT_TOKEN_SIZE": 32,
    "AUTH_TOKEN_SIZE": 64,
    "BCRYPT_SALT_ROUNDS": 8,
    "DEBUG": process.env.ONEAUTH_DEBUG
};

if (process.env.ONEAUTH_DEV) {
    config.SERVER_URL =  "https://oneauth.herokuapp.com";
    config.DEBUG = true
} else {
    config.SERVER_URL =  "https://account.codingblocks.com";
}

module.exports = config;
