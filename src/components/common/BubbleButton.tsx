import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button as BootstrapButton, ButtonProps } from "react-bootstrap";
import { gsap } from "gsap";
import "./BubbleButton.scss";

interface BubbleButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  bubbleEffect?: boolean;
  glowEffect?: boolean;
  heartBurst?: boolean;
  variant?: "primary" | "secondary" | "romantic" | "gradient" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const BubbleButton: React.FC<BubbleButtonProps> = ({
  onClick,
  bubbleEffect = true,
  glowEffect = true,
  heartBurst = false,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  children,
  className = "",
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bubblesRef = useRef<HTMLDivElement>(null);

  const createBubbles = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!bubbleEffect || !bubblesRef.current) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create multiple bubbles
    for (let i = 0; i < 8; i++) {
      const bubble = document.createElement("div");
      bubble.className = "bubble-particle";
      bubble.style.left = `${x}px`;
      bubble.style.top = `${y}px`;
      bubblesRef.current.appendChild(bubble);

      gsap.to(bubble, {
        x: (Math.random() - 0.5) * 100,
        y: -Math.random() * 80 - 20,
        opacity: 0,
        scale: Math.random() * 0.8 + 0.2,
        duration: 1.5 + Math.random() * 0.5,
        ease: "power2.out",
        onComplete: () => bubble.remove(),
      });
    }
  };

  const createHeartBurst = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!heartBurst || !bubblesRef.current) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create heart particles
    const hearts = ["💖", "💕", "💓", "💗", "❤️", "💝"];

    for (let i = 0; i < 6; i++) {
      const heart = document.createElement("div");
      heart.className = "heart-particle";
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      bubblesRef.current.appendChild(heart);

      gsap.to(heart, {
        x: (Math.random() - 0.5) * 120,
        y: -Math.random() * 100 - 30,
        opacity: 0,
        scale: 0.5,
        rotation: Math.random() * 360,
        duration: 2 + Math.random() * 0.5,
        ease: "power2.out",
        onComplete: () => heart.remove(),
      });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    // Create effects
    createBubbles(e);
    if (heartBurst) {
      createHeartBurst(e);
    }

    // Button press animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }

    onClick?.(e);
  };

  useEffect(() => {
    // Glow effect animation
    if (glowEffect && buttonRef.current) {
      gsap.to(buttonRef.current, {
        boxShadow: "0 0 20px rgba(255, 107, 157, 0.6)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, [glowEffect]);

  const buttonClasses = [
    "bubble-button",
    `bubble-button--${variant}`,
    `bubble-button--${size}`,
    glowEffect && "bubble-button--glow",
    isPressed && "bubble-button--pressed",
    loading && "bubble-button--loading",
    disabled && "bubble-button--disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className="bubble-button-wrapper"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <BootstrapButton
        ref={buttonRef}
        className={buttonClasses}
        onClick={handleClick}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}

        {/* Bubble container */}
        <div ref={bubblesRef} className="bubbles-container" />

        {/* Ripple effect */}
        <div className="ripple-effect" />
      </BootstrapButton>
    </motion.div>
  );
};

export default BubbleButton;
