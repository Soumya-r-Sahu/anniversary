import React from "react";
import { motion } from "framer-motion";
import { Container, Row, Col } from "react-bootstrap";

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen d-flex align-items-center justify-content-center min-vh-100">
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={6}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="loading-content"
            >
              {" "}
              {/* Animated Bubbles */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="loading-bubbles mb-4"
              >
                <span className="fs-1">🫧</span>
              </motion.div>
              {/* Loading Text */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="loading-title text-gradient-romantic fw-bold mb-3"
              >
                Preparing Something Special...
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="loading-subtitle text-muted"
              >
                Loading our beautiful anniversary website
              </motion.p>
              {/* Loading Progress */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 2 }}
                className="loading-progress-container mt-4"
              >
                <div className="loading-progress-bar"></div>
              </motion.div>{" "}
              {/* Floating Bubbles */}
              {[...Array(6)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 50,
                    x: (index - 3) * 40,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -50,
                    x: (index - 3) * 40 + Math.sin(index) * 20,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: "easeOut",
                  }}
                  className="floating-bubble-loader"
                  style={{
                    position: "absolute",
                    fontSize: "1.5rem",
                    left: "50%",
                    top: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  🫧
                </motion.div>
              ))}
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoadingScreen;
