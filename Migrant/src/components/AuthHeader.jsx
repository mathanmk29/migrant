import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiLogOut,
  FiAlertCircle,
  FiFileText,
  FiChevronDown,
} from "react-icons/fi";
import { RiGovernmentLine } from "react-icons/ri";
import { FaUserShield } from "react-icons/fa";

const AuthHeader = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin/migrant");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-xl">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <RiGovernmentLine className="text-3xl text-indigo-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              MAAGRS
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate("/home")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive("/home")
                  ? "bg-indigo-100 text-indigo-600 font-medium"
                  : "hover:bg-gray-100 text-gray-700 hover:text-indigo-600"
              }`}
            >
              <FiHome />
              <span>Home</span>
            </button>
            <button
              onClick={() => navigate("/select-agency")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive("/select-agency")
                  ? "bg-indigo-100 text-indigo-600 font-medium"
                  : "hover:bg-gray-100 text-gray-700 hover:text-indigo-600"
              }`}
            >
              <FaUserShield />
              <span>Agencies</span>
            </button>

            {user?.agencyVerified && user?.isMigrant && (
              <>
                <button
                  onClick={() => navigate("/submit-complaint")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive("/submit-complaint")
                      ? "bg-indigo-100 text-indigo-600 font-medium"
                      : "hover:bg-gray-100 text-gray-700 hover:text-indigo-600"
                  }`}
                >
                  <FiAlertCircle />
                  <span>Submit Complaint</span>
                </button>
                <button
                  onClick={() => navigate("/user-complaints")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive("/user-complaints")
                      ? "bg-indigo-100 text-indigo-600 font-medium"
                      : "hover:bg-gray-100 text-gray-700 hover:text-indigo-600"
                  }`}
                >
                  <FiFileText />
                  <span>Your Complaints</span>
                </button>
              </>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 font-medium hover:bg-red-200 transition-all duration-300"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300"
            >
              <div className="w-6 flex flex-col space-y-1.5">
                <div
                  className={`h-0.5 bg-gray-600 transition-all duration-300 ${
                    isMenuOpen ? "transform rotate-45 translate-y-2" : ""
                  }`}
                ></div>
                <div
                  className={`h-0.5 bg-gray-600 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></div>
                <div
                  className={`h-0.5 bg-gray-600 transition-all duration-300 ${
                    isMenuOpen ? "transform -rotate-45 -translate-y-2" : ""
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-2 py-4">
                <button
                  onClick={() => {
                    navigate("/home");
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isActive("/home")
                      ? "bg-indigo-100 text-indigo-600 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FiHome />
                  <span>Home</span>
                </button>

                {user?.agencyVerified && user?.isMigrant && (
                  <>
                    <button
                      onClick={() => {
                        navigate("/select-agency");
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        isActive("/select-agency")
                          ? "bg-indigo-100 text-indigo-600 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <FaUserShield />
                      <span>Agencies</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/submit-complaint");
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        isActive("/submit-complaint")
                          ? "bg-indigo-100 text-indigo-600 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <FiAlertCircle />
                      <span>Submit Complaint</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/user-complaints");
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        isActive("/user-complaints")
                          ? "bg-indigo-100 text-indigo-600 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <FiFileText />
                      <span>Your Complaints</span>
                    </button>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default AuthHeader;
