const express = require('express');
const auth = require('../middlewares/authMiddleware');
const { subscribePlan, getDefaultPlan,downloadInvoice } = require('../controllers/user.subscription.controllers');
const router = express.Router();


router.post('/subscribe', auth, subscribePlan);
router.get('/user-subscription', auth, getDefaultPlan);
router.get('/download-invoice/:orderId',  downloadInvoice);


module.exports = router