const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/registration', validate(authValidation.registration), authController.registration);
router.post('/driver-registration', validate(authValidation.driverRegistration), authController.driverRegistration);
router.post('/verifyOTP', validate(authValidation.verifyOtp), authController.verifyOTP);
router.post('/resendOTP', validate(authValidation.resentOtp), authController.resendOTP);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-number', validate(authValidation.forgotPassword), authController.forgotPassword);
//router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

module.exports = router;

/**
  @swagger
  tags:
    name: Auth
    description: Authentication
 */
/**
 * @swagger
 * /auth/registration:
 *   post:
 *     summary: Device Registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userType
 *               - phone
 *               - deviceToken
 *             properties:
 *               userType:
 *                 type: string
 *                 enum: [Driver, Customer]
 *                 description:  Must be send Driver/Customer 
 *               phone:
 *                 type: number
 *                 description: must be unique
 *               deviceToken:
 *                 type: string
 *                 description: must be unique
 *             example:
 *               userType: Driver/Customer
 *               phone: xxxxxxxxxx
 *               deviceToken: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *     responses:
 *       "200":
 *         description: User profile has been created.
 */

/**
 * @swagger
 * /auth/driver-registration:
 *   post:
 *     summary: Driver Registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - fullName
 *               - email
 *               - address
 *               - dateOfBirth
 *               - gender
 *               - userLicence
 *               - userLicenceVerified
 *               - userLicenceImage
 *               - RCNumber
 *               - RCImage
 *               - RCVerified
 *               - aadharCardNumber
 *               - aadharCardImage
 *               - aadharCardVerified
 *               - PANNumber
 *               - PANImage
 *               - PANVerified
 *               - truckImage
 *               - vehicleInfo
 *             properties:
 *               id:
 *                 type: string
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               dateOfBirth:
 *                 type: date
 *               gender:
 *                 type: string
 *               userLicence:
 *                 type: string
 *               userLicenceVerified:
 *                 type: boolean
 *               userLicenceImage:
 *                 type: string
 *                 format: binary
 *               RCNumber:
 *                 type: string
 *               RCImage:
 *                 type: string
 *                 format: binary
 *               RCVerified:
 *                 type: boolean
 *               aadharCardNumber:
 *                 type: string
 *               aadharCardImage:
 *                 type: string
 *                 format: binary
 *               aadharCardVerified:
 *                 type: boolean
 *               PANNumber:
 *                 type: string
 *               PANImage:
 *                 type: string
 *                 format: binary
 *               PANVerified:
 *                 type: boolean
 *               truckImage:
 *                 type: string
 *                 format: binary
 *               vehicleInfo:
 *                 type: string             
 *             example:
 *               userId: String
 *               OTP: 123457
 *     responses:
 *       "200":
 *         description: OTP verification
 *       "400":
 *         description: Invalid input, object invalid
 */

/**
 * @swagger
 * /auth/verifyOTP:
 *   post:
 *     summary: Verify OTP
 *     description: Default OTP is 123456",
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userType
 *               - OTP
 *             properties:
 *               userId:
 *                 type: string
 *               OTP:
 *                 type: number
 *                 description: Min-6 And Max-6 Numbers*              
 *             example:
 *               userId: String
 *               OTP: 123457
 *     responses:
 *       "200":
 *         description: OTP verification
 */

/**
 * @swagger
 * /auth/resendOtp:
 *   post:
 *     summary: Resend OTP
  *     description: Default resend OTP is 111111
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userType
 *               - OTP
 *             properties:
 *               userId:
 *                 type: string                  
 *             example:
 *               userId: String
 *     responses:
 *       "200":
 *         description: OTP verification
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: An email will be sent to reset password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: fake@example.com
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               password: password1
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: Password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Password reset failed
 */

/**
 * @swagger
 * /auth/send-verification-email:
 *   post:
 *     summary: Send verification email
 *     description: An email will be sent to verify email.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: verify email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verify email token
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: verify email failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: verify email failed
 */
