const express = require('express');

const router = express.Router();

const passwordController = require('../controllers/forgotpassword');

router.post('/password/forgotpassword', passwordController.forgotpassword);

router.get('/password/resetpassword',passwordController.resetpassword)

router.post('/password/newpassword',passwordController.newpassword)


module.exports = router