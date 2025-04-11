const express = require("express");
const axios = require("axios");
const Complaint = require("../models/Complaint");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Submit a Complaint
router.post("/submit", async (req, res) => {
  try {
    const { complaintText } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Send complaint to ML API
    const mlRes = await axios.post("http://127.0.0.1:8000/classify", { complaint_text: complaintText });
    
    const complaintData = {
      userId: decoded.userId,
      complaintText,
      category: mlRes.data.category,
      categoryConfidence: mlRes.data.category_confidence,
      alternativeCategories: mlRes.data.alternative_categories,
      recommendedDepartment: mlRes.data.recommended_department,
      keywordsFound: mlRes.data.keywords_found,
      explanation: mlRes.data.explanation,
    };

    // Save in database
    const newComplaint = new Complaint(complaintData);
    await newComplaint.save();

    res.status(201).json({ message: "Complaint submitted successfully", complaint: newComplaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Complaints for Logged-in User
router.get("/user-complaints", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const complaints = await Complaint.find({ userId: decoded.userId }).sort({ createdAt: -1 });
    
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Complaints for a Specific Department
router.get("/department/:departmentName", async (req, res) => {
  try {
    const { departmentName } = req.params;
    const complaints = await Complaint.find({ recommendedDepartment: departmentName }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
