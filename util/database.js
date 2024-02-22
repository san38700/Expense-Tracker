const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.SEQUELIZE_DATABASE, process.env.SEQUELIZE_ROOT,process.env.SEQUELIZE_PASSWORD, {
    dialect: 'mysql', 
    host: process.env.SEQUELIZE_HOST
})

module.exports = sequelize