import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Heart, Clock, Camera, Users, Music, Sparkles } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const footerItems = [
    { icon: Heart, text: "Made with Love", color: "#ff6b9d" },
    { icon: Clock, text: "Every Moment Counts", color: "#ec4899" },
    { icon: Camera, text: "Capturing Memories", color: "#db2777" },
    { icon: Users, text: "Together Forever", color: "#be185d" },
    { icon: Music, text: "Our Song", color: "#9d174d" },
    { icon: Sparkles, text: "Magical Moments", color: "#831843" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-r from-pink-100 via-red-50 to-rose-100 py-8 mt-auto ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 240, 245, 0.9), rgba(254, 242, 242, 0.9), rgba(255, 228, 230, 0.9))",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255, 182, 193, 0.3)",
      }}
    >
      <Container>
        <Row>
          <Col md={8} className="mx-auto text-center">
            {/* Love Quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4"
            >
              <p className="text-gray-600 font-script text-lg leading-relaxed">
                "In all the world, there is no heart for me like yours. In all
                the world, there is no love for you like mine."
              </p>
              <small className="text-gray-500">— Maya Angelou</small>
            </motion.div>
            {/* Footer Icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="d-flex flex-wrap justify-content-center align-items-center gap-4 mb-4"
            >
              {footerItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                  whileHover={{
                    scale: 1.1,
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                  className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    border: "1px solid rgba(255, 182, 193, 0.3)",
                    cursor: "default",
                  }}
                >
                  <item.icon size={18} style={{ color: item.color }} />
                  <span className="text-gray-700 small font-medium">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
            {/* Anniversary Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mb-4"
            >
              <div
                className="d-inline-block px-4 py-2 rounded-pill"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(255, 168, 204, 0.1))",
                  border: "2px solid rgba(255, 107, 157, 0.2)",
                }}
              >
                <span className="text-pink-600 font-weight-bold">
                  💕 Our Love Story Continues... 💕
                </span>
              </div>
            </motion.div>
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-gray-500 small mb-0">
                © {currentYear} Our Anniversary Website • Built with 💖 for Our
                Special Day
              </p>
            </motion.div>{" "}
            {/* Floating Bubbles */}
            <div className="position-relative">
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -30,
                    x: Math.sin(index) * 20,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 1,
                    ease: "easeOut",
                  }}
                  className="position-absolute"
                  style={{
                    left: `${30 + index * 20}%`,
                    bottom: "20px",
                    fontSize: "1.2rem",
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                >
                  🫧
                </motion.div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </motion.footer>
  );
};

export default Footer;
