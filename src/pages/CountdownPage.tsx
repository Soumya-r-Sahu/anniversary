import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { toast } from "react-hot-toast";

// Stores
import { useThemeStore } from "@store/themeStore";
import { useWorkflowStore } from "@store/workflowStore";

// Components
import ParticleSystem from "@components/features/ParticleSystem";
import BubbleAnimation from "@components/features/BubbleAnimation";
import EnhancedCountdown from "@components/features/EnhancedCountdown";
import WorkflowNavigation from "@components/common/WorkflowNavigation";
import BubbleButton from "@components/common/BubbleButton";

const CountdownPage: React.FC = () => {
  const { theme } = useThemeStore();
  const { completeStep } = useWorkflowStore();
  const navigate = useNavigate();

  const celebrationRef = useRef<HTMLDivElement>(null);

  // Anniversary date - June 16th, 2025
  const anniversaryDate = new Date("2025-06-16T00:00:00");

  const handleCountdownComplete = () => {
    createCelebrationAnimation();

    // Complete the countdown step
    completeStep("countdown");

    // Show completion message
    toast.success("🎉 The countdown is complete! Our anniversary is here! 🎉");

    // Auto-progress after 3 seconds
    setTimeout(() => {
      navigate("/timeline");
    }, 3000);
  };

  const handleMilestone = (timeLeft: number) => {
    // Check for milestone celebrations
    if (timeLeft === 86400) {
      // 1 day left
      triggerMilestoneCelebration("🎉 Only 1 day left! 🎉");
    } else if (timeLeft === 604800) {
      // 1 week left
      triggerMilestoneCelebration("💕 One week to go! 💕");
    } else if (timeLeft === 2592000) {
      // 1 month left
      triggerMilestoneCelebration("📅 One month until our special day! 📅");
    }
  };

  const triggerMilestoneCelebration = (message: string) => {
    toast.success(message, {
      duration: 6000,
      icon: "🎉",
    });

    // Create celebration animation
    if (celebrationRef.current) {
      gsap.to(celebrationRef.current, {
        scale: 1.1,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const createCelebrationAnimation = () => {
    if (celebrationRef.current) {
      gsap
        .timeline()
        .to(celebrationRef.current, {
          scale: 1.2,
          rotation: 360,
          duration: 1,
          ease: "power2.out",
        })
        .to(celebrationRef.current, {
          scale: 1,
          duration: 0.5,
        });
    }
  };

  const handleStepComplete = () => {
    completeStep("countdown");
    toast.success("✨ Countdown experience completed!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className={`countdown-page ${theme}`}
    >
      {/* Workflow Navigation */}
      <WorkflowNavigation
        currentStepId="countdown"
        onStepComplete={handleStepComplete}
        autoProgress={true}
        showProgress={true}
      />

      {/* Hero Section */}
      <section className="countdown-hero min-vh-100 d-flex align-items-center position-relative">
        <Container fluid>
          <Row className="justify-content-center text-center">
            <Col lg={10} xl={8}>
              {/* Title */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="countdown-header mb-5"
              >
                <h1 className="display-2 fw-bold text-gradient-romantic mb-4">
                  ⏰ Countdown to Our Special Day ❤️
                </h1>
                <p className="lead fs-4 text-muted">
                  June 16th - The day our hearts celebrate together
                </p>
              </motion.div>

              {/* Enhanced Countdown Display */}
              <motion.div
                ref={celebrationRef}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="countdown-container mb-5"
              >
                <EnhancedCountdown
                  targetDate={anniversaryDate}
                  onComplete={handleCountdownComplete}
                  onMilestone={handleMilestone}
                  showBubbles={true}
                  showCrackers={true}
                />
              </motion.div>

              {/* Interactive Elements */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="countdown-actions d-flex flex-wrap gap-3 justify-content-center"
              >
                <BubbleButton
                  variant="romantic"
                  size="lg"
                  bubbleEffect={true}
                  heartBurst={true}
                  onClick={() => {
                    toast.success("💕 Love sent to the universe! 💕");
                  }}
                >
                  💖 Send Love
                </BubbleButton>

                <BubbleButton
                  variant="gradient"
                  size="lg"
                  bubbleEffect={true}
                  onClick={() => {
                    // Share countdown
                    toast.success("💌 Countdown shared with love!");
                  }}
                >
                  📤 Share Countdown
                </BubbleButton>

                <BubbleButton
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    completeStep("countdown");
                    navigate("/timeline");
                  }}
                >
                  Continue Journey →
                </BubbleButton>
              </motion.div>
            </Col>
          </Row>
        </Container>

        {/* Background Effects */}
        <ParticleSystem
          particleCount={30}
          color={["#ff6b9d", "#c44569", "#f8b500", "#ff6348"][0]}
          shapes={["heart", "star"]}
        />

        <BubbleAnimation bubbleCount={10} />
      </section>

      {/* Memory Lane Section */}
      <section className="memory-lane-section py-5">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <h2 className="display-4 fw-bold text-gradient-romantic mb-4">
                📸 While We Wait...
              </h2>
              <p className="lead">
                Let's reminisce about our beautiful journey together
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            {/*
              { icon: '💕', title: 'Our First Date', desc: 'The day everything changed' },
              { icon: '🌟', title: 'Special Moments', desc: 'Memories that make us smile' },
              { icon: '🚀', title: 'Future Dreams', desc: 'What awaits us ahead' }
            */}
            {Array.from({ length: 3 }).map((_, index) => (
              <Col key={index} md={4}>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5 + index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  className="memory-card"
                >
                  <div className="card border-0 shadow-lg bg-glass h-100">
                    <div className="card-body text-center p-4">
                      <div className="memory-icon fs-1 mb-3">💕</div>
                      <h5 className="card-title text-romantic fw-bold">
                        Memory Title
                      </h5>
                      <p className="card-text text-muted">
                        Memory description goes here.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </motion.div>
  );
};

export default CountdownPage;
