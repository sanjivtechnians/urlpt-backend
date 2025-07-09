const Templates = require("../models/templateModel")
const ErrorHandler = require("../utils/errorHandler")
const { uploadFileToS3 } = require("../utils/uploadHelper")

exports.addTemplate = async (req, res, next) => {
    try {
        const payload = req.body  
        payload['industry'] = payload?.industry?.split(',')
        payload['goal'] = payload?.goal?.split(',')
        const user = req.user
        
        const file = req?.files?.templateImage;
        const teaserImage = req?.files?.teaserImage
        
        if(teaserImage){
            const s3URL = await uploadFileToS3(teaserImage, 'template-preview');
            payload['teaserImage'] = s3URL;
        }

        if(file){
            const s3URL = await uploadFileToS3(file, 'template-preview');
            payload['previewImage'] = s3URL;
        }
        var template 
        if(payload?.templateId){
            payload['updatedBy'] = user._id
            template = await Templates.findByIdAndUpdate(payload?.templateId, payload, {new: true})
        }else{
            payload['createdBy'] = user._id
            payload.slug = payload.templateName.toLowerCase().replace(/\s+/g, '_');
            template = await Templates.create(payload)
        }
        if (!template) return next(new ErrorHandler('Failed to create template.'))
        res.json({
            success: true,
            data: template
        })

    } catch (error) {
        return next(error)
    }
}

exports.updateTemplateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const user = req.user;

        payload['updatedBy'] = user._id; // Optional: track who updated it

        const updatedTemplate = await Templates.findByIdAndUpdate(id, payload, {
            new: true, // return the updated document
        });

        if (!updatedTemplate) return next(new ErrorHandler('Template not found.', 404));

        res.json({
            success: true,
            data: updatedTemplate
        });
    } catch (error) {
        return next(error);
    }
};

exports.updateTemplateDetails = async (req, res, next) => {
    try {

        const payload = req.body;
        console.log('payload: ', payload);
        const file = req?.files?.templateImage;
        if(!payload.previewImage && !file){
            return next(new ErrorHandler('Image not found!.'))
        }

        if(file){
            const s3URL = await uploadFileToS3(file, 'template-preview');
            payload['previewImage'] = s3URL;
        }

        await Templates.findByIdAndUpdate(req.params.id, payload);

        res.json({
            success: true,
            message: "Template saved successfully."
        });
    } catch (error) {
        next(error);
    }
};



exports.getTemplates = async (req, res, next) => {
    try {
        const user = req.user;
        const { category, subCategory, name, industry, goal } = req.query
        const filter = {
            isDeleted: false // apply to all users
        };

        if (user.role !== 'admin') {
            filter.status = "published"; // only for non-admins
        }

        if(category){
            filter.category = category
        }

        if(goal){
            filter.goal = goal
        }
        if(industry){
            filter.industry = industry
        }

        if(subCategory){
            filter.subCategory = subCategory
        }
        if (name) {
            filter.templateName = { $regex: name, $options: 'i' }; // Case-insensitive search
        }

        

        const templates = await Templates.find(filter).sort({ createdAt: -1 }); // Sort by createdAt in descending order (newest first)

        res.json({
            success: true,
            data: templates || []
        });
    } catch (error) {
        return next(error);
    }
}

exports.getTemplate = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!id) return next(new ErrorHandler('Template id not found'))
        const filter = {
            isDeleted: false,
            _id: id
        };

        const templates = await Templates.findOne(filter);
        if (!templates) {
            return next(new ErrorHandler('Template not found!'))
        }

        res.json({
            success: true,
            data: templates
        });
    } catch (error) {
        return next(error);
    }
}
