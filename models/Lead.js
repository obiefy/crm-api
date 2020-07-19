const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeadSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Lead = mongoose.model("lead", LeadSchema);

module.exports = Lead;
