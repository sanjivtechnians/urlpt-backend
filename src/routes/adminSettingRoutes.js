const express = require('express');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();
const { usdToInr, updateGstSettings } = require('../controllers/adminSettingControllers');


router.post('/usd-to-inr', auth, usdToInr);
router.post('/update-gst-settings', auth, updateGstSettings);

module.exports = router