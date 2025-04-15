import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGeolocated } from "react-geolocated";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiCheck, FiX, FiMapPin, FiGlobe, FiLoader } from "react-icons/fi";

const Verification = () => {
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [migrantStatus, setMigrantStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Verification, 3: Result
  const navigate = useNavigate();

  // Get user's live location
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 5000,
  });

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      if (currentStep === 1) setCurrentStep(2);
    }
  };

  const getUserState = async (latitude, longitude) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      return res.data.address.state;
    } catch (err) {
      console.error("Error fetching user state:", err);
      return null;
    }
  };

  const handleVerify = async () => {
    if (!aadharBack) {
      setError("Please upload Aadhar Back image");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setCurrentStep(3);

    const formData = new FormData();
    formData.append("file", aadharBack);

    try {
      const mlRes = await axios.post("http://127.0.0.1:8001/extract_aadhaar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extractedState = mlRes.data.State;
      console.log("ML State:", extractedState);

      if (!coords) {
        setError("Location access required for verification!");
        setIsLoading(false);
        return;
      }

      const userState = await getUserState(coords.latitude, coords.longitude);
      console.log("User's Live State:", userState);

      if (userState && extractedState && userState.toLowerCase() !== extractedState.toLowerCase()) {
        setMigrantStatus(true);
        await axios.post(
          "http://localhost:5000/api/auth/update-migrant",
          { isMigrant: true },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } else {
        setMigrantStatus(false);
      }

      // Auto navigate after showing result for 2 seconds
      setTimeout(() => {
        navigate("/home");
      }, 5000);
    } catch (err) {
      setError("Verification failed. Please try again.");
      console.error("Verification Error:", err);
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
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Verification Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-full">
              <FiGlobe className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Migrant Verification</h2>
              <p className="text-blue-100">Verify your migrant status using Aadhar documents</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6">
          <div className="flex justify-between relative">
            {/* Progress line */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0">
              <motion.div
                className="h-full bg-blue-600"
                initial={{ width: "0%" }}
                animate={{
                  width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%"
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            {/* Step 1 - Made clickable */}
            <div 
              className="flex flex-col items-center z-10 cursor-pointer"
              onClick={() => currentStep > 1 && setCurrentStep(1)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                {currentStep > 1 ? <FiCheck /> : 1}
              </div>
              <span className={`text-sm mt-2 ${currentStep >= 1 ? "text-blue-600 font-medium" : "text-gray-500"}`}>Upload</span>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                {currentStep > 2 ? <FiCheck /> : 2}
              </div>
              <span className={`text-sm mt-2 ${currentStep >= 2 ? "text-blue-600 font-medium" : "text-gray-500"}`}>Verify</span>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                3
              </div>
              <span className={`text-sm mt-2 ${currentStep >= 3 ? "text-blue-600 font-medium" : "text-gray-500"}`}>Result</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {error && (
            <motion.div 
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          {/* Step 1: Upload Documents */}
          <AnimatePresence>
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-800">Upload Your Documents</h3>
                <p className="text-gray-600">Please upload clear photos of your Aadhar card for verification</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
                      <FiUpload className="h-6 w-6" />
                    </div>
                    <h4 className="font-medium text-gray-800 mb-2">Aadhar Back Side</h4>
                    <p className="text-sm text-gray-500 mb-4">Photo with your address details</p>
                    <input
                      id="back"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setAadharBack)}
                      accept="image/*"
                    />
                    <motion.label
                      htmlFor="back"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Select File
                    </motion.label>
                    {aadharBack && (
                      <p className="mt-3 text-sm text-green-600 flex items-center">
                        <FiCheck className="mr-1" /> File selected
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 2: Verification */}
          <AnimatePresence>
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-800">Verify Your Location</h3>
                <p className="text-gray-600">We'll compare your Aadhar address with your current location</p>
                
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-1">
                      <FiMapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Current Location</h4>
                      {coords ? (
                        <p className="text-gray-600">Detected: {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}</p>
                      ) : (
                        <p className="text-yellow-600">Waiting for location access...</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-xl overflow-hidden">
                    {aadharFront && (
                      <img
                        src={URL.createObjectURL(aadharFront)}
                        alt="Aadhar Front Preview"
                        className="w-full h-auto"
                      />
                    )}
                  </div>
                  <div className="border rounded-xl overflow-hidden">
                    {aadharBack && (
                      <img
                        src={URL.createObjectURL(aadharBack)}
                        alt="Aadhar Back Preview"
                        className="w-full h-auto"
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    onClick={handleVerify}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-md flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading || !coords}
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="animate-spin mr-2" /> Verifying...
                      </>
                    ) : (
                      "Verify Now"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Result */}
          <AnimatePresence>
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-10"
              >
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <FiLoader className="animate-spin h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800">Verifying Your Details</h3>
                    <p className="text-gray-600">This may take a few moments...</p>
                  </div>
                ) : migrantStatus ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <FiCheck className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Migrant Status Verified</h3>
                    <p className="text-gray-600 mb-6">You have been identified as a migrant worker</p>
                    <div className="bg-green-50 rounded-lg p-4 text-green-800 max-w-md">
                      <p>You now have access to migrant-specific services and support programs.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                      <FiGlobe className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Your not Verified as Migrant</h3>
                    <p className="text-gray-600 mb-6">Your current location matches your Aadhar address</p>
                    <div className="bg-blue-50 rounded-lg p-4 text-blue-800 max-w-md">
                      <p>You can still access general services available in your area.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Verification;