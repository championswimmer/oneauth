const { models } = require("../db/models");

function findOrCreateDemographic(userId) {
  return models.Demographic.findCreateFind({
    where: { userId: userId },
    include: [models.Address]
  });
}

function createAddress(options) {
  return models.Address.create(options);
}

function findDemographic(userId) {
  return models.Demographic.findOne({
    where: { userId: userId }
  });
}

function findAddress(userId, demoUserId) {
  return models.Address.findOne({
    where: {
      id: userId,
      "$demographic.userId$": demoUserId
    },
    include: [models.Demographic, models.State, models.Country]
  });
}

function updateAddressbyAddrId(addrId, options) {
  return models.Address.update(options, {
    where: { id: addrId }
  });
}

function updateAddressbyDemoId(demoId, options) {
  return models.Address.update(options, {
    where: { id: demoId }
  });
}

function findAllAddresses(userId, includes = [models.Demographic]) {
  return models.Address.findAll({
    where: { "$demographic.userId$": userId },
    include: includes
  });
}

function findAllStates() {
  return models.State.findAll({});
}

function findAllCountries() {
  return models.Country.findAll({});
}

function findAllBranches() {
  return models.Branch.findAll({});
}
function findAllColleges() {
  return models.College.findAll({});
}

module.exports = {
  findOrCreateDemographic,
  updateAddressbyDemoId,
  updateAddressbyAddrId,
  findAddress,
  createAddress,
  findAllAddresses,
  findDemographic,
  findAllStates,
  findAllCountries,
  findAllBranches,
  findAllColleges
};
