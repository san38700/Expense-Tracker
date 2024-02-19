const Sequelize = require('sequelize')

const sequelize = require('../util/database')


const ForgotPasswordRequest = sequelize.define('forgotpasswordrequests', {
    id : {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    isactive: {
        type:Sequelize.BOOLEAN,
        unique: false
    }
})

module.exports = ForgotPasswordRequest