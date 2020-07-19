const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../logger");
const User = require("./../models/User");
const config = require("./../config");
const auth = require("./../middleware/auth");

// @route POST api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // TODO returns status
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const validCredentials = await bcrypt.compare(password, user.password);
    if (!validCredentials) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: 36000 },
      (error, token) => {
        if (error) throw error;
        res.status(200).json({
          message: "You're logged in successfully",
          data: {
            token: token,
            user: user,
          },
        });
      }
    );
  } catch (error) {
    logger(error);
    res.status(401).json({
      message: "Invalid credentials",
    });
  }
});

// @route GET api/auth/user
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      data: user,
    });
  } catch (error) {
    logger(error);
    res.status(401).json({
      message: "Invalid credentials",
    });
  }
});

module.exports = router;
