import React from 'react';
import { motion } from 'framer-motion';
import { 
  CompassIcon, 
  ToolboxIcon, 
  ConstellationIcon, 
  MountainIcon, 
  PaperPlaneIcon 
} from './icons/AnimatedIcons';
import BackgroundScene from './BackgroundScene';

const Section = ({ children, className = "" }) => (
  <motion.section 
    className={`min-h-screen flex items-center justify-center p-8 ${className}`}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
  >
    {children}
  </motion.section>
);

const PortfolioSection = () => {
  return (
    <motion.div className="relative">
      <BackgroundScene />
      
      <div className="relative z-10">
        {/* Introduction Section */}
        <Section>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", duration: 1.5 }}
              className="w-32 h-32 mx-auto mb-8"
            >
              <CompassIcon />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Hello, I'm [Your Name]
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-300 mb-8"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              A passionate developer crafting digital experiences
            </motion.p>
          </div>
        </Section>

        {/* Projects Section */}
        <Section className="bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="w-24 h-24 mx-auto mb-8"
            >
              <ToolboxIcon />
            </motion.div>
            
            <motion.h2 
              className="text-4xl font-bold text-white text-center mb-12"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
            >
              Featured Projects
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Project cards here */}
            </div>
          </div>
        </Section>

        {/* Skills Section */}
        <Section>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="w-24 h-24 mx-auto mb-8"
            >
              <ConstellationIcon />
            </motion.div>
            
            <motion.h2 
              className="text-4xl font-bold text-white text-center mb-12"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
            >
              Skills & Expertise
            </motion.h2>

            {/* Add skill visualization */}
          </div>
        </Section>

        {/* Experience Section */}
        <Section className="bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="w-24 h-24 mx-auto mb-8"
            >
              <MountainIcon />
            </motion.div>
            
            <motion.h2 
              className="text-4xl font-bold text-white text-center mb-12"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
            >
              Experience
            </motion.h2>

            {/* Add timeline or experience cards */}
          </div>
        </Section>

        {/* Contact Section */}
        <Section>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="w-24 h-24 mx-auto mb-8"
            >
              <PaperPlaneIcon />
            </motion.div>
            
            <motion.h2 
              className="text-4xl font-bold text-white mb-12"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
            >
              Let's Connect
            </motion.h2>

            {/* Add contact form or links */}
          </div>
        </Section>
      </div>
    </motion.div>
  );
};

export default PortfolioSection;