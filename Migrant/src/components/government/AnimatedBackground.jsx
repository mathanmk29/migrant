import React from "react";
import { motion } from "framer-motion";

// Helper function to generate random number between min and max
const random = (min, max) => Math.random() * (max - min) + min;

const AnimatedBackground = () => {
  // Generate background elements
  const circles = [...Array(6)].map((_, i) => ({
    id: `circle-${i}`,
    width: random(150, 400),
    height: random(150, 400),
    top: random(-10, 110),
    left: random(-10, 110),
    duration: random(20, 40),
    delay: random(0, 5),
    opacity: random(0.04, 0.08),
    type: 'circle',
    color: i % 3 === 0 ? 'blue' : i % 3 === 1 ? 'indigo' : 'purple'
  }));

  const squares = [...Array(4)].map((_, i) => ({
    id: `square-${i}`,
    width: random(100, 300),
    height: random(100, 300),
    top: random(-5, 105),
    left: random(-5, 105),
    duration: random(25, 45),
    delay: random(0, 5),
    opacity: random(0.03, 0.06),
    type: 'square',
    color: i % 2 === 0 ? 'blue' : 'cyan'
  }));
  
  const elements = [...circles, ...squares];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute ${
            element.type === 'circle' 
              ? 'rounded-full' 
              : 'rounded-3xl rotate-12'
          } ${
            element.color === 'blue' 
              ? 'bg-blue-100' 
              : element.color === 'indigo'
              ? 'bg-indigo-100'
              : element.color === 'purple'
              ? 'bg-purple-100'
              : 'bg-cyan-100'
          }`}
          style={{
            width: element.width + 'px',
            height: element.height + 'px',
            top: element.top + '%',
            left: element.left + '%',
            opacity: element.opacity,
          }}
          initial={{
            scale: 0.8,
            opacity: 0,
          }}
          animate={{
            y: [0, random(-100, 100)],
            x: [0, random(-100, 100)],
            rotate: element.type === 'square' ? [15, random(-15, 45)] : 0,
            opacity: [element.opacity, element.opacity * 2, element.opacity],
            scale: [1, random(0.85, 1.15), 1],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
