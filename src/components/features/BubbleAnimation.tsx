import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface BubbleAnimationProps {
  bubbleCount?: number;
  colors?: string[];
  animationType?: "floating" | "burst" | "celebration";
  className?: string;
  style?: React.CSSProperties;
  size?: "small" | "medium" | "large";
  intensity?: "low" | "medium" | "high";
}

const BubbleAnimation: React.FC<BubbleAnimationProps> = ({
  bubbleCount = 15,
  colors = ["#ff6b9d", "#4ecdc4", "#a8e6cf", "#ffd93d"],
  animationType = "floating",
  className = "",
  style = {},
  size = "medium",
  intensity = "medium",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use the existing UnifiedBubbleAnimation system
    if (window.BackgroundComponents?.bubbleAnimation) {
      const bubbleSystem = window.BackgroundComponents.bubbleAnimation;

      // Configure bubble system based on props
      const bubbleConfig = {
        enableFloatingBubbles:
          animationType === "floating" || animationType === "celebration",
        enableRandomBubbles: animationType === "celebration",
        enableBurstBubbles: animationType === "burst",
        bubbleCount: bubbleCount,
        colors: colors,
        size: size,
        intensity: intensity,
      };

      // Apply configuration
      bubbleSystem.config = { ...bubbleSystem.config, ...bubbleConfig };

      // Start appropriate animations
      if (animationType === "floating") {
        bubbleSystem.startFloatingBubbles();
      } else if (animationType === "celebration") {
        bubbleSystem.startFloatingBubbles();
        bubbleSystem.startRandomBubbles();
      } else if (animationType === "burst" && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        bubbleSystem.createBubbleBurst(centerX, centerY, bubbleCount);
      }
    }

    return () => {
      // Cleanup if needed
      if (window.BackgroundComponents?.bubbleAnimation) {
        // Stop animations when component unmounts
        window.BackgroundComponents.bubbleAnimation.stopAnimations?.();
      }
    };
  }, [bubbleCount, colors, animationType, size, intensity]);

  // Generate inline bubbles for React-controlled animations
  const generateBubbles = () => {
    return Array.from({ length: Math.min(bubbleCount, 8) }, (_, index) => (
      <motion.div
        key={index}
        className="react-bubble"
        initial={{
          scale: 0,
          opacity: 0,
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50,
        }}
        animate={{
          scale: [0, 1.2, 0.8, 1],
          opacity: [0, 1, 0.8, 0],
          x: [
            Math.random() * 100 - 50,
            Math.random() * 200 - 100,
            Math.random() * 300 - 150,
          ],
          y: [
            Math.random() * 100 - 50,
            -Math.random() * 150 - 50,
            -Math.random() * 300 - 100,
          ],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          delay: index * 0.2,
          repeat: animationType === "floating" ? Infinity : 0,
          repeatDelay: 2,
          ease: "easeOut",
        }}
        style={{
          position: "absolute",
          width: getBubbleSize(),
          height: getBubbleSize(),
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), ${colors[index % colors.length]})`,
          border: "1px solid rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(2px)",
          boxShadow: `inset 0 0 10px rgba(255, 255, 255, 0.3), 0 0 15px ${colors[index % colors.length]}40`,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
    ));
  };

  const getBubbleSize = () => {
    const baseSize = size === "small" ? 15 : size === "medium" ? 25 : 35;
    return `${baseSize + Math.random() * 10}px`;
  };

  return (
    <div
      ref={containerRef}
      className={`bubble-animation-container ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5,
        overflow: "hidden",
        ...style,
      }}
    >
      {generateBubbles()}
    </div>
  );
};

export default BubbleAnimation;
