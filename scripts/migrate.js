/**
 * Created by championswimmer on 08/06/17.
 */

const args = require('args');
const fs = require('fs');

const config = require('../config');
const secret = config.SECRETS;
const debug = require('debug')('oauth:scripts:migrate')

args
    .option('file', 'path to migration file')
    .option('database', 'name of database', secret.DB.NAME)
    .option('username', 'user of database', secret.DB.USER)
    .option('password', 'password of db user', secret.DB.PASSWORD)
    .option('list', 'list all available migration files')
    .option('migrate', 'run migration')


const flags = args.parse(process.argv);

if (!flags.list && !flags.migrate) {
    args.showHelp();
    process.exit(0);
}

if (flags.list) {
    fs.readdir(__dirname + '/../migrations', (err, items) => {
        if (err) throw err;
        for (item of items) {
            debug(item);
        }
    })
}

if (flags.migrate) {
    const db = require('../src/db/models').db;
    if (!flags.file.includes('migrations')) {
        flags.file = __dirname + '/../migrations/' + flags.file;
    }
    fs.readFile(flags.file, (err, data) => {
        let mig = data.toString();
        debug("Running Migration :")
        debug(mig)
        process.nextTick(() => {
            db.query(mig).spread((results, meta) => {
                debug(results);
            })
        })
    })
}
