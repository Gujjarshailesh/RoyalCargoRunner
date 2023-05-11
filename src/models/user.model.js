const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    userLicence: {
      type: String,
      trim: true,
    },
    userLicenceVerified: {
      type: Boolean,
      trim: true,
    },
    userLicenceImage: {
      type: String,
      trim: true,
    },
    RCNumber: {
      type: String,
      trim: true,
    },
    RCImage: {
      type: String,
      trim: true,
    },
    RCVerified: {
      type: Boolean,
      trim: true,
    },
    aadharCardNumber: {
      type: String,
      trim: true,
    },
    aadharCardImage: {
      type: String,
      trim: true,
    },
    aadharCardVerified: {
      type: Boolean,
      trim: true,
    },
    PANNumber: {
      type: String,
      trim: true,
    },
    PANImage: {
      type: String,
      trim: true,
    },
    PANVerified: {
      type: Boolean,
      trim: true,
    },
    truckImage: {
      type: String,
      trim: true,
    },
    vehicleInfo: {
      type: String,
      trim: true,
    },
    accountType: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    companyAddress: {
      type: String,
      trim: true,
    },
    companyWebsite: {
      type: String,
      trim: true,
    },
    paymentInformation: {
      type: String,
      trim: true,
    },
    deviceToken: {
      type: String,
      trim: true,
    },
    OTP: {
      type: Number,
      trim: true,
    },
    role: {
      type: String,
      enum: roles
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.index({_id:1}, {collation: { locale: 'en', strength: 2}});
/**
 * Check if phone is taken
 * @param {string} phone - The user's phone
 * @param {ObjectId} [excludeuserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneTaken = async function (phone, excludeuserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeuserId } });
  return !!user;
};
/**
 * @typedef user
 */
const user = mongoose.model('User', userSchema);

module.exports = user;
