/**
 * Created by championswimmer on 01/04/17.
 */
const bcrypt = require('bcrypt');

const config = require('../../config');
const saltRounds = config.BCRYPT_SALT_ROUNDS;

/**
 * Returns promise
 */
const pass2hash = function (pass) {
    return bcrypt.hash(pass, saltRounds)
};

const compare2hash = function (pass, hash) {
    return bcrypt.compare(pass, hash)
};

module.exports = {
    pass2hash, compare2hash
};