const models = require('../db/models').models;

function findClientById(clientId) {
    return models.Client.findOne({
        where: {id: clientId}
    })
}

function createClient(options) {
    return models.Client.create(options)
}
function updateClient(options,clientId) {
    return models.Client.update(options, {
        where: {id: clientId}
    })
}

function findAllClient() {
    return models.Client.findAll({});
}

function findAllClientbyUser(userId) {
    return models.Client.findAll({
        where: {userId: userId}
    })
}

module.exports = {
    createClient, updateClient, findClientById, findAllClient, findAllClientbyUser
}