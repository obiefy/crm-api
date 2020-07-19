function admin(req, res, next) {
  if (!req.user || req.user.role !== "staff") {
    return res
      .status(403)
      .json({ message: "You don't have access to this page" });
  }

  next();
}

module.exports = admin;
