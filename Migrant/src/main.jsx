import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Verification from "./pages/Verification";
import SelectAgency from "./pages/SelectAgency";
import AgencyLogin from "./pages/AgencyLogin";
import AgencySignup from "./pages/AgencySignup";
import SubmitComplaint from "./pages/SubmitComplaint";
import UserComplaints from "./pages/UserComplaints";
import AgencyDashboard from "./pages/AgencyDashboard";
import DepartmentLogin from "./pages/DepartmentLogin";
import DepartmentSignup from "./pages/DepartmentSignup";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import LandingPage from "./pages/LandingPage";
import GovLogin from "./pages/GovLogin";
import GovDashboard from "./pages/GovDashboard";
import AgencyDetails from "./pages/AgencyDetails";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* Sign In Routes */}
      <Route path="/signin/migrant" element={<Login />} />
      <Route path="/signin/agency" element={<AgencyLogin />} />
      <Route path="/signin/department" element={<DepartmentLogin />} />
      <Route path="/signin/government" element={<GovLogin />} />
      
      {/* Sign Up Routes */}
      <Route path="/signup/migrant" element={<Signup />} />
      <Route path="/signup/agency" element={<AgencySignup />} />
      <Route path="/signup/department" element={<DepartmentSignup />} />
      
      {/* Dashboard Routes - Each protected for specific user type */}
      <Route path="/home" element={
        <ProtectedRoute userType="migrant">
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/agency-dashboard" element={
        <ProtectedRoute userType="agency">
          <AgencyDashboard />
        </ProtectedRoute>
      } />
      <Route path="/department-dashboard" element={
        <ProtectedRoute userType="department">
          <DepartmentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/government-dashboard" element={
        <ProtectedRoute userType="government">
          <GovDashboard />
        </ProtectedRoute>
      } />
      
      {/* Complaint Routes - Protected for verified migrants only */}
      <Route path="/submit-complaint" element={
        <ProtectedRoute userType="migrant" requireAgencyVerification={true}>
          <SubmitComplaint />
        </ProtectedRoute>
      } />
      <Route path="/user-complaints" element={
        <ProtectedRoute userType="migrant" requireAgencyVerification={true}>
          <UserComplaints />
        </ProtectedRoute>
      } />
      
      {/* Agency Selection and Verification - Only for migrants */}
      <Route path="/verify" element={
        <ProtectedRoute userType="migrant">
          <Verification />
        </ProtectedRoute>
      } />
      <Route path="/select-agency" element={
        <ProtectedRoute userType="migrant">
          <SelectAgency />
        </ProtectedRoute>
      } />
      <Route path="/agency/:id" element={
        <ProtectedRoute userType="migrant">
          <AgencyDetails />
        </ProtectedRoute>
      } />

      {/* Catch-all route for undefined URLs */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);
