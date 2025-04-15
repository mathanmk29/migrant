import { useState, useEffect } from "react";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

// Import components
import DepartmentHeader from "../components/department/DepartmentHeader";
import LoadingSpinner from "../components/department/LoadingSpinner";
import EmptyState from "../components/department/EmptyState";
import ComplaintsTable from "../components/department/ComplaintsTable";
import ComplaintDetailModal from "../components/department/ComplaintDetailModal";

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
    localStorage.removeItem("deptToken")
    navigate("/signin/department")
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[95%] mx-auto">
        <DepartmentHeader departmentName={departmentName} handleLogout={handleLogout} />

        {isLoading ? (
          <LoadingSpinner />
        ) : complaints.length === 0 ? (
          <EmptyState />
        ) : (
          <ComplaintsTable 
            complaints={complaints}
            setSelectedComplaint={setSelectedComplaint}
            getStatusColor={getStatusColor}
            handleStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>

      {/* Complaint Detail Modal */}
      <AnimatePresence>
        <ComplaintDetailModal 
          selectedComplaint={selectedComplaint}
          setSelectedComplaint={setSelectedComplaint}
          getStatusColor={getStatusColor}
          handleStatusUpdate={handleStatusUpdate}
        />
      </AnimatePresence>
    </div>
  );
};

export default DepartmentDashboard;