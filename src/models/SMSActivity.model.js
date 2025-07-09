const mongoose = require('mongoose');

const SMSActivitySchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'failed'],
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true,
        versionKey: false
    });

module.exports = mongoose.model('sms-activity', SMSActivitySchema);
