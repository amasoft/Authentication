import User from "../model/UserModel.js";
import { createToken, sendSMS, sendMail } from "../util/helpers.js";
import Joi from "joi";
// const jwt = require("jsonwebtoken");
import bcrypt from "bcrypt";
// const { sendmail, emailverified } = require("../util/sendmail");

// const handleErrors = (err) => {
//   // console.log("handleErrors", err);

//   let errors = { email: "", password: "" };
//   //incoreet email
//   if (err.message === "incorrect Email") {
//     errors.email = "email not registered ";
//   }
//   //incoreet password
//   if (err.message === "incorrect Password") {
//     errors.password = "password is incorrect ";
//   }
//   //duplivcate error code
//   if (err.code === 11000) {
//     errors.email = " Email  already registerd";
//     // return errors;
//   }
//   //validat
//   if (err.message.includes("user validation failed")) {
//     Object.values(err.errors).forEach(({ properties }) => {
//       errors[properties.path] = properties.message;
//       console.log("888888", properties);
//     });
//     // console.log(err);
//   }
//   console.log("error ", JSON.stringify(errors));
//   Object.entries(errors).forEach(([key, value]) => {
//     if (value === null || value === undefined || value === "") {
//       delete errors[key];
//     } else if (typeof value === "object" && !Array.isArray(value)) {
//       // Recursively remove empty keys in nested objects
//       removeEmptyKeys(value);

//       // If the nested object becomes empty after removal, delete the key
//       if (Object.keys(value).length === 0) {
//         delete errors[key];
//       }
//     }
//   });
//   return errors;
// };
// const maxAge = 3 * 24 * 60 * 60;
export default class authentication {
  static async signup(req, res) {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(12).required(),
      phoneNumber: Joi.string()
        .pattern(/^\+[0-9]{13}$/)
        .required(),
    });
    const params = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
    };
    const fieldsValidation = (items) => {
      const item = Object.entries(items).find(
        (el) => el[1] === "" || el[1] === undefined
      );

      return item ? item[0] : false;
    };

    const checkInputs = fieldsValidation(params);
    if (checkInputs)
      return res.status(409).json({ message: ` ${checkInputs} is required` });
    const verifycode = Math.floor(Math.random() * 90000) + 10000;
    const verifyLink = `localhost:3000/api/v1/verifyemail/${verifycode}`;
    params.code = verifycode;
    try {
      const user = await User.create(params);
      if (!user)
        return res.status(409).json({
          message: "Registration not Succesfull!",
        });
      var message = `Dear ${user.firstName} ${user.lastName} welcome, klndly verify Your Account using this Passcode`;
      const sendCode = sendMail(verifyLink, user.email, message);

      console.log("sendCode");
      console.log(sendCode);
      if (!sendCode)
        return res.status(409).json({
          message: "error sending SMS!",
          error: sendCode,
        });
      const token = createToken(user._id);
      res.status(201).json({
        user: user._id,
        token,
        message: "Registration Succesfull Proceed to verify your Email",
      });
    } catch (err) {
      // const errors = handleErrors(err);
      console.log("arinze", err);
      console.log("faith", JSON.stringify(err));
      return res.status(400).json({ errors: err });
    }
  }

  static async verifyEmail(req, res) {
    const code = req.params.verifycode;
    const checkCode = await User.findOne({
      code: code,
    });
    if (checkCode && checkCode.verified) {
      return res.status(401).json({
        message: "Email already verfied!",
      });
    }
    if (!checkCode) {
      console.log("checkCode", checkCode);

      return res.status(401).json({
        message: "Incorrct code!",
      });
    }
    User.updateOne(
      { code: code },
      { $set: { verified: true, code: "undefined" } }
    )
      .then((result) => {
        return res.status(200).json({
          message: "Email veriefied",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  static async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    //check if email is verifed
    if (user && !user.verified) {
      return res.status(400).json({
        message: "please verify your Email",
      });
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = createToken(user._id);
      return res
        .status(200)
        .json({ token: token, message: "Login  Succesfull" });
    }
    return res.status(401).json({ message: "incorrect email/password" });
  }

  static async forgotPassword(req, res) {
    //check if confirm and password are same
    const isPasswordsame = await User.hasPassword(
      req.body.password,
      req.body.confirm
    );
    //check if paasword is correct
    User.updateOne(
      { email: req.email },
      { $set: { password: isPasswordsame, code: "undefined" } }
    )
      .then((result) => {
        return res.status(200).json({
          message: "password  updated succesfully ",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  static async sendRestpassword(req, res) {
    try {
      const userEmail = req.body.email;
      const generateCode = Math.floor(Math.random() * 30000) + 10000;
      var token = `localhost:3000/api/v1/forgotpassword/${generateCode}`;
      const duration = Date.now();
      const tenMinutesnow = new Date(duration);
      tenMinutesnow.setMinutes(tenMinutesnow.getMinutes() + 10);
      console.log("duration>>  " + tenMinutesnow);

      User.updateOne(
        { email: userEmail },
        { $set: { code: generateCode, expiresTime: tenMinutesnow } }
      )
        .then((result) => {
          const sendmail = sendMail(token, userEmail);
          if (sendMail) {
            return res.status(200).json({
              message:
                "Account reset Code sent to Email,Please check your inbox! ",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      return res.status(500).json({
        message: "erro occured " + error,
      });
    }
  }
  static async getProfiles(req, res) {
    const projection = {
      _id: 0,
      email: 1,
      lastName: 1,
    };
    console.log("from getprofiles");
    const { email } = req.body;
    try {
      const result = await User.findOne({ email: email }).select(projection);
      if (result) {
        return res
          .status(200)
          .json({ data: result, message: "user data succesfully returned" });
      }
    } catch (error) {
      return res.status(200).json({ message: "erro getting data" });
    }
  }
}
