require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const agencyRoutes = require("./routes/agencyRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const governmentRoutes = require("./routes/governementRoutes");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/agency", agencyRoutes);
app.use("/api/complaints", complaintRoutes)
app.use("/api/department", departmentRoutes);
app.use("/api/government", governmentRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
