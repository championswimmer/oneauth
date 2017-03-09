/**
 * Created by championswimmer on 08/03/17.
 */
const Sequelize = require('sequelize');

const db = new Sequelize(
    'oneauth', 'oneauth', 'oneauth',  {
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

db.sync().then(() => {console.log('DB Done')});



module.exports = {
    models: {User, UserLocal, UserFacebook}

};