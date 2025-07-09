const express = require('express')
const auth = require('../middlewares/authMiddleware')
const isAdmin = require('../middlewares/adminMiddleware')
const { getScripts, createMainScript, sendMail, sendSMS } = require('../controllers/scriptControllers')


const router = express.Router()

router.get('', getScripts)
router.get('/crate-main-script', createMainScript)
router.post('/send-mail', sendMail)
router.post('/send-sms', sendSMS)



module.exports = router