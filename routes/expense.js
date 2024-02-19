const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/expense');
const authenticationController = require('../controllers/userauthentication')

router.post('/expense/add-expense',expenseController.addExpense)

router.get('/expense/get-expense',authenticationController.authentication,expenseController.getExpense)

router.delete('/expense/delete-expense/:id',authenticationController.authentication,expenseController.deleteExpense)

router.get('/user/download',expenseController.authenticate,expenseController.downloadExpense)

router.get('/user/downloads',expenseController.authenticate,expenseController.downloads)

router.delete('/expense/edit-expense/:id',expenseController.editExpense)

module.exports = router