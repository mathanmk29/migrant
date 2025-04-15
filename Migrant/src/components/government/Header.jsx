import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiUser, FiMenu, FiX } from "react-icons/fi";
import ProfileModal from "./ProfileModal";
import axios from "axios";

const Header = ({ department, handleLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [departmentData, setDepartmentData] = useState(null);
  
  // Function to fetch department details
  const fetchDepartmentDetails = async () => {
    try {
      // Use the token stored in localStorage
      const token = localStorage.getItem("govToken");
      console.log("Token found:", !!token);
      
      if (!token) {
        console.log("No token found, using department prop");
        setDepartmentData(department);
        return;
      }

      console.log("Fetching profile data...");
      const response = await axios.get('http://localhost:5000/api/government/profile', {
        headers: { 'x-auth-token': token }
      });

      console.log("Profile data received:", response.data);
      if (response.data) {
        setDepartmentData(response.data);
      }
    } catch (error) {
      console.error('Error fetching department details:', error);
      // If there's an error, use the department data that was passed as prop
      if (department) {
        setDepartmentData(department);
      }
    }
  };
  return (
    <>
    <motion.header
      className="bg-white/90 backdrop-blur-lg shadow-md sticky top-0 z-50 border-b border-gray-200/70"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-3.5 max-w-[98%] mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <motion.div
            className="w-11 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="tracking-wider">G</span>
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Government Portal
            </h1>
            {department && (
              <p className="text-sm text-gray-500">
                Logged in as {department.name}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">

          {/* User Menu */}
          <div className="relative">
            <motion.button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white mr-2">
                <FiUser className="text-base" />
              </div>
              <span className="font-medium text-gray-700">Profile</span>
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{department?.name || "Admin"}</p>
                    <p className="text-xs text-gray-500">Government</p>
                  </div>
                  <button 
                    onClick={() => {
                      console.log("Profile button clicked");
                      fetchDepartmentDetails();
                      setIsProfileModalOpen(true);
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                  >
                    <FiUser className="mr-2 text-gray-400" /> Profile
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <FiLogOut className="mr-2 text-red-400" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


        </div>
      </div>


    </motion.header>

    {/* Profile Modal */}
    <ProfileModal 
      isOpen={isProfileModalOpen} 
      onClose={() => setIsProfileModalOpen(false)} 
      governmentData={departmentData || department}
    />
    {/* Modal state debug */}
    {console.log("Profile modal state:", { isOpen: isProfileModalOpen, data: departmentData || department })}
    </>
  );
};

export default Header;
