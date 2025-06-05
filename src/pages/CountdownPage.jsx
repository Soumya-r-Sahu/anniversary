import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingBubbles from '../components/effects/FloatingBubbles';
import globalConfig from '../config/globalConfig';

const CountdownPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const targetDate = new Date(globalConfig.importantDates.anniversary);

    if (isNaN(targetDate)) {
      console.error('Invalid target date');
      return;
    }

    const updateCountdown = () => {
      const now = Date.now(); // Use Date.now() for better performance
      const distance = targetDate - now;

      if (distance < 0) {
        setIsComplete(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', () => clearInterval(interval));
    };
  }, []);

  const handleComplete = () => {
    // Redirect to anniversary page after celebration
    setTimeout(() => {
      navigate('/anniversary');
    }, 5000);
  };

  useEffect(() => {
    if (isComplete) {
      handleComplete();
    }
  }, [isComplete]);

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <FloatingBubbles count={30} />
        <div className="text-center z-10">
          <h1 className="text-6xl font-dancing gradient-text mb-8 animate-bounce">
            🎉 Happy Anniversary! 🎉
          </h1>
          <p className="text-2xl text-pink-600 mb-4">
            The day has finally arrived!
          </p>
          <p className="text-lg text-gray-600">
            Redirecting to anniversary page in 5 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <FloatingBubbles />
      
      <div className="text-center max-w-4xl mx-auto z-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-4 font-dancing">
            Counting Down to Forever 💕
          </h1>
          <p className="text-xl md:text-2xl text-pink-700 font-dancing">
            Our love story continues...
          </p>
        </div>

        {/* Countdown Display */}
        <div className="glassmorphism p-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white/20 rounded-xl">
              <div className="text-4xl md:text-5xl font-bold gradient-text animate-pulse">
                {timeLeft.days}
              </div>
              <div className="text-pink-600 font-semibold uppercase tracking-wide text-sm">
                Days
              </div>
            </div>
            
            <div className="text-center p-4 bg-white/20 rounded-xl">
              <div className="text-4xl md:text-5xl font-bold gradient-text animate-pulse">
                {timeLeft.hours}
              </div>
              <div className="text-pink-600 font-semibold uppercase tracking-wide text-sm">
                Hours
              </div>
            </div>
            
            <div className="text-center p-4 bg-white/20 rounded-xl">
              <div className="text-4xl md:text-5xl font-bold gradient-text animate-pulse">
                {timeLeft.minutes}
              </div>
              <div className="text-pink-600 font-semibold uppercase tracking-wide text-sm">
                Minutes
              </div>
            </div>
            
            <div className="text-center p-4 bg-white/20 rounded-xl">
              <div className="text-4xl md:text-5xl font-bold gradient-text animate-pulse">
                {timeLeft.seconds}
              </div>
              <div className="text-pink-600 font-semibold uppercase tracking-wide text-sm">
                Seconds
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="glassmorphism rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-dancing text-pink-600 mb-4">
            Until Our Next Special Moment
          </h2>
          <div className="text-lg text-gray-700 leading-relaxed">
            <TypewriterText />
          </div>
        </div>
      </div>
    </div>
  );
};

const TypewriterText = () => {
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const messages = [
    "Every second ⏳ draws us closer to our day 💑",
    "Time slows 🕰️ when love ❤️ is near",
    "Each moment ⌛ counts on the way to forever ♾️",
    "Our hearts 💓 beat with the countdown ⏰",
  ];

  useEffect(() => {
    const currentMessage = messages[currentIndex];
    let timeout;

    if (!isDeleting && text === currentMessage) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    } else {
      const nextText = isDeleting
        ? currentMessage.substring(0, text.length - 1)
        : currentMessage.substring(0, text.length + 1);

      timeout = setTimeout(() => setText(nextText), isDeleting ? 30 : 50);
    }

    return () => clearTimeout(timeout);
  }, [text, currentIndex, isDeleting, messages]);

  return (
    <span className="border-r-2 border-pink-500 animate-pulse">
      {text}
    </span>
  );
};

export default CountdownPage;
