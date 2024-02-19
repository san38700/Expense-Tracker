const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const User = sequelize.define('users', {
    id : {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type:Sequelize.STRING,
        unique: false
    },
    email: {
        type:Sequelize.STRING,
        unique: true
    },
    password : {
        type:Sequelize.STRING,
        unique:false
    },
    ispremiumuser : Sequelize.BOOLEAN,
    totalexpenses :{
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
})

module.exports = User