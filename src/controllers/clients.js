const models = require('../db/models').models;

function createClient(options) {
    return new Promise ((resolve,reject)=>{
        models.Client.create(options)
        .then(function (client){
            resolve(client.id)
        })
        .catch(err => resolve(err))
    });
}
function updateClient(options,clientId) {
    return new Promise ((resolve,reject)=>{
        models.Client.update(options, {
            where: {id: clientId}
        }).then(function (client) {
            resolve();
        }).catch(function (error) {
            reject();
        })
    });
}

function findClient(clientId) {
    return new Promise ((resolve,reject)=>{
        models.Client.findOne({
            where: {id: clientId}
        }).then(function (client) {
            resolve(client)
        }).catch(function(){
            reject();
        })
    });
}

function findAllClient() {
    return new Promise ((resolve,reject)=>{
        models.Client.findAll({
        }).then(function (clients) {
            resolve(clients)
        }).catch(function(){
            reject();
        })
    });
}

function findAllClientbyUser(userId) {
    return new Promise ((resolve,reject)=>{
        models.Client.findAll({
            where: {userId: userId}
        }).then(function (clients) {
            resolve(clients)
        }).catch(function(){
            reject();
        })
    });
}

module.exports = {
    createClient, updateClient, findClient, findAllClient, findAllClientbyUser
}