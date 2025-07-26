import jwt from "jsonwebtoken";

export const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
