const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')
const imageUpload = require('../public/fileupload')
const userController = require('../controllers/user.controllers')

router.get('/getUsers', adminController.getUsers)
router.post('/activeDeactiveUser', adminController.activeDeactiveUser)
router.post('/deleteUser', adminController.deleteUser)
router.get('/getCategory', adminController.getCategory)
router.get('/getArticals', adminController.getArticals)
router.get('/getArticalFilter', adminController.getArticalFilter)
router.post('/addEditCategory', adminController.addEditCategory)
router.post('/addEditartical', imageUpload.fields([{
  name: 'artical_image', maxCount: 1
}]), adminController.addEditartical)
router.post('/deleteCategory', adminController.deleteCategory)
router.post('/deleteArtical', adminController.deleteArtical)
router.post('/adminchangepassword', adminController.adminchangepassword)
router.post('/activeDeactiveartical', adminController.activeDeactiveartical)
router.post('/sendadminNofication', adminController.sendadminNofication)
router.post('/addEditMediaContent', imageUpload.fields([{
  name: 'home_banner', maxCount: 1
},
{ name: 'home_video', maxCount: 1 },
{ name: 'information_contentone_image', maxCount: 1 },
{ name: 'information_contentsecond_image', maxCount: 1 },
{ name: 'information_contentthird_image', maxCount: 1 }]), adminController.addEditMediaContent)
router.get('/getMediaContant', adminController.getMediaContant)
router.get('/getNotifications', adminController.getNotifications)
router.post('/addEditFaq', adminController.addEditFaq)
router.get('/getFaqsList', adminController.getFaqsList)
router.post('/deleteFaqs', adminController.deleteFaqs)
router.post('/activeDeactiveFaqs', adminController.activeDeactiveFaqs)
router.post('/addEdiSubCategory', adminController.addEdiSubCategory)
router.post('/deleteSubCategory', adminController.deleteSubCategory)
router.get('/getSubCategory', adminController.getSubCategory)
router.post('/addEditCurrency', imageUpload.fields([{
  name: 'image', maxCount: 1
}]), adminController.addEditCurrency)
router.post('/deleteCurrency', adminController.deleteCurrency)
router.post('/activeDeactiveCurrency', adminController.activeDeactiveCurrency)
router.get('/getCurrencyList', adminController.getCurrencyList)

/*news letter */

router.get('/getnewsletter', adminController.getnewsletter)
router.post('/sendnewsletter', adminController.sendnewsletter)
router.post('/activeDeactivenewsletteruser', adminController.activeDeactivenewsletteruser)

/*help desk */
router.get('/getrequestedData', userController.getrequestedData)
router.post('/deleterequestedData', userController.deleterequestedData)

/*total counts */
router.get('/getTotalCount', adminController.getTotalCount)

/*user transactions */

router.get('/getUserTransactions', adminController.getUserTransactions)
router.get('/getAllswaprecords', adminController.getAllswaprecords)
router.get('/getAllsendrecords', adminController.getAllsendrecords)

/*send enquiry message */
router.post('/sendenquirymessage', adminController.sendenquirymessage)


module.exports = router