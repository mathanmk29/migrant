// components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  const government = localStorage.getItem("govToken"); 


  if (government){
    return <Navigate to="/government-dashboard" />;
  }else if (!government) {
    return <Navigate to="/" />;
  }

  console.log(user);
  
  if (!user) {
    return <Navigate to="/signin/migrant" />;
  }

  if (!user.user.isMigrant || !user.user.agencyVerified) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;
