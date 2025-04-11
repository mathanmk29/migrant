import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

/**
 * ProtectedRoute - A component that protects routes based on user type and verification status
 * 
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child components to render if authorized
 * @param {string} props.userType - Type of user that should access this route: "migrant", "agency", "department", "government"
 * @param {boolean} props.requireAgencyVerification - Whether to require agency verification (for migrant routes only)
 * @returns {JSX.Element} - Rendered component or redirect
 */
const ProtectedRoute = ({ 
  children, 
  userType = "migrant", 
  requireAgencyVerification = false 
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");
  
  useEffect(() => {
    const validateAccess = async () => {
      try {
        let token;
        let endpoint;
        
        // Determine which token and endpoint to use based on user type
        switch (userType) {
          case "migrant":
            token = localStorage.getItem("token");
            endpoint = "http://localhost:5000/api/auth/user";
            setRedirectPath("/signin/migrant");
            break;
          case "agency":
            token = localStorage.getItem("agencyToken");
            endpoint = "http://localhost:5000/api/auth/agency";
            setRedirectPath("/signin/agency");
            break;
          case "department":
            token = localStorage.getItem("deptToken");
            endpoint = "http://localhost:5000/api/auth/department";
            setRedirectPath("/signin/department");
            break;
          case "government":
            token = localStorage.getItem("govToken");
            endpoint = "http://localhost:5000/api/auth/government";
            setRedirectPath("/signin/government");
            break;
          default:
            setIsAuthorized(false);
            setLoading(false);
            return;
        }
        
        if (!token) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }
        
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Check specific conditions based on user type
        if (userType === "migrant" && requireAgencyVerification) {
          setIsAuthorized(res.data && res.data.agencyVerified);
        } else {
          // For other user types, just check if user data exists
          setIsAuthorized(!!res.data);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };
    
    validateAccess();
  }, [userType, requireAgencyVerification]);
  
  if (loading) {
    // You can replace this with a loading spinner component
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!isAuthorized) {
    // Redirect to appropriate sign-in page if not authorized
    return <Navigate to={redirectPath} replace />;
  }
  
  // If authorized, render the children
  return children;
};

export default ProtectedRoute;
