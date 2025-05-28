import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import "./EnhancedCountdown.scss";

interface CountdownProps {
  targetDate: Date;
  onComplete?: () => void;
  onMilestone?: (timeLeft: number) => void;
  showBubbles?: boolean;
  showCrackers?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const EnhancedCountdown: React.FC<CountdownProps> = ({
  targetDate,
  onComplete,
  onMilestone,
  showBubbles = true,
  showCrackers = true,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  const [showMiniCrackers, setShowMiniCrackers] = useState(false);
  const countdownRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLDivElement>(null);
  const crackersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        onComplete?.();
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const total = Math.floor(distance / 1000);

      setTimeLeft({ days, hours, minutes, seconds, total });

      // Trigger mini crackers in last 10 seconds
      if (total <= 10 && total > 0 && showCrackers) {
        setShowMiniCrackers(true);
        createMiniCrackers();
      } else if (total > 10) {
        setShowMiniCrackers(false);
      }

      // Milestone callback
      onMilestone?.(total);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete, onMilestone, showCrackers]);

  // Create floating bubbles
  useEffect(() => {
    if (!showBubbles || !bubblesRef.current) return;

    const createBubble = () => {
      const bubble = document.createElement("div");
      bubble.className = "countdown-bubble";
      bubble.style.left = Math.random() * 100 + "%";
      bubble.style.animationDelay = Math.random() * 2 + "s";
      bubble.style.animationDuration = Math.random() * 3 + 2 + "s";
      bubblesRef.current?.appendChild(bubble);

      // Remove bubble after animation
      setTimeout(() => {
        bubble.remove();
      }, 5000);
    };

    const bubbleInterval = setInterval(createBubble, 800);

    return () => clearInterval(bubbleInterval);
  }, [showBubbles]);

  const createMiniCrackers = () => {
    if (!crackersRef.current) return;

    const crackerEmojis = ["✨", "🎆", "🎇", "💥", "⭐", "🌟", "💫"];

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const cracker = document.createElement("div");
        cracker.className = "mini-cracker";
        cracker.textContent =
          crackerEmojis[Math.floor(Math.random() * crackerEmojis.length)];
        cracker.style.left = Math.random() * 100 + "%";
        cracker.style.top = Math.random() * 100 + "%";
        crackersRef.current?.appendChild(cracker);

        gsap.to(cracker, {
          scale: 2,
          opacity: 0,
          rotation: Math.random() * 360,
          duration: 1,
          ease: "power2.out",
          onComplete: () => cracker.remove(),
        });
      }, i * 200);
    }
  };

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  const getUrgencyClass = (): string => {
    if (timeLeft.total <= 10) return "urgent-final";
    if (timeLeft.total <= 60) return "urgent-minute";
    if (timeLeft.total <= 3600) return "urgent-hour";
    if (timeLeft.days === 0) return "urgent-day";
    return "";
  };

  return (
    <motion.div
      ref={countdownRef}
      className={`enhanced-countdown ${getUrgencyClass()}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Floating bubbles */}
      {showBubbles && <div ref={bubblesRef} className="bubbles-background" />}

      {/* Mini crackers for last 10 seconds */}
      {showMiniCrackers && (
        <div ref={crackersRef} className="crackers-container" />
      )}

      {/* Countdown display */}
      <div className="countdown-grid">
        {/* Days */}
        <motion.div
          className="countdown-unit"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="countdown-number">{formatNumber(timeLeft.days)}</div>
          <div className="countdown-label">Days</div>
          <div className="countdown-sparkle">✨</div>
        </motion.div>

        {/* Hours */}
        <motion.div
          className="countdown-unit"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="countdown-number">{formatNumber(timeLeft.hours)}</div>
          <div className="countdown-label">Hours</div>
          <div className="countdown-sparkle">💫</div>
        </motion.div>

        {/* Minutes */}
        <motion.div
          className="countdown-unit"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="countdown-number">
            {formatNumber(timeLeft.minutes)}
          </div>
          <div className="countdown-label">Minutes</div>
          <div className="countdown-sparkle">⭐</div>
        </motion.div>

        {/* Seconds */}
        <motion.div
          className="countdown-unit seconds"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          animate={{
            scale: timeLeft.total <= 10 ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: timeLeft.total <= 10 ? Infinity : 0,
          }}
        >
          <div className="countdown-number">
            {formatNumber(timeLeft.seconds)}
          </div>
          <div className="countdown-label">Seconds</div>
          <div className="countdown-sparkle">🌟</div>
        </motion.div>
      </div>

      {/* Urgency message */}
      {timeLeft.total <= 10 && timeLeft.total > 0 && (
        <motion.div
          className="urgency-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>🎉 Almost there! Get ready! 🎉</h3>
        </motion.div>
      )}

      {/* Progress bar */}
      <div className="countdown-progress">
        <div
          className="progress-fill"
          style={{
            width: `${Math.max(0, 100 - (timeLeft.total / (24 * 60 * 60)) * 100)}%`,
          }}
        />
      </div>
    </motion.div>
  );
};

export default EnhancedCountdown;
