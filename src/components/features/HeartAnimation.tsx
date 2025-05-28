import React from "react";
import BubbleAnimation from "./BubbleAnimation";

interface HeartAnimationProps {
  heartCount?: number;
  colors?: string[];
  animationType?: "floating" | "burst" | "celebration";
  className?: string;
  style?: React.CSSProperties;
  size?: "small" | "medium" | "large";
  intensity?: "low" | "medium" | "high";
}

/**
 * HeartAnimation Component - Legacy Support
 * This component has been replaced with the new bubble animation system
 * for better performance and unified animation management.
 * Heart animations are now rendered as colorful bubbles.
 */
const HeartAnimation: React.FC<HeartAnimationProps> = ({
  heartCount = 15,
  colors = ["#ff6b9d", "#ec4899", "#db2777", "#be185d"],
  animationType = "floating",
  className = "",
  style = {},
  size = "medium",
  intensity = "medium",
}) => {
  return (
    <BubbleAnimation
      bubbleCount={heartCount}
      colors={colors}
      animationType={animationType}
      className={`heart-animation-legacy ${className}`}
      style={style}
      size={size}
      intensity={intensity}
    />
  );
};

export default HeartAnimation;
