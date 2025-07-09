const visitorDataModel = require('../models/visitorDataModel')
const { getIpDetails } = require('../utils/helper')
const Visitors = require('./../models/user.visitor.model')
const Usersubscription = require('../models/user.subscription.model');
const packageModel = require("./../models/packageModel");
const userProfile = require('./../models/userProfile.model');
const mongoose = require('mongoose')

exports.addVisitors = async (req, res, next) => {
    try {
        const { clientId, urlpt_ip, ...restPayload } = req.body;

        if (!clientId) {
            return res.status(400).send({ message: "Client ID is required" });
        }

        const objectClientId = new mongoose.Types.ObjectId(clientId);
        
        const subscription = await Usersubscription.aggregate([
            {
                $match: { userId: objectClientId, status: "active" },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $limit: 1,
            },
            {
                $lookup: {
                    from: "packages",
                    localField: "subCriptionId",
                    foreignField: "_id",
                    as: "packageDetails",
                },
            },
            {
                $unwind: { path: "$packageDetails", preserveNullAndEmptyArrays: true },
            },
        ]);

        const activeSubscription = subscription?.[0];
        let maxVisitors = activeSubscription?.packageDetails?.noOfVisitors;
        let subscriptionStartDate = activeSubscription?.createdAt;

        if (!activeSubscription || !maxVisitors) {
            const freePackage = await packageModel.findOne({ isDefault: true });
            if (!freePackage || !freePackage.noOfVisitors) {
                return res.status(400).send({ message: "No valid subscription or fallback package found" });
            }
            maxVisitors = freePackage.noOfVisitors;
            subscriptionStartDate = freePackage.createdAt;
        }

        const visitorsSinceSubscription = await Visitors.countDocuments({
            clientId: objectClientId,
            createdAt: { $gte: subscriptionStartDate },
        });

        if (visitorsSinceSubscription === maxVisitors) {
            return res.status(400).json({
                message: `Visitor limit reached. Maximum allowed: ${maxVisitors}`,
            });
        }

        // Get IP location data
        const locationData = await getIpDetails(urlpt_ip);

        const payload = {
            ...restPayload,
            clientId: objectClientId,
        };

        // Add location fields if available
        if (locationData) {
            payload.latitude = locationData.latitude;
            payload.longitude = locationData.longitude;
            payload.country = locationData.country_name;
            payload.state = locationData.region_name;
            payload.city = locationData.city;
        }

        const userProfilePayload = {
            userId: objectClientId,
            visitorId: restPayload.visitorId
        }

        // Create the visitor
        const visitor = await Visitors.create(payload);

        const existingUser = await userProfile.findOne({ visitorId: restPayload.visitorId });

        if (!existingUser) {
            const userData = await userProfile.create(userProfilePayload);
            console.log('New userProfile created:', userData);
        } else {
            console.log('UserProfile already exists for this visitorId. Skipping creation.');
        }

        if (!visitor && !userData) {
            return res.status(400).send({ message: "Unable to add visitor and user profile" });
        }

        return res.status(201).send({
            message: "Visitor added successfully",
            visitor
        });

    } catch (error) {
        console.error("Error adding visitor:", error);
        return next(error);
    }
};


exports.addVisitorData = async (req, res, next) => {
    try {
        let payload = req.body
        payload['clientId'] = new mongoose.Types.ObjectId(req.body.clientId)
        await visitorDataModel.create(payload)
        res.json({
            success: true,
            message: "Visitor Data saved successfully."
        })



    } catch (error) {
        return next(error)
    }
}


exports.getVisitorlimit = async (req, res, next) => {
    try {
        const { _id, role } = req.user;

        if (role !== 'user') {
            console.log("Visitor limit check not applicable for this role");
            return;
        }

        const objectClientId = new mongoose.Types.ObjectId(_id);

        // Get latest active subscription
        const subscription = await Usersubscription.aggregate([
            { $match: { userId: objectClientId, status: "active" } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            {
                $lookup: {
                    from: "packages",
                    localField: "subCriptionId",
                    foreignField: "_id",
                    as: "packageDetails",
                },
            },
            {
                $unwind: { path: "$packageDetails", preserveNullAndEmptyArrays: true },
            },
        ]);

        const activeSubscription = subscription?.[0];
        let maxVisitors = activeSubscription?.packageDetails?.noOfVisitors;
        let subscriptionStartDate = activeSubscription?.createdAt;

        // If no active subscription, fallback to free
        if (!activeSubscription || !maxVisitors) {
            const freePackage = await packageModel.findOne({ isDefault: true });
            if (!freePackage || !freePackage.noOfVisitors) {
                return res.status(400).json({
                    success: false,
                    message: "No valid subscription or fallback package found",
                });
            }
            maxVisitors = freePackage.noOfVisitors;
            subscriptionStartDate = freePackage.createdAt;
        }

        // Count only visitors added since current subscription started
        const visitorsSinceSubscription = await Visitors.countDocuments({
            clientId: objectClientId,
            createdAt: { $gte: subscriptionStartDate },
        });

        if (visitorsSinceSubscription === maxVisitors) {
            return res.status(200).json({
                success: false,
                message: `Visitor limit reached. Maximum allowed: ${maxVisitors}`,
                data: {
                    maxVisitors,
                    currentVisitorCount: visitorsSinceSubscription,
                },
            });
        }

        // Limit not yet reached
        return res.status(200).json({
            success: true,
            message: `Visitor limit check passed. You have ${maxVisitors - visitorsSinceSubscription} visitor slot(s) remaining.`,
            data: {
                maxVisitors,
                currentVisitorCount: visitorsSinceSubscription,
            },
        });

    } catch (error) {
        console.error("Error in getVisitorlimit:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while checking visitor limit",
            error: error.message,
        });
    }
};