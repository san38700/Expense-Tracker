const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const expense = require('../models/expense');
const { crossOriginResourcePolicy } = require('helmet');



exports.getExpenses =  (req,res) => {
    console.log(req.user._id)
    return expense.find({userId: req.user._id})
}



// exports.getExpenses =  (req,res) => {
//     return req.user.getExpenses(req);
// }