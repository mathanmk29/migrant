import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiXCircle,
  FiUserCheck,
  FiActivity,
  FiClock,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";
import { RiGovernmentLine } from "react-icons/ri";
import { FaUserShield } from "react-icons/fa";
import AuthHeader from "../components/AuthHeader";

const Home = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  const navigate = useNavigate();

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

  

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Sample data for visualization
  const statsData = [];

  const activityData = [
    {
      icon: <FiClock className="text-blue-400" />,
      action: "Last Login",
      time: "2 hours ago",
    },
    {
      icon: <FiUserCheck className="text-green-400" />,
      action: "Account Created",
      time: "5 days ago",
    },
    {
      icon: <FiActivity className="text-purple-400" />,
      action: "Profile Updated",
      time: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <AuthHeader user={user} />

      {/* Agency Verification Modal */}
      <AnimatePresence>
        {isAgencyModalOpen && user?.agency && (
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Agency Verification
                    </h2>
                    <p className="text-gray-600">
                      Your migrant status is verified by the following agency
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAgencyModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-6 bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                      <FiShield className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {user?.agency?.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {user?.agency?.description ||
                          "Government verification agency"}
                      </p>

                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <FiCheckCircle className="mr-1.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span>
                          Verification Status:{" "}
                          <span className="font-medium text-green-600">
                            Verified
                          </span>
                        </span>
                      </div>

                      {user?.verificationDate && (
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <FiClock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                          <span>
                            Verified on:{" "}
                            {new Date(
                              user.verificationDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsAgencyModalOpen(false)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Welcome Section */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
                <h2 className="text-2xl font-bold">
                  Welcome back, {user.name}!
                </h2>
                <p className="text-indigo-100">
                  Manage your account and services
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <FiUserCheck className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <FiClock className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-gray-500">Date of Birth</p>
                      <p className="font-medium">
                        {new Date(user.dob).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleModal}
                  className={`mt-6 w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg ${
                    user.isMigrant
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      : "bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600"
                  }`}
                >
                  {user.isMigrant ? (
                    <span className="flex items-center justify-center space-x-2">
                      <FiCheckCircle className="text-xl" />
                      <span>Verified Migrant</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <FiAlertCircle className="text-xl" />
                      <span>Not a Migrant</span>
                    </span>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Agency Section - Updated Design */}
            {user?.agency && (
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                  <h2 className="text-2xl font-bold">Your Agency</h2>
                  <p className="text-purple-100">
                    {user.agencyVerified
                      ? "Verified partner"
                      : "Pending verification"}
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <RiGovernmentLine className="text-purple-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-gray-500">Agency Name</p>
                        <p className="font-medium">{user.agency.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        {user.agencyVerified ? (
                          <FiCheckCircle className="text-purple-600 text-xl" />
                        ) : (
                          <FiAlertCircle className="text-purple-600 text-xl" />
                        )}
                      </div>
                      <div>
                        <p className="text-gray-500">Verification Status</p>
                        <p className="font-medium">
                          {user.agencyVerified ? "Verified" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      user.agencyVerified
                        ? setIsAgencyModalOpen(true)
                        : navigate("/select-agency")
                    }
                    className={`mt-6 w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg ${
                      user.agencyVerified
                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    }`}
                    title={
                      user.agencyVerified
                        ? "View your agency verification details"
                        : "Select or update your agency"
                    }
                  >
                    {user.agencyVerified ? (
                      <span className="flex items-center justify-center space-x-2">
                        <FiCheckCircle className="text-xl" />
                        <span>Verified Agency</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <FiAlertCircle className="text-xl" />
                        <span>Update Agency</span>
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Recent Activity Section */}
            {/* <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
                <h3 className="text-xl font-bold">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {activityData.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="bg-gray-100 p-3 rounded-full">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-gray-500 text-sm">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div> */}
          </motion.div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
      </div>

      {/* Migrancy Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div
                className={`p-6 text-white ${
                  user?.isMigrant
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                    : "bg-gradient-to-r from-rose-600 to-red-500"
                }`}
              >
                <h2 className="text-2xl font-bold">Migrant Status</h2>
              </div>
              {!user?.isMigrant && (
                <button
                  onClick={() => navigate("/verify")}
                  className="absolute top-4 right-4 bg-white text-rose-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all duration-300 shadow-sm"
                >
                  Verify
                </button>
              )}
              <div className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {user?.isMigrant ? (
                    <>
                      <div className="bg-emerald-100 p-4 rounded-full">
                        <FiCheckCircle className="text-emerald-600 text-4xl" />
                      </div>
                      <p className="text-lg font-medium text-gray-800">
                        You have been verified as a migrant.
                      </p>
                      <p className="text-gray-500">
                        Your migrant status is confirmed.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="bg-rose-100 p-4 rounded-full">
                        <FiAlertCircle className="text-rose-600 text-4xl" />
                      </div>
                      <p className="text-lg font-medium text-gray-800">
                        You are not identified as a migrant.
                      </p>
                      <p className="text-gray-500">
                        Please contact support if this is incorrect.
                      </p>
                    </>
                  )}
                </div>
                <button
                  onClick={toggleModal}
                  className="mt-6 w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
