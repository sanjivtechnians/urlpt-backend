const ErrorHandler = require('../utils/errorHandler');
const Usersubscription = require('../models/user.subscription.model');
const TransactionModel = require('../models/transactionModel');
const Pricing = require('./../models/packageModel');
const PDFDocument = require('pdfkit');
const { invoiceTemplate } = require('../template/invoice-template');
const puppeteer = require('puppeteer');
const AdminSetting = require('../models/admin.setting.model');



exports.subscribePlan = async (req, res) => {
    try {
        const { _id } = req.user;
        const { package_id, package_name, duration } = req.body;

        const selectedPackage = await Pricing.findOne({ name: package_name });
        if (!selectedPackage) return res.status(400).json({ error: "Invalid package" });

        await Usersubscription.updateMany(
            { userId: _id, status: "active" },
            { $set: { status: "deactive" } }
        );

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(duration === "monthly" ? startDate.getMonth() + 1 : startDate.getMonth() + 12);

        const formatDateTime = (date) => {
            return date.toISOString().slice(0, 19).replace("T", " ");
        };

        const formattedStartDate = formatDateTime(startDate);
        const formattedEndDate = formatDateTime(endDate);

        const newSubscription = new Usersubscription({
            userId: _id,
            subCriptionId: package_id,
            subCriptionType: package_name,
            duration,
            price: selectedPackage.price,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            status: "active",
        });

        await newSubscription.save();
        res.status(201).json({ message: "Subscription successful", subscription: newSubscription });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getDefaultPlan = async (req, res) => {
    try {
        const { _id } = req.user;

        await Usersubscription.updateMany(
            { userId: _id, status: "active" },
            { $set: { status: "deactive" } }
        );

        const defaultPlans = await Pricing.find({ isDefault: true });

        if (!defaultPlans.length) {
            return res.status(404).json({ message: "No default plans found" });
        }

        res.status(200).json(defaultPlans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.downloadInvoice = async (req, res) => {
    const { orderId } = req.params;

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
        };;

        let paymentDetails = '';
        console.log('Payment Method Details:', JSON.stringify(paymentMethodDetails, null, 2));
        
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
        
        console.log('Final Payment Details:', paymentDetails);

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

        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });
        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename=invoice-${order.id}.pdf`,
            'Content-Length': pdfBuffer.length,
        });

        return res.end(pdfBuffer);
    } catch (error) {
        console.error('PDF generation', error);
        res.status(500).send('Failed to generate PDF');
    }
};