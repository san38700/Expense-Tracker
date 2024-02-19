const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Expense = sequelize.define('expenses', {
    id : {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount:Sequelize.INTEGER,
    description: {
        type:Sequelize.STRING,
        unique: false
    },
    category: {
        type:Sequelize.STRING
    }    
})

module.exports = Expense