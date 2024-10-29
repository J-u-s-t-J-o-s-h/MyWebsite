import React from 'react';
import { motion } from 'framer-motion';

const WaveBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-gray-900">
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${50 + index * 10}% ${50 + index * 10}%, rgba(59, 130, 246, 0.1), transparent)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: index * 2,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-900/50 to-gray-900" />
    </div>
  );
};

export default WaveBackground; 