const Sequelize = require('sequelize')

module.exports = {
    address: {
        label: {type: Sequelize.DataTypes.STRING, allowNull: true},
        first_name: {type: Sequelize.DataTypes.STRING, allowNull: false},
        last_name: {type: Sequelize.DataTypes.STRING, allowNull: false},
        mobile_number: {type: Sequelize.DataTypes.STRING, allowNull: false},
        whatsapp_number: {type: Sequelize.DataTypes.STRING, allowNull: true},
        email: {type: Sequelize.DataTypes.STRING, allowNull: false},
        pincode: {type: Sequelize.DataTypes.INTEGER, allowNull: false},
        street_address: {type: Sequelize.DataTypes.STRING, allowNull: false},
        landmark: {type: Sequelize.DataTypes.STRING, allowNull: true},
        city: {type: Sequelize.DataTypes.STRING, allowNull: false},
        primary: {type: Sequelize.DataTypes.BOOLEAN, allowNull: false}
    },

    state: {
        name: {
            type: Sequelize.DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        id: {
            type: Sequelize.DataTypes.STRING(2),
            primaryKey: true,
        }
    },

    country: {
        name: {
            type: Sequelize.DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        id: {
            type: Sequelize.DataTypes.STRING(2),
            primaryKey: true
        }
    },

    college: {
        name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },

    branch: {
        code: {
            type: Sequelize.DataTypes.STRING(6),
            unique: true
        },
        name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        }
    },

    company: {
        name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    },


}
