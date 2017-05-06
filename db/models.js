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
        },
        logging: false
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
    refreshToken: {type: Sequelize.STRING, allowNull: true},
    photo: {type: Sequelize.STRING, allowNull: true},

});

const UserTwitter = db.define('usertwitter', {
    id: {type: Sequelize.BIGINT, primaryKey: true},
    token: Sequelize.STRING,
    tokenSecret: {type: Sequelize.STRING, allowNull: true}
});

const UserGithub = db.define('usergithub', {
    id: {type: Sequelize.BIGINT, primaryKey: true},
    token: Sequelize.STRING,
    tokenSecret: {type: Sequelize.STRING, allowNull: true}
});

const UserLms = db.define('userlms', {
    id: {type: Sequelize.BIGINT, primaryKey: true},
    roll_number: Sequelize.STRING,
    accessToken: Sequelize.STRING,
    course_identifier: Sequelize.STRING
});

UserLocal.belongsTo(User);
User.hasOne(UserLocal);

UserFacebook.belongsTo(User);
User.hasOne(UserFacebook);

UserTwitter.belongsTo(User);
User.hasOne(UserTwitter);

UserGithub.belongsTo(User);
User.hasOne(UserGithub);

UserLms.belongsTo(User);
User.hasOne(UserLms);


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
User.hasMany(GrantCode);

GrantCode.belongsTo(Client);
Client.hasMany(GrantCode);


const AuthToken = db.define('authtoken', {
    token: {type: Sequelize.STRING, primaryKey: true},
    scope: Sequelize.ARRAY(Sequelize.STRING),
    explicit: {type: Sequelize.BOOLEAN, default: false}
});

AuthToken.belongsTo(User);
User.hasMany(AuthToken);

AuthToken.belongsTo(Client);
Client.hasMany(AuthToken);



db.sync({}).then(() => {console.log('Database configured')});



module.exports = {
    models: {User, UserLocal, UserFacebook, UserTwitter, UserGithub, UserLms,
        Client, GrantCode, AuthToken}
};