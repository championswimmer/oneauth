const { User } = require("../db/models").models;
const sequelize = require('sequelize');

function findUserById(id, includes) {
  return User.findOne({
    where: { id },
    include: includes
  });
}

function updateUser(userid, newValues) {
  return User.update(newValues, {
    where: { id: userid },
    returning: true
  });
}

function findUserForTrustedClient(trustedClient, userId) {
  return User.findOne({
    attributes: trustedClient ? undefined : ["id", "username", "photo"],
    where: { id: userId }
  });
}

function findAllUsersWithFilter(trustedClient, filterArgs) {
  return User.findAll({
    attributes: trustedClient ? undefined : ["id", "username", "email", "firstname", "lastname", "mobile_number"],
    where: generateFilter(filterArgs) || {},
  });
}

function generateFilter(filterArgs) {

  let whereObj = {}

  if (filterArgs.username) {
    whereObj.username = filterArgs.username
  }
  if (filterArgs.firstname) {
    whereObj.firstname = {
      $iLike: `${filterArgs.firstname}%`
    }
  }
  if (filterArgs.lastname) {
    whereObj.lastname = {
      $iLike: `${filterArgs.lastname}%`
    }
  }
  if (filterArgs.email) {
    let email = filterArgs.email

    //Testing if email has dots, i.e. ab.c@gmail.com is same as abc@gmail.com
    whereObj.email = sequelize.where(sequelize.fn('replace', sequelize.col('email'), '.', ''), sequelize.fn('replace', email, '.', ''))

  }
  if (filterArgs.contact) {
    let contact = filterArgs.contact
    if(/^\d+$/.test(contact)) {
      whereObj.mobile_number = {
        like: `%${contact}`
      }
    } else {
        throw new Error("Invalid Phone Format")
    }
  }
  if (filterArgs.verified) {
    let verify = (filterArgs.verified === 'true')
    if (verify) {
      whereObj.verifiedemail = {
        $ne: null
      }
    } else {
      whereObj.verifiedemail = {
        $eq: null
      }
    }
  }
  return whereObj
}

module.exports = {
  findUserById,
  updateUser,
  findUserForTrustedClient,
  findAllUsersWithFilter
};
