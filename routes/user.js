const express = require('express');

const router = express.Router();

const ExpenseTrackerController = require('../controllers/user');

router.post('/user/signup', ExpenseTrackerController.createUser);

router.post('/user/login',ExpenseTrackerController.userLogin)


module.exports = router