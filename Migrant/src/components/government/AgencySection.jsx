import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiFilter, FiCheck, FiX, FiUser, FiMail, FiMapPin, FiPhone, FiCalendar, FiRefreshCw } from "react-icons/fi";

const AgencySection = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  fetchAgencies,
  agencies,
  loading,
  handleVerify,
  handleReject,
}) => {
  const [expandedAgency, setExpandedAgency] = useState(null);
  return (
    <>
      {/* Filters */}
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-100 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.1)', y: -2 }}
      >
        <div className="absolute -right-12 -top-12 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full opacity-60"></div>
        <div className="absolute -left-12 -bottom-12 w-24 h-24 bg-gradient-to-tr from-indigo-50 to-blue-50 rounded-full opacity-60"></div>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-5 space-y-4 md:space-y-0">
          <div className="flex-1 relative z-10">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 text-lg" />
            </div>
            <input
              type="text"
              placeholder="Search agencies..."
              className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-white/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all duration-300"
              aria-label="Search agencies"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && fetchAgencies()}
            />
          </div>
          <div className="relative z-10">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400 text-lg" />
            </div>
            <select
              className="appearance-none block pl-12 pr-10 py-3 border border-gray-200 rounded-lg bg-white/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all duration-300"
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Agencies</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Pending Only</option>
            </select>
          </div>
          <motion.button
            onClick={fetchAgencies}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-base font-medium relative z-10 flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiRefreshCw className="mr-2" /> Apply Filters
          </motion.button>
        </div>
      </motion.div>

      {/* Agencies List */}
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-100 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="absolute right-0 top-0 w-40 h-40 bg-gradient-to-b from-blue-50 to-transparent opacity-60 rounded-bl-full"></div>
        <h2 className="text-xl font-bold text-gray-800 p-6 border-b border-gray-100 relative z-10 flex items-center">
          Agency Listing
          <span className="ml-3 text-sm font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded-md">
            {agencies.length} total
          </span>
        </h2>
        {loading ? (
          <div className="flex justify-center items-center p-14">
            <motion.div
              className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : agencies.length === 0 ? (
          <div className="p-14 text-center relative z-10">
            <div className="mx-auto w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mb-5 shadow-inner">
              <FiUser className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">
              No agencies found
            </h3>
            <p className="text-gray-500 mt-2 text-lg">
              Try adjusting your search filters
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 relative z-10">
            <AnimatePresence>
              {agencies.map((agency) => (
                <motion.li
                  key={agency._id}
                  className="p-5 hover:bg-blue-50/30 transition-all duration-300 cursor-pointer"
                  onClick={() => setExpandedAgency(expandedAgency === agency._id ? null : agency._id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-5 md:mb-0 flex items-start space-x-5">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 shadow-md">
                          <FiUser className="text-2xl" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <a
                            href={`/agency/${agency._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-gray-800 hover:text-blue-600 hover:underline transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {agency.name}
                          </a>

                        </div>
                        <div className="flex items-center mt-1.5 text-sm text-gray-500">
                          <FiMail className="mr-2 flex-shrink-0" />
                          <span className="truncate">{agency.email}</span>
                        </div>
                        <motion.span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${
                            agency.isVerified
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {agency.isVerified ? (
                            <>
                              <FiCheck className="mr-1" />
                              Verified
                            </>
                          ) : (
                            <>
                              <FiClock className="mr-1" />
                              Pending Verification
                            </>
                          )}
                        </motion.span>
                        
                        {/* Additional Agency Info - Shown when expanded */}
                        <AnimatePresence>
                          {expandedAgency === agency._id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 space-y-2 text-sm text-gray-600 overflow-hidden"
                            >
                              <div className="flex items-center">
                                <FiMapPin className="mr-2 flex-shrink-0 text-gray-400" />
                                <span>{agency.address || '123 Agency Street, City, Country'}</span>
                              </div>
                              <div className="flex items-center">
                                <FiPhone className="mr-2 flex-shrink-0 text-gray-400" />
                                <span>{agency.phone || '+1 234 567 8900'}</span>
                              </div>
                              <div className="flex items-center">
                                <FiCalendar className="mr-2 flex-shrink-0 text-gray-400" />
                                <span>Registered on {new Date(agency.createdAt || Date.now()).toLocaleDateString()}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    {!agency.isVerified && (
                      <div className="flex space-x-3">
                        <motion.button
                          onClick={() => handleVerify(agency._id)}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiCheck className="mr-2" />
                          <span>Verify</span>
                        </motion.button>
                        <motion.button
                          onClick={() => handleReject(agency._id)}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiX className="mr-2" />
                          <span>Reject</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
    </>
  );
};

export default AgencySection;
