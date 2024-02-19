const express = require('express')

const router = express.Router()

const purchaseController = require('../controllers/purchase')
const authenticationController = require('../controllers/userauthentication');

router.post('/purchase/purchase-premium',authenticationController.authentication,purchaseController.purchasepremium)

router.post('/purchase/purchase-failure',authenticationController.authentication,purchaseController.purchasefailure)

router.post('/purchase/updatetransactionstatus',authenticationController.authentication,purchaseController.updateTransactionStatus)

router.get('/premium/leaderboard',purchaseController.leaderboard)

module.exports = router;