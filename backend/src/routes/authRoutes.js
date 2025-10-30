
import {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  resetPassword,
  verifyEmail,
  login,
  logoutUser
} from "../controllers/authController.js"

import { Router } from "express"

import { validate } from "../middlewares/validatorMiddleware.js"
import {
  forgotPasswordValidator,
  userChangeCurrentPasswordValidator,
  userLoginValidator,
  userRegisterValidator
} from "../validators/index.js"
import { verifyJWT } from "../middlewares/authMiddleware.js"

const router = Router();

router.route("/register").post(userRegisterValidator(),  registerUser)
router.route("/me").get( verifyJWT, getCurrentUser)
router.route("/login").post(userLoginValidator(), validate, login)
router.route("/verify-email/:verificationToken").get(verifyEmail)
router.route("/resendEmailVerificationCode").post(verifyJWT, resendEmailVerification)
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPasswordValidator(), validate, forgotPasswordRequest)
router.route("/reset-password/:token").post(validate, resetPassword)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/change-password").post(
  verifyJWT,
  userChangeCurrentPasswordValidator(),
  validate,
  changeCurrentPassword
);

router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification)

export default router
