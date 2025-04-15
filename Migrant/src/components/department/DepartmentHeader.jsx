import React from 'react';
import { FiLogOut } from "react-icons/fi";

const DepartmentHeader = ({ departmentName, handleLogout }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{departmentName} Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage citizen complaints</p>
        </div>

        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-800 cursor-pointer transition-all duration-300 h-fit my-auto p-2 rounded-md text-white flex"
        > 
          <FiLogOut className="my-auto mr-2"/> LOGOUT
        </button>
      </div>
    </div>
  );
};

export default DepartmentHeader;
