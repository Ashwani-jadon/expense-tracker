import User from "../Models/user.model.js";
import {generateAlphanumericOtp} from "../Utils/utils.js";
import bcrypt from "bcrypt";
import { createToken } from "../Utils/token.js";

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !/^\S+@\S+\.\S+$/.test(email) || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateAlphanumericOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    const hashedOtp = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Generated OTP (for testing):", otp);
    console.log("password for testing", password);

    const newUser = await User.create({
      fullName,
      email,
      otp: hashedOtp,
      otpExpiry,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyOtp = async (req, res) => {
  const userId = req.params.id;
  const { otp } = req.body;

  try {
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await User.findByIdAndUpdate(userId, {
      otp: null,
      otpExpiry: null,
      isVerified: true,
    });

    // set token for jwt auth
    const token = createToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "OTP verified successfully",
        success: true,
        user: {
          id: user._id,
          email: user.email,
        },
      });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found,please register first" });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your account first" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // set token for jwt auth
    const token = createToken(user._id);

return res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  .status(200)
  .json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
    },
  });
  } catch (error) {
    console.log(error);
  }
};

export const logout = (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .json({
      success: true,
      message: "Logout successful",
    });
};
