const Joi = require('joi');
const { password } = require('./custom.validation');

/**
 * Device registration API
 */
const registration = {
  body: Joi.object().keys({
    userType: Joi.string().required(),
    phone: Joi.number().required(),
    deviceToken: Joi.string().required(),
  }),
};

/**
 * Verify Otp API
 */
const verifyOtp = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    OTP: Joi.number().min(6).required(),
  }),
};

/**
 * Resend Otp API
 */
const resentOtp = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

/**
 * Driver Registration API
 */
const driverRegistration = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    fullName: Joi.string().required().max(255),
    email: Joi.string().required().max(255),
    address: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    gender: Joi.string().required().max(10),
    userLicence: Joi.string().required().max(255),
    userLicenceVerified: Joi.boolean().required(),
    userLicenceImage: Joi.optional(),
    RCNumber: Joi.string().required().max(255),
    RCImage: Joi.optional(),
    RCVerified: Joi.boolean().required(),
    aadharCardNumber: Joi.string().required().max(16),
    aadharCardImage: Joi.optional(),
    aadharCardVerified: Joi.boolean().required(),
    PANNumber: Joi.string().required().max(16),
    PANImage: Joi.optional(),
    PANVerified: Joi.boolean().required(),
    truckImage: Joi.optional(),
    vehicleInfo: Joi.string().required().max(255)
  }),
};

/**
 * Customer Registration API
 */
const customerRegistration = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    fullName: Joi.string().required().max(255),
    email: Joi.string().required().max(255),
    address: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    gender: Joi.string().required().max(10),
    accountType: Joi.string().required().max(255),
    companyName: Joi.string().required(),
    companyAddress: Joi.string().required().max(255),
    companyWebsite: Joi.string().required().max(255),
    paymentInformation: Joi.string().required().max(255),
  }),
};


const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  registration,
  driverRegistration,
  customerRegistration,
  verifyOtp,
  resentOtp,
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
