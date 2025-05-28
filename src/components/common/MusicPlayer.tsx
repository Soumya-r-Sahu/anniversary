import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
} from "lucide-react";
import { useMusicStore } from "../../store/musicStore";
import toast from "react-hot-toast";

interface MusicPlayerProps {
  className?: string;
  size?: "small" | "medium" | "large";
  showControls?: boolean;
  autoPlay?: boolean;
}

interface Song {
  title: string;
  artist: string;
  src: string;
  cover?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  className = "",
  size = "medium",
  showControls = true,
  autoPlay = false,
}) => {
  const { isPlaying, volume, setIsPlaying, setVolume } = useMusicStore();
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Playlist of romantic songs
  const playlist: Song[] = [
    {
      title: "Our Song",
      artist: "Anniversary Special",
      src: "/music/romantic1.mp3",
    },
    {
      title: "Love Story",
      artist: "Together Forever",
      src: "/music/romantic2.mp3",
    },
    {
      title: "Always & Forever",
      artist: "Our Hearts",
      src: "/music/romantic3.mp3",
    },
  ];

  // Size configurations
  const sizeConfig = {
    small: {
      player: "width: 50px; height: 50px;",
      controls: "gap: 8px; padding: 8px;",
      button: "width: 32px; height: 32px; font-size: 14px;",
      slider: "width: 60px; height: 4px;",
    },
    medium: {
      player: "width: 60px; height: 60px;",
      controls: "gap: 12px; padding: 12px;",
      button: "width: 40px; height: 40px; font-size: 16px;",
      slider: "width: 80px; height: 6px;",
    },
    large: {
      player: "width: 80px; height: 80px;",
      controls: "gap: 16px; padding: 16px;",
      button: "width: 50px; height: 50px; font-size: 20px;",
      slider: "width: 120px; height: 8px;",
    },
  };

  const currentSize = sizeConfig[size];

  // Initialize audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleEnded = () => {
      nextTrack();
    };

    const handleError = (e: any) => {
      console.warn("Audio load error:", e);
      toast.error("Failed to load music");
    };

    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    // Set initial volume
    audio.volume = volume;

    return () => {
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [currentTrack, volume]);

  // Handle play/pause state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying && userInteracted) {
      audio.play().catch((error) => {
        console.warn("Audio play failed:", error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, isLoaded, userInteracted, setIsPlaying]);

  // Auto-play handling
  useEffect(() => {
    if (autoPlay && isLoaded && userInteracted) {
      setIsPlaying(true);
    }
  }, [autoPlay, isLoaded, userInteracted, setIsPlaying]);

  const handlePlayPause = () => {
    if (!userInteracted) {
      setUserInteracted(true);
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`music-player ${className}`}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: "25px",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255, 182, 193, 0.3)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={playlist[currentTrack]?.src}
        preload="metadata"
        loop={false}
      />

      {/* Main Play Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePlayPause}
        className="main-play-button"
        style={{
          ...parseStyleString(currentSize.player),
          background: isPlaying
            ? "linear-gradient(135deg, #ec4899, #f472b6, #fb7185)"
            : "linear-gradient(135deg, #6b7280, #9ca3af)",
          border: "none",
          borderRadius: "50%",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
        }}
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="pause"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Pause
                size={size === "small" ? 16 : size === "medium" ? 20 : 24}
              />
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Play
                size={size === "small" ? 16 : size === "medium" ? 20 : 24}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music Visualizer */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="music-visualizer"
              style={{
                position: "absolute",
                bottom: "8px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "2px",
                alignItems: "end",
              }}
            >
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: ["4px", "12px", "4px"],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: "2px",
                    background: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "1px",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Extended Controls */}
      <AnimatePresence>
        {showControls && isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="extended-controls"
            style={{
              position: "absolute",
              right: "100%",
              top: "50%",
              transform: "translateY(-50%)",
              marginRight: "12px",
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              ...parseStyleString(currentSize.controls),
              display: "flex",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 182, 193, 0.2)",
            }}
          >
            {/* Previous Track */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTrack}
              style={{
                ...parseStyleString(currentSize.button),
                background: "transparent",
                border: "none",
                color: "#6b7280",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <SkipBack
                size={size === "small" ? 12 : size === "medium" ? 16 : 20}
              />
            </motion.button>

            {/* Progress Bar */}
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              style={{
                ...parseStyleString(currentSize.slider),
                background: "#e5e7eb",
                borderRadius: "4px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.1 }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #ec4899, #f472b6)",
                  borderRadius: "4px",
                }}
              />
            </div>

            {/* Next Track */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTrack}
              style={{
                ...parseStyleString(currentSize.button),
                background: "transparent",
                border: "none",
                color: "#6b7280",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <SkipForward
                size={size === "small" ? 12 : size === "medium" ? 16 : 20}
              />
            </motion.button>

            {/* Volume Control */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "4px",
                }}
              >
                {volume > 0 ? (
                  <Volume2
                    size={size === "small" ? 12 : size === "medium" ? 14 : 16}
                  />
                ) : (
                  <VolumeX
                    size={size === "small" ? 12 : size === "medium" ? 14 : 16}
                  />
                )}
              </motion.button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                style={{
                  width: "60px",
                  height: "4px",
                  background: "#e5e7eb",
                  borderRadius: "2px",
                  outline: "none",
                  cursor: "pointer",
                }}
              />
            </div>

            {/* Track Info */}
            <div
              style={{
                fontSize: "10px",
                color: "#6b7280",
                textAlign: "center",
                minWidth: "60px",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "2px" }}>
                {playlist[currentTrack]?.title}
              </div>
              <div>
                {formatTime(progress)} / {formatTime(duration)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper function to parse style string into object
const parseStyleString = (styleString: string): React.CSSProperties => {
  const styleObj: React.CSSProperties = {};
  styleString.split(";").forEach((rule) => {
    const [property, value] = rule.split(":").map((s) => s.trim());
    if (property && value) {
      const camelProperty = property.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );
      styleObj[camelProperty as keyof React.CSSProperties] = value as any;
    }
  });
  return styleObj;
};

export default MusicPlayer;
