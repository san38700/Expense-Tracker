const Sib = require('sib-api-v3-sdk')
const User = require('../models/user')
const ForgotPasswordRequest = require('../models/forgotpassword')
const path = require('path');
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

let requestid;
let userid;


exports.forgotpassword = async (req, res, next) => {
    const { Email } = req.body;

    try {
        const user = await User.findOne({ email: Email });

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(user.email, user.name);
        
        // const existingRequest = await ForgotPasswordRequest.findOne({ userId: user._id });

        // if (existingRequest) {
        // console.log('Existing password request found');
        // // Handle existing request (e.g., send a notification or inform user)
        // return res.status(409).json({ message: 'Existing password request exists' }); // Consider using a 409 Conflict status code
        // } else {
        // // If no existing request, proceed with creating a new one
        // let requestId = uuidv4();
        // const passwordRequest = new ForgotPasswordRequest({ id: requestId, isactive: true, userId: user._id });
        // await passwordRequest.save();
        // console.log('Password request created');
        // }

        // Generate and check for unique UUID
        let requestId = uuidv4();

        const passwordRequest = new ForgotPasswordRequest({isactive: true, userId: user._id });

        await passwordRequest.save();
        console.log('Password request created');

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        const TranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'sandeepkratosj@gmail.com',
            name: 'Sandeep'
        };

        const receivers = [
            {
                email: Email
            }
        ];

        const sendEmailResponse = await TranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset Password',
            htmlContent: `<p>Please <a href='http://localhost:3000/password/resetpassword?id=${passwordRequest.id}'>click here</a> to reset your password</p>`,
        });

        res.status(201).json({ message: 'Please check your email for resetting your password', id: passwordRequest._id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.resetpassword = async (req, res, next) => {
    const id = req.query.id
    console.log('id',id)

    const request = await ForgotPasswordRequest.findOne({id : id})
    if (!request){
        return res.status(404).send('Link Expired')
    }

    requestid = request._id;
    userid = request.userId;

    console.log(request);

    //console.log(request.isactive,request.userid)
    console.log(requestid)
    console.log(userid)
    
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
        await User.findByIdAndUpdate(userid, { password: hashedPassword });

        await ForgotPasswordRequest.findByIdAndUpdate(requestid,{ isactive: false });

        res.status(201).json({message: "password updated please login"})

    }catch (err) {
        console.log(err)
        res.status(500).json({error: "Internal Server Error"})
    }
    
}




// const Sib = require('sib-api-v3-sdk')
// const NewUser = require('../models/user')
// const ForgotPasswordRequest = require('../models/forgotpassword')
// const path = require('path');
// const bcrypt = require('bcrypt')
// const { v4: uuidv4 } = require('uuid')

// let requestid;
// let userid;

// exports.forgotpassword = async (req,res,next) => {
//     const {Email} = req.body
//     //console.log(Email)
    
//     const user = await NewUser.findOne({where : {email : Email}})
//     if(user == null){
//         console.log('User not found')
//         res.json({message: 'User not found'})
//     }else{
//     console.log(user.email,user.name)
    
//     const requestId = uuidv4();

//     await ForgotPasswordRequest.create({ id: requestId, userid : user.id, isactive: true , userId: user.id})
//     .then(res => console.log('password request created'))
//     .catch(err => console.log(err))
    
//     const request = await ForgotPasswordRequest.findOne({where: {id : requestId}})
//     // .then(res => console.log(res))
//     // .catch(err => console.log(err))
    

//     const client = Sib.ApiClient.instance;

//     const apiKey = client.authentications['api-key']
//     apiKey.apiKey = process.env.BREVO_API_KEY

//     const TranEmailApi = new Sib.TransactionalEmailsApi()

//     const sender = {
//         email: 'sandeepkratosj@gmail.com',
//         Name: "Sandeep"
//     }

//     const receivers = [
//         {
//             email: Email
//         }
//     ]

//     TranEmailApi.sendTransacEmail(
//         {
//             sender,
//             to: receivers,
//             subject: 'Reset Password',
//             // textContent: 'Please ignore password reset mail sent by mistake'
//             htmlContent: `<p>Please <a href='http://localhost:3000/password/resetpassword?id=${request.id}'>click here</a> to reset your password</p>`,
//         }
//     )
//     .then(result => {

//        res.status(201).json({message: 'Please check your email for resetting your password',id: request.id})
//     })
//     .catch(err =>  {
//         console.log(err)
//         res.status(500).json({ error: 'Internal Server Error' });
//     })
//     }
    
// }



// exports.resetpassword = async (req, res, next) => {
//     const id = req.query.id
//     console.log('id',id)

//     const request = await ForgotPasswordRequest.findOne({where: {id : id}})
//     // .then(res => console.log(res))
//     // .catch(err => console.log(err))
//     requestid = request.id
//     userid = request.userId
//     //console.log(request.isactive,request.userid)
//     if (request.isactive == true){
//         const filePath = path.join(__dirname, '../public/password/resetpassword.html')
//         res.sendFile(filePath)
//     }else{
//         res.send('Link expired')
//     }
        
// };

// exports.newpassword = async (req, res, next) => {
    
//     try{
//         const { password } = req.body;
//         console.log(password)
//         const saltRounds = 10
//         const hashedPassword = await bcrypt.hash(password, saltRounds)
//         console.log(hashedPassword)

//         console.log(requestid)
//         console.log(userid)
//         const newUser = await NewUser.findOne({ where: {id: userid }});
//         const PasswordRequest = await ForgotPasswordRequest.findOne({ where: {id: requestid}})
//         newUser.update({password: hashedPassword})
//         PasswordRequest.update({isactive: false})

//         res.status(201).json({message: "password updated please login"})

//     }catch (err) {
//         console.log(err)
//         res.status(500).json({error: "Internal Server Error"})
//     }
    
// }