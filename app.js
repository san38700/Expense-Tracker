const express = require('express');
require('dotenv').config();


const path = require('path');
const fs = require('fs')

const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
var cors = require('cors')


const Expense = require('./models/expense')
const User = require('./models/user')
const ForgotPasswordRequest = require('./models/forgotpassword')
const Url = require('./models/fileurl')
const Order = require('./models/order')

const sequelize = require('./util/database')


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
    //console.log('url',req.url)
    console.log('poll succeeded')
    res.sendFile(path.join(__dirname,`public/${req.url}`))
})

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order); // One user can have many orders
Order.belongsTo(User); // Each order belongs to one user


User.hasMany(ForgotPasswordRequest)
ForgotPasswordRequest.belongsTo(User)

User.hasMany(Url)
Url.belongsTo(User)

sequelize
    // .sync({force: true})
    .sync()
    .then(result => app.listen(process.env.PORT || 3000))
    .catch(err => console.log(err))