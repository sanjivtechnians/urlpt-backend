const campaignActionModel = require("../models/campaignActionModel");
const campaignTriggerModel = require("../models/campaignTriggerModel");
const campaignTypeModel = require("../models/campaignTypeModel");
const filtersModel = require("../models/filtersModel");
const Campaign = require("../models/user.campaign.model");
const mongoose = require('mongoose');
const { createCampaignScript } = require("../utils/createScript");
const ErrorHandler = require("../utils/errorHandler");
const { uploadFileToS3 } = require("../utils/uploadHelper");
const { getMinifiedCode } = require("../utils/scriptUtils");
const CampaignTrack = require('../models/campaignTrackModel')
const AppearLogModel = require('../models/appearLogModel')
const Conversion = require('../models/conversion.model');


exports.getCampaignAdmin = async (req, res, next) => {
    try {
        const user = req.user;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;

        let matchCondition = {};

        if (user.role === 'user') {
            matchCondition = { clientId: new mongoose.Types.ObjectId(user._id) };
        }

        const aggregateQuery = [
            { $match: matchCondition },  // ✅ Correct way to apply filters
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: pageSize },
            {
                $lookup: {
                    from: "users",
                    localField: "clientId",
                    foreignField: "_id",
                    as: "client",
                }
            },
            {
                $project: {
                    _id: 1,
                    clientId: 1,
                    heading: 1,
                    imageURL: 1,
                    popupContent: 1,
                    selectedOption: 1,
                    triggerType: 1,
                    onsiteAction: 1,
                    category: 1,
                    subCategory: 1,
                    pageTime: 1,
                    campaigndesignerName: 1,
                    scrollPercentage: 1,
                    hours: 1,
                    minutes: 1,
                    seconds: 1,
                    days: 1,
                    region: 1,
                    trafficSource: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    isActive: 1,
                    clicks: 1,
                    client: {
                        $cond: {
                            if: { $gt: [{ $size: "$client" }, 0] },
                            then: {
                                _id: { $arrayElemAt: ["$client._id", 0] },
                                firstName: { $arrayElemAt: ["$client.firstName", 0] },
                                lastName: { $arrayElemAt: ["$client.lastName", 0] }
                            },
                            else: null
                        }
                    }
                }
            }
        ];

        const campaigns = await Campaign.aggregate(aggregateQuery);

        const totalCampaigns = await Campaign.countDocuments(matchCondition);  // ✅ Correct filter for counting
        const totalPages = Math.ceil(totalCampaigns / pageSize);

        const campaignSinceSubscription = await Campaign.countDocuments({

            clientId: new mongoose.Types.ObjectId(user._id),
            createdAt: { $gte: req.query.subscriptionStartDate },
        });

        res.json({
            success: true,
            data: campaigns,
            totalCampaigns,
            totalPages,
            currentPage: page,
            campaignSinceSubscription
        });
    } catch (error) {
        return next(error);
    }
};

exports.getCampaignDropdown = async (req, res, next) => {
    try {
        const campaignTypes = await campaignTypeModel.find({ isDelete: false })
        const formattedData = campaignTypes.map(campaign => ({
            value: campaign.name,  // Assuming `name` is the field storing "Inline Action"
            label: campaign.name,
            _id: campaign._id
        }));
        res.json({
            success: true,
            data: formattedData
        })
    } catch (error) {
        return next(error);
    }
};
exports.getCampaignAction = async (req, res, next) => {
    try {
        const aggregateQuery = [
            { $match: { isDelete: false } },
            {
                $lookup: {
                    from: 'campaign-types',
                    localField: 'campaignTypeId',
                    foreignField: '_id',
                    as: 'campaignType'
                }
            },
            {
                $unwind: {
                    path: "$campaignType",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    label: "$actionName",
                    value: "$actionName",
                    campaignTypeId: { $arrayElemAt: ["$campaignTypeId", 0] },
                    campaignTypeName: "$campaignType.name"
                }
            }
        ];

        const campaignAction = await campaignActionModel.aggregate(aggregateQuery);

        res.json({
            success: true,
            data: campaignAction
        });


    } catch (error) {
        return next(error);
    }
};

exports.getCampaignTriggers = async (req, res, next) => {
    try {
        const campaignTriggers = await campaignTriggerModel.find({ isDelete: false })

        const formattedData = campaignTriggers.map(campaign => ({
            value: campaign.triggerName,  // Assuming `name` is the field storing "Inline Action"
            label: campaign.triggerName,
            _id: campaign._id
        }));
        res.json({
            success: true,
            data: formattedData
        })
    } catch (error) {
        return next(error);
    }
};

exports.getFilters = async (req, res, next) => {
    try {
        const filters = await filtersModel.find()
        res.json({
            success: true,
            data: filters
        })
    } catch (error) {
        return next(error)
    }
}


exports.createNewCampaign = async (req, res, next) => {
    try {
        const payload = req.body
        delete payload.popupContent
        if (!payload.segmentId) {
            delete payload.segmentId
        }
        const user = req.user
        payload['clientId'] = new mongoose.Types.ObjectId(user._id)
        payload['campaigndesignerName'] = req.body.campaignName
        const campaign = await Campaign.create(payload)
        res.json({
            success: true,
            data: campaign
        })
    } catch (error) {
        return next(error)
    }
}
exports.getCampaignById = async (req, res, next) => {
    try {
        const campaignId = req.params.id
        if (!campaignId) {
            return next(new ErrorHandler('Please provide a campaign ID'))
        }
        const campaign = await Campaign.findOne({ "_id": campaignId }).populate('templateId segmentId')
        if (!campaign) {
            return next(new ErrorHandler('Campaign not found!.'))
        }
        res.json({
            success: true,
            data: campaign
        })
    } catch (error) {
        return next(error)
    }
}

exports.updateCampaign = async (req, res, next) => {
    try {
        const campaignId = req.params.id;
        if (!campaignId) {
            return next(new ErrorHandler('Please provide a campaign ID'));
        }
        const user = req.user
        const payload = req.body
        if (!payload.segmentId) {
            delete payload.segmentId
        }
        if (payload.templateId) {
            payload['templateId'] = new mongoose.Types.ObjectId(payload.templateId)
        }
        payload['isActive'] = payload.status === 'published' ? true : false
        payload['campaigndesignerName'] = req.body.campaignName
        // createPopScript(payload.popUpContent, user._id, new Date())

        const campaign = await Campaign.findByIdAndUpdate(campaignId, payload, {
            new: true,
        });

        if (payload.popUpContent) {
            await createCampaignScript(payload.popUpContent, user._id, campaignId, payload.isActive)
        }


        if (!campaign) {
            return next(new ErrorHandler('Campaign not found', 404));
        }
        res.json({
            success: true,
            data: campaign
        });
    } catch (error) {
        return next(error);
    }
};

exports.scriptUpdate = async (req, res, next) => {
    try {
        const user = req.user
        const payload = req.body
        const campaignId = req.params.id;
        const content = payload.popUpContent
        delete payload.popUpContent
        payload['isActive'] = payload.status === 'published' ? true : false
        if (!campaignId) {
            return next(new ErrorHandler('Please provide a campaign ID'));
        }
        await Campaign.findByIdAndUpdate(campaignId, payload, {
            new: true,
        });
        const minifiedCode = await getMinifiedCode(content)
        await createCampaignScript(minifiedCode, user._id, campaignId, payload.isActive)
        res.json({
            success: true,
            message: "Campaign Saved successfully."
        });
    } catch (error) {
        return next(error);
    }
};


exports.uploadFiles = async (req, res, next) => {
    try {
        const user = req.user
        const path = `campaign-images/${user._id}`
        const file = req.files.file
        if (!file && file.data) {
            return next(new ErrorHandler('File not found', 500))
        }

        const uploadedData = await uploadFileToS3(file, path)
        if (!uploadedData) {
            return next(new ErrorHandler('Failed to upload file', 500))
        }
        res.json({
            success: true,
            uploadUrl: uploadedData
        })
    } catch (error) {
        return next(error);
    }
};
exports.increaseCounter = async (req, res, next) => {
    try {
        const payload = req.body;

        // Modify buttonValue if it's "Close"
        if (payload.buttonValue === 'Close') {
            payload.buttonValue = '✕';
        }

        const campaignTrack = await CampaignTrack.create(payload);
        if (!campaignTrack) {
            return next(new ErrorHandler('Failed to add track.'));
        }

        res.json({
            success: true,
            message: 'Counter updated successfully.'
        });

    } catch (error) {
        return next(error);
    }
};
exports.increaseAppear = async (req, res, next) => {
    try {
        const payload = req.body


        const appear = await AppearLogModel.create(payload)
        res.json({
            success: true,
            message: 'Record added successfully.'
        })

    } catch (error) {
        return next(error);
    }
};

exports.campaignStat = async (req, res, next) => {
    try {
        const campaignId = req.params.id;

        const aggregateQuery = [
            // First match the specific campaign
            {
                $match: {
                    campaignId: new mongoose.Types.ObjectId(campaignId)
                }
            },
            // Lookup to join with usercampaign collection to get campaign data
            {
                $lookup: {
                    from: "usercampaigns",
                    localField: "campaignId",
                    foreignField: "_id",
                    as: "campaignData"
                }
            },
            // Lookup to join with appear-logs collection to count appearances
            {
                $lookup: {
                    from: "appear-logs",
                    localField: "campaignId",
                    foreignField: "campaignId",
                    as: "appearances"
                }
            },
            // Unwind the joined campaign data
            {
                $unwind: "$campaignData"
            },
            // Group by button value and include appearance count
            {
                $group: {
                    _id: "$buttonValue",
                    clickCount: { $sum: 1 },
                    // totalAppearances: { $first: "$campaignData.appearCounter" }, // keep original
                    totalAppearances: { $first: { $size: "$appearances" } }, // new field from appear-logs
                    campaignName: { $first: "$campaignData.campaignName" },
                    uniqueUsers: { $addToSet: "$userId" },
                    firstClick: { $min: "$timestamp" },
                    lastClick: { $max: "$timestamp" }
                }
            },
            // Add calculated fields
            {
                $project: {
                    buttonValue: "$_id",
                    clickCount: 1,
                    totalAppearances: 1,
                    campaignName: 1,
                    // uniqueUserCount: { $size: "$uniqueUsers" },
                    // clickThroughRate: {
                    //     $multiply: [
                    //         { $divide: ["$clickCount", "$totalAppearances"] },
                    //         100
                    //     ]
                    // },
                    // firstClick: 1,
                    // lastClick: 1,
                    // _id: 0
                }
            },
            // Sort by most clicked button first
            {
                $sort: { clickCount: -1 }
            }
        ];

        const result = await CampaignTrack.aggregate(aggregateQuery);
        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        return next(error);
    }
};


exports.getAppearances = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const [appearances, total] = await Promise.all([
            AppearLogModel.find({ campaignId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            AppearLogModel.countDocuments({ campaignId })
        ]);

        res.json({
            success: true,
            data: appearances,
            total,
            page,
            pages: Math.ceil(total / limit),
            message: 'Appearances fetched successfully'
        });

    } catch (error) {
        return next(error);
    }
};

exports.getClicks = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const query = {
            campaignId,
            buttonValue: { $ne: '✕' }
        };

        const [clicks, total] = await Promise.all([
            CampaignTrack.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            CampaignTrack.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: clicks,
            total,
            page,
            pages: Math.ceil(total / limit),
            message: 'Button clicks (excluding closes) fetched successfully'
        });

    } catch (error) {
        return next(error);
    }
};

exports.getCloses = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const query = {
            campaignId,
            buttonValue: '✕'
        };

        const [closes, total] = await Promise.all([
            CampaignTrack.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            CampaignTrack.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: closes,
            total,
            page,
            pages: Math.ceil(total / limit),
            message: 'Campaign closes fetched successfully'
        });

    } catch (error) {
        return next(error);
    }
};

exports.getConversions = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        // First get appearances data
        const [appearances, totalAppearances] = await Promise.all([
            AppearLogModel.find({ campaignId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            AppearLogModel.countDocuments({ campaignId })
        ]);

        // Extract visitIds from appearances
        const visitIds = appearances.map(appearance => appearance.visitId);

        // Get conversions that match these visitIds and the user
        const conversions = await Conversion.find({
            visitId: { $in: visitIds }
        });

        // Count total conversions for this campaign and user
        const totalConversions = await Conversion.countDocuments({
            visitId: { $in: await AppearLogModel.distinct('visitId', { campaignId }) }
        });


        res.json({
            success: true,
            data: conversions,
            total: totalConversions,
            page,
            pages: Math.ceil(totalConversions / limit),
            message: 'Campaign conversions fetched successfully'
        });

    } catch (error) {
        return next(error);
    }
};

exports.getTotalConversions = async (req, res) => {
    try {
        const { campaignId } = req.params;
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        // First get appearances data
        const [appearances, totalAppearances] = await Promise.all([
            AppearLogModel.find({ campaignId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            AppearLogModel.countDocuments({ campaignId })
        ]);

        // Extract visitIds from appearances
        const visitIds = appearances.map(appearance => appearance.visitId);

        // Get conversions that match these visitIds and the user
        const conversions = await Conversion.find({
            visitId: { $in: visitIds }
        });

        // Count total conversions for this campaign and user
        const totalConversions = await Conversion.countDocuments({
            visitId: { $in: await AppearLogModel.distinct('visitId', { campaignId }) }
        });

        res.json({
            success: true,
            data: {
                appearances,
                conversions
            },
            totals: {
                appearances: totalAppearances,
                conversions: totalConversions
            },
            pagination: {
                page,
                pages: Math.ceil(totalAppearances / limit),
                limit
            },
            message: 'Data fetched successfully'
        });

    } catch (error) {
        return next(error);
    }
};
