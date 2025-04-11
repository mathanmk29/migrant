import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLogOut,
  FiSearch,
  FiFilter,
  FiCheck,
  FiX,
  FiUser,
  FiMail,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

const GovDashboard = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("unverified");
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 });
  const [department, setDepartment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("govToken");
    if (!token) {
      navigate("/signin/government");
      return;
    }

    fetchAgencies();
  }, [navigate]);

  useEffect(() => {
    if (agencies.length > 0) {
      setStats({
        total: agencies.length,
        verified: agencies.filter((a) => a.isVerified).length,
        pending: agencies.filter((a) => !a.isVerified).length,
      });
    }
  }, [agencies]);

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("governmentToken");
      const res = await axios.get(
        `http://localhost:5000/api/government/agencies?status=${statusFilter}&search=${searchTerm}`,
        { headers: { "x-auth-token": token } }
      );
      setAgencies(res.data.agencies);
    } catch (err) {
      console.error("Failed to fetch agencies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (agencyId) => {
    try {
      const token = localStorage.getItem("governmentToken");
      await axios.put(
        `http://localhost:5000/api/government/agencies/${agencyId}`,
        { action: "verify" },
        { headers: { "x-auth-token": token } }
      );
      fetchAgencies();
    } catch (err) {
      console.error("Failed to verify agency:", err);
    }
  };

  const handleReject = async (agencyId) => {
    try {
      const token = localStorage.getItem("governmentToken");
      await axios.put(
        `http://localhost:5000/api/government/agencies/${agencyId}`,
        { action: "reject" },
        { headers: { "x-auth-token": token } }
      );
      fetchAgencies();
    } catch (err) {
      console.error("Failed to reject agency:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("governmentToken");
    navigate("/signin/government");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-100 rounded-full opacity-10"
            style={{
              width: Math.random() * 350 + 150 + "px",
              height: Math.random() * 350 + 150 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="w-full px-6 sm:px-8 md:px-10 lg:px-14 xl:px-24 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              G
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Government Portal
              </h1>
              {department && (
                <p className="text-sm text-gray-500">
                  Logged in as {department.name}
                </p>
              )}
            </div>
          </div>
          <motion.button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow hover:shadow-md transition-all text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiLogOut className="text-base" />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="w-full px-6 sm:px-8 md:px-10 lg:px-14 xl:px-24 py-10 relative z-1">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-7 border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-gray-500">
                  Total Agencies
                </p>
                <p className="text-4xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <div className="p-3.5 rounded-full bg-blue-100 text-blue-600">
                <FiUser className="text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-7 border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-gray-500">Verified</p>
                <p className="text-4xl font-bold text-green-600">
                  {stats.verified}
                </p>
              </div>
              <div className="p-3.5 rounded-full bg-green-100 text-green-600">
                <FiCheckCircle className="text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-7 border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-gray-500">Pending</p>
                <p className="text-4xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3.5 rounded-full bg-yellow-100 text-yellow-600">
                <FiClock className="text-2xl" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-7 mb-10 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-5 space-y-4 md:space-y-0">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 text-lg" />
              </div>
              <input
                type="text"
                placeholder="Search agencies..."
                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && fetchAgencies()}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400 text-lg" />
              </div>
              <select
                className="appearance-none block pl-12 pr-10 py-3 border border-gray-300 rounded-lg bg-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Agencies</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Pending Only</option>
              </select>
            </div>
            <motion.button
              onClick={fetchAgencies}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:shadow-md transition-all text-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Apply Filters
            </motion.button>
          </div>
        </motion.div>

        {/* Agencies List */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="flex justify-center items-center p-14">
              <motion.div
                className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : agencies.length === 0 ? (
            <div className="p-14 text-center">
              <div className="mx-auto w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                <FiUser className="text-gray-400 text-4xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-700">
                No agencies found
              </h3>
              <p className="text-gray-500 mt-2 text-lg">
                Try adjusting your search filters
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              <AnimatePresence>
                {agencies.map((agency) => (
                  <motion.li
                    key={agency._id}
                    className="p-7 hover:bg-gray-50/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-5 md:mb-0 flex items-start space-x-5">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600">
                            <FiUser className="text-2xl" />
                          </div>
                        </div>
                        <div>
                          <a
                            href={`/agency/${agency._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl font-semibold text-black-600 hover:underline underline-color-blue"
                          >
                            {agency.name}
                          </a>
                          <div className="flex items-center mt-2 text-base text-gray-500">
                            <FiMail className="mr-2" />
                            <span>{agency.email}</span>
                          </div>
                          <motion.span
                            className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium mt-3 ${
                              agency.isVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {agency.isVerified
                              ? "Verified"
                              : "Pending Verification"}
                          </motion.span>
                        </div>
                      </div>
                      {!agency.isVerified && (
                        <div className="flex space-x-3">
                          <motion.button
                            onClick={() => handleVerify(agency._id)}
                            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow hover:shadow-md transition-all text-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiCheck className="mr-2" />
                            <span>Verify</span>
                          </motion.button>
                          <motion.button
                            onClick={() => handleReject(agency._id)}
                            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow hover:shadow-md transition-all text-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiX className="mr-2" />
                            <span>Reject</span>
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default GovDashboard;
