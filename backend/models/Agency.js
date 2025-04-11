const mongoose = require("mongoose");

const AgencySchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  department: String,
  location: String,
  licenseNumber: { type: String, unique: true },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Agency", AgencySchema);