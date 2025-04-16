import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiMapPin, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";
import Header from "../components/Header";

const DepartmentSignup = () => {
  const [department, setDepartment] = useState({
    name: "",
    email: "",
    password: "",
    jurisdiction: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation regex
  const nameRegex = /^[A-Za-z\s\-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!nameRegex.test(value)) {
          return "Department name must contain only letters and spaces.";
        }
        break;
      case "email":
        if (!emailRegex.test(value)) {
          return "Invalid email format.";
        }
        break;
      case "password":
        if (!passwordRegex.test(value)) {
          return "Password must be 8+ characters, include uppercase, lowercase, number and special character.";
        }
        break;
      case "jurisdiction":
        if (!value.trim()) {
          return "Jurisdiction is required.";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  const validateAll = () => {
    const newErrors = {};
    Object.entries(department).forEach(([key, value]) => {
      const err = validateField(key, value);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({ ...prev, [name]: value }));

    // Live validation
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (!validateAll()) return;
  
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/department/signup", department);
      toast.success("Department registered successfully!");
      navigate("/signin/department");
    } catch (error) {
      console.error("Signup Error:", error.response?.data);
  
      const errMsg = error.response?.data?.error?.toLowerCase();
      if (errMsg && errMsg.includes("email") && errMsg.includes("exist")) {
        setErrors((prev) => ({ ...prev, email: "Email already exists." }));
      } else {
        toast.error(error.response?.data?.error || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-start pt-8 pb-8 justify-center bg-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden my-auto"
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <FiShield className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold">Register Department</h2>
          <p className="mt-2 opacity-90">Create an account for your government department</p>
        </div>

        <form onSubmit={handleSignup} className="p-8 space-y-6">
          {/* Department Name */}
          <div>
            <label className="block text-gray-700 mb-2">Department Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Ministry of..."
                value={department.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-200`}
                required
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="department@example.com"
                value={department.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-200`}
                required
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Jurisdiction */}
          <div>
            <label className="block text-gray-700 mb-2">Jurisdiction</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="text-gray-400" />
              </div>
              <input
                type="text"
                name="jurisdiction"
                placeholder="City, State or National"
                value={department.jurisdiction}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.jurisdiction ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-200`}
                required
              />
            </div>
            {errors.jurisdiction && (
              <p className="text-red-500 text-sm mt-1">{errors.jurisdiction}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={department.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-200`}
                required
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200"
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
                Registering...
              </>
            ) : (
              "Register Department"
            )}
          </button>
        </form>

        <div className="px-8 pb-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="/signin/department"
              className="text-purple-600 font-medium hover:underline transition duration-200"
            >
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DepartmentSignup;
