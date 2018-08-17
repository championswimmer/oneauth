const generator = require("../utils/generator");
const { Client, Demographic, Address, User, EventSubscription } = require("../db/models").models;

function deleteEventSubscription(id) {
  return EventSubscription.destroy({
    where: { 
      clientId: id 
    }
  });
}

function findAllEventSubscription(id) {
  return EventSubscription.findAll({
    where: { 
      clientId: id 
    }
  });
}

function createEventSubscriptionBulk (options) {
  return EventSubscription.bulkCreate (options)
}

module.exports = {
  createEventSubscriptionBulk,
  deleteEventSubscription,
  findAllEventSubscription
};
