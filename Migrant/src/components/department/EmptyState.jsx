import React from 'react';
import { FiAlertCircle } from "react-icons/fi";

const EmptyState = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <div className="bg-purple-100 p-6 rounded-full inline-block mb-4">
        <FiAlertCircle className="text-purple-600 text-4xl" />
      </div>
      <h3 className="text-xl font-medium text-gray-700 mb-2">No Complaints Found</h3>
      <p className="text-gray-500">There are currently no complaints assigned to your department.</p>
    </div>
  );
};

export default EmptyState;
