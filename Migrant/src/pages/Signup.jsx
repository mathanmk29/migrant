import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiCalendar,
  FiPhone,
  FiHome,
  FiMapPin,
  FiBriefcase,
  FiGlobe,
  FiCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";

const Signup = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    mobile: "",
    email: "",
    permanentAddress: "",
    currentAddress: "",
    occupationType: "",
    workLocation: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const occupationTypes = [
    "Government Employee",
    "Private Sector",
    "Self-Employed",
    "Student",
    "Unemployed",
    "Retired",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateMobile = (mobile) => {
    const re = /^[0-9]{10}$/;
    return re.test(mobile);
  };

  const validateDateOfBirth = (dob) => {
    if (!dob) return false;

    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 18;
  };

  const validateName = (name) => {
    const re = /^[A-Za-z\s\-']+$/;
    return re.test(name);
  };

  const validateAddress = (address) => {
    const re = /^[A-Za-z0-9\s\-,.#\/()]+$/;
    return re.test(address);
  };

  const validateWorkLocation = (location) => {
    const re = /^[A-Za-z\s\-,.]+$/;
    return re.test(location);
  };

  const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number, and one special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return re.test(password);
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!user.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (user.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (!validateName(user.firstName)) {
      newErrors.firstName = "First name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Last Name validation
    if (!user.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (user.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (!validateName(user.lastName)) {
      newErrors.lastName = "Last name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Date of Birth validation
    if (!user.dob) {
      newErrors.dob = "Date of birth is required";
    } else if (!validateDateOfBirth(user.dob)) {
      newErrors.dob = "You must be at least 18 years old";
    }

    // Gender validation
    if (!user.gender) {
      newErrors.gender = "Gender is required";
    }

    // Mobile validation
    if (!user.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!validateMobile(user.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    // Email validation
    if (!user.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(user.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Address validation
    if (!user.permanentAddress.trim()) {
      newErrors.permanentAddress = "Permanent address is required";
    } else if (user.permanentAddress.trim().length < 10) {
      newErrors.permanentAddress = "Address seems too short";
    } else if (!validateAddress(user.permanentAddress)) {
      newErrors.permanentAddress = "Address contains invalid characters";
    }

    if (!user.currentAddress.trim()) {
      newErrors.currentAddress = "Current address is required";
    } else if (user.currentAddress.trim().length < 10) {
      newErrors.currentAddress = "Address seems too short";
    } else if (!validateAddress(user.currentAddress)) {
      newErrors.currentAddress = "Address contains invalid characters";
    }

    // Occupation validation
    if (!user.occupationType) {
      newErrors.occupationType = "Occupation type is required";
    }

    // Work location validation
    if (!user.workLocation.trim()) {
      newErrors.workLocation = "Work location is required";
    } else if (!validateWorkLocation(user.workLocation)) {
      newErrors.workLocation = "Work location contains invalid characters";
    }

    // Password validation
    if (!user.password) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!validatePassword(user.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)";
    }

    // Confirm password validation
    if (!user.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
        dob: user.dob,
        gender: user.gender,
        mobile: user.mobile,
        email: user.email.trim(),
        permanentAddress: user.permanentAddress.trim(),
        currentAddress: user.currentAddress.trim(),
        occupationType: user.occupationType,
        workLocation: user.workLocation.trim(),
        password: user.password,
      });
  
      toast.success("Account created successfully!");
      navigate("/signin/migrant");
    } catch (error) {
      if (error.response?.data?.error === "Email already in use") {
        setErrors((prev) => ({
          ...prev,
          email: "Email address is already registered"
        }));
        toast.error("This email is already registered");
      } else {
        const message =
          error.response?.data?.message || "Signup failed. Please try again.";
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Form Side */}
        <div className="w-full p-6 md:p-10">
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FiUser className="h-8 w-8 text-blue-600" />
            </motion.div>
            <motion.h1
              className="text-3xl font-bold text-gray-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Create Your Account
            </motion.h1>
            <motion.p
              className="text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Please fill in all the required details
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-gray-700 mb-1">First Name*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={user.firstName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </motion.div>

              {/* Last Name */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-gray-700 mb-1">Last Name*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={user.lastName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200`}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date of Birth */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-gray-700 mb-1">
                  Date of Birth*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dob"
                    value={user.dob}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]} // Prevent future dates
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.dob ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 appearance-none`}
                  />
                </div>
                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                )}
              </motion.div>

              {/* Gender */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-gray-700 mb-1">Gender*</label>
                <select
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
              </motion.div>

              {/* Mobile Number */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-gray-700 mb-1">
                  Mobile Number*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="9876543210"
                    value={user.mobile}
                    onChange={handleChange}
                    maxLength="10"
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.mobile ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200`}
                  />
                </div>
                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                )}
              </motion.div>
            </div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-gray-700 mb-1">Email*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={user.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </motion.div>

            {/* Permanent Address */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-gray-700 mb-1">
                Permanent Address (As per Aadhaar/PAN/Voter ID)*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiHome className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="permanentAddress"
                  placeholder="Complete address as per your documents"
                  value={user.permanentAddress}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border ${
                    errors.permanentAddress
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200`}
                />
              </div>
              {errors.permanentAddress && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.permanentAddress}
                </p>
              )}
            </motion.div>

            {/* Current Address */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="block text-gray-700 mb-1">
                Current Address*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="currentAddress"
                  placeholder="Your current residential address"
                  value={user.currentAddress}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border ${
                    errors.currentAddress ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200`}
                />
              </div>
              {errors.currentAddress && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.currentAddress}
                </p>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Occupation Type */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <label className="block text-gray-700 mb-1">
                  Occupation Type*
                </label>
                <select
                  name="occupationType"
                  value={user.occupationType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.occupationType ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200`}
                >
                  <option value="">Select Occupation</option>
                  {occupationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.occupationType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.occupationType}
                  </p>
                )}
              </motion.div>

              {/* Work Location */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
              >
                <label className="block text-gray-700 mb-1">
                  Work Location*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBriefcase className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="workLocation"
                    placeholder="City or area where you work"
                    value={user.workLocation}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.workLocation ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200`}
                  />
                </div>
                {errors.workLocation && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.workLocation}
                  </p>
                )}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <label className="block text-gray-700 mb-1">Password*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={user.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 characters with at least one uppercase, one
                  lowercase, one number, and one special character (!@#$%^&*)
                </p>
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 }}
              >
                <label className="block text-gray-700 mb-1">
                  Confirm Password*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCheck className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="pt-4"
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
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
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </motion.div>
          </form>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/signin/migrant"
                className="text-blue-600 font-medium hover:underline transition duration-200"
              >
                Sign in
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;