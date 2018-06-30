const models = require('../db/models').models;

function findUserById(userid,includes, attributes){
    return new Promise((resolve,reject) => {
        models.User.findOne({
            attributes: attributes,
            where: {id: userid},
            include: includes
        }).then(function (user) {
            resolve(user);
        }).catch(function (err) {
            reject();
        })
    })
}

function UpdareUser(userid, newValues){
    return new Promise((resolve,reject) => {
        models.User.update(newValues, {
            where: {id: userid},
            returning: true
        }).then(function (user) {
            resolve(user);
        }).catch(function (err) {
            reject();
        })
    })
}

function deleteAuthToken(token){
    return new Promise((resolve,reject) => {
        models.AuthToken.destroy({
            where: {
                token: token
            }
        }).then(function () {resolve("success");
        }).catch(function (err) {reject(err);
        })
    })
}

module.exports = {
    findUserById, deleteAuthToken, UpdareUser
}