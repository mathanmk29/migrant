import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <motion.div
      className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

export default LoadingSpinner;
