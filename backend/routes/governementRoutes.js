const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Government = require("../models/Government");
const Agency = require("../models/Agency")
const router = express.Router();

// Department Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDepartment = new Government({ name, email, password: hashedPassword });
    await newDepartment.save();

    res.status(201).json({ message: "Department registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const department = await Government.findOne({ email });

    if (!department) return res.status(400).json({ error: "Department not found" });

    const isMatch = await bcrypt.compare(password, department.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ departmentId: department._id, name: department.name }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, departmentName: department.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get unverified agencies
router.get("/agencies/unverified", async (req, res) => {
  try {
    const agencies = await Agency.find({ isVerified: false })
      .select("-password") // Exclude passwords
      .sort({ createdAt: -1 });
      
    res.json({ agencies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all agencies
router.get("/agencies", async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    if (status === "verified") {
      query.isVerified = true;
    } else if (status === "unverified") {
      query.isVerified = false;
    }

    const agencies = await Agency.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ agencies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single agency by ID
router.get("/agencies/:id", async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id).select("-password");
    if (!agency) return res.status(404).json({ error: "Agency not found" });
    res.json({ agency });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Verify/reject agency
router.put("/agencies/:id", async (req, res) => {
  try {
    const { action } = req.body;
    const { id } = req.params;

    if (!["verify", "reject"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    if (action === "verify") {
      const agency = await Agency.findByIdAndUpdate(
        id,
        { isVerified: true },
        { new: true }
      ).select("-password");

      if (!agency) {
        return res.status(404).json({ error: "Agency not found" });
      }

      // Here you would typically send a verification email
      res.json({ 
        message: "Agency verified successfully",
        agency 
      });
    } else {
      // For rejection, you might want to delete or just flag
      await Agency.findByIdAndDelete(id);
      res.json({ message: "Agency rejected and removed" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
