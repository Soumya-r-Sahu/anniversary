import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Home Page Component - Anniversary Website v4.0.0
 * Entry point that redirects to appropriate page based on anniversary date
 */
const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [daysUntil, setDaysUntil] = useState(0);
  
  useEffect(() => {
    // Calculate days until anniversary
    const calculateDaysUntil = () => {
      const now = new Date();
      const targetDate = new Date('2025-06-16T00:00:00'); // Anniversary date
      const diffTime = targetDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };
    
    const days = calculateDaysUntil();
    setDaysUntil(days);
    setLoading(false);
    
    // Redirect based on date
    const redirectTimeout = setTimeout(() => {
      const targetPage = days > 0 ? '/countdown' : '/anniversary';
      window.location.hash = targetPage;
    }, 2000);
    
    return () => clearTimeout(redirectTimeout);
  }, []);
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-md">
        <h1 className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-4 font-display">
          Jerry & Soumya
        </h1>
        
        <div className="animate-pulse my-6">
          {loading ? (
            <p className="text-lg">Loading your love story...</p>
          ) : (
            <p className="text-lg">
              {daysUntil > 0 
                ? `${daysUntil} days until your anniversary!` 
                : "It's your anniversary today!"}
            </p>
          )}
        </div>
        
        <div className="mt-8">
          <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
