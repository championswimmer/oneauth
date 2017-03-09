/**
 * Created by championswimmer on 10/03/17.
 */
const uid2 = require('uid2');

module.exports = {
    genNdigitNum(N) {
        return parseInt(Math.random()*(Math.pow(10,N)))
    },
    genNcharAlphaNum(N) {
        return uid2(N)
    }
};