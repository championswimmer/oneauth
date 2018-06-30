const {models} = require('../db/models')

function findCreateDemographic(userId){
    return new Promise((resolve,reject) => {
        models.Demographic.findCreateFind({
            where: {userId: userId},
            include: [models.Address]
        }).then(([demographics, created])=>{
            resolve(demographics);
        }).catch((err)=>{
            reject(err);
        })
    })
}

function createAddress(options){
    return new Promise((resolve,reject) => {
        models.Address.create(options)
        .then((address) => {
            resolve(address);
        })
        .catch(err => {
            reject(err);
        })
    })
}


function findDemographic(userId){
    return new Promise((resolve,reject) => {
        models.Demographic.findOne({where: {userId: userId}})
    })
}

function findAddress(userId, demoUserId){
    return new Promise((resolve,reject) => {
        models.Address.findOne({
            where: {
                id: userId,
                '$demographic.userId$': demoUserId
            },
            include: [models.Demographic, models.State, models.Country]
        }).then(function (address) {
            resolve(address);
        }).catch((err) => {
            reject(err);
        })
    })
}


function updateAddressbyAddrId(addrId,options){
    return new Promise((resolve,reject) => {
        models.Address.update(options,
        { where: {id: addrId} })
        .then((address) => {
            resolve(address);
        })
        .catch(err => {
            reject(err);
        })
    })
}

function updateAddressbyDemoId(demoId,options){
    return new Promise((resolve,reject) => {
        models.Address.update(options,
        { where: {id: demoId} })
        .then((address) => {
            resolve(address);
        })
        .catch(err => {
            reject(err);
        })
    })
}

function findAllAddress(userId, includes){
    return new Promise((resolve,reject) => {
        models.Address.findAll({
            where: {'$demographic.userId$': userId},
            include: includes
        }).then(function (addresses) {
            if (!addresses || addresses.length === 0) {
                throw new Error("User has no addresses")
            }
            resolve(addresses)
        }).catch(function (err) {
            reject(err.message)
        })
    })
}


module.exports = {
    findCreateDemographic,updateAddressbyDemoId,updateAddressbyAddrId,
    findAddress, createAddress, findAllAddress,findDemographic
}

