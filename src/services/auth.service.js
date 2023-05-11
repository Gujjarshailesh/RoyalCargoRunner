const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { User, PrivacyPolicy } = require('../models');
const mongoose = require('mongoose');

const fs = require("fs");
const _ = require("lodash");
var moment = require('moment');

/**
 * Privacy policy content 
 * @returns {Promise<PrivacyPolicy>}
 */
const privacyPolicyContent = async () => {
  return await PrivacyPolicy.findOne({},{content:1}).limit(1);
};

/**
 * Device Registration
 * @param {string} userType
 * @param {string} phone
 * @param {string} deviceToken
 * @returns
 */
const registration = async (body) => {
  try {
    const model = {
      phone: body.phone,
      deviceToken: body.deviceToken,
      role:body.userType,
      OTP: 123456
    }
    return await userService.createUser(model)
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

/**
 * Driver Registration
 * @param {string} body
 * @returns
 */
const driverRegistration = async (req, res) => {  
 try {
  const user = await User.findById(mongoose.Types.ObjectId(req.body.id));
  if(!user){
    return res.status(400).json({
      status: false,
      message: "The driver could not be identified."
    });
  }
  if(!user.isPhoneVerified){
    return res.status(400).json({
      status: false,
      message: "Phone number is not validated, please verify your phone number."
    });
  }

  var path = "./public/profile/" + req.body.id;
  await fs.promises.mkdir(path, { recursive: true });
  if (!req.files.userLicenceImage.mimetype) return res.status(400).send ("No files were uploaded!!");
  if (!req.files.RCImage.mimetype) return res.status(400).send ("No files were uploaded!!");
  if (!req.files.aadharCardImage.mimetype) return res.status(400).send ("No files were uploaded!!");
  if (!req.files.PANImage.mimetype) return res.status(400).send ("No files were uploaded!!");

  // If does not have image mime type prevent from uploading
  if (!/^image/.test(req.files.userLicenceImage.mimetype)) return res.status(400).send ({
    status:false,
    message:"Allow only image file!!"
  });
  if (!/^image/.test(req.files.RCImage.mimetype)) return res.status(400).send ({
    status:false,
    message:"Allow only image file!!"
  });
  if (!/^image/.test(req.files.aadharCardImage.mimetype)) return res.status(400).send ({
    status:false,
    message:"Allow only image file!!"
  });
  if (!/^image/.test(req.files.PANImage.mimetype)) return res.status(400).send ({
    status:false,
    message:"Allow only image file!!"
  });
  if (!/^image/.test(req.files.PANImage.mimetype)) return res.status(400).send ({
    status:false,
    message:"Allow only image file!!"
  });
  if (!/^image/.test(req.files.truckImage.mimetype)) return res.status(400).send ({
    status:false,
    message:"Allow only image file!!"
  });

  const toDateFormat = moment(new Date(req.body.dateOfBirth)).format("DD/DD/YYYY");
  if(!moment(toDateFormat, "MM/DD/YYYY", true).isValid()) return res.status(400).send ({
    status:false,
    message:"Please enter valid date, Valid date format is [MM/DD/YYYY]"
  });  

  // User Licence Image
  let userLicenceImage = await fileUpload(req.files.userLicenceImage, path + "/" + Date.now() + "." + (req.files.RCImage.mimetype
    ? req.files.RCImage.mimetype.split("/")[1]
    : "png"));

  // RC Image
  let RCImage = await fileUpload(req.files.RCImage, path + "/" + Date.now() + "." + (req.files.RCImage.mimetype
    ? req.files.RCImage.mimetype.split("/")[1]
    : "png"));

   // Aadhar Card Image
   let aadharCardImage = await fileUpload(req.files.aadharCardImage, path + "/" + Date.now() + "." + (req.files.RCImage.mimetype
    ? req.files.RCImage.mimetype.split("/")[1]
    : "png"));

    // PAN Image
    let PANImage = await fileUpload(req.files.PANImage, path + "/" + Date.now() + "." + (req.files.PANImage.mimetype
      ? req.files.RCImage.mimetype.split("/")[1]
      : "png"));
    // PAN Image
    let truckImage = await fileUpload(req.files.truckImage, path + "/" + Date.now() + "." + (req.files.truckImage.mimetype
      ? req.files.RCImage.mimetype.split("/")[1]
      : "png"));
  await User.updateOne(
    {
      _id: req.body.id
    },
    _.assign(
      _.pick(req.body, [
        "fullName",
        "email",
        "address",
        "gender",
        "userLicence",
        "userLicenceVerified",
        "RCNumber",
        "RCVerified",
        "aadharCardNumber",
        "aadharCardVerified",
        "PANNumber",
        "PANVerified",
        "truckImage",
        "vehicleInfo"
      ]),
      {
        userLicenceImage: _.replace(userLicenceImage, "./public/",""),
        RCImage: _.replace(RCImage, "./public/",""),
        aadharCardImage: _.replace(aadharCardImage, "./public/",""),
        PANImage:_.replace(PANImage, "./public/",""),
        truckImage:_.replace(truckImage, "./public/",""),
        dateOfBirth : new Date(req.body.dateOfBirth+"Z")
      }
    )
  );
  return;
 } catch (error) {
  return res.status(400).json({
    status:false,
    message: error.message
  });
 }
};
/**
 * Customer Registration
 * @param {string} body
 * @returns
 */
const customerRegistration = async (req, res) => {  
  try {
   const user = await User.findById(mongoose.Types.ObjectId(req.body.id));
   if(!user){
     return res.status(400).json({
       status: false,
       message: "The customer could not be identified."
     });
   }
   if(!user.isPhoneVerified){
     return res.status(400).json({
       status: false,
       message: "Phone number is not validated, please verify your phone number."
     });
   }
 
   await User.updateOne(
     {
       _id: req.body.id
     },
     _.assign(
       _.pick(req.body, [
         "fullName",
         "email",
         "address",
         "gender",
         "accountType",
         "companyName",
         "companyAddress",
         "companyWebsite",
         "paymentInformation"
       ]),
       {
         dateOfBirth : new Date(req.body.dateOfBirth+"Z")
       }
     )
   );
   return;
  } catch (error) {
   return res.status(400).json({
     status:false,
     message: error.message
   });
  }
 };
var fileUpload = (image, path) => {
  return new Promise((resolve, reject) => {
    // Move the uploaded image to our upload folder
    image.mv(path);
    return resolve(path);   
  });
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  privacyPolicyContent,
  registration,
  driverRegistration,
  customerRegistration,
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
