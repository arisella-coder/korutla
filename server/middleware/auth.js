// middleware/auth.js
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authentication failed: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication failed: Invalid token" });
  }
};

export const authorizeVendor = (req, res, next) => {
  if (req.user && req.user.role === "vendor") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied: Only vendors can perform this action" });
  }
};
