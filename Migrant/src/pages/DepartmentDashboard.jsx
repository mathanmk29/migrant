import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiPhone,
  FiHome,
  FiMapPin,
  FiBriefcase,
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiX,
  FiLogOut 
} from "react-icons/fi";
import { toast } from 'react-toastify';
import {useNavigate} from "react-router-dom" 

const DepartmentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const departmentName = localStorage.getItem("departmentName");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("deptToken");
        const res = await axios.get(`http://localhost:5000/api/department/complaints?departmentName=${departmentName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data);
      } catch (error) {
        toast.error("Failed to fetch complaints");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, [departmentName]);

  const handleStatusUpdate = async (complaintId, status) => {
    try {
      const token = localStorage.getItem("deptToken");
      await axios.post(
        "http://localhost:5000/api/department/update-status", 
        { complaintId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status updated to ${status}`);
      setComplaints(complaints.map(comp => 
        comp._id === complaintId ? { ...comp, status } : comp
      ));
      setSelectedComplaint(null);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Solving": return "bg-blue-100 text-blue-800";
      case "Solved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  const handleLogout = async () => {
    localStorage.clear("deptToken")
    navigate("/signin/department")
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between">
          <div>
          <h1 className="text-3xl font-bold text-gray-800">{departmentName} Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage citizen complaints</p>
          </div>

          <button onClick={()=> handleLogout()} className="bg-red-500 hover:bg-red-800 cursor-pointer transition-all duration-300 h-fit my-auto p-2 rounded-md text-white flex"> <FiLogOut className="my-auto mr-2"/> LOGOUT</button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="bg-purple-100 p-6 rounded-full inline-block mb-4">
              <FiAlertCircle className="text-purple-600 text-4xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Complaints Found</h3>
            <p className="text-gray-500">There are currently no complaints assigned to your department.</p>
          </div>
        ) : (
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
        )}
      </div>

      {/* Complaint Detail Modal */}
      <AnimatePresence>
        {selectedComplaint && (
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentDashboard;