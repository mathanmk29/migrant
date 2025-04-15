import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiUser, FiChevronDown } from "react-icons/fi";
import ProfileModal from "./ProfileModal";

const Header = ({ handleLogout, agencyData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  return (
    <>
      <motion.header 
        className="bg-white/90 backdrop-blur-lg rounded-xl shadow-sm mb-6 border border-gray-100 relative"
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
              Agency Verification Portal
            </motion.h1>
            <motion.p 
              className="text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Manage migrant verification requests
            </motion.p>
          </div>
          
          <div className="relative" id="profile-menu-container">
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                {agencyData?.name ? agencyData.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{agencyData?.name || "Admin"}</p>
                <p className="text-xs text-gray-500">Agency Account</p>
              </div>
              <FiChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Dropdown menu - positioned outside the container */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
            style={{
              position: 'absolute',
              top: '75px', 
              right: '24px',
              zIndex: 9999,
              width: '240px'
            }}
          >
            <div className="bg-white rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden">
              <div className="py-1">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800 truncate">{agencyData?.name || "Admin"}</p>
                  <p className="text-xs text-gray-500 truncate">{agencyData?.email || "agency@example.com"}</p>
                </div>
                
                <button
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FiUser className="mr-3 text-gray-500" />
                  Profile
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
        agencyData={agencyData}
      />
    </>
  );
};

export default Header;