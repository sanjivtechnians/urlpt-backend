const express = require('express')
const authController = require("../controllers/authController")
const auth = require('../middlewares/authMiddleware')
const isAdmin = require('../middlewares/adminMiddleware')
const { addVisitors, addVisitorData, getVisitorlimit } = require('../controllers/visitorsControllers')


const router = express.Router()

router.post('/add-visitors', addVisitors)
router.post('/visitor-data', addVisitorData)
router.get('/get-visitor-limit', auth, getVisitorlimit)



module.exports = router