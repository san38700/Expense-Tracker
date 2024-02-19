exports.authentication = async (req,res,next) => {
    try {
       const token = req.header('Authorization')
       //console.log(token)
       const user = jwt.verify(token, process.env.TOKEN_SECRET)
       console.log('userId >>>', user.userId)
 
       NewUser.findByPk(user.userId)
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