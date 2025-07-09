const express = require('express');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();
const { addTemplate, getTemplates, getTemplate, updateTemplateById, updateTemplateDetails } = require('../controllers/templateControllers')


router.post('/add-template', auth, addTemplate);
router.get('/get-templates', auth, getTemplates);
router.get('/get-template/:id', auth, getTemplate);
router.put('/edit-template/:id', auth, updateTemplateById);
router.put('/edit-template-details/:id', auth, updateTemplateDetails);


module.exports = router