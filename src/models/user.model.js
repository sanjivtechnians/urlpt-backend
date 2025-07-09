const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require('dotenv').config();
const crypto = require("crypto");



const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    websites: [
      {
        website: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true }
      }
    ],
    email: {
      type: String,
      required: true,
      unique: true
    },
    mobileNumber: {
      type: String,
    },
    password: {
      type: String,
      required: true
    },
    address1: {
      type: String,

    },
    address2: {
      type: String
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    pinCode: {
      type: Number,
    },
    role: {
      type: String,
      default: 'user',
      required: true
    },
    passwordChangeAt: {
      type: Date
    },
    passwordResetToken: {
      type: String
    },
    passwordResetTokenExpires: {
      type: Date
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    autoDeletedAt: {
      type: Date,
      default: null
    },
    autoDeletedDays: {
      type: Number,
      default: 30
    },
    logoutTime: {
      type: Number,
      default: 5,
      min: [1, 'Logout time must be at least 1 minute']
    }

  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hashSync(this.password, 10);
  this.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compareSync(password, this.password);
};
userSchema.methods.createResetPasswordToken = function () {

  const resetToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest("hex")
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
}

const User = new mongoose.model("user", userSchema);
module.exports = User;
