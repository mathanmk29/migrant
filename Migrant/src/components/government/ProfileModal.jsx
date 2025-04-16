import { motion } from "framer-motion";
import { FiX, FiMail, FiMapPin, FiTag, FiUser, FiGrid } from "react-icons/fi";

const ProfileModal = ({ isOpen, onClose, governmentData }) => {
  console.log("Profile Modal Props:", { isOpen, governmentData });
  
  // Only check isOpen
  if (!isOpen) return null;
  
  // No need for default data now as it comes from the backend

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6 max-h-[90vh] overflow-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>

        {/* Profile header */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
            {governmentData?.name ? governmentData.name.charAt(0).toUpperCase() : "G"}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{governmentData?.name || "Government Department"}</h2>
        </div>

        {/* Profile details */}
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FiUser className="text-blue-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-800">{governmentData?.name || "Not Available"}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FiMail className="text-blue-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{governmentData?.email || "Not Available"}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FiGrid className="text-blue-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-gray-500">Division</p>
              <p className="font-medium text-gray-800">{governmentData?.division || "Administrative"}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FiMapPin className="text-blue-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-800">{governmentData?.location || "Government Complex, Capital City"}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Government Official
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;
