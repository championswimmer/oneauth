const config = require('../../config');
const secret = config.SECRETS;
const {db, models: {
    Branch
}} = require('../../src/db/models');


(async () => {
    try {
        await Branch.bulkCreate([
            {"code": "OTHER", "name": "---OTHER / NOT LISTED ---"},
            {"code": "BT_CS", "name": "(B.Tech/BE) Computers / IT / Software"},
            {"code": "BT_EL", "name": "(B.Tech/BE) Electrical / Electronics"},
            {"code": "BT_ME", "name": "(B.Tech/BE) Mechanical / Automobile / Aeronautical"},
            {"code": "BT_PR", "name": "(B.Tech/BE) Production / Manufacturing"},
            {"code": "BT_CI", "name": "(B.Tech/BE) Civil"},
            {"code": "BT_CH", "name": "(B.Tech/BE) Chemical / Petroleum / Textile"},
            {"code": "BT_BT", "name": "(B.Tech/BE) BioTech / Environmental"},
            {"code": "BT_OT", "name": "(B.Tech/BE) Others"},
            {"code": "MT_CS", "name": "(M.Tech/ME) Computers / IT / Software"},
            {"code": "MT_EL", "name": "(M.Tech/ME) Electrical / Electronics"},
            {"code": "MT_ME", "name": "(M.Tech/ME) Mechanical / Automobile / Aeronautical"},
            {"code": "MT_PR", "name": "(M.Tech/ME) Production / Manufacturing"},
            {"code": "MT_CI", "name": "(M.Tech/ME) Civil"},
            {"code": "MT_CH", "name": "(M.Tech/ME) Chemical / Petroleum / Textile"},
            {"code": "MT_BT", "name": "(M.Tech/ME) BioTech / Environmental"},
            {"code": "MT_OT", "name": "(M.Tech/ME) Others"},
            {"code": "BCA",   "name": "(BCA)"},
            {"code": "MCA",   "name": "(MCA)"},
            {"code": "BS_PH", "name": "(B.Sc/BS) Physics or related"},
            {"code": "BS_CH", "name": "(B.Sc/BS) Chemistry or related"},
            {"code": "BS_MA", "name": "(B.Sc/BS) Maths or related"},
            {"code": "MS_PH", "name": "(M.Sc/MS) Physics or related"},
            {"code": "MS_CH", "name": "(M.Sc/MS) Chemistry or related"},
            {"code": "MS_MA", "name": "(M.Sc/MS) Maths or related"},
            {"code": "BCOM",  "name": "(B.Com/B.Sc) Economics / Finance"},
            {"code": "MCOM",  "name": "(M.Com/M.Sc) Economics / Finance"},
            {"code": "BA",    "name": "(BA)"},
            {"code": "MA",    "name": "(MA)"},
            {"code": "PHD",   "name": "(Ph.D / M.Phil / Research)"},
        ])

    } catch (err) {
        console.error(err)
    } finally {
        process.exit()
    }
})()
