const session = require('express-session')
const Sequelize = require('sequelize')
const SequelizeSessionStore = require('connect-session-sequelize')(session.Store)

const db = require('../db/models').db

const sessions = db.define('session', {
    sid: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    userId: Sequelize.STRING,
    expires: Sequelize.DATE,
    data: Sequelize.STRING(50000)
})
const extendDefaultFields = (defaults, session) => ({
    data: defaults.data,
    expires: defaults.expires,
    userId: session.passport && session.passport.user
})
const sessionStore = new SequelizeSessionStore({
    db,
    table: 'session',
    extendDefaultFields
})
sessionStore.sync()

module.exports = {
    sessionStore
}