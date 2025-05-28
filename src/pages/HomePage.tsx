import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Howl } from "howler";
import { toast } from "react-hot-toast";

// Stores
import { useThemeStore } from "@store/themeStore";
import { useMusicStore } from "@store/musicStore";
import { useWorkflowStore } from "@store/workflowStore";

// Components
import TypewriterEffect from "@components/features/TypewriterEffect";
import FloatingHearts from "@components/features/FloatingHearts";
import InteractiveElements from "@components/features/InteractiveElements";
import WorkflowNavigation from "@components/common/WorkflowNavigation";
import BubbleButton from "@components/common/BubbleButton";

// Utils - Import existing JS functionality
import "../pages/index.js";

const HomePage: React.FC = () => {
  const { theme, config } = useThemeStore();
  const { playSong, isPlaying } = useMusicStore();
  const { completeStep, unlockStep } = useWorkflowStore();
  const navigate = useNavigate();
  const [userInteracted, setUserInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Integration with existing index.js functionality
  useEffect(() => {
    // Initialize existing index page functionality
    if (window.IndexPage) {
      const indexPage = new window.IndexPage();

      // Setup page-specific interactions from existing code
      const setupInteractions = () => {
        // Heart click interactions
        const heartElements = document.querySelectorAll(
          ".floating-heart, .heart-animation",
        );
        heartElements.forEach((heart: Element) => {
          const heartEl = heart as HTMLElement;
          heartEl.addEventListener("click", (e) => {
            e.preventDefault();
            createHeartBurst(e.clientX, e.clientY);
            if (!isPlaying) {
              handleFirstInteraction();
            }
          });
        });

        // Anniversary message interactions
        const messageElements = document.querySelectorAll(
          ".anniversary-message, .love-message",
        );
        messageElements.forEach((msg: Element) => {
          const msgEl = msg as HTMLElement;
          msgEl.addEventListener("click", () => {
            toast.success("💕 Sending love your way!", {
              icon: "💕",
              duration: 3000,
            });
          });
        });
      };

      setTimeout(setupInteractions, 1000);
    }
  }, [isPlaying]);

  // Handle first user interaction for music autoplay
  const handleFirstInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      // Start background music from existing music system
      if (window.UnifiedMusicManager) {
        window.UnifiedMusicManager.startBackgroundMusic();
      }
    }
  };
  // Create bubble burst effect (converted from heart burst)
  const createBubbleBurst = (x: number, y: number) => {
    const container = document.getElementById("floating-bubbles-container");
    if (!container) return;

    const bubbles = ["🫧", "💙", "💎", "✨", "🔵", "🌀", "💚", "🤍"];

    for (let i = 0; i < 12; i++) {
      const bubble = document.createElement("div");
      bubble.className = "burst-bubble";
      bubble.innerHTML = bubbles[Math.floor(Math.random() * bubbles.length)];
      bubble.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        font-size: ${Math.random() * 20 + 15}px;
        pointer-events: none;
        z-index: 1000;
        animation: bubbleBurst 2.5s ease-out forwards;
        transform: translate(-50%, -50%);
      `;

      container.appendChild(bubble);

      // Animate bubble with floating motion
      gsap.to(bubble, {
        x: (Math.random() - 0.5) * 250,
        y: -Math.random() * 200 - 60,
        opacity: 0,
        scale: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * 360,
        duration: 2.5,
        ease: "power2.out",
        onComplete: () => bubble.remove(),
      });
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className={`home-page ${theme}`}
      onClick={handleFirstInteraction}
    >
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="hero-section min-vh-100 d-flex align-items-center position-relative overflow-hidden"
      >
        <Container fluid>
          <Row className="justify-content-center text-center">
            <Col lg={10} xl={8}>
              {/* Main Title with Typewriter Effect */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="hero-content"
              >
                <h1 className="hero-title display-1 fw-bold mb-4">
                  <span className="text-gradient-romantic">
                    ❤️ For My Sweet
                  </span>
                  <br />
                  <TypewriterEffect
                    strings={[
                      "Jerry (Puja) ❤️",
                      "My Beautiful Love ❤️",
                      "My Heart's Desire ❤️",
                    ]}
                    typeSpeed={50}
                    backSpeed={30}
                    loop={true}
                  />
                </h1>
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="hero-subtitle lead fs-3 mb-5 text-muted"
                >
                  A special surprise crafted with love, featuring our beautiful
                  journey together
                </motion.p>{" "}
                {/* Interactive Buttons */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                  className="hero-actions d-flex flex-wrap gap-3 justify-content-center"
                >
                  <BubbleButton
                    variant="primary"
                    size="lg"
                    icon="⏰"
                    onClick={() => {
                      completeStep("index");
                      unlockStep("countdown");
                      navigate("/countdown");
                    }}
                    className="pulse-animation"
                  >
                    Countdown to Our Day
                  </BubbleButton>

                  <BubbleButton
                    variant="romantic"
                    size="lg"
                    icon="📖"
                    onClick={() => navigate("/timeline")}
                  >
                    Our Love Story
                  </BubbleButton>

                  <BubbleButton
                    variant="gradient"
                    size="lg"
                    icon="🎮"
                    onClick={() => navigate("/games")}
                  >
                    Play Together
                  </BubbleButton>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
        {/* Floating Hearts */}
        <FloatingHearts count={15} /> {/* Interactive Elements */}
        <InteractiveElements />
      </section>

      {/* Workflow Navigation */}
      <WorkflowNavigation currentStep="index" />

      {/* Quick Links Section */}
      <section className="quick-links-section py-5">
        <Container>
          <Row className="g-4">
            {[
              {
                to: "/photo-booth",
                icon: "📸",
                title: "Photo Booth",
                desc: "Create magical memories",
              },
              {
                to: "/love-letters",
                icon: "💌",
                title: "Love Letters",
                desc: "Read our sweet messages",
              },
              {
                to: "/celebration",
                icon: "🎉",
                title: "Celebration",
                desc: "Light up the sky!",
              },
            ].map((item, index) => (
              <Col key={index} md={4}>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 2 + index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="quick-link-card h-100"
                >
                  <Link to={item.to} className="text-decoration-none">
                    <div className="card border-0 shadow-lg h-100 bg-glass">
                      <div className="card-body text-center p-4">
                        <div className="quick-link-icon fs-1 mb-3">
                          {item.icon}
                        </div>
                        <h5 className="card-title text-romantic fw-bold">
                          {item.title}
                        </h5>
                        <p className="card-text text-muted">{item.desc}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Love Message Section */}
      <section className="love-message-section py-5 text-center">
        <Container>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="love-message-card bg-glass p-5 rounded-4 shadow-lg"
          >
            <h3 className="text-romantic fw-bold mb-4">
              💕 A Message From The Heart 💕
            </h3>
            <p className="lead">
              Every moment with you is a treasure, every day a new adventure in
              love. This website is my way of celebrating US - our journey, our
              dreams, and our future together.
            </p>{" "}
            <div className="mt-4">
              <BubbleButton
                variant="romantic"
                size="lg"
                icon="💖"
                onClick={() => {
                  createBubbleBurst(
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                  );
                  toast.success("💙 Love sent with bubbles of joy!", {
                    icon: "🫧",
                    duration: 3000,
                  });
                }}
              >
                Send Love
              </BubbleButton>
            </div>
          </motion.div>
        </Container>
      </section>
    </motion.div>
  );
};

export default HomePage;
