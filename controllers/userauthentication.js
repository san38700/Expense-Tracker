const jwt = require('jsonwebtoken');
const User = require('../models/user')

exports.authentication = async (req,res,next) => {
    try {
       const token = req.header('Authorization')
       //console.log(token)
       const user = jwt.verify(token, process.env.TOKEN_SECRET)
       console.log('userId >>>', user.userId)
 
       User.findById(user.userId)
         .then(user => {
           req.user = user
           next()
         })
    }
     catch(err){
       console.log(err)
       return res.status(401).json({success:false})
     }
}