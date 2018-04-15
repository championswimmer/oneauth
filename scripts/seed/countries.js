const config = require('../../config');
const secret = config.SECRETS;
const {db, models: {
        Country
    }} = require('../../src/db/models');

async function runSeed() {
    try {
        await db.sync()
        await Country.create({name: 'India', id: 'IN'})
    } catch (err) {
        console.error(err)
    } finally {
        process.exit()
    }
}

runSeed()