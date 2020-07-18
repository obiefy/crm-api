const jwt = require("jsonwebtoken");
const config = require("./../config");

function auth(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;

    next();
  } catch (exception) {
    res.status(401).json({ message: "Invalid token" });
  }
}
module.exports = auth;
