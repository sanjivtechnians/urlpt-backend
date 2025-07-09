const express = require('express')
const auth = require('../middlewares/authMiddleware')
const isAdmin = require('../middlewares/adminMiddleware')
const { getCampaignAdmin,
    getCampaignDropdown,
    getCampaignAction,
    getCampaignTriggers,
    createNewCampaign,
    getCampaignById,
    updateCampaign,
    scriptUpdate,
    uploadFiles,
    increaseCounter,
    increaseAppear,
    campaignStat,
    getAppearances,
    getClicks,
    getCloses,
    getTotalConversions,
    getConversions
} = require('../controllers/campaignControllers')


const router = express.Router()


router.get('/get-campaign', auth, getCampaignAdmin)
router.get('/get-campaign-type', auth, getCampaignDropdown)
router.get('/get-campaign-action', auth, getCampaignAction)
router.get('/get-campaign-triggers', auth, getCampaignTriggers)
router.post('/create-campaign', auth, createNewCampaign)
router.get('/get-campaign/:id', auth, getCampaignById)
router.put('/update-campaign/:id', auth, updateCampaign)
router.put('/script-update/:id', auth, scriptUpdate)
router.post('/upload-file', auth, uploadFiles)
router.post('/increase-counter', increaseCounter)
router.post('/increase-appear', increaseAppear)
router.get('/campaign-stat/:id', campaignStat)
router.get('/appearances/:campaignId', auth, getAppearances);
router.get('/clicks/:campaignId', auth, getClicks);
router.get('/closes/:campaignId', auth, getCloses);
router.get('/total/conversions/:campaignId', auth, getTotalConversions);
router.get('/conversions/:campaignId', auth, getConversions);



module.exports = router