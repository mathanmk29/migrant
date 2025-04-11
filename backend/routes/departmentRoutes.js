const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Department = require("../models/Department");
const Complaint = require("../models/Complaint");

const router = express.Router();

// Department Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingDepartment = await Department.findOne({ email });
    if (existingDepartment) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newDepartment = new Department({
      name,
      email,
      password: hashedPassword,
    });
    await newDepartment.save();

    res.status(201).json({ message: "Department registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Department Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const department = await Department.findOne({ email });

    if (!department)
      return res.status(400).json({ error: "Department not found" });

    const isMatch = await bcrypt.compare(password, department.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { departmentId: department._id, name: department.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, departmentName: department.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Complaint Status
router.post("/update-status", async (req, res) => {
  try {
    const { complaintId, status } = req.body;

    if (!["Pending", "Solving", "Solved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await Complaint.findByIdAndUpdate(complaintId, { status });

    res.json({ message: `Complaint marked as ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Complaints for a Specific Department
router.get("/complaints", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const departmentName = decoded.name;

    const complaints = await Complaint.find({
      recommendedDepartment: departmentName,
    })
      .sort({ createdAt: -1 })
      .populate("userId");

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
