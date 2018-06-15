const config = require('../../config');
const secret = config.SECRETS;
const debug = require('debug')('oauth:states.js')
const {db, models: {
        Country,
        State
    }} = require('../../src/db/models');

async function runSeed() {
    try {
        // await db.sync()
        const country = await Country.findOne({where: {id: 'IN'}})
        if (!country) { throw new Error("Country India is not yet added, so cannot add states")}


        await State.bulkCreate([
            { countryId: 'IN', name: 'Andhra Pradesh', id: 'AP' },
            { countryId: 'IN', name: 'Arunachal Pradesh', id: 'AR' },
            { countryId: 'IN', name: 'Assam', id: 'AS' },
            { countryId: 'IN', name: 'Bihar', id: 'BR' },
            { countryId: 'IN', name: 'Chhattisgarh', id: 'CG' },
            { countryId: 'IN', name: 'Chandigarh', id: 'CH' },
            { countryId: 'IN', name: 'Dadra and Nagar Haveli', id: 'DN' },
            { countryId: 'IN', name: 'Daman and Diu', id: 'DD' },
            { countryId: 'IN', name: 'Delhi', id: 'DL' },
            { countryId: 'IN', name: 'Goa', id: 'GA' },
            { countryId: 'IN', name: 'Gujarat', id: 'GJ' },
            { countryId: 'IN', name: 'Haryana', id: 'HR' },
            { countryId: 'IN', name: 'Himachal Pradesh', id: 'HP' },
            { countryId: 'IN', name: 'Jammu and Kashmir', id: 'JK' },
            { countryId: 'IN', name: 'Jharkhand', id: 'JH' },
            { countryId: 'IN', name: 'Karnataka', id: 'KA' },
            { countryId: 'IN', name: 'Kerala', id: 'KL' },
            { countryId: 'IN', name: 'Madhya Pradesh', id: 'MP' },
            { countryId: 'IN', name: 'Maharashtra', id: 'MH' },
            { countryId: 'IN', name: 'Manipur', id: 'MN' },
            { countryId: 'IN', name: 'Meghalaya', id: 'ML' },
            { countryId: 'IN', name: 'Mizoram', id: 'MZ' },
            { countryId: 'IN', name: 'Nagaland', id: 'NL' },
            { countryId: 'IN', name: 'Orissa', id: 'OR' },
            { countryId: 'IN', name: 'Punjab', id: 'PB' },
            { countryId: 'IN', name: 'Pondicherry', id: 'PY' },
            { countryId: 'IN', name: 'Rajasthan', id: 'RJ' },
            { countryId: 'IN', name: 'Sikkim', id: 'SK' },
            { countryId: 'IN', name: 'Tamil Nadu', id: 'TN' },
            { countryId: 'IN', name: 'Tripura', id: 'TR' },
            { countryId: 'IN', name: 'Uttar Pradesh', id: 'UP' },
            { countryId: 'IN', name: 'Uttarakhand', id: 'UK' },
            { countryId: 'IN', name: 'West Bengal', id: 'WB' }
        ])
        debug("Seed ran")

    } catch (err) {
        debug(err)
    } finally {
        process.exit()
    }
}

runSeed()