const mongoose = require('mongoose');

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const expense = require('./expense');

const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  password: {
    type: String,
    required: true
  },
  ispremiumuser: {
    default : null,
    type: Boolean
  },
  totalexpenses: {
    type: Number,
    required: false, 
    default: 0
  }
});



module.exports = mongoose.model('User', userSchema);




// const Sequelize = require('sequelize')

// const sequelize = require('../util/database')

// const User = sequelize.define('users', {
//     id : {
//         type:Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name:{
//         type:Sequelize.STRING,
//         unique: false
//     },
//     email: {
//         type:Sequelize.STRING,
//         unique: true
//     },
//     password : {
//         type:Sequelize.STRING,
//         unique:false
//     },
//     ispremiumuser : Sequelize.BOOLEAN,
//     totalexpenses :{
//         type: Sequelize.INTEGER,
//         defaultValue: 0
//     }
// })

// module.exports = User