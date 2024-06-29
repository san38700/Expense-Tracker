const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  paymentid: {
    type: String,
    default: null
  },
  orderid: {
    type: String,
    required: false 
  },
  status: {
    type: String,
    required: false 
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});



module.exports = mongoose.model('Order', orderSchema);



// const Sequelize = require('sequelize')

// const sequelize = require('../util/database')


// const Order = sequelize.define('order', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     paymentid: Sequelize.STRING,
//     orderid: Sequelize.STRING,
//     status: Sequelize.STRING
// })

// module.exports = Order

