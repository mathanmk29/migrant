import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiMail, FiCheckCircle, FiClock, FiMapPin, FiBriefcase, FiKey, FiArrowLeft
} from 'react-icons/fi';

const AgencyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const token = localStorage.getItem('governmentToken');
        const res = await axios.get(`http://localhost:5000/api/government/agencies/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setAgency(res.data.agency);
      } catch (err) {
        console.error('Error fetching agency details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-blue-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Agency not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 relative">
        <button
          onClick={() => navigate("/government-dashboard")}
          className="absolute top-4 left-4 flex items-center text-sm text-blue-600 hover:underline"
        >
          <FiArrowLeft className="mr-1" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {agency.name}
        </h1>

        <div className="space-y-4 text-gray-700 text-base">
          <div className="flex items-center">
            <FiMail className="mr-2 text-blue-500" />
            <span>{agency.email}</span>
          </div>
          <div className="flex items-center">
            <FiBriefcase className="mr-2 text-purple-500" />
            <span>Department: {agency.department}</span>
          </div>
          <div className="flex items-center">
            <FiMapPin className="mr-2 text-green-500" />
            <span>Location: {agency.location}</span>
          </div>
          <div className="flex items-center">
            <FiKey className="mr-2 text-yellow-500" />
            <span>License #: {agency.licenseNumber}</span>
          </div>
          <div className="flex items-center">
            {agency.isVerified ? (
              <>
                <FiCheckCircle className="mr-2 text-green-600" />
                <span className="text-green-700">Verified</span>
              </>
            ) : (
              <>
                <FiClock className="mr-2 text-yellow-600" />
                <span className="text-yellow-700">Pending Verification</span>
              </>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6 text-right">
          Registered on: {new Date(agency.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default AgencyDetails;
