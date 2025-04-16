import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiUser, FiChevronDown } from "react-icons/fi";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import { toast } from "react-toastify";

const DepartmentHeader = ({ departmentName, handleLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [departmentData, setDepartmentData] = useState(null);
  
  useEffect(() => {
    // Fetch department data on component mount
    const fetchDepartmentData = async () => {
      try {
        const token = localStorage.getItem("deptToken");
        if (!token) return;
        
        // Decode JWT token to get department information
        try {
          const tokenData = JSON.parse(atob(token.split(".")[1]));
          if (!tokenData || !tokenData.departmentId) {
            return;
          }
          
          // Make API call to get department data (uncomment in production)
          // const response = await axios.get(
          //   `http://localhost:5000/api/department/profile/${tokenData.departmentId}`,
          //   { headers: { Authorization: `Bearer ${token}` } }
          // );
          // setDepartmentData(response.data);
          
          // For now, use mock data based on department name from localStorage
          setDepartmentData({
            _id: tokenData.departmentId || "dept-123",
            name: departmentName,
            email: `${departmentName.toLowerCase().replace(/\s+/g, '.')}@gov.in`,
            description: `Official ${departmentName} department responsible for handling citizen complaints and grievances.`,
            location: "Government Complex, City Center",
            isVerified: true
          });
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
        }
      } catch (error) {
        console.error("Error fetching department data:", error);
        toast.error("Failed to load department profile");
      }
    };
    
    fetchDepartmentData();
  }, [departmentName]);
  
  return (
    <>
      <motion.header 
        className="bg-white/90 backdrop-blur-lg rounded-xl shadow-md mb-6 border border-gray-100 relative ring-1 ring-gray-200/50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="p-4 sm:p-6 flex justify-between items-center">
          <div>
            <motion.h1 
              className="text-2xl md:text-3xl font-bold text-gray-800"
              initial={{ x: -10 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {departmentName} Dashboard
            </motion.h1>
            <motion.p 
              className="text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Manage citizen complaints
            </motion.p>
          </div>
          
          <div className="relative" id="profile-menu-container">
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white mr-2">
                <FiUser className="text-base" />
              </div>
              <span className="font-medium text-gray-700">Profile</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Dropdown menu - positioned below the header */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
            className="absolute right-6 top-[90px] z-50 w-64"
          >
            <div className="bg-white rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden">
              <div className="py-1">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800 truncate">{departmentName || "Department"}</p>
                  <p className="text-xs text-gray-500 truncate">Government Department</p>
                </div>
                
                <button
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FiUser className="mr-3 text-gray-500" />
                  View Profile
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  <FiLogOut className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        departmentData={departmentData}
      />
    </>
  );
};

export default DepartmentHeader;
