import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";

const Header = ({ handleLogout }) => (
  <motion.header 
    className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm mb-6"
    initial={{ y: -50 }}
    animate={{ y: 0 }}
    transition={{ type: 'spring' }}
  >
    <div className="p-4 sm:p-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Agency Verification Portal</h1>
        <p className="text-gray-600">Manage migrant verification requests</p>
      </div>
      <motion.button
        onClick={handleLogout}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg shadow hover:shadow-md transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiLogOut />
        <span>Logout</span>
      </motion.button>
    </div>
  </motion.header>
);

export default Header;
