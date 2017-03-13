/**
 * Created by championswimmer on 08/03/17.
 */
const Sequelize = require('sequelize');
const secrets = require('../secrets.json');

const db = new Sequelize(
    secrets.DB.NAME, secrets.DB.USER, secrets.DB.PASSWORD,  {
        host: 'localhost',
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    });


const User = db.define('user', {
    id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
    username: {type: Sequelize.STRING, unique: true},
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    photo: Sequelize.STRING,
    email: Sequelize.STRING
});

const UserLocal = db.define('userlocal', {
   password: Sequelize.STRING
});

const UserFacebook = db.define('userfacebook', {
    id: {type: Sequelize.BIGINT, primaryKey: true},
    accessToken: Sequelize.STRING,
    refreshToken: Sequelize.STRING,

});
UserLocal.belongsTo(User);
UserFacebook.belongsTo(User);
User.hasOne(UserLocal);
User.hasOne(UserFacebook);

const Client = db.define('client', {
    id: {type: Sequelize.BIGINT, primaryKey: true},
    name: Sequelize.STRING,
    secret: Sequelize.STRING,
    domain: Sequelize.ARRAY(Sequelize.STRING),
    callbackURL: Sequelize.ARRAY(Sequelize.STRING)
});

Client.belongsTo(User);
User.hasMany(Client);

const GrantCode = db.define('grantcode', {
    code: {type: Sequelize.STRING, primaryKey: true}
});

GrantCode.belongsTo(User);
GrantCode.belongsTo(Client);
Client.hasMany(GrantCode);
User.hasMany(GrantCode);


const AuthToken = db.define('authtoken', {
    token: {type: Sequelize.STRING, primaryKey: true},
    scope: Sequelize.ARRAY(Sequelize.STRING),
    explicit: {type: Sequelize.BOOLEAN, default: false}
});

AuthToken.belongsTo(User);
AuthToken.belongsTo(Client);
Client.hasMany(AuthToken);
User.hasMany(AuthToken);



db.sync({}).then(() => {console.log('Database configured')});



module.exports = {
    models: {User, UserLocal, UserFacebook, Client, GrantCode, AuthToken}
};