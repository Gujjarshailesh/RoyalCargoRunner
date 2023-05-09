const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { User } = require('../models');

const registration = catchAsync(async (req, res) => {    
  const data = await authService.registration(req.body);
  const tokens = await tokenService.generateAuthTokens(data); 
  res.status(httpStatus.CREATED).send({
    status:true,
    message:'OTP has been sent.',
    resultModel : {
      _id: data._id,
      token: tokens.token
    }  
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { OTP, userId } = req.body;
  const user = await User.findOne({_id : userId});
  if(user){
    const userModel = await User.findOne({_id : userId, OTP: OTP});
    if(userModel){
      res.status(200).send({
        status:true,
        message:"OTP Matched"
      });
    } else {
      res.status(400).send({
        status:true,
        message:"The OTP entered is incrrect."
      });
    }
  } else {
    res.status(400).send({
      status:true,
      message:"User not found"
    });
  }  
});

const resendOTP = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const user = await User.findOne({_id : userId});
  if(user) {
    const updated = await User.findOneAndUpdate(
      {
        _id: user._id
      },
      {
        OTP: 111111
      }
    );
    if(updated){
      res.status(200).send({
        status:true,
        message:"The OPT has been resent."
      });
    } else {
      res.status(400).send({
        status:true,
        message:"The OTP entered is incrrect."
      });
    }
  } else {
    res.status(400).send({
      status:true,
      message:"User not found"
    });
  }  
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
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
  registration,
  verifyOTP,
  resendOTP,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
