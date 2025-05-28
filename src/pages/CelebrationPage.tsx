import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Row, Col, Card, Modal } from "react-bootstrap";
import { gsap } from "gsap";
import { toast } from "react-hot-toast";

// Stores
import { useThemeStore } from "@store/themeStore";
import { useMusicStore } from "@store/musicStore";
import { useWorkflowStore } from "@store/workflowStore";

// Components
import ParticleSystem from "@components/features/ParticleSystem";
import BubbleAnimation from "@components/features/BubbleAnimation";
import TypewriterEffect from "@components/features/TypewriterEffect";
import WorkflowNavigation from "@components/common/WorkflowNavigation";
import BubbleButton from "@components/common/BubbleButton";

interface CelebrationEffect {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  intensity: "mild" | "medium" | "intense";
}

const CelebrationPage: React.FC = () => {
  const { theme, config } = useThemeStore();
  const { playSong, isPlaying, playlist } = useMusicStore();
  const { completeStep } = useWorkflowStore();
  const [isPartying, setIsPartying] = useState(false);
  const [activeEffects, setActiveEffects] = useState<Set<string>>(new Set());
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");

  const celebrationRef = useRef<HTMLDivElement>(null);
  const fireworksRef = useRef<HTMLCanvasElement>(null);
  // Complete the final step when celebrations start
  useEffect(() => {
    if (isPartying) {
      completeStep("fireworks");

      // Show celebration toast message after a delay
      setTimeout(() => {
        toast.success(
          "🎉 Congratulations! You've completed our love journey! 🎉",
          {
            duration: 5000,
            style: { background: config.primaryColor, color: "white" },
          },
        );
      }, 3000);
    }
  }, [isPartying, completeStep, config.primaryColor]);

  // Celebration effects
  const celebrationEffects: CelebrationEffect[] = [
    {
      id: "fireworks",
      name: "Fireworks",
      emoji: "🎆",
      description: "Spectacular fireworks display!",
      color: "#ff6b9d",
      intensity: "intense",
    },
    {
      id: "confetti",
      name: "Confetti",
      emoji: "🎊",
      description: "Colorful confetti shower!",
      color: "#f8b500",
      intensity: "medium",
    },
    {
      id: "bubbles",
      name: "Bubble Rain",
      emoji: "🫧",
      description: "Magical bubble shower!",
      color: "#c44569",
      intensity: "mild",
    },
    {
      id: "sparkles",
      name: "Sparkles",
      emoji: "✨",
      description: "Magical sparkle effects!",
      color: "#a55eea",
      intensity: "medium",
    },
    {
      id: "balloons",
      name: "Balloons",
      emoji: "🎈",
      description: "Floating celebration balloons!",
      color: "#ff6348",
      intensity: "mild",
    },
    {
      id: "stars",
      name: "Shooting Stars",
      emoji: "🌟",
      description: "Magical shooting stars!",
      color: "#feca57",
      intensity: "intense",
    },
  ];

  // Special celebration messages
  const celebrationMessages = [
    "🎉 Happy Anniversary! Here's to many more years of love! 🎉",
    "💕 Celebrating the most beautiful love story! 💕",
    "🌟 Two hearts, one soul, endless love! 🌟",
    "🎊 Love wins! Today and always! 🎊",
    "💖 Together we create magic! 💖",
    "🎆 Our love lights up the sky! 🎆",
  ];

  // Initialize celebration
  useEffect(() => {
    if (celebrationRef.current) {
      gsap.fromTo(
        celebrationRef.current.children,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
      );
    }
  }, []);

  // Start mega celebration
  const startMegaCelebration = () => {
    setIsPartying(true);

    // Activate all effects
    setActiveEffects(new Set(celebrationEffects.map((effect) => effect.id)));

    // Show celebration message
    const randomMessage =
      celebrationMessages[
        Math.floor(Math.random() * celebrationMessages.length)
      ];
    setCelebrationMessage(randomMessage);
    setShowCelebrationModal(true); // Play celebration music
    if (isPlaying && playlist?.songs && playlist.songs.length > 0) {
      playSong(playlist.songs[0]); // Play first song as celebration anthem
    }
    // Start all effects
    startFireworks();
    startConfetti();
    startBubbleRain();
    startSparkles();
    startBalloons();
    startShootingStars();

    // Create screen flash
    createScreenFlash();

    // Toast notification
    toast.success("🎉🎊 MEGA CELEBRATION ACTIVATED! 🎊🎉", {
      duration: 5000,
      style: {
        background: "linear-gradient(45deg, #ff6b9d, #f8b500)",
        color: "white",
        fontSize: "1.2rem",
      },
    });

    // Auto-stop after 10 seconds
    setTimeout(() => {
      stopAllCelebrations();
    }, 10000);
  };

  // Stop all celebrations
  const stopAllCelebrations = () => {
    setIsPartying(false);
    setActiveEffects(new Set());

    // Clear all animation intervals
    document
      .querySelectorAll(".celebration-element")
      .forEach((el) => el.remove());
  };

  // Individual effect functions
  const startFireworks = () => {
    if (!fireworksRef.current) return;

    const canvas = fireworksRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks: any[] = [];
    const particles: any[] = [];

    const createFirework = () => {
      const firework = {
        x: Math.random() * canvas.width,
        y: canvas.height,
        targetX: Math.random() * canvas.width,
        targetY: Math.random() * canvas.height * 0.6,
        speed: 5 + Math.random() * 3,
        color: ["#ff6b9d", "#f8b500", "#c44569", "#ff6348"][
          Math.floor(Math.random() * 4)
        ],
      };
      fireworks.push(firework);
    };

    const explode = (firework: any) => {
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: firework.targetX,
          y: firework.targetY,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          color: firework.color,
          life: 30 + Math.random() * 20,
        });
      }
    };

    const animate = () => {
      if (!activeEffects.has("fireworks")) return;

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        const dx = fw.targetX - fw.x;
        const dy = fw.targetY - fw.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < fw.speed) {
          explode(fw);
          fireworks.splice(i, 1);
        } else {
          fw.x += (dx / distance) * fw.speed;
          fw.y += (dy / distance) * fw.speed;

          ctx.fillStyle = fw.color;
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life / 50;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      if (Math.random() < 0.1) createFirework();
      requestAnimationFrame(animate);
    };

    animate();
  };

  const startConfetti = () => {
    const confettiContainer = document.createElement("div");
    confettiContainer.className = "celebration-element confetti-container";
    confettiContainer.style.position = "fixed";
    confettiContainer.style.top = "0";
    confettiContainer.style.left = "0";
    confettiContainer.style.width = "100vw";
    confettiContainer.style.height = "100vh";
    confettiContainer.style.pointerEvents = "none";
    confettiContainer.style.zIndex = "1000";
    document.body.appendChild(confettiContainer);

    const colors = ["#ff6b9d", "#f8b500", "#c44569", "#ff6348", "#a55eea"];

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = "10px";
      confetti.style.height = "10px";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = "-10px";
      confettiContainer.appendChild(confetti);

      gsap.to(confetti, {
        y: window.innerHeight + 20,
        rotation: Math.random() * 360,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 2,
        ease: "none",
      });
    }
  };
  const startBubbleRain = () => {
    const bubbles = ["🫧", "💙", "💚", "💜", "🤍", "🩵"];
    const bubbleContainer = document.createElement("div");
    bubbleContainer.className = "celebration-element bubble-rain";
    bubbleContainer.style.position = "fixed";
    bubbleContainer.style.top = "0";
    bubbleContainer.style.left = "0";
    bubbleContainer.style.width = "100vw";
    bubbleContainer.style.height = "100vh";
    bubbleContainer.style.pointerEvents = "none";
    bubbleContainer.style.zIndex = "998";
    document.body.appendChild(bubbleContainer);

    for (let i = 0; i < 50; i++) {
      const bubble = document.createElement("div");
      bubble.textContent = bubbles[Math.floor(Math.random() * bubbles.length)];
      bubble.style.position = "absolute";
      bubble.style.fontSize = `${1 + Math.random()}rem`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.top = "-50px";
      bubble.style.opacity = "0.8";
      bubbleContainer.appendChild(bubble);

      gsap.to(bubble, {
        y: window.innerHeight + 50,
        rotation: 360,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 3,
        ease: "none",
      });
    }
  };

  const startSparkles = () => {
    const sparkleContainer = document.createElement("div");
    sparkleContainer.className = "celebration-element sparkles";
    sparkleContainer.style.position = "fixed";
    sparkleContainer.style.top = "0";
    sparkleContainer.style.left = "0";
    sparkleContainer.style.width = "100vw";
    sparkleContainer.style.height = "100vh";
    sparkleContainer.style.pointerEvents = "none";
    sparkleContainer.style.zIndex = "997";
    document.body.appendChild(sparkleContainer);

    for (let i = 0; i < 30; i++) {
      const sparkle = document.createElement("div");
      sparkle.textContent = "✨";
      sparkle.style.position = "absolute";
      sparkle.style.fontSize = "1.5rem";
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkleContainer.appendChild(sparkle);
      gsap.to(sparkle, {
        scale: 2,
        rotation: 360,
        opacity: 1,
        duration: 1,
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 4,
        ease: "power2.inOut",
      });
    }
  };

  const startBalloons = () => {
    const balloons = ["🎈", "🎀", "🎁"];
    const balloonContainer = document.createElement("div");
    balloonContainer.className = "celebration-element balloons";
    balloonContainer.style.position = "fixed";
    balloonContainer.style.bottom = "0";
    balloonContainer.style.left = "0";
    balloonContainer.style.width = "100vw";
    balloonContainer.style.height = "100vh";
    balloonContainer.style.pointerEvents = "none";
    balloonContainer.style.zIndex = "996";
    document.body.appendChild(balloonContainer);

    for (let i = 0; i < 20; i++) {
      const balloon = document.createElement("div");
      balloon.textContent =
        balloons[Math.floor(Math.random() * balloons.length)];
      balloon.style.position = "absolute";
      balloon.style.fontSize = "2rem";
      balloon.style.left = `${Math.random() * 100}%`;
      balloon.style.bottom = "-50px";
      balloonContainer.appendChild(balloon);

      gsap.to(balloon, {
        y: -(window.innerHeight + 100),
        x: `+=${(Math.random() - 0.5) * 200}`,
        rotation: (Math.random() - 0.5) * 180,
        duration: 4 + Math.random() * 2,
        delay: Math.random() * 2,
        ease: "power1.out",
      });
    }
  };

  const startShootingStars = () => {
    const starContainer = document.createElement("div");
    starContainer.className = "celebration-element shooting-stars";
    starContainer.style.position = "fixed";
    starContainer.style.top = "0";
    starContainer.style.left = "0";
    starContainer.style.width = "100vw";
    starContainer.style.height = "100vh";
    starContainer.style.pointerEvents = "none";
    starContainer.style.zIndex = "995";
    document.body.appendChild(starContainer);

    for (let i = 0; i < 15; i++) {
      const star = document.createElement("div");
      star.textContent = "🌟";
      star.style.position = "absolute";
      star.style.fontSize = "1.5rem";
      star.style.left = "-50px";
      star.style.top = `${Math.random() * 50}%`;
      starContainer.appendChild(star);

      gsap.to(star, {
        x: window.innerWidth + 100,
        y: `+=${Math.random() * 200}`,
        duration: 1.5 + Math.random(),
        delay: Math.random() * 3,
        ease: "power2.out",
      });
    }
  };

  const createScreenFlash = () => {
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.top = "0";
    flash.style.left = "0";
    flash.style.width = "100vw";
    flash.style.height = "100vh";
    flash.style.background =
      "linear-gradient(45deg, #ff6b9d, #f8b500, #c44569)";
    flash.style.zIndex = "9999";
    flash.style.pointerEvents = "none";
    document.body.appendChild(flash);

    gsap.fromTo(
      flash,
      { opacity: 0 },
      {
        opacity: 0.7,
        duration: 0.2,
        yoyo: true,
        repeat: 3,
        onComplete: () => flash.remove(),
      },
    );
  };

  // Handle individual effect toggle
  const toggleEffect = (effectId: string) => {
    const newActiveEffects = new Set(activeEffects);

    if (newActiveEffects.has(effectId)) {
      newActiveEffects.delete(effectId);
    } else {
      newActiveEffects.add(effectId);
      // Start the specific effect
      switch (effectId) {
        case "fireworks":
          startFireworks();
          break;
        case "confetti":
          startConfetti();
          break;
        case "bubbles":
          startBubbleRain();
          break;
        case "sparkles":
          startSparkles();
          break;
        case "balloons":
          startBalloons();
          break;
        case "stars":
          startShootingStars();
          break;
      }
      if (isPlaying && playlist?.songs && playlist.songs.length > 1) {
        playSong(playlist.songs[1]); // Play second song for effects
      }
    }

    setActiveEffects(newActiveEffects);
  };
  return (
    <div
      className="celebration-page"
      style={{ backgroundColor: `${config.primaryColor}05` }}
    >
      <ParticleSystem
        particleCount={theme === "romantic" ? 150 : 80}
        color={config.primaryColor}
      />

      {/* Background Canvas for Effects */}
      <canvas
        ref={fireworksRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <Container fluid className="celebration-container py-5">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-5"
        >
          <h1 className="display-2 mb-4" style={{ color: config.primaryColor }}>
            🎉 Celebration Time! 🎊
          </h1>{" "}
          <TypewriterEffect
            texts={[
              "Let's celebrate our amazing love! 💕",
              "Every day with you is a celebration! 🎈",
              "Love wins, today and always! 🌟",
              "Creating magical moments together! ✨",
            ]}
            style={{
              fontSize: "1.5rem",
              color: config.primaryColor,
              minHeight: "2rem",
            }}
          />
        </motion.div>
        {/* Main Celebration Button */}
        <motion.div
          className="text-center mb-5"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {" "}
          <BubbleButton
            size="lg"
            variant="gradient"
            onClick={startMegaCelebration}
            disabled={isPartying}
            style={{
              fontSize: "1.5rem",
              padding: "15px 40px",
              background: "linear-gradient(45deg, #ff6b9d, #f8b500)",
              border: "none",
              borderRadius: "50px",
              boxShadow: "0 10px 20px rgba(255, 107, 157, 0.3)",
            }}
          >
            {isPartying
              ? "🎉 CELEBRATING! 🎉"
              : "🎊 START MEGA CELEBRATION! 🎊"}
          </BubbleButton>
        </motion.div>
        {/* Individual Effects */}
        <Row ref={celebrationRef} className="g-4 mb-5">
          {celebrationEffects.map((effect) => (
            <Col key={effect.id} lg={4} md={6}>
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  className={`celebration-effect-card h-100 ${activeEffects.has(effect.id) ? "active" : ""}`}
                  style={{
                    borderColor: effect.color,
                    borderWidth: activeEffects.has(effect.id) ? "3px" : "1px",
                    backgroundColor: `${effect.color}15`,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => toggleEffect(effect.id)}
                >
                  <Card.Body className="text-center">
                    <motion.div
                      style={{ fontSize: "3rem", marginBottom: "1rem" }}
                      animate={
                        activeEffects.has(effect.id)
                          ? {
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, -10, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration: 1,
                        repeat: activeEffects.has(effect.id) ? Infinity : 0,
                      }}
                    >
                      {effect.emoji}
                    </motion.div>

                    <Card.Title style={{ color: effect.color }}>
                      {effect.name}
                    </Card.Title>
                    <Card.Text style={{ color: config.primaryColor }}>
                      {effect.description}
                    </Card.Text>

                    <div className="mb-3">
                      <span
                        className={`badge bg-${effect.intensity === "intense" ? "danger" : effect.intensity === "medium" ? "warning" : "success"}`}
                      >
                        {effect.intensity}
                      </span>
                    </div>
                    <BubbleButton
                      variant={
                        activeEffects.has(effect.id) ? "primary" : "outline"
                      }
                      style={
                        activeEffects.has(effect.id)
                          ? {}
                          : {
                              borderColor: effect.color,
                              color: effect.color,
                            }
                      }
                      onClick={() => toggleEffect(effect.id)}
                    >
                      {activeEffects.has(effect.id)
                        ? "✅ Active"
                        : "🎮 Activate"}
                    </BubbleButton>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
        {/* Stop All Button */}
        {activeEffects.size > 0 && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {" "}
            <BubbleButton
              variant="secondary"
              size="lg"
              onClick={stopAllCelebrations}
            >
              🛑 Stop All Celebrations
            </BubbleButton>
          </motion.div>
        )}{" "}
        {/* Floating Bubbles */}
        <BubbleAnimation
          bubbleCount={theme === "romantic" ? 25 : 15}
          colors={[config.primaryColor, config.accentColor]}
          animationType="floating"
        />
        {/* Workflow Navigation */}
        <WorkflowNavigation currentStepId="fireworks" />
      </Container>

      {/* Celebration Modal */}
      <Modal
        show={showCelebrationModal}
        onHide={() => setShowCelebrationModal(false)}
        size="lg"
        centered
      >
        <AnimatePresence>
          {showCelebrationModal && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
              transition={{ duration: 0.5, ease: "back.out(1.7)" }}
            >
              <Modal.Header
                closeButton
                style={{
                  background: "linear-gradient(45deg, #ff6b9d, #f8b500)",
                  color: "white",
                }}
              >
                <Modal.Title>🎉 CELEBRATION ACTIVATED! 🎉</Modal.Title>
              </Modal.Header>

              <Modal.Body className="text-center py-5">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  style={{ fontSize: "3rem", marginBottom: "2rem" }}
                >
                  🎊💕🎉💖🎆
                </motion.div>

                <h4
                  style={{ color: config.primaryColor, marginBottom: "1.5rem" }}
                >
                  {celebrationMessage}
                </h4>
                <motion.p
                  style={{ fontSize: "1.2rem", color: config.primaryColor }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Enjoy the magical celebration! ✨
                </motion.p>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                <BubbleButton
                  variant="primary"
                  onClick={() => setShowCelebrationModal(false)}
                >
                  Continue Celebrating! 🎉
                </BubbleButton>
              </Modal.Footer>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </div>
  );
};

export default CelebrationPage;
