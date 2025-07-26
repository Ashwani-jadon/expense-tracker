import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // If token not found
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload." });
    }
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token." });
  }
};
