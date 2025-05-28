import React, { useEffect, useRef } from "react";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Stores
import { useThemeStore } from "@store/themeStore";
import { useMusicStore } from "@store/musicStore";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { isPlaying, toggleMusic } = useMusicStore();
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  // Navigation items
  const navItems = [
    { path: "/", label: "🏠 Home", icon: "🏠" },
    { path: "/countdown", label: "⏰ Countdown", icon: "⏰" },
    { path: "/timeline", label: "📖 Our Story", icon: "📖" },
    { path: "/games", label: "🎮 Games", icon: "🎮" },
    { path: "/photo-booth", label: "📸 Photos", icon: "📸" },
    { path: "/love-letters", label: "💌 Letters", icon: "💌" },
    { path: "/celebration", label: "🎉 Celebrate", icon: "🎉" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const scrolled = window.scrollY > 50;
        navRef.current.classList.toggle("scrolled", scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <BSNavbar
        ref={navRef}
        expand="lg"
        fixed="top"
        className={`custom-navbar ${theme} glass-effect`}
        variant={theme === "dark" ? "dark" : "light"}
      >
        <Container>
          {/* Brand */}
          <BSNavbar.Brand as={Link} to="/" className="brand-logo fw-bold fs-4">
            💕 Anniversary Love
          </BSNavbar.Brand>

          {/* Mobile Toggle */}
          <BSNavbar.Toggle aria-controls="navbar-nav" />

          {/* Navigation Items */}
          <BSNavbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              {navItems.map((item) => (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  className={`nav-link-custom ${location.pathname === item.path ? "active" : ""}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label d-none d-lg-inline">
                    {item.label}
                  </span>
                </Nav.Link>
              ))}
            </Nav>

            {/* Controls */}
            <Nav className="navbar-controls d-flex align-items-center gap-2">
              {/* Music Toggle */}
              <Button
                variant="outline-primary"
                size="sm"
                className="control-btn"
                onClick={() => toggleMusic()}
                title={isPlaying ? "Pause Music" : "Play Music"}
              >
                {isPlaying ? "🔊" : "🔇"}
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="outline-secondary"
                size="sm"
                className="control-btn"
                onClick={toggleTheme}
                title="Change Theme"
              >
                {theme === "light" ? "🌙" : theme === "dark" ? "🌅" : "💕"}
              </Button>
            </Nav>
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>
    </motion.div>
  );
};

export default Navbar;
