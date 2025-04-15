import { motion } from "framer-motion";

const BackgroundAnimation = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-blue-100 rounded-full opacity-10"
        style={{
          width: Math.random() * 300 + 100 + 'px',
          height: Math.random() * 300 + 100 + 'px',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
        }}
        animate={{
          y: [0, Math.random() * 100 - 50],
          x: [0, Math.random() * 100 - 50],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: Math.random() * 20 + 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

export default BackgroundAnimation;
