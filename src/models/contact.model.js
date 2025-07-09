const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    visitorId: {
        type: [String],
        default: []
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    gender: {
        type: String,
    },
    dob: {
        type: String,
    },
    creation_source: {
        type: String,
    },

},
    {
        timestamps: true,
        versionKey: false
    });

module.exports = mongoose.model('contact', contactSchema)
