const mongoose = require("mongoose");

const userSubscription = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subCriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'packages', required: true },
    subCriptionType: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: { type: String, required: true },
    remainEmail: { type: Number, required: false },
    remainSMS: { type: Number, required: false },


  },
  {
    timestamps: true,
    versionKey: false,
  }
);


const Usersubscription = new mongoose.model("usersubcription", userSubscription);
module.exports = Usersubscription;
