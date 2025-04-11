const mongoose = require("mongoose");

const GovernmentSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model("Government", GovernmentSchema);
