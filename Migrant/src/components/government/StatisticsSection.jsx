import React from "react";
import { motion } from "framer-motion";
import { FiUser, FiCheckCircle, FiClock } from "react-icons/fi";

const StatisticsSection = ({ stats }) => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ staggerChildren: 0.1, duration: 0.5 }}
    >
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-100"
        whileHover={{ y: -5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-medium text-gray-500">
              Total Agencies
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {stats.total}
            </p>
          </div>
          <div className="p-2.5 rounded-full bg-blue-100 text-blue-600">
            <FiUser className="text-xl" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-100"
        whileHover={{ y: -5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-medium text-gray-500">Verified</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.verified}
            </p>
          </div>
          <div className="p-2.5 rounded-full bg-green-100 text-green-600">
            <FiCheckCircle className="text-xl" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-100"
        whileHover={{ y: -5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-medium text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="p-2.5 rounded-full bg-yellow-100 text-yellow-600">
            <FiClock className="text-xl" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatisticsSection;
