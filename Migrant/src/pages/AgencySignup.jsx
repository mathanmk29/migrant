import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiMapPin, FiFileText } from "react-icons/fi";
import { toast } from "react-toastify";
import Header from "../components/Header";

const AgencySignup = () => {
  const [agency, setAgency] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    location: "",
    licenseNumber: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    licenseNumber: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const departments = [
    "Immigration",
    "Housing",
    "Employment",
    "Healthcare",
    "Education",
    "Legal",
    "Other"
  ];

  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(name)) {
      return "Name should not contain numbers or special characters";
    }
    return "";
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validateLocation = (location) => {
    const regex = /^[a-zA-Z\s,]*$/;
    if (!regex.test(location)) {
      return "Location should not contain special characters";
    }
    return "";
  };

  const validateLicense = (license) => {
    const regex = /^\d{10}$/;
    if (!regex.test(license)) {
      return "License number must be exactly 10 digits";
    }
    return "";
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      return "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
    }
    return "";
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateName(agency.name);
    const emailError = validateEmail(agency.email);
    const locationError = validateLocation(agency.location);
    const licenseError = validateLicense(agency.licenseNumber);
    const passwordError = validatePassword(agency.password);
    
    if (nameError || emailError || locationError || licenseError || passwordError) {
      setErrors({
        name: nameError,
        email: emailError,
        location: locationError,
        licenseNumber: licenseError,
        password: passwordError
      });
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/agency/signup", agency);
      toast.success("Agency registered successfully! Awaiting admin verification.");
      navigate("/signin/agency");
    } catch (error) {
      if (error.response?.data?.error?.includes("email")) {
        setErrors(prev => ({ ...prev, email: "Email already exists" }));
      } else if (error.response?.data?.error?.includes("License number")) {
        setErrors(prev => ({ ...prev, licenseNumber: "License number already in use" }));
      } else {
        toast.error(error.response?.data?.error || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    setAgency((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    switch (name) {
      case "name":
        setErrors(prev => ({ ...prev, name: validateName(value) }));
        break;
      case "email":
        setErrors(prev => ({ ...prev, email: validateEmail(value) }));
        break;
      case "location":
        setErrors(prev => ({ ...prev, location: validateLocation(value) }));
        break;
      case "licenseNumber":
        setErrors(prev => ({ ...prev, licenseNumber: validateLicense(value) }));
        break;
      case "password":
        setErrors(prev => ({ ...prev, password: validatePassword(value) }));
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
      <div className="flex-grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-center text-white">
              <h1 className="text-4xl font-bold">Agency Registration</h1>
              <p className="mt-3 text-lg opacity-90">
                Register your government department account
              </p>
            </div>

            <form onSubmit={handleSignup} className="p-10 space-y-7">
              {/* Agency Name */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Agency Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={agency.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-12 pr-4 py-3 text-lg border ${errors.name ? "border-red-300" : "border-gray-300"} rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="e.g. Department of Immigration"
                    required
                  />
                </div>
                {errors.name && <p className="mt-2 text-base text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Official Email
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={agency.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-12 pr-4 py-3 text-lg border ${errors.email ? "border-red-300" : "border-gray-300"} rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="agency@government.org"
                    required
                  />
                </div>
                {errors.email && <p className="mt-2 text-base text-red-600">{errors.email}</p>}
              </div>

              {/* Department */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={agency.department}
                  onChange={handleChange}
                  className="block w-full pl-4 pr-10 py-3 text-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={agency.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-12 pr-4 py-3 text-lg border ${errors.location ? "border-red-300" : "border-gray-300"} rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="City, State"
                    required
                  />
                </div>
                {errors.location && <p className="mt-2 text-base text-red-600">{errors.location}</p>}
              </div>

              {/* License Number */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Government License Number
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFileText className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={agency.licenseNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength="10"
                    className={`block w-full pl-12 pr-4 py-3 text-lg border ${errors.licenseNumber ? "border-red-300" : "border-gray-300"} rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="10 digit number"
                    required
                  />
                </div>
                {errors.licenseNumber ? (
                  <p className="mt-2 text-base text-red-600">{errors.licenseNumber}</p>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    Must be a 10-digit government-issued license number
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={agency.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-12 pr-4 py-3 text-lg border ${errors.password ? "border-red-300" : "border-gray-300"} rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Minimum 8 characters"
                    minLength="8"
                    required
                  />
                </div>
                {errors.password && <p className="mt-2 text-base text-red-600">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                      Processing...
                    </>
                  ) : (
                    "Register Agency"
                  )}
                </button>
              </div>
            </form>

            <div className="px-10 pb-8 text-center">
              <p className="text-lg text-gray-600">
                Already have an account?{" "}
                <a
                  href="/signin/agency"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgencySignup;