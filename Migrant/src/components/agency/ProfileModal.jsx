import { motion } from "framer-motion";
import { FiX, FiMail, FiMapPin, FiTag, FiUser, FiGrid, FiPhone } from "react-icons/fi";

const ProfileModal = ({ isOpen, onClose, agencyData }) => {
  if (!isOpen || !agencyData) return null;

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
            {agencyData.name ? agencyData.name.charAt(0).toUpperCase() : "A"}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{agencyData.name}</h2>
        </div>

        {/* Profile details */}
          <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FiUser className="text-blue-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-800">{agencyData.name}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FiMail className="text-blue-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{agencyData.email}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FiPhone className="text-blue-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium text-gray-800">{agencyData.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FiGrid className="text-blue-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium text-gray-800">{agencyData.department}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FiMapPin className="text-blue-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-800">{agencyData.location}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FiTag className="text-blue-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-gray-500">License Number</p>
              <p className="font-medium text-gray-800">{agencyData.licenseNumber}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 text-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            agencyData.isVerified 
              ? "bg-green-100 text-green-800" 
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {agencyData.isVerified ? "Verified" : "Verification Pending"}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;
