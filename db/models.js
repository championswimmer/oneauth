/**
 * Created by championswimmer on 08/03/17.
 */
const Sequelize = require('sequelize');
const config = require('../config');
const secrets = config.SECRETS;

const db_name = secrets.DB.NAME;
const db_user = secrets.DB.USER;
const db_pass = secrets.DB.PASSWORD;
const db_host = secrets.DB.HOST;

const DATABASE_URL = process.env.DATABASE_URL || ('postgres://' + db_user + ":" + db_pass + "@" + db_host + ":5432/" + db_name);

const db = new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        logging: config.DEBUG ? console.log : false
    });


const User = db.define('user', {
    id: {type: Sequelize.DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    username: {type: Sequelize.DataTypes.STRING, unique: true, allowNull: false},
    firstname: Sequelize.DataTypes.STRING,
    lastname: Sequelize.DataTypes.STRING,
    photo: Sequelize.DataTypes.STRING,
    email: Sequelize.DataTypes.STRING,
    role: {type: Sequelize.DataTypes.ENUM('admin', 'employee', 'intern'), allowNull: true},
    verifiedemail: {type:Sequelize.DataTypes.STRING , defaultValue:null , unique: true, allowNull: true}	
});

const Resetpassword = db.define('resetpassword', {
    id: {type: Sequelize.DataTypes.BIGINT, autoIncrement: true , primaryKey: true},
    key: {type: Sequelize.DataTypes.STRING, unique: true, allowNull: false},
    deletedAt:{type: Sequelize.DATE}
});

const Verifyemail = db.define('verifyemail', {
    id: {type: Sequelize.DataTypes.BIGINT, autoIncrement: true , primaryKey: true},
    key: {type: Sequelize.DataTypes.STRING, unique: true, allowNull: false},
    deletedAt:{type: Sequelize.DATE}
});

const UserLocal = db.define('userlocal', {
   password: Sequelize.DataTypes.STRING
});

const UserFacebook = db.define('userfacebook', {
    id: {type: Sequelize.DataTypes.BIGINT, primaryKey: true},
    accessToken: Sequelize.DataTypes.STRING,
    refreshToken: {type: Sequelize.DataTypes.STRING, allowNull: true},
    photo: {type: Sequelize.DataTypes.STRING, allowNull: true},

});

const UserTwitter = db.define('usertwitter', {
    id: {type: Sequelize.DataTypes.BIGINT, primaryKey: true},
    token: Sequelize.DataTypes.STRING,
    tokenSecret: {type: Sequelize.DataTypes.STRING, allowNull: true},
    username: {type: Sequelize.DataTypes.STRING, allowNull: true}
});

const UserGithub = db.define('usergithub', {
    id: {type: Sequelize.DataTypes.BIGINT, primaryKey: true},
    token: Sequelize.DataTypes.STRING,
    tokenSecret: {type: Sequelize.DataTypes.STRING, allowNull: true},
    username: {type: Sequelize.DataTypes.STRING, allowNull: true}
});

const UserLms = db.define('userlms', {
    id: {type: Sequelize.DataTypes.BIGINT, primaryKey: true},
    roll_number: Sequelize.DataTypes.STRING,
    accessToken: Sequelize.DataTypes.STRING,
    course_identifier: Sequelize.DataTypes.STRING,
    courses: Sequelize.DataTypes.JSONB
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

Resetpassword.belongsTo(User);
Verifyemail.belongsTo(User);

const Client = db.define('client', {
    id: {type: Sequelize.DataTypes.BIGINT, primaryKey: true},
    name: Sequelize.DataTypes.STRING,
    secret: Sequelize.DataTypes.STRING,
    domain: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
    callbackURL: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING)
});

Client.belongsTo(User);
User.hasMany(Client);

const GrantCode = db.define('grantcode', {
    code: {type: Sequelize.DataTypes.STRING, primaryKey: true}
});

GrantCode.belongsTo(User);
User.hasMany(GrantCode);

GrantCode.belongsTo(Client);
Client.hasMany(GrantCode);


const AuthToken = db.define('authtoken', {
    token: {type: Sequelize.DataTypes.STRING, primaryKey: true},
    scope: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
    explicit: {type: Sequelize.DataTypes.BOOLEAN, default: false}
});

AuthToken.belongsTo(User);
User.hasMany(AuthToken);

AuthToken.belongsTo(Client);
Client.hasMany(AuthToken);



db.sync({
  force: config.DEPLOY_CONFIG === 'heroku', // Clear DB on each run on heroku
}).then(() => {console.log('Database configured')}).catch(err => console.error(err));



module.exports = {
    models: {User, UserLocal, UserFacebook, UserTwitter, UserGithub, UserLms,
        Client, GrantCode, AuthToken , Resetpassword , Verifyemail},
    db
};
