import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiLogIn } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";

const AgencyLogin = () => {
  const [agency, setAgency] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/agency/login", agency);
      localStorage.setItem("agencyToken", res.data.token);

      if (res.data.agency.isVerified) {
        toast.success("Login successful!");
        navigate("/agency-dashboard");
      } else {
        toast.error("Wait For Approval By Government!");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-6 bg-blue-100">
        <ToastContainer />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
            <h2 className="text-3xl font-bold">Agency Portal</h2>
            <p className="mt-2 text-base opacity-90">Access your government agency dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 text-md">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400 h-5 w-5" />
                </div>
                <input
                  type="email"
                  placeholder="agency@example.com"
                  value={agency.email}
                  onChange={(e) => setAgency({ ...agency, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-md">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 h-5 w-5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={agency.password}
                  onChange={(e) => setAgency({ ...agency, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-md font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2 h-5 w-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="px-8 pb-8 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <a
                href="/signup/agency"
                className="text-blue-600 font-medium hover:underline transition duration-200"
              >
                Register your agency
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AgencyLogin;