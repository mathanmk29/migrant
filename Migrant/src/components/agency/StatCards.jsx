import { motion } from "framer-motion";
import { FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const StatCards = ({ stats }) => (
  <motion.div 
    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ staggerChildren: 0.1 }}
  >
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-100"
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Pending Requests</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
          <FiClock className="text-xl" />
        </div>
      </div>
    </motion.div>

    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-100"
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Approved Users</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="p-3 rounded-full bg-green-100 text-green-600">
          <FiCheckCircle className="text-xl" />
        </div>
      </div>
    </motion.div>

    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-100"
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Rejected Users</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        <div className="p-3 rounded-full bg-red-100 text-red-600">
          <FiAlertCircle className="text-xl" />
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default StatCards;
