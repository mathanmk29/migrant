import { motion } from "framer-motion";
import { FiUser, FiMail } from "react-icons/fi";

const UserCard = ({ user, activeTab, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity:.0, scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    whileHover={{ y: -5 }}
    className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md overflow-hidden cursor-pointer border border-gray-100"
    onClick={() => onClick(user)}
  >
    <div className="p-5">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600">
            <FiUser className="text-xl" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {user.firstName} {user.lastName}
          </h3>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <FiMail className="mr-1.5 flex-shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              activeTab === "pending" ? 'bg-yellow-100 text-yellow-800' :
              user.agencyVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {activeTab === "pending" ? 'Pending' : user.agencyVerified ? 'Approved' : 'Rejected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default UserCard;
