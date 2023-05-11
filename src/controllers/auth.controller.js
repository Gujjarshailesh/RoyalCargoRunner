const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { User } = require('../models');
const _ = require("lodash");

/**
 * Splash screen API
 */
const splash = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send({
    message: "success",
    resultModel: {
      image: "https://designimages.appypie.com/appsplashscreen/appsplashscreen-92-text-label.jpg",
    }
  });
});

/**
 * Privacy Policy Api
 */
const privacyPolicy = catchAsync(async (req, res) => {
  const content = await authService.privacyPolicyContent(req);
  res.status(httpStatus.OK).send({
    message: "success",
    resultModel: "<h1>Privacy Policy for examle@mailinator.com</h1> <p>At mailinator.com, accessible from www.mailinator.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by mailinator.com and how we use it.</p>"
  });
});

/**
 * Device registration
 */
const registration = catchAsync(async (req, res) => {
  const data = await authService.registration(req.body);
  const tokens = await tokenService.generateAuthTokens(data);
  res.status(httpStatus.CREATED).send({
    status: true,
    message: 'OTP has been sent.',
    resultModel: {
      _id: data._id,
      token: tokens.token
    }
  });
});

/**
 * Driver registration
 */
const driverRegistration = catchAsync(async (req, res) => {
  const data = await authService.driverRegistration(req, res);
  res.status(httpStatus.CREATED).send({
    status: true,
    message: 'Driver registration has been completed successfully.',
    data: data
  });
});

/**
 * Customer registration
 */
const customerRegistration = catchAsync(async (req, res) => {
  const data = await authService.customerRegistration(req, res);
  res.status(httpStatus.CREATED).send({
    status: true,
    message: 'Customer registration has been completed successfully.',
    data: data
  });
});

/**
 * Verify OTP
 */
const verifyOTP = catchAsync(async (req, res) => {
  try {
    const { OTP, userId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (user) {
      const userModel = await User.findOne({ _id: userId, OTP: OTP });
      if (userModel) {
        await User.findOneAndUpdate({ _id: userModel._id }, { isPhoneVerified: true });
        res.status(200).send({
          status: true,
          message: "OTP Matched"
        });
      } else {
        res.status(400).send({
          status: true,
          message: "The OTP entered is incrrect."
        });
      }
    } else {
      res.status(400).send({
        status: true,
        message: "User not found"
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message
    });
  }
});

/**
 * Resend OTP
 */
const resendOTP = catchAsync(async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (user) {
      const updated = await User.findOneAndUpdate(
        {
          _id: user._id
        },
        {
          OTP: 111111
        }
      );
      if (updated) {
        res.status(200).send({
          status: true,
          message: "The OPT has been resent."
        });
      } else {
        res.status(400).send({
          status: true,
          message: "The OTP entered is incrrect."
        });
      }
    } else {
      res.status(400).send({
        status: true,
        message: "User not found"
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message
    });
  }
});

const login = catchAsync(async (req, res) => {
  // const { email, password } = req.body;
  // const user = await authService.loginUserWithEmailAndPassword(email, password);
  // const tokens = await tokenService.generateAuthTokens(user);
  // res.send({ user, tokens });
  return res.status(400).json({
    status: false,
    message: "Under development"
  });
});

const logout = catchAsync(async (req, res) => {
  // await authService.logout(req.body.refreshToken);
  // res.status(httpStatus.NO_CONTENT).send();
  return res.status(400).json({
    status: false,
    message: "Under development"
  });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  // const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  // await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  // res.status(httpStatus.NO_CONTENT).send();
  return res.status(400).json({
    status: false,
    message: "Under development"
  });
});

const resetPassword = catchAsync(async (req, res) => {
  // await authService.resetPassword(req.query.token, req.body.password);
  // res.status(httpStatus.NO_CONTENT).send();
  return res.status(400).json({
    status: false,
    message: "Under development"
  });
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  splash,
  privacyPolicy,
  registration,
  verifyOTP,
  resendOTP,
  driverRegistration,
  customerRegistration,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
