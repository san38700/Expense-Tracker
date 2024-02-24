const Sib = require('sib-api-v3-sdk')
const NewUser = require('../models/user')
const ForgotPasswordRequest = require('../models/forgotpassword')
const path = require('path');
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

let requestid;
let userid;

exports.forgotpassword = async (req,res,next) => {
    const {Email} = req.body
    //console.log(Email)
    
    const user = await NewUser.findOne({where : {email : Email}})
    if(user == null){
        console.log('User not found')
        res.json({message: 'User not found'})
    }else{
    console.log(user.email,user.name)
    
    const requestId = uuidv4();

    await ForgotPasswordRequest.create({ id: requestId, userid : user.id, isactive: true , userId: user.id})
    .then(res => console.log('password request created'))
    .catch(err => console.log(err))
    
    const request = await ForgotPasswordRequest.findOne({where: {id : requestId}})
    // .then(res => console.log(res))
    // .catch(err => console.log(err))
    

    const client = Sib.ApiClient.instance;

    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.BREVO_API_KEY

    const TranEmailApi = new Sib.TransactionalEmailsApi()

    const sender = {
        email: 'sandeepkratosj@gmail.com',
        Name: "Sandeep"
    }

    const receivers = [
        {
            email: Email
        }
    ]

    TranEmailApi.sendTransacEmail(
        {
            sender,
            to: receivers,
            subject: 'Reset Password',
            // textContent: 'Please ignore password reset mail sent by mistake'
            htmlContent: `<p>Please <a href='http://13.49.243.60:3000/password/resetpassword?id=${request.id}'>click here</a> to reset your password</p>`,
        }
    )
    .then(result => {

       res.status(201).json({message: 'Please check your email for resetting your password',id: request.id})
    })
    .catch(err => console.log(err))
    }
    
}



exports.resetpassword = async (req, res, next) => {
    const id = req.query.id
    console.log('id',id)

    const request = await ForgotPasswordRequest.findOne({where: {id : id}})
    // .then(res => console.log(res))
    // .catch(err => console.log(err))
    requestid = request.id
    userid = request.userId
    //console.log(request.isactive,request.userid)
    if (request.isactive == true){
        const filePath = path.join(__dirname, '../public/password/resetpassword.html')
        res.sendFile(filePath)
    }else{
        res.send('Link expired')
    }
        
};

exports.newpassword = async (req, res, next) => {
    
    try{
        const { password } = req.body;
        console.log(password)
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        console.log(hashedPassword)

        console.log(requestid)
        console.log(userid)
        const newUser = await NewUser.findOne({ where: {id: userid }});
        const PasswordRequest = await ForgotPasswordRequest.findOne({ where: {id: requestid}})
        newUser.update({password: hashedPassword})
        PasswordRequest.update({isactive: false})

        res.status(201).json({message: "password updated please login"})

    }catch (err) {
        console.log(err)
        res.status(500).json({error: "Internal Server Error"})
    }
    
}