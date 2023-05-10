const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controllers');
const imageUpload = require('../public/fileupload')
router.post('/userRegister', userController.userRegister);
router.post('/VerifyToken', userController.VerifyToken);
router.post('/login', userController.login)
router.post('/googleLogin', userController.googleLogin)

router.post('/forgetPassword', userController.forgetPassword)
router.post('/sendresetPasswordLink', userController.sendresetPasswordLink)
router.post('/addEditEnquiry', userController.addEditEnquiry)
router.post('/deleteEnquiry', userController.deleteEnquiry)
router.get('/getEnquiry', userController.getEnquiry)

/*Coins Apis */
router.post('/userCoinsActiveDeactive', userController.userCoinsActiveDeactive)
router.get('/getUserCoins', userController.getUserCoins)
router.get('/getAllCoins', userController.getAllCoins)

/*send receive coins amount */
router.post('/sendreceive', userController.sendreceive)
router.get('/gettransactions', userController.gettransactions)
/* news letter */

router.post('/addnewsletter', userController.addnewsletter)

/*tradeHistory */
router.post('/addtradeHistory', userController.addtradeHistory)
router.get('/gettradeHistory', userController.gettradeHistory)

/*help desk */
router.post('/submitHelpForm', imageUpload.fields([{
    name: 'file', maxCount: 1
}]), userController.submitHelpForm)


module.exports = router