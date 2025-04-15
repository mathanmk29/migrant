import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiHome, FiLogOut, FiShield, FiCheckCircle, 
  FiAlertCircle, FiChevronRight, FiUser, FiClock,FiChevronDown 
} from "react-icons/fi";
import { RiGovernmentLine } from "react-icons/ri";
import { FaUserShield } from "react-icons/fa";

const SelectAgency = () => {
  const [agencies, setAgencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/signin/migrant");

        const res = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/signin/migrant");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/api/agency/agencies");
        setAgencies(res.data);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to load agencies. Please try again.");
        setIsLoading(false);
        console.error("Error fetching agencies:", error);
      }
    };

    fetchAgencies();
  }, []);

  const handleSelect = (agency) => {
    setSelectedAgency(agency);
    setIsConfirmOpen(true);
  };

  const confirmSelection = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:5000/api/agency/request-verification", { 
        userId, 
        agencyId: selectedAgency._id 
      });
      setIsConfirmOpen(false);
      navigate("/home", { 
        state: { 
          success: `Verification request sent to ${selectedAgency.name}!` 
        } 
      });
    } catch (error) {
      setError("Failed to send request. Please try again.");
      console.error("Error requesting verification:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin/migrant");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation Bar */}
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
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-700 hover:text-indigo-600"
                    >
                      <FiHome />
                      <span>Home</span>
                    </button>
      
                    {user?.agencyVerified ? (
                      <>
                        <button
                          onClick={() => navigate("/submit-complaint")}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-700 hover:text-indigo-600"
                        >
                          <FiAlertCircle />
                          <span>Submit Complaint</span>
                        </button>
                        <button
                          onClick={() => navigate("/user-complaints")}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-700 hover:text-indigo-600"
                        >
                          <FiFileText />
                          <span>Your Complaints</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate("/select-agency")}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-700 hover:text-indigo-600"
                      >
                        <FaUserShield />
                        <span>Agencies</span>
                      </button>
                    )}
      
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg transition-all duration-300"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
      
                  {/* Mobile Menu Button */}
                  <button 
                    onClick={toggleMenu}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                  >
                    <FiChevronDown className={`text-2xl transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
      
                {/* Mobile Navigation */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="md:hidden overflow-hidden"
                    >
                      <div className="flex flex-col space-y-2 py-4">
                        <button
                          onClick={() => {
                            navigate("/home");
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                        >
                          <FiHome />
                          <span>Home</span>
                        </button>
      
                        {user?.agencyVerified ? (
                          <>
                            <button
                              onClick={() => {
                                navigate("/submit-complaint");
                                setIsMenuOpen(false);
                              }}
                              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                            >
                              <FiAlertCircle />
                              <span>Submit Complaint</span>
                            </button>
                            <button
                              onClick={() => {
                                navigate("/user-complaints");
                                setIsMenuOpen(false);
                              }}
                              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                            >
                              <FiFileText />
                              <span>Your Complaints</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              navigate("/select-agency");
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                          >
                            <FaUserShield />
                            <span>Agencies</span>
                          </button>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Select Verification Agency
                </h1>
                <p className="text-gray-600 mt-2">
                  Choose a government agency to verify your migrant status
                </p>
              </div>
              {user?.agency && (
                <div className="mt-4 md:mt-0 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Current agency: <span className="font-medium">{user.agency.name}</span> ({user.agencyVerified ? "Verified" : "Pending"})
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Agencies List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : agencies.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {agencies.map((agency) => (
              <motion.div
                key={agency._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                      <FiShield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-800">{agency.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{agency.description || "Government verification agency"}</p>
                      
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <FiClock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                        <span>Avg. verification time: {agency.avgVerificationTime || "3-5 days"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <motion.button
                      onClick={() => handleSelect(agency)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Request Verification <FiChevronRight className="ml-2 h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="mx-auto h-24 w-24 text-gray-400">
              <FiShield className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No agencies available</h3>
            <p className="mt-1 text-gray-500">Please check back later or contact support</p>
          </motion.div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmOpen && selectedAgency && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Request</h2>
                    <p className="text-gray-600">
                      You're about to request verification from {selectedAgency.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsConfirmOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <FiUser className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Verification Process</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        This agency will review your documents and confirm your migrant status.
                        Average processing time: {selectedAgency.avgVerificationTime || "3-5 days"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsConfirmOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSelection}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    Confirm Request
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectAgency;