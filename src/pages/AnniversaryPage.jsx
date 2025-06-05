import React from 'react';
import { Link } from 'react-router-dom';
import FloatingBubbles from '../components/effects/FloatingBubbles';
import TimeCalculator from '../components/features/TimeCalculator';

const AnniversaryPage = () => {
  return (
    <div className="min-h-screen relative px-4 py-8">
      <FloatingBubbles />
      
      <div className="max-w-4xl mx-auto z-10 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold gradient-text mb-6 font-dancing leading-tight animate-float">
            💕 Happy Anniversary, My Sweet Jerry 💕
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl text-pink-700 mb-8 font-dancing leading-relaxed">
            To my dearest <span className="text-red-500 font-semibold">Pujuu (Champi)</span>, my sweet <span className="text-pink-600 font-semibold">Jerry</span> 💕
          </h2>
        </div>

        {/* Time Calculator */}
        <div className="mb-12">
          <TimeCalculator />
        </div>

        {/* Love Message */}
        <div className="glassmorphism rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-dancing text-pink-600 mb-4 text-center">
            💌 A Message From My Heart
          </h3>
          <div className="text-lg text-gray-700 leading-relaxed space-y-4">
            <p>
              My dearest Jerry, from the moment we started talking on June 16, 2024, 
              my world became brighter, warmer, and filled with endless joy. 
            </p>
            <p>
              Every day with you feels like a beautiful dream that I never want to wake up from. 
              Your sweet messages, caring nature, and the way you make me smile even on the hardest days - 
              these are the treasures I hold closest to my heart.
            </p>
            <p>
              Thank you for being my Jerry, my Pujuu, my everything. 
              Here's to many more months and years of love, laughter, and beautiful memories together.
            </p>
            <p className="text-center font-dancing text-xl text-pink-600">
              Forever yours, Mankada (Soumya) 💖
            </p>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link 
            to="/love-story" 
            className="glassmorphism p-6 rounded-xl text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-3xl mb-3">📖</div>
            <div className="font-medium text-pink-700">Our Love Story</div>
            <div className="text-sm text-gray-600 mt-1">Journey together</div>
          </Link>
          
          <Link 
            to="/photo-gallery" 
            className="glassmorphism p-6 rounded-xl text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-3xl mb-3">📸</div>
            <div className="font-medium text-pink-700">Photo Gallery</div>
            <div className="text-sm text-gray-600 mt-1">Beautiful memories</div>
          </Link>
          
          <Link 
            to="/music-playlist" 
            className="glassmorphism p-6 rounded-xl text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-3xl mb-3">🎵</div>
            <div className="font-medium text-pink-700">Our Playlist</div>
            <div className="text-sm text-gray-600 mt-1">Songs of love</div>
          </Link>
          
          <Link 
            to="/love-letters" 
            className="glassmorphism p-6 rounded-xl text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-3xl mb-3">💌</div>
            <div className="font-medium text-pink-700">Love Letters</div>
            <div className="text-sm text-gray-600 mt-1">Heartfelt words</div>
          </Link>
          
          <Link 
            to="/special-dates" 
            className="glassmorphism p-6 rounded-xl text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-3xl mb-3">📅</div>
            <div className="font-medium text-pink-700">Special Dates</div>
            <div className="text-sm text-gray-600 mt-1">Important moments</div>
          </Link>
          
          <Link 
            to="/fireworks" 
            className="glassmorphism p-6 rounded-xl text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-3xl mb-3">🎆</div>
            <div className="font-medium text-pink-700">Celebration</div>
            <div className="text-sm text-gray-600 mt-1">Fireworks show</div>
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            to="/"
            className="inline-block bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnniversaryPage;
