import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!isLoading && currentUser) {
      navigate('/dashboard');
    }
  }, [isLoading, currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-2xl text-white font-semibold"
        >
          Loading...
        </motion.div>
      ) : (
        <div className="text-center">
          {currentUser ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white"
            >
              <h1 className="text-3xl font-bold mb-4">Welcome, {currentUser.email}!</h1>
              <p className="text-gray-400">Redirecting to dashboard...</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold text-white">Welcome to Your App</h1>
              <p className="text-gray-400">Please log in to continue.</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Log In
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
