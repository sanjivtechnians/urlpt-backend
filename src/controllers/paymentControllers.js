const Razorpay = require("razorpay");
const TransactionModel = require('../models/transactionModel');
const ErrorHandler = require("../utils/errorHandler");
require('dotenv').config()
const crypto = require("crypto");
const Usersubscription = require('../models/user.subscription.model');
const Pricing = require('./../models/packageModel');
const User = require("../models/user.model");
const sendEmail = require("../utils/mailer");
const { invoiceTemplate } = require("../template/invoice-template");



const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
    try {
        const { name, amount, currency, customer_name, customer_email, customer_addressLine1, customer_addressLine2, customer_city, customer_zip, customer_country, customer_state, duration, sDate, eDate, noOfCampaign, noOfVisitors, emailLimit, SMSLimit, gst_details } = req.body;

        const order = await razorpay.orders.create({
            amount: Number(amount * 100),
            currency: currency,
        });

        if (!order) {
            return next(new ErrorHandler('Failed to create order'));
        }

        const fixedOrder = {
            ...order,
            amount: order.amount / 100,
            amount_due: order.amount_due / 100,
            amount_paid: order.amount_paid / 100,
        };

        const transactionPayload = {
            userId: req.user._id,
            paymentName: name,
            amount,
            currency,
            razorpayOrderId: order.id,
            status: order.status,
            customer_name: customer_name,
            email: customer_email,
            customer_address: `${customer_addressLine1}, ${customer_addressLine2}`,
            customer_city: customer_city,
            customer_zip: customer_zip,
            customer_country: customer_country,
            customer_state: customer_state,
            contact: req.user.mobileNumber,
            raw_data: fixedOrder,
            duration: duration,
            startDate: sDate,
            endDate: eDate,
            noOfCampaign: noOfCampaign,
            noOfVisitors: noOfVisitors,
            emailLimit: emailLimit,
            SMSLimit: SMSLimit,
            gst_details: gst_details
        };

        const userUpdateFields = {
            address1: customer_addressLine1,
            address2: customer_addressLine2,
            city: customer_city,
            state: customer_state,
            country: customer_country,
            pinCode: customer_zip
        };

        const [transaction, updatedUser] = await Promise.all([
            TransactionModel.create(transactionPayload),
            User.findByIdAndUpdate(
                req.user._id,
                userUpdateFields,
                { new: true }
            )
        ]);
        const transactionId = transaction._id;
    //    console.log(transactionId);

        res.json({
            success: true,
            data: order,
            user: updatedUser,
            transactionId: transactionId
        });
    } catch (error) {
        return next(error);
    }
};


exports.verifyPayment = async (req, res, next) => {

    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, package_id, package_name, duration, userId, amount, sDate, eDate, payment_failed } = req.body;

        if (payment_failed == true) {
            await TransactionModel.findOneAndUpdate(
                { "razorpayOrderId": razorpay_order_id },
                {
                    status: "failed"
                }
            );
            return next(new ErrorHandler('Payment failed - no payment ID provided', 400));
        }

        const verifyString = razorpay_order_id + "|" + razorpay_payment_id
        const expect = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(verifyString).digest("hex")
        const isValid = expect === razorpay_signature;
        if (!isValid) {
            return next(new ErrorHandler('Payment verification failed!', 500))
        }

        // Fetch full payment details dynamically from Razorpay
        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

        let paymentMethodDetails = {
            method: paymentDetails.method
        };

        if (paymentDetails.method === "card" && paymentDetails.card) {
            paymentMethodDetails.card = {
                last4: paymentDetails.card.last4 || null,
                network: paymentDetails.card.network || null,
                type: paymentDetails.card.type || null,
                issuer: paymentDetails.card.issuer || null,
            };
        } else if (paymentDetails.method === "upi" && paymentDetails.upi) {
            paymentMethodDetails.upi = {
                vpa: paymentDetails.upi.vpa || null,
            };
        } else if (paymentDetails.method === "wallet" && paymentDetails.wallet) {
            paymentMethodDetails.wallet = {
                name: paymentDetails.wallet || null,
            };
        }

        const selectedPackage = await Pricing.findOne({ name: package_name });
        if (!selectedPackage) {
            return res.status(400).json({ error: "Invalid package" });
        }

        await Usersubscription.updateMany(
            { userId: userId, status: "active" },
            { $set: { status: "deactive" } }
        );

        let startDate, endDate;
        if (sDate && eDate) {
            startDate = new Date(sDate);

            if (isNaN(startDate.getTime())) {
                return res.status(400).json({ error: "Invalid start date format" });
            }

            if (duration === "monthly") {
                endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + 1);
            } else if (duration === "yearly") {
                endDate = new Date(startDate);
                endDate.setFullYear(endDate.getFullYear() + 1);
            } else {
                return res.status(400).json({ error: "Invalid duration" });
            }

        } else {
            startDate = new Date();
            endDate = new Date(startDate);

            if (duration === "monthly") {
                endDate.setMonth(endDate.getMonth() + 1);
            } else if (duration === "yearly") {
                endDate.setFullYear(endDate.getFullYear() + 1);
            } else {
                return res.status(400).json({ error: "Invalid duration" });
            }
        }


        const formatDateTime = (date) => date.toISOString().slice(0, 19).replace("T", " ");
        const formattedStartDate = formatDateTime(startDate);
        const formattedEndDate = formatDateTime(endDate);

        const filter = { "razorpayOrderId": razorpay_order_id }

        const updates = {
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status: "success",
            raw_data: paymentDetails,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            method: paymentDetails.method,
            email: paymentDetails.email,
            contact: paymentDetails.contact,
            paymentMethodDetails: paymentMethodDetails
        };

        const transaction = await TransactionModel.findOneAndUpdate(filter, updates);
        if (!transaction) {
            return next(new ErrorHandler('Transaction not found!', 404));
        }

        const newSubscription = new Usersubscription({
            userId: userId,
            subCriptionId: package_id,
            subCriptionType: package_name,
            duration,
            price: amount,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            status: "active",
        });

        await newSubscription.save();

        res.status(200).json({ success: true });

    } catch (error) {
        return next(error)
    }

}


exports.getTransaction = async (req, res, next) => {
    try {
        const { role, _id } = req.user;
        let { page, limit, paymentName, status, razorpayOrderId, amount, email, contact, createdAt } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        let filter = {};

        // Role-based filtering
        if (role === 'user') {
            filter.userId = _id;
        }


        if (paymentName) filter.paymentName = { $regex: paymentName, $options: "i" };
        if (razorpayOrderId) filter.razorpayOrderId = { $regex: razorpayOrderId, $options: "i" };
        if (amount) filter.amount = amount;
        if (status) filter.status = status;
        if (email) filter.email = { $regex: email, $options: "i" };
        if (contact) filter.contact = { $regex: contact, $options: "i" };

        let transactions = await TransactionModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalRecords = await TransactionModel.countDocuments(filter);

        res.json({
            success: true,
            data: transactions,
            total: totalRecords,
            pages: Math.ceil(totalRecords / limit),
        });
    } catch (error) {
        next(error);
    }
};


//sanjeev code

exports.postTransaction = async (req, res, next) => {

    const { orderId } = req.body;

    try {
        const transactionData = await TransactionModel.findOne({ _id: orderId });
        if (!transactionData) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const {
            paymentName,
            amount,
            status,
            email,
            duration,
            startDate,
            endDate,
            noOfCampaign,
            noOfVisitors,
            emailLimit,
            SMSLimit,
            customer_name,
            customer_address,
            customer_city,
            customer_state,
            customer_country,
            customer_zip,
            razorpayPaymentId,
            paymentMethodDetails,
            gst_details
        } = transactionData;

        const addressParts = [
            customer_address,
            customer_city,
            customer_state,
            customer_country,
            customer_zip
        ].filter(part => part && part !== 'N/A');

        const address = addressParts.length > 0 ? addressParts.join(', ') : 'N/A';

        // Use the GST details from transaction data
        const { is_same_country, is_same_state, gst_amount, gst_breakdown, gst_percentages } = gst_details || {};

        // Calculate subtotal and tax
        const subtotal = parseFloat((amount - gst_amount).toFixed(2));
        const tax = gst_amount;

        // Get GST rates from breakdown
        const gstRates = {
            cgst: gst_percentages?.cgst || 0,
            sgst: gst_percentages?.sgst || 0,
            igst: gst_percentages?.igst || 0,
            international_gst: gst_percentages?.international_gst || 0
        };

        let paymentDetails = '';

     if (paymentMethodDetails) {
            if (paymentMethodDetails.method === 'card' && paymentMethodDetails.card) {
                paymentDetails = `Card (${paymentMethodDetails.card.network || ''} ${paymentMethodDetails.card.type || ''}) •••• ${paymentMethodDetails.card.last4 || ''}`;
            } else if (paymentMethodDetails.method === 'upi' && paymentMethodDetails.upi) {
                paymentDetails = `UPI (${paymentMethodDetails.upi.vpa || ''})`;
            } else if (paymentMethodDetails.method === 'wallet' && paymentMethodDetails.wallet) {
                paymentDetails = `Wallet (${paymentMethodDetails.wallet.name || ''})`;
            } else if (paymentMethodDetails.method === 'netbanking') {
                // Try to get bank name from multiple places
                const bankName =
                    paymentMethodDetails.netbanking?.bank ||
                    paymentMethodDetails.bank ||
                    (transactionData.raw_data && transactionData.raw_data.bank) ||
                    'Bank Transfer';
                paymentDetails = `Net Banking (${bankName})`;
            } else {
                paymentDetails = 'N/A';
            }
        } else {
            paymentDetails = 'N/A';
        }

        

        const order = {
            id: orderId,
            customerName: customer_name,
            plan: paymentName,
            contract: duration,
            no_of_campaign: noOfCampaign,
            no_of_visitors: noOfVisitors,
            email_limit: emailLimit,
            SMS_limit: SMSLimit,
            address: address,
            email: email,
            date: new Date(startDate).toLocaleDateString('en-US'),
            dueDate: new Date(endDate).toLocaleDateString('en-US'),
            items: [{
                name: `${paymentName} Plan`,
                quantity: 1,
                price: subtotal,
                taxRate: is_same_country ?
                    (gst_percentages.cgst + gst_percentages.sgst + gst_percentages.igst) :
                    gst_percentages.international_gst
            }],
            subtotal,
            tax,
            total: amount,
            status: status === 'success' ? 'Paid' : 'Pending Payment',
            paymentMethod: paymentDetails,
            transactionId: razorpayPaymentId || 'N/A',
            isSameCountry: is_same_country,
            isSameState: is_same_state,
            gstRates: gstRates,
            gst_breakdown: gst_breakdown,
            gst_percentages: gst_percentages
        };

        const html = invoiceTemplate(order);
        //  console.log(transactionData)

        //    sending email to user mail on download
        if (razorpayPaymentId) {
            await sendEmail(email, "Payment Invoice", html);

            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false, msg: 'Payment Failed.' });
        }
    } catch (error) {
        console.error('Email sending Failed', error);
        res.status(500).send('Failed to Send Invoice on Email.');
    }

}