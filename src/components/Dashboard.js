import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackgroundScene from './BackgroundScene';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <BackgroundScene />
      
      {/* Top Bar */}
      <div className="relative z-10 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-white font-bold">
                  {currentUser?.email?.[0]?.toUpperCase()}
                </span>
              </motion.div>
              <div>
                <h1 className="text-white font-bold">Welcome back</h1>
                <p className="text-gray-400 text-sm">{currentUser?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/20 transition-colors"
              >
                + New Project
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Quick Actions */}
            <motion.div 
              className="grid grid-cols-3 gap-4"
              variants={itemVariants}
            >
              {[
                { title: 'Active Projects', value: '12', icon: '📊' },
                { title: 'Total Views', value: '1,234', icon: '👁️' },
                { title: 'Profile Score', value: '92%', icon: '⭐' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(31, 41, 55, 0.7)" }}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                  <p className="text-white text-xl font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Recent Projects */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl text-white font-bold">Recent Projects</h2>
                <button className="text-blue-400 hover:text-blue-300">View All</button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((project) => (
                  <motion.div
                    key={project}
                    className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors cursor-pointer"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-medium">Project {project}</h3>
                        <p className="text-gray-400 text-sm">Last updated 2h ago</p>
                      </div>
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Profile Completion */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              variants={itemVariants}
            >
              <h2 className="text-xl text-white font-bold mb-4">Profile Completion</h2>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-400 bg-blue-500/20">
                      In Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-400">
                      80%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-700">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "80%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
              <ul className="space-y-2 mt-4">
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✓</span> Basic Information
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✓</span> Portfolio Projects
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">○</span> Skills & Experience
                </li>
              </ul>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              variants={itemVariants}
            >
              <h2 className="text-xl text-white font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { text: "Updated portfolio description", time: "2h ago", color: "blue" },
                  { text: "Added new project", time: "5h ago", color: "green" },
                  { text: "Updated skills", time: "1d ago", color: "purple" }
                ].map((activity, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-3"
                    whileHover={{ x: 4 }}
                  >
                    <div className={`w-2 h-2 rounded-full bg-${activity.color}-400`} />
                    <div>
                      <p className="text-gray-300">{activity.text}</p>
                      <p className="text-gray-500 text-sm">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;