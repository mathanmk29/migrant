const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model("Department", DepartmentSchema);
