import React from 'react';
import { motion } from "framer-motion";
import { FiCheck, FiClock } from "react-icons/fi";

const ComplaintDetailModal = ({ selectedComplaint, setSelectedComplaint, getStatusColor, handleStatusUpdate }) => {
  if (!selectedComplaint) return null;
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold">
            Complaint Details
          </h2>
          <p className="text-purple-100">Submitted by {selectedComplaint.userId?.firstName} {selectedComplaint.userId?.lastName}</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Complaint Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Complaint Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium text-purple-600">
                    {selectedComplaint.category} ({(selectedComplaint.categoryConfidence * 100).toFixed(2)}%)
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Keywords Found</p>
                  <p className="font-medium">
                    {selectedComplaint.keywordsFound?.join(", ") || "None"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedComplaint.status)}`}>
                    {selectedComplaint.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Complaint Text</p>
                  <p className="font-medium mt-2 bg-gray-50 p-4 rounded-lg">
                    {selectedComplaint.complaintText}
                  </p>
                </div>
              </div>
            </div>
            
            {/* User Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">User Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-medium">
                    {selectedComplaint.userId?.firstName} {selectedComplaint.userId?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{selectedComplaint.userId?.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Mobile</p>
                  <p className="font-medium">{selectedComplaint.userId?.mobile}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="font-medium">
                    {selectedComplaint.userId?.dob ? new Date(selectedComplaint.userId.dob).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Occupation</p>
                  <p className="font-medium">{selectedComplaint.userId?.occupationType}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Address Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Permanent Address</p>
                <p className="font-medium">{selectedComplaint.userId?.permanentAddress}</p>
              </div>
              <div>
                <p className="text-gray-500">Current Address</p>
                <p className="font-medium">{selectedComplaint.userId?.currentAddress}</p>
              </div>
            </div>
          </div>
          
          {/* Alternative Categories */}
          {selectedComplaint.alternativeCategories?.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Alternative Categories</h3>
              <div className="space-y-2">
                {selectedComplaint.alternativeCategories.map((alt, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium">{alt.category}</span>
                    <span className="text-purple-600">{(alt.confidence * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Close
            </button>
            <button
              onClick={() => handleStatusUpdate(selectedComplaint._id, "Pending")}
              className="px-6 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-all duration-300"
            >
              <FiClock className="inline mr-2" />
              Mark Pending
            </button>
            <button
              onClick={() => handleStatusUpdate(selectedComplaint._id, "Solving")}
              className="px-6 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all duration-300"
            >
              <FiCheck className="inline mr-2" />
              Mark Solving
            </button>
            <button
              onClick={() => handleStatusUpdate(selectedComplaint._id, "Solved")}
              className="px-6 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-all duration-300"
            >
              <FiCheck className="inline mr-2" />
              Mark Solved
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ComplaintDetailModal;
