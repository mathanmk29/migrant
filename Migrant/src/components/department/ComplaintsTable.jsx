import React from 'react';
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";

const ComplaintsTable = ({ complaints, setSelectedComplaint, getStatusColor, handleStatusUpdate }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {complaints.map((complaint) => (
              <motion.tr 
                key={complaint._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                className="cursor-pointer"
                onClick={() => setSelectedComplaint(complaint)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {complaint.userId?.firstName} {complaint.userId?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{complaint.userId?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 line-clamp-2">
                    {complaint.complaintText}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-purple-600">
                    {complaint.category}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(complaint.categoryConfidence * 100).toFixed(2)}% confidence
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(complaint._id, "Solving");
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Mark as Solving
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(complaint._id, "Solved");
                    }}
                    className="text-green-600 hover:text-green-900"
                  >
                    Mark as Solved
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintsTable;
