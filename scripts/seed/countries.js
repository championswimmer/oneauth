const config = require('../../config');
const secret = config.SECRETS;
const {models: {
        Country
    }} = require('../../src/db/models');

async function runSeed() {
    try {
        await Country.sync()
        await Country.create({name: 'India', id: 'IN'})
    } catch (err) {
        console.error(err)
    } finally {
        process.exit()
    }
}

runSeed()