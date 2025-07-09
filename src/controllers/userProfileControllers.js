const userProfile = require('../models/userProfile.model');
const Uservisitor = require("../models/user.visitor.model");
const Conversion = require('../models/conversion.model');
const Contact = require('../models/contact.model');
const ErrorHandler = require('../utils/errorHandler');


exports.getAllUserProfile = async (req, res) => {
    try {
        const { _id, role } = req.user;
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page * limit;

        const filter = role === "user" ? { userId: _id } : {};

        const [userData, total] = await Promise.all([
            userProfile.aggregate([
                { $match: filter },
                { $sort: { _id: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $addFields: {
                        latestVisitorId: {
                            $cond: {
                                if: { $isArray: "$visitorId" },
                                then: { $arrayElemAt: ["$visitorId", -1] },
                                else: "$visitorId"
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "uservisitors",
                        let: { latestVisitorId: "$latestVisitorId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$visitorId", "$$latestVisitorId"] } } },
                            { $sort: { createdAt: -1 } },
                            { $limit: 1 },
                            {
                                $project: {
                                    _id: 0,
                                    city: 1,
                                    state: 1,
                                    country: 1
                                }
                            }
                        ],
                        as: "visitorInfo"
                    }
                },
                {
                    $unwind: {
                        path: "$visitorInfo",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]),
            userProfile.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: userData,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};

exports.getUserProfile = async (req, res, next) => {
    try {
        const userData = await userProfile.findById(req.params.userProfileId);
        
        if (!userData) {
            return next(new ErrorHandler('User Profile not found.', 404));
        }

        const userVisitors = await Uservisitor.find({ visitorId: userData.visitorId }).sort({ createdAt: 1 });

        let firstVisit = null;
        let lastVisit = null;
        let location = { city: null, state: null, country: null };

        if (userVisitors.length > 0) {
            firstVisit = userVisitors[0].createdAt;
            lastVisit = userVisitors[userVisitors.length - 1].createdAt;

            const latestVisitor = userVisitors[userVisitors.length - 1];

            location = {
                city: latestVisitor.city || null,
                state: latestVisitor.state || null,
                country: latestVisitor.country || null
            };
        }

        const conversions = await Conversion.find({ visitorId: userData.visitorId }).sort({ createdAt: -1 });

        let firstConversion = null;
        let lastConversion = null;
        if (conversions.length > 0) {
            firstConversion = conversions[0].createdAt;
            lastConversion = conversions[conversions.length - 1].createdAt;
        }

        const contacts = await Contact.find({ visitorId: userData.visitorId }).sort({ createdAt: -1 });

        let firstContact = null;
        let lastContact = null;
        if (contacts.length > 0) {
            firstContact = contacts[0].createdAt;
            lastContact = contacts[contacts.length - 1].createdAt;
        }

        const userDataObj = userData.toObject();

        userDataObj.location = location;
        userDataObj.firstVisit = firstVisit;
        userDataObj.lastVisit = lastVisit;
        userDataObj.firstConversion = firstConversion;
        userDataObj.lastConversion = lastConversion;
        userDataObj.firstContact = firstContact;
        userDataObj.lastContact = lastContact;
        userDataObj.conversions = conversions;
        userDataObj.userVisitors = userVisitors;
        userDataObj.contacts = contacts;

        res.json({
            success: true,
            data: userDataObj
        });

    } catch (error) {
        next(error);
    }
};