const express = require('express');
require('dotenv').config();

const mongoose = require('mongoose');


const path = require('path');
const fs = require('fs')

const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
var cors = require('cors')


// const Expense = require('./models/expense')
// const User = require('./models/user')
// const ForgotPasswordRequest = require('./models/forgotpassword')
// const Url = require('./models/fileurl')
// const Order = require('./models/order')

// const sequelize = require('./util/database')


const app = express();


const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const passwordRoutes = require('./routes/forgotpassword')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

app.use(bodyParser.json({ extended: false }));
//app.use(helmet())
app.use(compression())
app.use(morgan('combined', {stream: accessLogStream}))
app.use(cors())

app.use(expenseRoutes)

app.use(userRoutes)

app.use(purchaseRoutes)

app.use(passwordRoutes)

app.use((req,res) => {
    console.log('url',req.url)
    res.sendFile(path.join(__dirname,`public/${req.url}`))
})


// User.hasMany(Expense)
// Expense.belongsTo(User)

// User.hasMany(Order); // One user can have many orders
// Order.belongsTo(User); // Each order belongs to one user


// User.hasMany(ForgotPasswordRequest)
// ForgotPasswordRequest.belongsTo(User)

// User.hasMany(Url)
// Url.belongsTo(User)

mongoose
  .connect(
    `mongodb+srv://sandeepkumar:${process.env.MONGODBPASS}@cluster0.br5anyu.mongodb.net/expense-tracker?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(result => {
    console.log('Connected !')
    app.listen(3000)
    })
  .catch(err => console.log(err))


// sequelize
//     // .sync({force: true})
//     .sync()
//     .then(result => app.listen(3000))
//     .catch(err => console.log(err))