import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectCard3D = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden preserve-3d"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
        z: 50,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      {/* Glowing effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
          />
        )}
      </AnimatePresence>

      <div className="relative aspect-video overflow-hidden">
        <motion.img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 0.8 }}
        />
        
        {/* Floating tech badges */}
        <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end">
          {project.technologies.map((tech, index) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm text-blue-400 rounded-full text-sm
                         border border-blue-500/20"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>

      <motion.div 
        className="relative p-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.h3 
          className="text-xl font-bold text-white mb-2"
          layoutId={`title-${project.id}`}
        >
          {project.title}
        </motion.h3>
        <motion.p 
          className="text-gray-400 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {project.description}
        </motion.p>

        <div className="flex justify-between items-center">
          <motion.a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Live Demo</span>
            <motion.svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ x: isHovered ? 5 : 0 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </motion.svg>
          </motion.a>
          
          <motion.a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View Code</span>
            <motion.svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.7 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </motion.svg>
          </motion.a>
        </div>

        {/* Interactive corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/30" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/30" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/30" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/30" />
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard3D;