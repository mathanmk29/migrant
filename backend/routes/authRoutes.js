const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      dob,
      gender,
      mobile,
      permanentAddress,
      currentAddress,
      occupationType,
      workLocation
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: "Email already in use",
        message: "This email address is already registered" 
      });
    }

    // Rest of the signup logic remains the same...
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      dob: new Date(dob),
      gender,
      mobile,
      permanentAddress,
      currentAddress,
      occupationType,
      workLocation
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(201).json({ 
      message: "User registered successfully",
      token,
      userId: newUser._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Server error during registration",
      details: err.message 
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Return user data (excluding password)
    const userData = await User.findById(user._id).select("-password");

    res.json({
      token,
      userId: user._id,
      isMigrant: user.isMigrant,
      user: userData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Server error during login",
      details: err.message 
    });
  }
});

router.post("/update-migrant", async (req, res) => {
  try {
    const { isMigrant } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(decoded.userId, { isMigrant });

    res.json({ message: "Migrant status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password").populate("agency")
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
