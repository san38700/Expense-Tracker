const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true 
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Url', urlSchema);

// const Sequelize = require('sequelize')

// const sequelize = require('../util/database')

// const Url = sequelize.define('urls', {
//     id : {
//         type:Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     url: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// })

// module.exports = Url