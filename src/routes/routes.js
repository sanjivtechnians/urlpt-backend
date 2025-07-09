const express = require('express')
const authRouter = require('../routes/authRoutes')
const paymentRouter = require('./paymentRoute')
const campaignRoutes = require('./campaignRoutes')
const pricingRoutes = require('./pricingRoutes')
const visitorsRoutes = require('./visitorsRoutes')
const subscriptionRoutes = require('./subscriptionRoutes')
const dashboardRoutes = require('./dashboardRoutes')
const { getFilters } = require('./../controllers/campaignControllers')
const templateRoutes = require('./templateRoutes')
const conversionRoutes = require('./conversionRoutes')
const scriptRoute = require('./scriptRoute')
const credentialsRoutes = require('./credentialsRoutes')
const userProfileRoute = require('./userProfileRoute')
const segmentRoutes = require('./segmentRoutes')
const adminSettingRoutes = require('./adminSettingRoutes')

// const authRouter = require()

const router = express.Router()

router.use('/auth', authRouter)
router.use('/payment', paymentRouter)
router.use('/campaign', campaignRoutes)
router.use('/pricing', pricingRoutes)
router.use('/visitors', visitorsRoutes)
router.use('/subscription', subscriptionRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/templates', templateRoutes)
router.get('/filters', getFilters)
router.use('/conversion', conversionRoutes)
router.use('/script', scriptRoute)
router.use('/credentials', credentialsRoutes)
router.use('/userProfile', userProfileRoute)
router.use('/segment', segmentRoutes)
router.use('/adminSeting', adminSettingRoutes)






module.exports = router