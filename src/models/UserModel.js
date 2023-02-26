import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required!"],
      length: [3, "First name should be at least 3 characters long"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required!"],
      length: [3, "Last name should be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: [true, "Email already exists"],
      lowercase: true,
      validate: [validator.isEmail, "Provide a valid email please!"],
    },
    photo: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [
        8,
        "Password's length should be at least 8  or characters long",
      ],
    },
    passwordConfirm: {
      type: String,
      required: [true, "Enter your password again!"],
      validate: {
        validator(el) {
          return el === this.password;
        },
      },
    },
    otp: String,
    otpExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = "";
  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
