const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Lead = require("./../models/Lead");

// @route GET api/leads
router.get("/", async (req, res) => {
  Lead.find()
    .then((leads) => res.json({ data: leads }))
    .catch((error) =>
      res.status(500).json({
        message: "Server error, please try again later",
      })
    );
});

// @route POST api/leads
router.post("/", async (req, res) => {
  let { name, email, phone } = req.body;

  let validationMessage = null;

  if (!name || !email || !phone) {
    validationMessage = "Please provide valid data";
  }

  const isDuplicate =
    (await Lead.findOne({ email })) || (await Lead.findOne({ phone }));

  if (isDuplicate) {
    validationMessage = "Client is already exist";
  }

  if (validationMessage) {
    return res.status(422).json({
      message: validationMessage,
    });
  }

  try {
    const leadData = new Lead({ name, email, phone });
    await leadData.save();
    res.json({
      message: "Client Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error, please try again later",
    });
  }
});

// @route GET api/leads/:id
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        message: "Client Not Found",
      });
    }
    res.json({
      data: lead,
    });
  } catch (error) {
    res.status(404).json({
      message: "Client Not Found",
    });
  }
});

// @route PUT api/leads/:id
router.put("/:id", async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(422).json({
      message: "Please provide valid data",
    });
  }
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        message: "Client Not Found",
      });
    }
    await Lead.updateOne({ _id: lead._id }, { $set: { name, email, phone } });
    res.json({
      message: "Client Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error, please try again later",
    });
  }
});

// @route DELETE api/leads
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    lead.remove();
    res.json({
      message: "Client removed successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: "Client not found",
    });
  }
});

module.exports = router;
