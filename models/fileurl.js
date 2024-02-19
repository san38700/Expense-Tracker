const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Url = sequelize.define('urls', {
    id : {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Url