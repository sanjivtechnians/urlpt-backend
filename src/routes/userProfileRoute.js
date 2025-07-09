const express = require('express');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();
const { getAllUserProfile, getUserProfile } = require('../controllers/userProfileControllers.js')


router.get('/getAllUserProfile', auth, getAllUserProfile);
router.get('/userProfile/:userProfileId', auth, getUserProfile);

module.exports = router