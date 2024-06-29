const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;


const forgotPasswordRequestSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => uuidv4(),
        required: true,
        unique: true
    },
    isactive: {
        type: Boolean,
        default: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
});

forgotPasswordRequestSchema.index({ id: 1 }, { unique: true });

module.exports = mongoose.model('ForgotPasswordRequest', forgotPasswordRequestSchema);


// const Sequelize = require('sequelize')

// const sequelize = require('../util/database')


// const ForgotPasswordRequest = sequelize.define('forgotpasswordrequests', {
//     id : {
//         type: Sequelize.UUID,
//         defaultValue: Sequelize.UUIDV4,
//         allowNull: false,
//         primaryKey: true
//     },
//     isactive: {
//         type:Sequelize.BOOLEAN,
//         unique: false
//     }
// })

// module.exports = ForgotPasswordRequest