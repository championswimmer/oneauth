const models = require('../db/models').models
    , generator = require('../utils/generator')
    , config = require('../../config');

function getClientById(clientId) {
    return new Promise ((resolve,reject)=>{
        models.Client.findOne({
            where: {id: clientId}
        }).then((client)  => {
            resolve(client)
        }).catch(err => {
            reject(err);
        })
    })
}

function createGrantCode(clientId,userId) {
    return new Promise ((resolve,reject)=>{
        models.GrantCode.create({
        code: generator.genNcharAlphaNum(config.GRANT_TOKEN_SIZE),
        clientId: clientId,
        userId: userId
        }).then(function (grantCode) {
            resolve(grantCode.code)
        }).catch(function (err) {
            reject(err)
        })
    })
}
function createAuthToken(clientId,userId) {
    return new Promise ((resolve,reject)=>{
        models.AuthToken.create({
        token: generator.genNcharAlphaNum(config.AUTH_TOKEN_SIZE),
        scope: ['*'],
        explicit: false,
        clientId: clientId,
        userId: userId
        }).then(function (authToken) {
            resolve(null, authToken.token)
        }).catch(function (err) {
            reject(err)
        })
    })
}

function findGrantCode(client, code, redirectURI) {
    return new Promise((resolve,reject)=>{
        models.GrantCode.findOne({
            where: {code: code},
            include: [models.Client]
        }).then(function (grantCode) {
            if (!grantCode) {
                resolve(false) // Grant code does not exist
            }
            if (client.id !== grantCode.client.id) {
                resolve(false) //Wrong Client ID
            }
            let callbackMatch = false
            for (url of client.callbackURL) {
                if (redirectURI.startsWith(url)) callbackMatch = true
            }
            if (!callbackMatch) {
                resolve(false) // Wrong redirect URI
            }
            resolve(grantCode);
        }).catch(err => debug(err))
    })
}

function findCreateAuthToken(grantCode){
    return new Promise((resolve,reject)=>{
        models.AuthToken.findCreateFind({
        where: {
            clientId: grantCode.clientId,
            userId: grantCode.userId,
            explicit: true
        },
        defaults: {
            token: generator.genNcharAlphaNum(config.AUTH_TOKEN_SIZE),
            scope: ['*'],
            explicit: true,
            clientId: grantCode.clientId,
            userId: grantCode.userId
        }
        }).spread(function (authToken, created) {
            grantCode.destroy()
            resolve(authToken.token)
        }).catch(function (err) {
            reject(err)
        })
    });
}


function createAuthToken(clientId){
    return new Promise((resolve,reject)=>{
        models.AuthToken.create({
        token: generator.genNcharAlphaNum(config.AUTH_TOKEN_SIZE),
        scope: ['*'],
        explicit: false,
        clientId: clientId,
        userId: null // This is a client scoped token, so no related user here
        }).then((authtoken) => {
            grantCode.destroy()
            resolve(authToken.get().token)
        }).catch(function (err) {
            reject(err)
        })
    });
}


function findAuthToken(clientId, userId) {
    return new Promise((resolve,reject)=>{
        models.AuthToken.findOne({
        where: {
            clientId: clientId,
            userId: userId
        }
        }).then(function (authToken) {
            if (!authToken) {
                resolve(false)
            } else {
                resolve(true)
            }
        }).catch(function (err) {
            reject(err)
        })
    })
}
module.exports = {
    getClientById, createGrantCode,createAuthToken, findGrantCode, findAuthToken, findCreateAuthToken
}