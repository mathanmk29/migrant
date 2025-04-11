import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiLogOut, FiAlertCircle, FiFileText, FiChevronDown, FiSend } from "react-icons/fi";
import { RiGovernmentLine } from "react-icons/ri";
import { FaUserShield } from "react-icons/fa";
import { toast } from 'react-toastify';

const SubmitComplaint = () => {
  const [complaintText, setComplaintText] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Immigration",
    "Housing",
    "Employment",
    "Healthcare",
    "Education",
    "Legal",
    "Other"
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaintText) return toast.error("Please enter your complaint");
    

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/complaints/submit", 
        { complaintText}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Complaint submitted successfully!");
      navigate("/user-complaints");
    } catch (err) {
      console.error("Error submitting complaint:", err);
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-600 font-medium"
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

                  <button
                    onClick={() => {
                      navigate("/submit-complaint");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-600 font-medium"
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
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
              <h2 className="text-2xl font-bold">Submit a Complaint</h2>
              <p className="text-indigo-100">Describe your issue in detail</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Complaint Details
                </label>
                <textarea
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-300 min-h-[200px]"
                  placeholder="Describe your complaint in detail..."
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSend />
                      <span>Submit Complaint</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitComplaint;