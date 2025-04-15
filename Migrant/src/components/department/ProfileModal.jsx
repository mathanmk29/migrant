import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const ProfileModal = ({ isOpen, onClose, departmentData }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-xl shadow-lg w-full max-w-sm"
        >
          <div className="flex justify-between items-center p-5 border-b">
            <h2 className="text-xl font-bold text-gray-800">Department Profile</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="p-6">
            {departmentData ? (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-4xl font-medium">
                    {departmentData.name ? departmentData.name.charAt(0).toUpperCase() : "D"}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mt-4">
                  {departmentData.name || "Department"}
                </h3>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Department profile data not available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileModal;
