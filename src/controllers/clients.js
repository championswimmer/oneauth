const generator = require("../utils/generator");
const urlutils = require("../utils/urlutils");
const { Client } = require("../db/models").models;

function findClientById(id) {
  return Client.findOne({
    where: { id }
  });
}

function createClient(options, userId) {
  options.defaultURL = urlutils.prefixHttp(options.defaultURL);

  //Make sure all urls have http in them
  options.clientDomains.forEach(function(url, i, arr) {
    arr[i] = urlutils.prefixHttp(url);
  });
  options.clientCallbacks.forEach(function(url, i, arr) {
    arr[i] = urlutils.prefixHttp(url);
  });
  return Client.create({
    id: generator.genNdigitNum(10),
    secret: generator.genNcharAlphaNum(64),
    name: options.clientName,
    domain: options.clientDomains,
    defaultURL: options.defaultURL,
    callbackURL: options.clientCallbacks,
    userId: userId
  });
}
function updateClient(options, clientId) {
  options.defaultURL = urlutils.prefixHttp(options.defaultURL);
  //Make sure all urls have http in them
  options.clientDomains.forEach(function(url, i, arr) {
    arr[i] = urlutils.prefixHttp(url);
  });
  options.clientCallbacks.forEach(function(url, i, arr) {
    arr[i] = urlutils.prefixHttp(url);
  });

  let update = {
      name: options.clientName,
      domain: options.clientDomains,
      defaultURL: options.defaultURL,
      callbackURL: options.clientCallbacks,
      trusted: options.trustedClient
    }
  if (options.webhookURL) {
    update.webhookURL = options.webhookURL
  }
  return Client.update( update, {
      where: { id: clientId }
    }
  );
}

function findAllClients() {
  return Client.findAll({});
}

function findAllClientsByUserId(userId) {
  return Client.findAll({
    where: { userId }
  });
}

module.exports = {
  createClient,
  updateClient,
  findClientById,
  findAllClients,
  findAllClientsByUserId
};
