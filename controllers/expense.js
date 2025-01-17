const User = require('../models/user')
const Expense = require('../models/expense')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const Url = require('../models/fileurl')
const Userservices = require('../services/userservices')
const s3services = require('../services/s3services')
const ObjectId = mongoose.Types.ObjectId;

exports.authenticate = async (req,res,next) => {
    try {
       const token = req.header('Authorization')
       console.log(token)
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

exports.getExpense = async (req, res, next) => {
try {
    const page = parseInt(req.query.page) || 1;
    const items_per_page = parseInt(req.query.pageitems) || 1;
    
    // Adjust this based on your preferred page size
    const totalItems = await Expense.countDocuments({ userId: req.user._id });
    console.log(totalItems)
    
    const expenses = await Expense.find({ userId: req.user._id })
        .skip((page - 1) * items_per_page)
        .limit(items_per_page);

    res.status(200).json({ 
        Expenses: expenses, 
        premiumuser: req.user.ispremiumuser,
        pageData: { 
            totalItems, 
            currentPage: page,
            hasNextPage: items_per_page * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / items_per_page)
        }
    });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
}
}

exports.addExpense = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const amount = req.body.amount;
      const description = req.body.description;
      const category = req.body.category;
      const token = req.header('Authorization');
      const user = jwt.verify(token, process.env.TOKEN_SECRET);
      console.log('userId >>>', user.userId);
  
      const newExpense = new Expense({
        userId: user.userId,
        amount,
        description,
        category
      });
  
      const savedExpense = await newExpense.save({ session });
  
      const totalUserExpense = await User.findById(user.userId).session(session);
  
      if (totalUserExpense) {
        const currentTotalExpenses = Number(totalUserExpense.totalexpenses) || 0;
        const newTotalExpenses = currentTotalExpenses + Number(amount);
        console.log(newTotalExpenses);
  
        totalUserExpense.totalexpenses = newTotalExpenses;
        await totalUserExpense.save({ session });
      }
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(201).json({ newExpense: savedExpense });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  
exports.deleteExpense = async (req, res, next) => {
const session = await mongoose.startSession();
session.startTransaction();

try {
    if (req.params.id === 'undefined') {
    console.log('ID is missing');
    return res.status(400).json({ err: 'ID is missing' });
    }

    const expenseId = req.params.id;

    const expense = await Expense.findById(expenseId).session(session);
    if (!expense) {
    return res.status(404).json({ err: 'Expense not found' });
    }

    const amount = expense.amount;
    await Expense.deleteOne({ _id: expenseId }).session(session);

    const token = req.header('Authorization');
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const totalUserExpense = await User.findById(user.userId).session(session);

    if (totalUserExpense) {
    const currentTotalExpenses = Number(totalUserExpense.totalexpenses) || 0;
    const newTotalExpenses = currentTotalExpenses - Number(amount);

    totalUserExpense.totalexpenses = newTotalExpenses;
    await totalUserExpense.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: 'ok' });
} catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
}
};

exports.downloadExpense = async (req, res, next) => {
  let session;
  try {
      // Start a session for transaction
      session = await mongoose.startSession();
      session.startTransaction();

      const expenses = await Userservices.getExpenses(req);
      console.log(expenses);

      const userId = req.user._id;
      const stringifiedExpenses = JSON.stringify(expenses);
      console.log(stringifiedExpenses);

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const date = currentDate.getDate().toString().padStart(2, '0');
      const hours = currentDate.getHours().toString().padStart(2, '0');
      const minutes = currentDate.getMinutes().toString().padStart(2, '0');
      const seconds = currentDate.getSeconds().toString().padStart(2, '0');

      const filename = `Expense${userId}/${year}${month}${date}_${hours}${minutes}${seconds}.txt`;

      const fileURL = await s3services.uploadToS3(process.env.BUCKET_NAME, stringifiedExpenses, filename);

      console.log('File uploaded successfully. Object URL:', fileURL);

      // Create a record in the database
      const url = new Url({ url: fileURL, userId: userId });
      await url.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      console.log(url.url);
      res.status(201).json({ fileURL, success: true });
  } catch (error) {
      // Abort the transaction if an error occurs
      if (session) {
          await session.abortTransaction();
          session.endSession();
      }
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.downloads = async (req,res,next) => {
    try{
        const userId = req.user._id
        const downloadedExpenses = await Url.find({userId: userId})
        return res.status(201).json({downloadedExpenses})
    }catch(err){
        console.log(err)
    }
    

}








// const Expense = require('../models/expense')
// const User = require('../models/user')
// const Url = require('../models/fileurl')

// const jwt = require('jsonwebtoken');

// const sequelize = require('../util/database')

// const Userservices = require('../services/userservices')
// const s3services = require('../services/s3services')



// exports.addExpense = async (req,res,next) => {
//     let t

//     try {
//         const t = await sequelize.transaction();
    
//         const amount = req.body.amount;
//         const description = req.body.description;
//         const category = req.body.category;
//         const token = req.header('Authorization');
//         const user = jwt.verify(token, process.env.TOKEN_SECRET);
//         console.log('userId >>>', user.userId);
    
//         const data = await Expense.create({ amount, description, category, userId: user.userId }, { transaction: t });
    
//         const totalUserExpense = await User.findByPk(user.userId);
    
//         if (totalUserExpense) {
//             const currentTotalExpenses = Number(totalUserExpense.totalexpenses) || 0;
//             const newTotalExpenses = currentTotalExpenses + Number(amount);
//             console.log(newTotalExpenses);
    
//             await totalUserExpense.update({ totalexpenses: newTotalExpenses }, { transaction: t });
//         }
    
//         await t.commit();
//         res.status(201).json({ newExpense: data });
//     } catch (err) {
//         if (t) await t.rollback();
//         console.log(err);
//     };

// }

// exports.authenticate = async (req,res,next) => {
//     try {
//        const token = req.header('Authorization')
//        //console.log(token)
//        const user = jwt.verify(token, process.env.TOKEN_SECRET)
//        console.log('userId >>>', user.userId)
 
//         User.findByPk(user.userId)
//          .then(user => {
//            req.user = user
//            next()
//          })
//     }
//      catch(err){
//        console.log(err)
//        return res.status(401).json({success:false})
//      }
// }



// exports.getExpense = async (req, res, next) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const items_per_page = parseInt(req.query.pageitems) || 1
//         let totalItems; // Adjust this based on your preferred page size
//         const expenses = await Expense.findAll({
//             where: { userid: req.user.id },
//             offset: (page - 1) * items_per_page,
//             limit: items_per_page
//         });
//         totalItems = await Expense.count({ where: { userid: req.user.id } });

//         res.status(200).json({ 
//             Expenses: expenses, 
//             premiumuser: req.user.ispremiumuser,
//             pageData: { 
//             totalItems, 
//             currentPage: page,
//             hasNextPage: items_per_page * page < totalItems,
//             nextPage: page + 1,
//             hasPreviousPage: page > 1,
//             previousPage: page - 1,
//             lastPage: Math.ceil(totalItems/items_per_page)
//             }
    
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };



// exports.deleteExpense = async (req,res,next) => {
//     let t
//     try{
//         t = await sequelize.transaction()

//         if(req.params.id === 'undefined'){
//             console.log('id is missing')
//             return res.status(400).json({err : 'ID is missing'})
//         }
//     const expenseId = req.params.id
//     //console.log(expenseId)
//     const expense = await Expense.findByPk(expenseId)

//     const amount = expense.amount
//     await Expense.destroy({ where: { id: expenseId }, transaction: t });

//     const token = req.header('Authorization');
//     const user = jwt.verify(token, process.env.TOKEN_SECRET);
//     const totalUserExpense = await User.findByPk(user.userId);
    
//         if (totalUserExpense) {
//             const currentTotalExpenses = Number(totalUserExpense.totalexpenses) ;
//             const newTotalExpenses = currentTotalExpenses - Number(amount);
//             //console.log(newTotalExpenses);
    
//             await totalUserExpense.update({ totalexpenses: newTotalExpenses }, {transaction: t});
//         }
//         await t.commit()
//         res.status(201).json({success: 'ok'});
//     } catch (err) {
        
//         if (t) await t.rollback();
//         console.log(err);
        
//     }
    
// }


// exports.downloadExpense = async (req, res, next) => {
//     let transaction;
//     try {
//         // Begin a transaction
//         transaction = await sequelize.transaction();

//         const expenses = await Userservices.getExpenses(req);
//         console.log(expenses);

//         const userId = req.user.id;
//         const stringifiedExpenses = JSON.stringify(expenses);
//         console.log(stringifiedExpenses);

//         const currentDate = new Date();
//         const year = currentDate.getFullYear();
//         const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
//         const date = currentDate.getDate().toString().padStart(2, '0');
//         const hours = currentDate.getHours().toString().padStart(2, '0');
//         const minutes = currentDate.getMinutes().toString().padStart(2, '0');
//         const seconds = currentDate.getSeconds().toString().padStart(2, '0');

//         const filename = `Expense${userId}/${year}${month}${date}_${hours}${minutes}${seconds}.txt`;

//         const fileURL = await s3services.uploadToS3(process.env.BUCKET_NAME, stringifiedExpenses, filename);

//         console.log('File uploaded successfully. Object URL:', fileURL);

//         // Create a record in the database
//         const url = await Url.create({ url: fileURL, userId: userId }, { transaction });

//         // Commit the transaction
//         await transaction.commit();

//         console.log(url.url);
//         res.status(201).json({ fileURL, success: true });
//     } catch (error) {
//         // Rollback the transaction if an error occurs
//         if (transaction) await transaction.rollback();
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// exports.downloads = async (req,res,next) => {
//     try{
//         const userId = req.user.id
//         const downloadedExpenses = await Url.findAll({where: {userId: userId}})
//         return res.status(201).json({downloadedExpenses})
//     }catch(err){
//         console.log(err)
//     }
    

// }


// exports.editExpense = async (req,res,next) => {
//     const expenseId = req.params.id
//     await Expense.destroy({where: {id :expenseId}})
//     res.sendStatus(200)
    
// }