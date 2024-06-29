const Razorpay = require('razorpay');
const Order = require('../models/order')
const User = require('../models/user');

exports.purchasepremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 2500;

        const order = await new Promise((resolve, reject) => {
            rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
                if (err) {
                    reject(new Error(JSON.stringify(err)));
                } else {
                    resolve(order);
                }
            });
        });

        const newOrder = new Order({
            orderid: order.id,
            status: 'PENDING',
            userId: req.user._id 
        });

        await newOrder.save();


        return res.status(201).json({ order, key_id: rzp.key_id });
    } catch (err) {
        console.error("Error occurred during premium purchase:", err);
        return res.status(403).json({ message: 'Something went wrong', error: err.message });
    }
};

exports.purchasefailure = async (req, res) => {
    try {
        const orderid = req.body.response.error.metadata.order_id;

        const result = await Order.findOneAndUpdate(
            { orderid: orderid },
            { status: 'FAILED' },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ status: 'failure', message: 'Order not found' });
        }

        res.json({ status: 'failure', message: 'Payment failed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;

        const order = await Order.findOne({ orderid: order_id });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const promise1 = Order.findByIdAndUpdate(order._id, { paymentid: payment_id, status: 'SUCCESSFUL' });
        const promise2 = User.findByIdAndUpdate(req.user._id, { ispremiumuser: true });

        Promise.all([promise1, promise2])
            .then(() => {
                return res.status(202).json({ success: true, message: 'Transaction Successful' });
            })
            .catch((err) => {
                throw new Error(err);
            });
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err.message, message: 'Something went wrong' });
    }
}

exports.leaderboard = async (req, res) => {
    try {
        // Find all users and sort by totalexpenses in descending order
        const users = await User.find().sort({ totalexpenses: -1 });

        res.status(201).json({ users: users });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// exports.purchasepremium = async (req, res) => {
//     try {
//         const rzp = new Razorpay({
//             key_id: process.env.RAZORPAY_KEY_ID,
//             key_secret: process.env.RAZORPAY_KEY_SECRET
//         });

//         const amount = 2500;

//         const order = await new Promise((resolve, reject) => {
//             rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
//                 if (err) {
//                     reject(new Error(JSON.stringify(err)));
//                 } else {
//                     resolve(order);
//                 }
//             });
//         });

//         await req.user.createOrder({ orderid: order.id, status: 'PENDING' });

//         return res.status(201).json({ order, key_id: rzp.key_id });
//     } catch (err) {
//         console.error("Error occurred during premium purchase:", err);
//         return res.status(403).json({ message: 'Something went wrong', error: err.message });
//     }
// };


// exports.purchasefailure = (req, res) => {
//     const orderid  = req.body.response.error.metadata.order_id
//     //console.log(req.body.response.error.metadata.order_id)
//     Order.update(
//         { status: 'FAILED'},
//         { where: { orderid: orderid} }
//     ).then(() => {
//         res.json({ status: 'failure', message: 'Payment failed' });
//     }).catch(error => {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Internal server error' });
//     });
// }

// exports.updateTransactionStatus = async (req, res) => {
//     try{
//         const {payment_id, order_id} = req.body
//         const order = await Order.findOne({where: {orderid: order_id}})
//         const promise1 = order.update({paymentid: payment_id, status: 'SUCCESSFUL'})
//         const promise2 = req.user.update({ispremiumuser: true})

//         Promise.all([promise1, promise2]).then(() =>{
//             return res.status(202).json({success: true, message: 'Transaction Successful'})
//         }).catch((err) => {
//             throw new Error(err)
//         })
//     }catch(err){
//         console.log(err)
//         res.status(403).json({error:err, message:'Something went wrong'})
//     }
// }

// exports.leaderboard = async (req, res) => {
//     try{
//         // joining tables method 


//         const users = await User.findAll({
//             order:[['totalexpenses',"DESC"]]
//         })
//         res.status(201).json({users:users})

//     }catch(err){
//         console.log(err)
//         res.status(500).json({error:"Internal Server Error"})
//     }
// }