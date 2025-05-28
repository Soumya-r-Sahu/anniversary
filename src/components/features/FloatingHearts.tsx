import React from "react";
import BubbleAnimation from "./BubbleAnimation";

interface FloatingHeartsProps {
  count?: number;
  colors?: string[];
  className?: string;
  style?: React.CSSProperties;
  size?: "small" | "medium" | "large";
  intensity?: "low" | "medium" | "high";
}

/**
 * FloatingHearts Component - Legacy Support
 * This component has been converted to use the new bubble animation system
 * for better performance and unified animation management.
 */
const FloatingHearts: React.FC<FloatingHeartsProps> = ({
  count = 15,
  colors = ["#ff6b9d", "#ec4899", "#ffa8cc", "#f472b6"],
  className = "",
  style = {},
  size = "medium",
  intensity = "medium",
}) => {
  return (
    <BubbleAnimation
      bubbleCount={count}
      colors={colors}
      animationType="floating"
      className={`floating-hearts-legacy ${className}`}
      style={style}
      size={size}
      intensity={intensity}
    />
  );
};

export default FloatingHearts;
