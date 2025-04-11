const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Agency = require("../models/Agency");
const User = require("../models/User");

const router = express.Router();

// Agency Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, department, location, licenseNumber } = req.body;
    
    // Check if license number already exists
    const existingLicense = await Agency.findOne({ licenseNumber });
    if (existingLicense) {
      return res.status(400).json({ error: "License number already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgency = new Agency({ 
      name, 
      email, 
      password: hashedPassword,
      department,
      location,
      licenseNumber
    });
    
    await newAgency.save();

    res.status(201).json({ 
      message: "Agency registered successfully. Waiting for admin verification.",
      agency: newAgency
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agency Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const agency = await Agency.findOne({ email });

    if (!agency) return res.status(400).json({ error: "Agency not found" });

    const isMatch = await bcrypt.compare(password, agency.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ agencyId: agency._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, agency });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Agencies
router.get("/agencies", async (req, res) => {
  try {
    const agencies = await Agency.find({});
    res.json(agencies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User requests agency verification
router.post("/request-verification", async (req, res) => {
  try {
    const { userId, agencyId } = req.body;
    await User.findByIdAndUpdate(userId, { agency: agencyId, agencyVerified: false });

    res.json({ message: "Verification request sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agency views all requested users
router.get("/requests", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const agencyId = decoded.agencyId;

    const users = await User.find({ agency: agencyId, agencyVerified: false });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Agency approves or declines verification
router.post("/update-verification", async (req, res) => {
  try {
    const { userId, status } = req.body;
    await User.findByIdAndUpdate(userId, { agencyVerified: status });

    res.json({ message: `Verification ${status ? "Approved" : "Declined"}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users (verified and unverified)
router.get("/users", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const agencyId = decoded.agencyId;

    const users = await User.find({ agency: agencyId });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user statistics
router.get("/stats", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const agencyId = decoded.agencyId;

    const pending = await User.countDocuments({
      agency: agencyId,
      agencyVerified: false
    });
    const approved = await User.countDocuments({
      agency: agencyId,
      agencyVerified: true
    });
    const rejected = await User.countDocuments({
      agency: agencyId,
      agencyVerified: false
    });

    res.json({ pending, approved, rejected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;