import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiCheck, FiX } from "react-icons/fi";

const UserDetailModal = ({ selectedRequest, activeTab, onClose, onUpdate }) => (
  <AnimatePresence>
    {selectedRequest && (
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-3">
                  <FiUser className="h-6 w-6" />
                </div>
                <h2 className="ml-3 text-xl font-bold">
                  {selectedRequest.firstName} {selectedRequest.lastName}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors duration-200"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-indigo-100">
              {activeTab === "pending" ? "Verification Request" : 
               selectedRequest.agencyVerified ? "Approved Migrant" : "Rejected Application"}
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500">Date of Birth</p>
                    <p className="font-medium">{new Date(selectedRequest.dob).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Gender</p>
                    <p className="font-medium">{selectedRequest.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Mobile</p>
                    <p className="font-medium">{selectedRequest.mobile}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Address Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500">Permanent Address</p>
                    <p className="font-medium">{selectedRequest.permanentAddress}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Address</p>
                    <p className="font-medium">{selectedRequest.currentAddress}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Occupation Type</p>
                  <p className="font-medium">{selectedRequest.occupationType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Work Location</p>
                  <p className="font-medium">{selectedRequest.workLocation}</p>
                </div>
              </div>
            </div>
            
            {activeTab === "pending" && (
              <div className="flex justify-end space-x-4 pt-6">
                <motion.button
                  onClick={() => onUpdate(selectedRequest._id, false)}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiX className="mr-2" />
                  Decline
                </motion.button>
                <motion.button
                  onClick={() => onUpdate(selectedRequest._id, true)}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiCheck className="mr-2" />
                  Approve
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default UserDetailModal;
