import React from 'react';
import { motion } from 'framer-motion';

export const CompassIcon = () => (
  <motion.svg
    viewBox="0 0 100 100"
    className="w-full h-full"
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    {/* Outer Circle */}
    <motion.circle
      cx="50"
      cy="50"
      r="45"
      fill="none"
      stroke="rgba(59, 130, 246, 0.5)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    
    {/* Inner Circle */}
    <motion.circle
      cx="50"
      cy="50"
      r="35"
      fill="none"
      stroke="rgba(147, 51, 234, 0.5)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
    />
    
    {/* Compass Needle */}
    <motion.g
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.path
        d="M50 20L45 50L50 80L55 50Z"
        fill="rgba(59, 130, 246, 0.8)"
      />
    </motion.g>
  </motion.svg>
);

export const ToolboxIcon = () => (
  <motion.svg
    viewBox="0 0 100 100"
    className="w-full h-full"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Toolbox Body */}
    <motion.rect
      x="20"
      y="40"
      width="60"
      height="40"
      rx="5"
      fill="rgba(59, 130, 246, 0.3)"
      stroke="rgba(59, 130, 246, 0.8)"
      strokeWidth="2"
      initial={{ pathLength: 0, y: 60 }}
      animate={{ pathLength: 1, y: 40 }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
    
    {/* Toolbox Handle */}
    <motion.path
      d="M35 40V30H65V40"
      fill="none"
      stroke="rgba(147, 51, 234, 0.8)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    />
    
    {/* Tools */}
    <motion.g
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <motion.circle cx="35" cy="55" r="3" fill="rgba(255, 255, 255, 0.8)" />
      <motion.circle cx="50" cy="55" r="3" fill="rgba(255, 255, 255, 0.8)" />
      <motion.circle cx="65" cy="55" r="3" fill="rgba(255, 255, 255, 0.8)" />
    </motion.g>
  </motion.svg>
);

export const ConstellationIcon = () => (
  <motion.svg
    viewBox="0 0 100 100"
    className="w-full h-full"
  >
    {/* Stars */}
    {[
      { x: 30, y: 30 },
      { x: 70, y: 30 },
      { x: 50, y: 50 },
      { x: 30, y: 70 },
      { x: 70, y: 70 },
    ].map((star, index) => (
      <motion.g key={index}>
        <motion.circle
          cx={star.x}
          cy={star.y}
          r="3"
          fill="rgba(255, 255, 255, 0.8)"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        />
      </motion.g>
    ))}
    
    {/* Constellation Lines */}
    <motion.path
      d="M30 30L70 30L50 50L30 70L70 70"
      stroke="rgba(59, 130, 246, 0.5)"
      strokeWidth="1"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  </motion.svg>
);

export const MountainIcon = () => (
  <motion.svg
    viewBox="0 0 100 100"
    className="w-full h-full"
  >
    {/* Mountains */}
    <motion.path
      d="M10 70L30 30L50 60L70 20L90 70H10Z"
      fill="rgba(59, 130, 246, 0.3)"
      stroke="rgba(59, 130, 246, 0.8)"
      strokeWidth="2"
      initial={{ pathLength: 0, y: 20 }}
      animate={{ pathLength: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    />
    
    {/* Snow Caps */}
    <motion.path
      d="M28 35L30 30L32 35M68 25L70 20L72 25"
      stroke="rgba(255, 255, 255, 0.8)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 1 }}
    />
  </motion.svg>
);

export const PaperPlaneIcon = () => (
  <motion.svg
    viewBox="0 0 100 100"
    className="w-full h-full"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.path
      d="M20 50L40 60L80 20L50 70L20 50Z"
      fill="rgba(59, 130, 246, 0.3)"
      stroke="rgba(59, 130, 246, 0.8)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2 }}
    />
    
    <motion.path
      d="M40 60L50 70L45 80"
      fill="none"
      stroke="rgba(147, 51, 234, 0.8)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 1 }}
    />
    
    {/* Flying Animation */}
    <motion.g
      animate={{
        x: [0, 10, 0],
        y: [0, -5, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <motion.path
        d="M75 25L85 15M70 30L80 20M65 35L75 25"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1"
      />
    </motion.g>
  </motion.svg>
); 