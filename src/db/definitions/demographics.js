const Sequelize = require('sequelize')

module.exports = {
    address: {
        label: {type: Sequelize.DataTypes.STRING, allowNull: false},
        first_name: {type: Sequelize.DataTypes.STRING, allowNull: false},
        last_name: {type: Sequelize.DataTypes.STRING, allowNull: false},
        mobile_number: {type: Sequelize.DataTypes.STRING, allowNull: false, validate: {len: [10, 10]}},
        email: {type: Sequelize.DataTypes.STRING, allowNull: false},
        pincode: {type: Sequelize.DataTypes.INTEGER, allowNull: false},
        street_address: {type: Sequelize.DataTypes.STRING, allowNull: false},
        landmark: {type: Sequelize.DataTypes.STRING, allowNull: true},
        city: {type: Sequelize.DataTypes.STRING, allowNull: false},
        primary: {type: Sequelize.DataTypes.BOOLEAN, allowNull: false}
    },

    state: {
        state_name: {type: Sequelize.DataTypes.STRING, allowNull: false}
    },

    country: {
        country_name: {
            type: Sequelize.DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        country_code: {
            type: Sequelize.DataTypes.STRING(2),
            unique: true,
            allowNull: false,
        }
    },

    college: {
        college_name: {type: Sequelize.DataTypes.STRING, allowNull: false}
    },

    branch: {
        branch_name: {type: Sequelize.DataTypes.STRING, allowNull: false}
    },

    company: {
        company_name: {type: Sequelize.DataTypes.STRING, allowNull: false}
    },


}