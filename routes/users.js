const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("./../models/User");

// @route GET api/users
router.get("/", async (req, res) => {
  User.find()
    .then((users) => res.json({ data: users }))
    .catch((error) =>
      res.status(500).json({
        message: error,
      })
    );
});

// @route POST api/users
router.post("/", async (req, res) => {
  let { name, email, password, role } = req.body;

  let validationMessage = null;

  if (!name || !email || !password || !role) {
    validationMessage = "Please provide valid data";
  }

  if (role !== "super-admin" && role !== "staff") {
    validationMessage = "Please provide valid user role.";
  }

  const isDuplicate = await User.findOne({ email });
  if (isDuplicate) {
    validationMessage = "User is already exist";
  }

  if (validationMessage) {
    return res.status(422).json({
      message: validationMessage,
    });
  }

  try {
    const userData = new User({ name, role, email, password });
    await bcrypt.genSalt(10, (error, salt) => {
      if (error) throw error;
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) throw error;
        userData.password = hash;
        userData.save();
      });
    });
    res.json({
      message: "User Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

// @route GET api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    res.json({
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      message: "User Not Found",
    });
  }
});

// @route PUT api/users/:id
router.put("/:id", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(422).json({
      message: "Please provide valid data",
    });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    await user.update({ $set: { name, email } });
    res.json({
      message: "User Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

// @route DELETE api/users
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.remove();
    res.json({
      message: "User removed successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: "User not found",
    });
  }
});

module.exports = router;
