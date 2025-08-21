const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Invalid token or expired" });
  }
};

module.exports = authMiddleware;
