import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    
    const handleCanPlay = () => {
      // Auto-play is restricted, so we'll wait for user interaction
    };

    audio.addEventListener('canplay', handleCanPlay);
    
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Audio play failed:', error);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors"
      >
        🎵
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="glassmorphism p-4 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition-colors"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <span className="text-sm">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-pink-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Minimize Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ➖
          </button>
        </div>

        {/* Song Info */}
        <div className="mt-2 text-xs text-gray-600 text-center">
          🎵 Our Love Song
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/assets/music/Arijitsingh.m4a" type="audio/mp4" />
        <source src="/assets/music/Arijitsingh.m4a" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MusicPlayer;
