const express = require('express')
const authController = require("../controllers/authController")
const auth = require('../middlewares/authMiddleware')
const isAdmin = require('../middlewares/adminMiddleware')
const { userValidator } = require('../validators/userValidator');


const router = express.Router()


router.post('/login', authController.login)
router.get('/me', auth, authController.me)
router.post('/sign-up', authController.signUp)
router.get('/login-history', auth, isAdmin, authController.loginHistory)
router.put('/update/profile', auth, authController.updateUser)

router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.loginWithGoogle);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// router.get("/websites", auth, authController.getUserWebsites);
router.post("/add/websites", auth, authController.addWebsite);
router.put("/websites/primary", auth, authController.makePrimaryWebsite);
router.put("/websites/deactivate", auth, authController.deactivateWebsite);
router.delete("/websites/delete", auth, authController.deleteWebsite);
router.get('/login-history-with-id', auth, authController.loginHistoryById);
router.post('/logout/history', auth, authController.logoutHistory);
router.post('/change-password', auth, authController.changePassword);
router.post('/delete-account', auth, authController.deleteAccount);
router.post('/active-user', authController.activeUser);
router.post('/activation-mail/:email', authController.activationMail);
router.get('/get-all-users', auth, authController.getAllUsers);
router.post('/set-timeout', auth, authController.logoutTime);
router.post('/set-auto-delete-days', auth, authController.setAutoDeletedDays);
router.get('/get-auto-delete-days', auth, authController.getAutoDeleteDays);

//sanjeev-code
router.post('/send-emailotp', authController.postEmailOtp);


module.exports = router