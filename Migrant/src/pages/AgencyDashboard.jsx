import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, FiMail, FiCalendar, FiPhone, 
  FiHome, FiMapPin, FiBriefcase, FiCheck, 
  FiX, FiClock, FiLogOut, FiUsers, 
  FiCheckCircle, FiAlertCircle, FiSearch, FiFilter
} from "react-icons/fi";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const AgencyDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("agencyToken");
        const [pendingRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/agency/requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/agency/users", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        setRequests(pendingRes.data);
        setAllUsers(usersRes.data);
        calculateStats(pendingRes.data, usersRes.data);
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (pendingRequests, allUsers) => {
    const approved = allUsers.filter(u => u.agencyVerified === true).length;
    const rejected = allUsers.filter(u => u.agencyVerified === false).length;
    setStats({
      pending: pendingRequests.length,
      approved,
      rejected
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("agencyToken");
    navigate("/");
  };

  const handleUpdate = async (userId, status) => {
    try {
      await axios.post(
        "http://localhost:5000/api/agency/update-verification", 
        { userId, status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("agencyToken")}` } }
      );
      toast.success(`User ${status ? "approved" : "rejected"}`);
      
      // Update local state
      const updatedRequests = requests.filter(req => req._id !== userId);
      const updatedUser = allUsers.find(u => u._id === userId);
      if (updatedUser) {
        updatedUser.agencyVerified = status;
        setAllUsers([...allUsers]);
      }
      
      setRequests(updatedRequests);
      setSelectedRequest(null);
      calculateStats(updatedRequests, allUsers);
    } catch (error) {
      toast.error("Failed to update verification");
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "pending") return false;
    if (activeTab === "approved") return user.agencyVerified === true && matchesSearch;
    if (activeTab === "rejected") return user.agencyVerified === false && matchesSearch;
    return matchesSearch;
  });

  const filteredRequests = requests.filter(request => {
    return searchTerm === "" || 
      request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-100 rounded-full opacity-10"
            style={{
              width: Math.random() * 300 + 100 + 'px',
              height: Math.random() * 300 + 100 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.header 
          className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm mb-6"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring' }}
        >
          <div className="p-4 sm:p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Agency Verification Portal</h1>
              <p className="text-gray-600">Manage migrant verification requests</p>
            </div>
            <motion.button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg shadow hover:shadow-md transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiLogOut />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FiClock className="text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Approved Users</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiCheckCircle className="text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Rejected Users</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <FiAlertCircle className="text-xl" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tabs and Filters */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 mb-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "pending" ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab("approved")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "approved" ? 'bg-white shadow text-green-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Approved
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "rejected" ? 'bg-white shadow text-red-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Rejected
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "all" ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                All Users
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : activeTab === "pending" && filteredRequests.length === 0 ? (
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
              <FiUser className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Pending Requests</h3>
            <p className="text-gray-500">There are currently no verification requests to review.</p>
          </motion.div>
        ) : (activeTab !== "pending" && filteredUsers.length === 0) ? (
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
              <FiUsers className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Users Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {(activeTab === "pending" ? filteredRequests : filteredUsers).map((user) => (
                <motion.div
                  key={user._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md overflow-hidden cursor-pointer border border-gray-100"
                  onClick={() => setSelectedRequest(user)}
                >
                  <div className="p-5">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600">
                          <FiUser className="text-xl" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {user.firstName} {user.lastName}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <FiMail className="mr-1.5 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            activeTab === "pending" ? 'bg-yellow-100 text-yellow-800' :
                            user.agencyVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {activeTab === "pending" ? 'Pending' : user.agencyVerified ? 'Approved' : 'Rejected'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* User Detail Modal */}
        <AnimatePresence>
          {selectedRequest && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="bg-white/20 rounded-full p-3">
                        <FiUser className="h-6 w-6" />
                      </div>
                      <h2 className="ml-3 text-xl font-bold">
                        {selectedRequest.firstName} {selectedRequest.lastName}
                      </h2>
                    </div>
                    <button 
                      onClick={() => setSelectedRequest(null)}
                      className="text-white/80 hover:text-white transition-colors duration-200"
                    >
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-2 text-indigo-100">
                    {activeTab === "pending" ? "Verification Request" : 
                     selectedRequest.agencyVerified ? "Approved Migrant" : "Rejected Application"}
                  </p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-500">Date of Birth</p>
                          <p className="font-medium">{new Date(selectedRequest.dob).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Gender</p>
                          <p className="font-medium">{selectedRequest.gender}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Mobile</p>
                          <p className="font-medium">{selectedRequest.mobile}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Address Information</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-500">Permanent Address</p>
                          <p className="font-medium">{selectedRequest.permanentAddress}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Current Address</p>
                          <p className="font-medium">{selectedRequest.currentAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Employment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500">Occupation Type</p>
                        <p className="font-medium">{selectedRequest.occupationType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Work Location</p>
                        <p className="font-medium">{selectedRequest.workLocation}</p>
                      </div>
                    </div>
                  </div>
                  
                  {activeTab === "pending" && (
                    <div className="flex justify-end space-x-4 pt-6">
                      <motion.button
                        onClick={() => handleUpdate(selectedRequest._id, false)}
                        className="flex items-center px-6 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiX className="mr-2" />
                        Decline
                      </motion.button>
                      <motion.button
                        onClick={() => handleUpdate(selectedRequest._id, true)}
                        className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiCheck className="mr-2" />
                        Approve
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AgencyDashboard;