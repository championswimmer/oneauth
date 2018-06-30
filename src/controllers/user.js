const models = require('../db/models').models;

function findUserById(userid,includes, attributes){
    return models.User.findOne({
        attributes: attributes,
        where: {id: userid},
        include: includes
    })
}

function UpdareUser(userid, newValues){
    return models.User.update(newValues, {
        where: {id: userid},
        returning: true
    })
}

module.exports = {
    findUserById, UpdareUser
}