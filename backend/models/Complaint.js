const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  complaintText: String,
  category: String,
  categoryConfidence: Number,
  alternativeCategories: [
    { category: String, confidence: Number },
  ],
  recommendedDepartment: String,
  keywordsFound: [String],
  explanation: {
    category: String,
    department: String
  },
  status: { type: String, enum: ["Pending", "Solving", "Solved"], default: "Pending" }, // 🔥 Added Status
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);