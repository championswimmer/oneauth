const config = require('../config');
const secret = require('../secrets.json');

const args = require('args');

const db = require('../db/models').db;
const models = require('../db/models').models;

args
  .option('role', 'role to set')
  .option('userid', 'user id whose role to set')

const flags = args.parse(process.argv);

if (!flags.role || flags.userid == null) {
  args.showHelp();
  process.exit(0);
}

process.nextTick(() => {
  models.User.update({
    role: flags.role
  }, {
    where: {
      id: flags.userid
    },
    returning: true
  }).spread((results, meta) => {
    console.log(results);
    console.log(meta)
  })
})
