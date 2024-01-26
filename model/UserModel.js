// const mongoose = require("mongoose");
import mongoose from "mongoose";
// import { isEmail } from "validator";
// const { isEmail } = require("validator");
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "please enter an email"],
      unique: true,
      lowercase: true,
      // validate: [isEmail, "please enter  valid email"],
    },
    firstName: {
      type: String,
      required: [true, "firstname required"],
      uppercase: true,
    },
    lastName: {
      type: String,
      required: [true, "lastname required"],
      uppercase: true,
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (v) {
          // E.164 validation regex
          return /^\+\d{1,4}\s?\d{1,14}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid E.164 phone number!`,
      },
      required: [true, "phonenumber required"],
    },
    password: {
      type: String,
      required: [true, "please enter a pasword"],
      minlength: [6, "minimum password is 6 characters"],
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    code: {
      type: String,
      required: true,
    },
    expiresTime: {
      type: Number,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
//fire a function befor
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
//static method tologin user
// userSchema.statics.login = async function (email, password) {
//   const user = await this.findOne({ email });
//   if (user) {
//     const auth = await bcrypt.compare(password, user.password);
//     if (auth) {
//       return user;
//     }
//     throw Error("incorrect Password");
//   }
//   throw Error("incorrect Email");
// };
// userSchema.statics.login
userSchema.statics.hasPassword = async function (Password, confirmPasssword) {
  const isPassSame = true ? Password == confirmPasssword : false;
  if (isPassSame) {
    const salt = await bcrypt.genSalt();

    Password = await bcrypt.hash(Password, salt);
    return Password;
  }
  console.log(
    "inform>>>" +
      Password +
      ">>>>" +
      confirmPasssword +
      ">>>isPassSame " +
      isPassSame
  );
};
const User = mongoose.model("authuser", userSchema);
export default User;
