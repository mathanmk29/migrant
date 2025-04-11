import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DepartmentComplaints = () => {
  const { departmentName } = useParams();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/complaints/department/${departmentName}`);
        setComplaints(res.data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    fetchComplaints();
  }, [departmentName]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">{departmentName} Complaints</h2>
      {complaints.length === 0 ? <p>No complaints found.</p> : (
        <ul className="w-full max-w-lg">
          {complaints.map((complaint) => (
            <li key={complaint._id} className="bg-gray-800 p-4 rounded-lg mb-2">
              <p><strong>User ID:</strong> {complaint.userId}</p>
              <p className="text-gray-400"><strong>Complaint:</strong> {complaint.complaintText}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DepartmentComplaints;
