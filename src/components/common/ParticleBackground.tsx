import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  particleSpeed?: number;
  enableConnections?: boolean;
  enableMouse?: boolean;
  theme?: "romantic" | "celebration" | "dreamy" | "elegant";
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  className = "",
  particleCount = 60,
  connectionDistance = 120,
  particleSpeed = 0.5,
  enableConnections = true,
  enableMouse = true,
  theme = "romantic",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, radius: 80 });
  const animationRef = useRef<number>();

  // Mobile optimization - detect mobile device and adjust settings
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth < 768;

  // Adjust settings for mobile devices
  const mobileParticleCount = Math.floor(particleCount * 0.4); // Reduce particles by 60%
  const mobileConnectionDistance = connectionDistance * 0.7; // Reduce connection distance
  const finalParticleCount = isMobile ? mobileParticleCount : particleCount;
  const finalConnectionDistance = isMobile
    ? mobileConnectionDistance
    : connectionDistance;
  const finalEnableConnections = isMobile ? false : enableConnections; // Disable connections on mobile
  const finalEnableMouse = isMobile ? false : enableMouse; // Disable mouse interaction on mobile

  // Theme-based color configurations
  const themeColors = {
    romantic: {
      particles: ["#ff6b9d", "#ffa8cc", "#ffb3d6", "#ec4899", "#f472b6"],
      connections: "#ff6b9d",
      background:
        "radial-gradient(circle at 20% 30%, rgba(255, 107, 157, 0.05), transparent 50%)",
      glowIntensity: 0.3,
    },
    celebration: {
      particles: ["#fbbf24", "#f59e0b", "#d97706", "#92400e", "#78350f"],
      connections: "#fbbf24",
      background:
        "radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.08), transparent 50%)",
      glowIntensity: 0.5,
    },
    dreamy: {
      particles: ["#a78bfa", "#c084fc", "#ddd6fe", "#8b5cf6", "#7c3aed"],
      connections: "#a78bfa",
      background:
        "radial-gradient(circle at 50% 80%, rgba(167, 139, 250, 0.06), transparent 50%)",
      glowIntensity: 0.4,
    },
    elegant: {
      particles: ["#6b7280", "#9ca3af", "#d1d5db", "#4b5563", "#374151"],
      connections: "#6b7280",
      background:
        "radial-gradient(circle at 30% 70%, rgba(107, 114, 128, 0.05), transparent 50%)",
      glowIntensity: 0.2,
    },
  };

  const currentColors = themeColors[theme] || themeColors.romantic;

  // Create a particle
  const createParticle = (): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas not available");

    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * particleSpeed,
      vy: (Math.random() - 0.5) * particleSpeed,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.6 + 0.4,
      color:
        currentColors.particles[
          Math.floor(Math.random() * currentColors.particles.length)
        ],
      life: 0,
      maxLife: Math.random() * 300 + 200,
    };
  };

  // Initialize particles
  const initParticles = () => {
    particlesRef.current = [];
    for (let i = 0; i < finalParticleCount; i++) {
      try {
        particlesRef.current.push(createParticle());
      } catch (error) {
        // Canvas not ready yet
        break;
      }
    }
  };

  // Update particle positions
  const updateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life++;

      // Boundary wrapping
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Mouse interaction
      if (finalEnableMouse) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRef.current.radius) {
          const force =
            (mouseRef.current.radius - distance) / mouseRef.current.radius;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 0.01;
          particle.vy -= Math.sin(angle) * force * 0.01;
        }
      }

      // Apply gentle drift back to original velocity
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      particle.vx += (Math.random() - 0.5) * 0.01;
      particle.vy += (Math.random() - 0.5) * 0.01;

      // Update alpha based on life
      const lifeRatio = particle.life / particle.maxLife;
      particle.alpha = 0.8 * (1 - lifeRatio * 0.5);

      // Reset particle if life exceeded
      if (particle.life >= particle.maxLife) {
        particlesRef.current[index] = createParticle();
      }
    });
  };

  // Draw particles and connections
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    particlesRef.current.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = currentColors.glowIntensity * 10;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw connections
    if (finalEnableConnections) {
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < finalConnectionDistance) {
            const opacity = (1 - distance / finalConnectionDistance) * 0.5;
            ctx.save();
            ctx.globalAlpha =
              opacity * Math.min(particle.alpha, otherParticle.alpha);
            ctx.strokeStyle = currentColors.connections;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });
    }
  };

  // Animation loop
  const animate = () => {
    updateParticles();
    draw();
    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  // Handle canvas resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  };

  // Setup effect
  useEffect(() => {
    handleResize();
    initParticles();
    animate();

    window.addEventListener("resize", handleResize);
    if (finalEnableMouse) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
      if (finalEnableMouse) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [
    theme,
    finalParticleCount,
    finalConnectionDistance,
    particleSpeed,
    finalEnableConnections,
    finalEnableMouse,
  ]);
  // Update particles when theme changes
  useEffect(() => {
    initParticles();
  }, [theme]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`particle-background ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
        background: currentColors.background,
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      {/* Additional atmospheric effects */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(circle at 20% 20%, ${currentColors.particles[0]}08, transparent 40%),
            radial-gradient(circle at 80% 80%, ${currentColors.particles[1]}08, transparent 40%),
            radial-gradient(circle at 60% 30%, ${currentColors.particles[2]}06, transparent 35%)
          `,
          animation: "atmosphericPulse 8s ease-in-out infinite alternate",
        }}
      />
      {/* Floating orbs for extra ambiance */}
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 15 + index * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 2,
          }}
          style={{
            position: "absolute",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${currentColors.particles[index % currentColors.particles.length]}15, transparent 70%)`,
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />
      ))}{" "}
      <style>{`
        @keyframes atmosphericPulse {
          0% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.6;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default ParticleBackground;
