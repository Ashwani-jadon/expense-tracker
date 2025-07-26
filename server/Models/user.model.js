import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otpExpiry: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
      walletMoney: {
      type: Number,
      default: 0, // snapshot of wallet at the time of transaction
    },
},{timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;
