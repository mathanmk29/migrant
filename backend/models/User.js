const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"]
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"]
  },
  email: { 
    type: String, 
    unique: true,
    required: [true, "Email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email"
    ]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
    select: false
  },
  dob: {
    type: Date,
    required: [true, "Date of birth is required"]
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: [true, "Gender is required"]
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
    match: [
      /^[0-9]{10,15}$/,
      "Please add a valid mobile number"
    ]
  },
  permanentAddress: {
    type: String,
    required: [true, "Permanent address is required"]
  },
  currentAddress: {
    type: String,
    required: [true, "Current address is required"]
  },
  occupationType: {
    type: String,
    required: [true, "Occupation type is required"],
    enum: [
      "Government Employee",
      "Private Sector",
      "Self-Employed",
      "Student",
      "Unemployed",
      "Retired",
      "Other"
    ]
  },
  workLocation: {
    type: String,
    required: [true, "Work location is required"]
  },
  isMigrant: { 
    type: Boolean, 
    default: null 
  },
  agency: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Agency", 
    default: null 
  },
  agencyVerified: { 
    type: Boolean, 
    default: false 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);