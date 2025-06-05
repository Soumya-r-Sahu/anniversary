import React from 'react';
import { Link } from 'react-router-dom';
import FloatingBubbles from '../components/effects/FloatingBubbles';

const LoveStoryPage = () => {
  return (
    <div className="min-h-screen relative px-4 py-8">
      <FloatingBubbles />
      
      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4 font-dancing">
            📖 Our Love Story 📖
          </h1>
          <p className="text-xl text-pink-700 font-dancing">
            The beautiful journey of Jerry & Soumya
          </p>
        </div>

        <div className="glassmorphism rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-dancing text-pink-600 mb-6 text-center">
            Coming Soon! 🚧
          </h2>
          <p className="text-lg text-gray-700 text-center mb-6">
            This page is being crafted with love to tell our beautiful story.
            Check back soon for the complete timeline of our journey together!
          </p>
          
          <div className="text-center">
            <Link 
              to="/"
              className="inline-block bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoveStoryPage;
