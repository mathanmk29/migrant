import { motion } from "framer-motion";
import { FiUser, FiUsers } from "react-icons/fi";

const EmptyState = ({ type = "pending" }) => (
  <motion.div 
    className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-8 text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
      {type === "pending" ? (
        <FiUser className="text-gray-400 text-4xl" />
      ) : (
        <FiUsers className="text-gray-400 text-4xl" />
      )}
    </div>
    <h3 className="text-xl font-medium text-gray-700 mb-2">
      {type === "pending" ? "No Pending Requests" : "No Users Found"}
    </h3>
    <p className="text-gray-500">
      {type === "pending" 
        ? "There are currently no verification requests to review." 
        : "Try adjusting your search or filter criteria."}
    </p>
  </motion.div>
);

export default EmptyState;
