import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiLogOut,
  FiAlertCircle,
  FiFileText,
  FiChevronDown,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { RiGovernmentLine } from "react-icons/ri";
import { FaUserShield } from "react-icons/fa";

const UserComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/complaints/user-complaints",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComplaints(res.data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin/migrant");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Solved":
        return <FiCheckCircle className="text-green-500" />;
      case "Solving":
        return <FiClock className="text-blue-500" />;
      case "Pending":
        return <FiClock className="text-yellow-500" />;
      case "Rejected":
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Solved":
        return "bg-green-100 text-green-800";
      case "Solving":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-xl">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <RiGovernmentLine className="text-3xl text-indigo-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              MAAGRS
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => navigate("/home")}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-700 hover:text-indigo-600"
              >
                <FiHome />
                <span>Home</span>
              </button>

              <button
                onClick={() => navigate("/submit-complaint")}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-700 hover:text-indigo-600"
              >
                <FiAlertCircle />
                <span>Submit Complaint</span>
              </button>
              <button
                onClick={() => navigate("/user-complaints")}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-600 font-medium"
              >
                <FiFileText />
                <span>Your Complaints</span>
              </button>

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
              <FiChevronDown
                className={`text-2xl transition-transform duration-300 ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
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
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-600 font-medium"
                  >
                    <FiFileText />
                    <span>Your Complaints</span>
                  </button>

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
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
              <h2 className="text-2xl font-bold">Your Complaints</h2>
              <p className="text-indigo-100">
                View all your submitted complaints
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
                <FiFileText className="text-gray-400 text-4xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No Complaints Found
              </h3>
              <p className="text-gray-500 mb-4">
                You haven't submitted any complaints yet.
              </p>
              <button
                onClick={() => navigate("/submit-complaint")}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Submit Your First Complaint
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <motion.div
                  key={complaint._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {complaint.category}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Submitted on{" "}
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(complaint.status)}
                          <span>{complaint.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700">{complaint.complaintText}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                        <span className="font-medium">Department:</span>{" "}
                        {complaint.recommendedDepartment}
                      </div>
                      {complaint.response && (
                        <div className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-700">
                          <span className="font-medium">Response:</span>{" "}
                          {complaint.response}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserComplaints;
