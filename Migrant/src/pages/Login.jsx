import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiLogIn, FiMail, FiLock, FiGlobe } from "react-icons/fi";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        user
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("user", JSON.stringify(res.data));
      setIsLoading(false);

      if (res.data.isMigrant) {
        navigate("/home");  // Redirect to Home if user is a migrant
      } else {
        navigate("/verify");  // Redirect to Verify if user is not a migrant
      }
      
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 font-['Poppins']">
      {/* Login Form */}
      <div className="pt-20 flex items-center justify-center px-4 pb-20 font-['Poppins']">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Illustration */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.h2 className="text-white text-3xl font-bold mt-8 text-center">
                Global Citizen Portal
              </motion.h2>
              <motion.p className="text-blue-100 text-center mt-2">
                Connecting migrants with essential services worldwide
              </motion.p>
            </motion.div>
          </div>

          {/* Form */}
          <div className="w-full md:w-1/2 p-10">
            <div className="text-center mb-10">
              <motion.div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <FiGlobe className="h-8 w-8 text-blue-600" />
              </motion.div>
              <motion.h1 className="text-3xl font-bold text-gray-800">
                Welcome Back
              </motion.h1>
              <motion.p className="text-gray-500 mt-2">
                Sign in to access migrant services
              </motion.p>
            </div>

            {error && (
              <motion.div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="text-right mt-2">
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-md flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <>
                    Login <FiLogIn className="ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                New to MAAGRS?{" "}
                <Link
                  to="/signup/migrant"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
