const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true 
  },
  description: {
    type: String,
    required: false 
  },
  category: {
    type: String,
    required: false 
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Mongoose automatically generates an "_id" field, similar to Sequelize's auto-incrementing ID

module.exports = mongoose.model('Expense', expenseSchema);



// const Sequelize = require('sequelize')

// const sequelize = require('../util/database')

// const Expense = sequelize.define('expenses', {
//     id : {
//         type:Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     amount:Sequelize.INTEGER,
//     description: {
//         type:Sequelize.STRING,
//         unique: false
//     },
//     category: {
//         type:Sequelize.STRING
//     }    
// })

// module.exports = Expense