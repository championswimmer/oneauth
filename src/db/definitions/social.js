const Sequelize = require('sequelize')
const userIdColumnDef = {type: Sequelize.DataTypes.INTEGER, unique: true}
module.exports = {
    local: {
        password: Sequelize.DataTypes.STRING,
        userId: userIdColumnDef,
    },

    facebook: {
        id: {type: Sequelize.DataTypes.BIGINT, primaryKey: true},
        accessToken: Sequelize.DataTypes.STRING,
        refreshToken: {type: Sequelize.DataTypes.STRING, allowNull: true},
        photo: {type: Sequelize.DataTypes.STRING, allowNull: true},
        userId: userIdColumnDef,
    },

    twitter: {
        id: {type: Sequelize.DataTypes.BIGINT, primaryKey: true},
        token: Sequelize.DataTypes.STRING,
        tokenSecret: {type: Sequelize.DataTypes.STRING, allowNull: true},
        username: {type: Sequelize.DataTypes.STRING, allowNull: true},
        userId: userIdColumnDef,
    },

    github: {
        id: {type: Sequelize.DataTypes.BIGINT, primaryKey: true},
        token: Sequelize.DataTypes.STRING,
        tokenSecret: {type: Sequelize.DataTypes.STRING, allowNull: true},
        username: {type: Sequelize.DataTypes.STRING, allowNull: true},
        userId: userIdColumnDef,
    },

    google:{
        id: {type: Sequelize.DataTypes.STRING, primaryKey: true},
        token: Sequelize.DataTypes.STRING,
        tokenSecret: {type: Sequelize.DataTypes.STRING, allowNull: true},
        username: {type: Sequelize.DataTypes.STRING, allowNull: true},
        userId: userIdColumnDef,
    },

    linkedin:{
        id: {type: Sequelize.DataTypes.STRING, primaryKey: true},
        username: Sequelize.DataTypes.STRING,
        email: Sequelize.DataTypes.STRING,
        profile: Sequelize.DataTypes.STRING,
        token: Sequelize.DataTypes.TEXT,
        tokenSecret: {type: Sequelize.DataTypes.TEXT, allowNull: true},
        userId: userIdColumnDef,
    },

    lms: {
        id: {type: Sequelize.DataTypes.BIGINT, primaryKey: true},
        roll_number: Sequelize.DataTypes.STRING,
        accessToken: Sequelize.DataTypes.STRING,
        course_identifier: Sequelize.DataTypes.STRING,
        courses: Sequelize.DataTypes.JSONB,
        userId: userIdColumnDef,
    }

}
