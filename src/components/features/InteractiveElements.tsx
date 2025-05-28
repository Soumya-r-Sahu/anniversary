import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Button, Card } from "react-bootstrap";
import { useThemeStore } from "@store/themeStore";

// Global window type extension
declare global {
  interface Window {
    BackgroundComponents?: {
      bubbleAnimation?: {
        createBubbleBurst: (x: number, y: number, count: number) => void;
      };
    };
  }
}

interface InteractiveElementsProps {
  className?: string;
  style?: React.CSSProperties;
}

const InteractiveElements: React.FC<InteractiveElementsProps> = ({
  className = "",
  style = {},
}) => {
  const { config } = useThemeStore();

  const [heartClicks, setHeartClicks] = useState(0);
  const [showLoveMessage, setShowLoveMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [floatingElements, setFloatingElements] = useState<any[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const heartButtonRef = useRef<HTMLButtonElement>(null);

  // Love messages to display
  const loveMessages = [
    "💕 You make my heart skip a beat! 💕",
    "🌟 Every day with you is magical! 🌟",
    "💖 You are my sunshine! 💖",
    "🎀 Love you to the moon and back! 🎀",
    "💝 You complete me! 💝",
    "🌹 Forever and always! 🌹",
    "💞 You are my everything! 💞",
    "✨ Together we shine brighter! ✨",
  ];
  // Handle heart button click
  const handleHeartClick = (e: React.MouseEvent) => {
    const newClickCount = heartClicks + 1;
    setHeartClicks(newClickCount);

    // Create bubble burst effect
    createBubbleBurst(e.clientX, e.clientY);

    // Show love message every 5 clicks
    if (newClickCount % 5 === 0) {
      const randomMessage =
        loveMessages[Math.floor(Math.random() * loveMessages.length)];
      setCurrentMessage(randomMessage);
      setShowLoveMessage(true);

      setTimeout(() => setShowLoveMessage(false), 3000);
    }

    // Animate heart button
    if (heartButtonRef.current) {
      gsap.to(heartButtonRef.current, {
        scale: 1.3,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    }
  };
  // Create bubble burst effect (replaced heart burst)
  const createBubbleBurst = (x: number, y: number) => {
    // Use the unified bubble animation system if available
    if (window.BackgroundComponents?.bubbleAnimation) {
      window.BackgroundComponents.bubbleAnimation.createBubbleBurst(x, y, 8);
      return;
    } // Fallback bubble animation
    const bubbleColors = [
      "#ff6b9d",
      "#ec4899",
      "#ffa8cc",
      "#f472b6",
      "#f9a8d4",
      "#fbcfe8",
    ];
    const burstContainer = document.createElement("div");
    burstContainer.style.position = "fixed";
    burstContainer.style.left = `${x}px`;
    burstContainer.style.top = `${y}px`;
    burstContainer.style.pointerEvents = "none";
    burstContainer.style.zIndex = "1000";
    bubbleColors.forEach((color) => {
      const bubbleEl = document.createElement("div");
      bubbleEl.style.position = "absolute";
      bubbleEl.style.width = "20px";
      bubbleEl.style.height = "20px";
      bubbleEl.style.borderRadius = "50%";
      bubbleEl.style.background = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), ${color})`;
      bubbleEl.style.border = "1px solid rgba(255, 255, 255, 0.3)";
      bubbleEl.style.transform = "translate(-50%, -50%)";
      bubbleEl.style.boxShadow = `0 0 15px ${color}40`;
      burstContainer.appendChild(bubbleEl);
    });

    document.body.appendChild(burstContainer);

    // Animate bubbles
    gsap.fromTo(
      burstContainer.children,
      {
        scale: 0,
        rotation: 0,
        x: 0,
        y: 0,
      },
      {
        scale: 1.5,
        rotation: 360,
        x: () => (Math.random() - 0.5) * 200,
        y: () => (Math.random() - 0.5) * 200 - 50,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "power2.out",
        onComplete: () => burstContainer.remove(),
      },
    );
  };

  // Create floating love elements
  const createFloatingElement = (type: "heart" | "star" | "sparkle") => {
    const element = {
      id: Date.now() + Math.random(),
      type,
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      emoji: type === "heart" ? "💕" : type === "star" ? "⭐" : "✨",
      color: config.primaryColor,
    };

    setFloatingElements((prev) => [...prev, element]);

    // Remove element after animation
    setTimeout(() => {
      setFloatingElements((prev) => prev.filter((el) => el.id !== element.id));
    }, 4000);
  }; // Interactive kiss button
  const handleKissClick = (e: React.MouseEvent) => {
    createBubbleBurst(e.clientX, e.clientY);
    createFloatingElement("heart");
  };
  // Interactive hug button
  const handleHugClick = (e: React.MouseEvent) => {
    // Create warm glow effect
    const glow = document.createElement("div");
    glow.style.position = "fixed";
    glow.style.left = `${e.clientX - 50}px`;
    glow.style.top = `${e.clientY - 50}px`;
    glow.style.width = "100px";
    glow.style.height = "100px";
    glow.style.borderRadius = "50%";
    glow.style.backgroundColor = config.primaryColor;
    glow.style.opacity = "0.3";
    glow.style.pointerEvents = "none";
    glow.style.zIndex = "999";
    document.body.appendChild(glow);

    gsap.fromTo(
      glow,
      { scale: 0 },
      {
        scale: 3,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => glow.remove(),
      },
    );

    createFloatingElement("sparkle");
  };
  // Magic wand effect
  const handleMagicClick = (e: React.MouseEvent) => {
    const sparkles = ["✨", "⭐", "🌟", "💫"];
    const sparkleContainer = document.createElement("div");
    sparkleContainer.style.position = "fixed";
    sparkleContainer.style.left = `${e.clientX}px`;
    sparkleContainer.style.top = `${e.clientY}px`;
    sparkleContainer.style.pointerEvents = "none";
    sparkleContainer.style.zIndex = "1000";

    sparkles.forEach((sparkle) => {
      const sparkleEl = document.createElement("div");
      sparkleEl.textContent = sparkle;
      sparkleEl.style.position = "absolute";
      sparkleEl.style.fontSize = "2rem";
      sparkleEl.style.transform = "translate(-50%, -50%)";
      sparkleContainer.appendChild(sparkleEl);
    });

    document.body.appendChild(sparkleContainer);

    gsap.fromTo(
      sparkleContainer.children,
      {
        scale: 0,
        rotation: 0,
        x: 0,
        y: 0,
        opacity: 1,
      },
      {
        scale: 2,
        rotation: 720,
        x: () => (Math.random() - 0.5) * 300,
        y: () => (Math.random() - 0.5) * 300,
        opacity: 0,
        duration: 2,
        stagger: 0.2,
        ease: "power2.out",
        onComplete: () => sparkleContainer.remove(),
      },
    );

    createFloatingElement("star");
  };

  return (
    <div
      ref={containerRef}
      className={`interactive-elements ${className}`}
      style={{
        position: "relative",
        zIndex: 10,
        ...style,
      }}
    >
      {/* Interactive Buttons */}
      <div className="interactive-buttons d-flex flex-wrap justify-content-center gap-3 mb-4">
        <Button
          ref={heartButtonRef}
          variant="outline-primary"
          size="lg"
          onClick={handleHeartClick}
          style={{
            borderColor: config.primaryColor,
            color: config.primaryColor,
            fontSize: "1.5rem",
          }}
          className="interactive-btn"
        >
          💕 Click for Love ({heartClicks})
        </Button>

        <Button
          variant="outline-success"
          size="lg"
          onClick={handleKissClick}
          style={{ fontSize: "1.5rem" }}
          className="interactive-btn"
        >
          💋 Send a Kiss
        </Button>

        <Button
          variant="outline-warning"
          size="lg"
          onClick={handleHugClick}
          style={{ fontSize: "1.5rem" }}
          className="interactive-btn"
        >
          🤗 Give a Hug
        </Button>

        <Button
          variant="outline-info"
          size="lg"
          onClick={handleMagicClick}
          style={{ fontSize: "1.5rem" }}
          className="interactive-btn"
        >
          🪄 Make Magic
        </Button>
      </div>

      {/* Love Message Display */}
      <AnimatePresence>
        {showLoveMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ duration: 0.5, ease: "back.out(1.7)" }}
            className="love-message-display text-center"
          >
            <Card
              className="love-message-card mx-auto"
              style={{
                maxWidth: "400px",
                backgroundColor: config.primaryColor + "20",
                borderColor: config.primaryColor,
                borderWidth: "2px",
              }}
            >
              <Card.Body>
                <motion.h4
                  style={{ color: config.primaryColor }}
                  animate={{
                    scale: [1, 1.1, 1],
                    color: [
                      config.primaryColor,
                      config.accentColor,
                      config.primaryColor,
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  {currentMessage}
                </motion.h4>
              </Card.Body>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Elements */}
      <AnimatePresence>
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            initial={{
              x: `${element.x}%`,
              y: `${element.y}%`,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              y: "-100%",
              scale: [0, 1.5, 1, 1.2, 0],
              opacity: [0, 1, 1, 1, 0],
              rotate: [0, 180, 360],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 4,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              fontSize: "2rem",
              color: element.color,
              pointerEvents: "none",
              zIndex: 1000,
            }}
          >
            {element.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Interactive Stats */}
      <div className="interactive-stats text-center mt-4">
        <Card
          className="stats-card mx-auto"
          style={{
            maxWidth: "300px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${config.primaryColor}50`,
          }}
        >
          <Card.Body>
            <h6 style={{ color: config.primaryColor }}>💕 Love Meter 💕</h6>
            <motion.div
              className="love-meter-bar"
              style={{
                width: "100%",
                height: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  backgroundColor: config.primaryColor,
                  borderRadius: "10px",
                }}
                animate={{
                  width: `${Math.min(100, (heartClicks / 50) * 100)}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>{" "}
            <small style={{ color: config.primaryColor }}>
              {heartClicks < 10
                ? "Getting warmer... 💕"
                : heartClicks < 25
                  ? "Love is growing! 💖"
                  : heartClicks < 50
                    ? "So much love! 💗"
                    : "Love overflowing! 💝"}
            </small>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveElements;
