import User from "../model/UserModel.js";

export const UserExist = async (req, res, next) => {
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    return res.json({
      status: 409,
      message: "user Already exist",
    });
  }
  next();
};
export const EmailExist = async (req, res, next) => {
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    next();
    return;
  }
  return res.status(200).json({
    message: "No account with this email",
  });
};
export const isEmailverified = async (req, res, next) => {
  const result = await User.findOne({ email: req.body.email });
  if (result && result.verified) {
    next();
    return;
  }
  return res.status(200).json({
    message: "please verify your Email",
  });
};
export const isresetCodevalid = async (req, res, next) => {
  console.log("params >>>" + req.params.token);
  const currentDate = new Date();
  const code = await req.params.token;
  const checkCode = await User.findOne({
    code: code,
  });
  if (!checkCode) {
    return res.status(409).json({ message: "Reset code  is invalid" });
  }
  const db = new Date(checkCode.expiresTime);

  if (db && currentDate < db) {
    console.log("message>>code is valid");
    req.email = checkCode.email;
    next();
  } else {
    console.log("message>>code has expired");
    return res.status(409).json({ message: "Code has Expired" });
  }
};
