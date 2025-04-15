import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

// Import components
import Header from "../components/agency/Header";
import BackgroundAnimation from "../components/agency/BackgroundAnimation";
import StatCards from "../components/agency/StatCards";
import TabsFilter from "../components/agency/TabsFilter";
import LoadingSpinner from "../components/agency/LoadingSpinner";
import UserGrid from "../components/agency/UserGrid";
import UserDetailModal from "../components/agency/UserDetailModal";

const AgencyDashboard = () => {
  // State
  const [requests, setRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [agencyData, setAgencyData] = useState(null);
  const navigate = useNavigate();
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    fetchAgencyData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("agencyToken");
      const [pendingRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/agency/requests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/agency/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
      setRequests(pendingRes.data);
      setAllUsers(usersRes.data);
      calculateStats(pendingRes.data, usersRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (pendingRequests, allUsers) => {
    const approved = allUsers.filter(u => u.agencyVerified === true).length;
    const rejected = allUsers.filter(u => u.agencyVerified === false).length;
    setStats({
      pending: pendingRequests.length,
      approved,
      rejected
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("agencyToken");
    navigate("/");
  };

  // Fetch agency profile data
  const fetchAgencyData = async () => {
    try {
      const token = localStorage.getItem("agencyToken");
      if (!token) {
        navigate("/");
        return;
      }
      
      // Decode JWT token to get agency ID
      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        if (!tokenData || !tokenData.agencyId) {
          toast.error("Invalid authentication data");
          navigate("/");
          return;
        }
        
        // For now, we'll get the agency data from local storage
        // In a real application, you'd make an API call to get the latest data
        // Example: const response = await axios.get(`http://localhost:5000/api/agency/profile`, { headers: { Authorization: `Bearer ${token}` } });
        
        // Check if we have agency data in localStorage from login
        const storedAgencyData = localStorage.getItem("agencyData");
        if (storedAgencyData) {
          setAgencyData(JSON.parse(storedAgencyData));
        } else {
          // Fallback if no data in localStorage - in a real app, you'd make an API call here
          setAgencyData({
            _id: tokenData.agencyId,
            name: "Your Agency",
            email: "agency@example.com",
            department: "Verification Department",
            location: "Your Location",
            licenseNumber: "ABC123",
            isVerified: true
          });
        }
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError);
        toast.error("Invalid authentication token");
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Error fetching agency data:", error);
      toast.error("Failed to load profile data");
    }
  };

  const handleUpdate = async (userId, status) => {
    try {
      await axios.post(
        "http://localhost:5000/api/agency/update-verification", 
        { userId, status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("agencyToken")}` } }
      );
      toast.success(`User ${status ? "approved" : "rejected"}`);
      
      // Update local state
      const updatedRequests = requests.filter(req => req._id !== userId);
      const updatedUser = allUsers.find(u => u._id === userId);
      if (updatedUser) {
        updatedUser.agencyVerified = status;
        setAllUsers([...allUsers]);
      }
      
      setRequests(updatedRequests);
      setSelectedRequest(null);
      calculateStats(updatedRequests, allUsers);
    } catch (error) {
      toast.error("Failed to update verification");
    }
  };

  // Filter users based on search and active tab
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "pending") return false;
    if (activeTab === "approved") return user.agencyVerified === true && matchesSearch;
    if (activeTab === "rejected") return user.agencyVerified === false && matchesSearch;
    return matchesSearch;
  });

  // Filter requests based on search
  const filteredRequests = requests.filter(request => {
    return searchTerm === "" || 
      request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Background Animation */}
      <BackgroundAnimation />

      <div className="max-w-[95%] mx-auto relative z-10">
        {/* Header */}
        <Header handleLogout={handleLogout} agencyData={agencyData} />

        {/* Statistics Cards */}
        <StatCards stats={stats} />

        {/* Tabs and Search Filter */}
        <TabsFilter 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />

        {/* Main Content */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <UserGrid 
            isLoading={isLoading}
            activeTab={activeTab}
            filteredRequests={filteredRequests}
            filteredUsers={filteredUsers}
            setSelectedRequest={setSelectedRequest}
          />
        )}

        {/* User Detail Modal */}
        <UserDetailModal 
          selectedRequest={selectedRequest} 
          activeTab={activeTab} 
          onClose={() => setSelectedRequest(null)} 
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
};

export default AgencyDashboard;