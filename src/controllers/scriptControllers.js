const { default: mongoose } = require("mongoose")
const ErrorHandler = require("../utils/errorHandler")
const User = require("../models/user.model")
const Campaign = require('../models/user.campaign.model')
const EmailActivity = require('../models/emailActivity.model');
const SMSActivity = require('../models/SMSActivity.model');
const Usersubscription = require('../models/user.subscription.model');
const packageModel = require("./../models/packageModel");


exports.getScripts = async (req, res, next) => {
    
    try {
        const referrer = req.headers.referer || req.headers.referrer;
        const url = new URL(referrer);
        const domain = url.hostname;

        const userId = req.query.clientId;
        if (!userId) {
            return next(new ErrorHandler('Please provide a client Id'));
        }

        const aggregateQuery = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'scripts',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$userId', '$$userId'] },
                                        { $eq: ['$isDelete', false] },
                                        { $eq: ['$isActive', true] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'scripts'
                }
            }
        ];

        const [user] = await User.aggregate(aggregateQuery);
        if (!user) return next(new ErrorHandler('No data found.'));
        if (user.isDeleted) return next(new ErrorHandler('User Deactivated.'));

        const activeWebsites = user.websites
        ?.filter(el => el.isActive)
        .map(el => el.website);
        console.log('activeWebsites: ', activeWebsites);
        console.log('domain: ', domain);

        const isAllowed = activeWebsites.some(site => site.includes(domain));
        if (!isAllowed){
            res.type('application/javascript').send('console.log("Not allowed on this site.")');
            return 
        } 

        const baseUrl = 'https://urlptapi.technians.in/scripts'; // replace with your CDN or API domain

        const mainScript = `${user._id}-main.js`
        const scriptFileNames = (user.scripts || [])
            .map(script => script.name)
            .filter(Boolean); // remove falsy values

        if (!scriptFileNames.includes(mainScript)) {
            // If mainScript is not found, return or stop further execution
            console.log('Main script not found, nothing to load.');
            res.type('application/javascript').send('console.log("Main Script not found.")');
        }


        const loader = `
            (function loadScripts() {
                const files = ${JSON.stringify(scriptFileNames)};
                const base = '${baseUrl}/';
                files.forEach(file => {
                    const s = document.createElement('script');
                    s.src = base + file;
                    s.async = true;
                    document.head.appendChild(s);
                });
            })();
        `;

        res.type('application/javascript').send(loader);

    } catch (error) {
        return next(error);
    }
};

const fs = require('fs');
const path = require('path');
const { createMainScript } = require("../utils/scriptUtils");
const scriptModel = require("../models/scriptModel");
const { getTemplate } = require("../template/editorTemplate");
const sendEmail = require("../utils/mailer");
const sendSendGridMail = require("../utils/sendGridMailer");
const { sendSMS } = require("../utils/smsHelper");
const { extractPlainText } = require("../utils/helper");


exports.createMainScript = async (req, res, next) => {
    try {
        const users = await User.find();

        if (users && users.length) {
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                const fileName = `${user._id}-main.js`;

                const scriptsDir = path.join(__dirname, '..', 'scripts');
                const filePath = path.join(scriptsDir, fileName);

                if (fs.existsSync(filePath)) {
                    console.log(`File exists: ${fileName}`);
                    const scriptData = await scriptModel.findOne({ name: fileName })
                    if (!scriptData) {
                        const sPayload = {
                            name: fileName,
                            isActive: true,
                            userId: user._id
                        }
                        await scriptModel.create(sPayload)
                    }
                } else {
                    await createMainScript(user)
                }
            }
        }

        res.status(200).json({ message: 'File check complete' });

    } catch (error) {
        next(error);
    }
};

// exports.sendMail = async (req, res, next) => {
//     try {
//         const {templateId, email } = req.body
//         const template = await Campaign.findById(templateId)

//         if(template && template.elements && template.elements.length){
//             const mailHtml = getTemplate(template.elements)
//             const data = await sendSendGridMail({email, subject: template.subject, mailHtml})
//         }

//         res.json({
//             success: true,
//             message: "Email Sent successfully."
//         })
//     } catch (error) {
//         next(error);
//     }
// };

exports.sendMail = async (req, res, next) => {
    try {
        const { templateId, email, userId } = req.body;

        const template = await Campaign.findById(templateId);
        if (!template || !template.elements?.length) {
            return res.status(400).json({ success: false, message: "Invalid or empty template." });
        }

        const subscription = await getActiveSubscription(userId);

        let maxMail = subscription?.packageDetails?.emailLimit;
        let subscriptionStartDate = subscription?.createdAt;

        if (!subscription || !maxMail) {
            const fallback = await packageModel.findOne({ isDefault: true });
            if (!fallback || !fallback.emailLimit) {
                return res.status(400).json({ message: "No valid subscription or fallback package found." });
            }
            maxMail = fallback.emailLimit;
            subscriptionStartDate = fallback.createdAt;
        }

        const latestSubscription = await Usersubscription.findOne({ userId: new mongoose.Types.ObjectId(userId), status: "deactive" }).sort({ createdAt: -1 });

        let remainEmails;
        if (latestSubscription && typeof latestSubscription.remainEmail === "number") {
            remainEmails = maxMail - latestSubscription.remainEmail;
        } else {
            remainEmails = maxMail
        }

        const sentEmails = await EmailActivity.countDocuments({
            userId,
            status: "sent",
            createdAt: { $gte: subscriptionStartDate }
        });

        if (sentEmails === remainEmails) {
            return res.status(400).json({
                message: `Email limit reached. Maximum allowed: ${remainEmails}`
            });
        }

        const mailHtml = getTemplate(template.elements);

        let status = "sent";
        let errorMessage = "";

        try {
            await sendSendGridMail({ email, subject: template.subject, mailHtml });
        } catch (err) {
            status = "failed";
            errorMessage = err.message;
        }

        await EmailActivity.create({
            userId,
            to: email,
            subject: template.subject,
            status,
            sentAt: new Date()
        });

        if (status === "sent") {
            const newRemain = Math.max(0, (remainEmails - 1) - sentEmails);
            await Usersubscription.updateOne(
                { userId: new mongoose.Types.ObjectId(userId), status: "active" },
                { $set: { remainEmail: newRemain } }
            );
        }

        return res.json({
            success: status === "sent",
            message: status === "sent" ? "Email sent successfully." : `Email failed: ${errorMessage}`
        });

    } catch (error) {
        next(error);
    }
};

const getActiveSubscription = async (userId) => {
    const objectClientId = new mongoose.Types.ObjectId(userId);

    const [subscription] = await Usersubscription.aggregate([
        { $match: { userId: objectClientId, status: "active" } },
        { $sort: { createdAt: -1 } },
        { $limit: 1 },
        {
            $lookup: {
                from: "packages",
                localField: "subCriptionId",
                foreignField: "_id",
                as: "packageDetails"
            }
        },
        {
            $unwind: {
                path: "$packageDetails",
                preserveNullAndEmptyArrays: true
            }
        }
    ]);

    return subscription || null;
};

// exports.sendSMS = async (req, res, next) => {
//     try {

//         console.log(req.body)

//         const { templateId, contact } = req.body
//         const template = await Campaign.findById(templateId)
//         if (template && template.elements && template.elements.length) {
//             const plainText = extractPlainText(template.elements)
//             const messageObj = {
//                 srcNumber: "+919559333592",
//                 dstNumber: contact,
//                 message: plainText
//             }

//             await sendSMS(messageObj)
//             res.json({
//                 success: true,
//                 message: "SMS send successfully."
//             })
//         }
//         return next(new ErrorHandler('Failed to send SMS'))

//     } catch (error) {
//         next(error);
//     }
// };

exports.sendSMS = async (req, res, next) => {
    try {
        const { templateId, contact, userId } = req.body;

        const template = await Campaign.findById(templateId);
        if (!template || !template.elements?.length) {
            return res.status(400).json({ success: false, message: "Invalid or empty template." });
        }

        const subscription = await getActiveSubscription(userId);

        let maxSMS = subscription?.packageDetails?.SMSLimit;
        let subscriptionStartDate = subscription?.createdAt;

        if (!subscription || !maxSMS) {
            const fallback = await packageModel.findOne({ isDefault: true });
            if (!fallback || !fallback.SMSLimit) {
                return res.status(400).json({ message: "No valid subscription or fallback package found." });
            }
            maxSMS = fallback.SMSLimit;
            subscriptionStartDate = fallback.createdAt;
        }

        const latestSubscription = await Usersubscription.findOne({ userId: new mongoose.Types.ObjectId(userId), status: "deactive" }).sort({ createdAt: -1 });

        let remainSMSs;
        if (latestSubscription && typeof latestSubscription.remainSMS === "number") {
            remainSMSs = maxSMS - latestSubscription.remainSMS;
        } else {
            remainSMSs = maxSMS;
        }

        const sentSMS = await SMSActivity.countDocuments({
            userId,
            status: "sent",
            createdAt: { $gte: subscriptionStartDate }
        });

        if (sentSMS === remainSMSs) {
            return res.status(400).json({
                message: `SMS limit reached. Maximum allowed: ${remainSMSs}`
            });
        }

        const plainText = extractPlainText(template.elements);

        const messageObj = {
            srcNumber: "+919559333592",
            dstNumber: contact,
            message: plainText
        };

        let status = "sent";
        let errorMessage = "";

        try {
            await sendSMS(messageObj);
        } catch (err) {
            status = "failed";
            errorMessage = err.message;
        }

        await SMSActivity.create({
            userId,
            to: contact,
            message: plainText,
            status,
            sentAt: new Date()
        });

        if (status === "sent") {
            const newRemain = Math.max(0, (remainSMSs - 1) - sentSMS);
            await Usersubscription.updateOne(
                { userId: new mongoose.Types.ObjectId(userId), status: "active" },
                { $set: { remainSMS: newRemain } }
            );
        }

        return res.json({
            success: status === "sent",
            message: status === "sent" ? "SMS sent successfully." : `SMS failed: ${errorMessage}`
        });

    } catch (error) {
        next(error);
    }
};
