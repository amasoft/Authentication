import Router from "express";
import authentication from "../controller/authController.js";
import {
  UserExist,
  EmailExist,
  isresetCodevalid,
  isEmailverified,
} from "../middlewares/authmiddleware.js";
const router = Router();
router.post("/signup", [UserExist], authentication.signup);
router.post("/login", authentication.login);
router.get("/verifyemail/:verifycode", authentication.verifyEmail);
router.post("/isemailverified", [isEmailverified], authentication.getProfiles);
router.post("/restcode", [EmailExist], authentication.sendRestpassword); //send code to user for password  rest
router.get(
  "/forgotpassword/:token",
  [isresetCodevalid],
  authentication.forgotPassword
);
//check password strength

export default router;
