import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const TabsFilter = ({ activeTab, setActiveTab, searchTerm, setSearchTerm }) => (
  <motion.div 
    className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 mb-6 border border-gray-100"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "pending" ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "approved" ? 'bg-white shadow text-green-600' : 'text-gray-600 hover:text-gray-800'}`}
        >
          Approved
        </button>
        <button
          onClick={() => setActiveTab("rejected")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "rejected" ? 'bg-white shadow text-red-600' : 'text-gray-600 hover:text-gray-800'}`}
        >
          Rejected
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "all" ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
        >
          All Users
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export default TabsFilter;
