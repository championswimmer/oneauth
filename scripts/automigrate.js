const config = require('../config');
const secret = config.SECRETS;
const package = require('../package')
config.DEBUG = true;
process.env.ONEAUTH_DB_NO_SYNC = 'true'

const {
    models: {College, Branch, Company},
    db
} = require('../src/db/models');

(async () => {
    try {
        if (package.version === '0.4.8') {
            await College.sync({force: true})
            await Branch.sync({force: true})
            await Company.sync({force: true})
        }
    } catch (err) {
        console.error(err)
    }
})()