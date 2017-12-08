/**
 * Created by championswimmer on 08/06/17.
 */

const args = require('args');
const fs = require('fs');

const config = require('../config');
const secret = config.SECRETS;

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
    fs.readdir(__dirname + '/../db/schema_update', (err, items) => {
        if (err) throw err;
        for (item of items) {
            console.log(item);
        }
    })
}

if (flags.migrate) {
    const db = require('../db/models').db;
    if (!flags.file.includes('db/schema_update')) {
        flags.file = __dirname + '/../db/schema_update/' + flags.file;
    }
    fs.readFile(flags.file, (err, data) => {
        let mig = data.toString();
        process.nextTick(() => {
            db.query(mig).spread((results, meta) => {
                console.log(results);
            })
        })
    })
}
