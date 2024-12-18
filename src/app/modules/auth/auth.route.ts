import express from "express";
import ValidateRequest from "../../middlewares/validateRequests";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import Auth from "../../middlewares/auth";
import { USER_ROLE } from "../users/user.constant";

const router = express.Router();

router.post(
  "/login",
  ValidateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
);
router.post(
  "/change-password",
  Auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  ValidateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword
);


// regresh token paower jonno route e hit korte hobe.
// then oi refresh token dia auto access token generate hobe. login er por
router.post(
  '/refresh-token',
  ValidateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);


export const AuthValidationRoute = router;
