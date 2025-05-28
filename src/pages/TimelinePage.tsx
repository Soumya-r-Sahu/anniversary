import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Card, Modal } from "react-bootstrap";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Stores
import { useThemeStore } from "@store/themeStore";
import { useMusicStore } from "@store/musicStore";
import { useWorkflowStore } from "@store/workflowStore";

// Components
import ParticleSystem from "@components/features/ParticleSystem";
import BubbleAnimation from "@components/features/BubbleAnimation";
import WorkflowNavigation from "@components/common/WorkflowNavigation";
import BubbleButton from "@components/common/BubbleButton";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  type: "milestone" | "memory" | "celebration" | "special";
  color: string;
  position: "left" | "right";
}

const TimelinePage: React.FC = () => {
  const { theme, config } = useThemeStore();
  const { playSong, isPlaying, playlist } = useMusicStore();
  const { completeStep } = useWorkflowStore();

  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState<Set<string>>(new Set());
  const [pageExplored, setPageExplored] = useState(false);

  const timelineRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement[]>([]);

  // Complete step when user explores the timeline
  useEffect(() => {
    if (visibleEvents.size >= 3 && !pageExplored) {
      setPageExplored(true);
      completeStep("love-story");
    }
  }, [visibleEvents.size, pageExplored, completeStep]);

  // Timeline events data
  const timelineEvents: TimelineEvent[] = [
    {
      id: "1",
      date: "June 16, 2023",
      title: "First Anniversary 💕",
      description:
        "Our first year together was filled with beautiful memories, laughter, and endless love.",
      type: "celebration",
      color: "#ff6b9d",
      position: "right",
    },
    {
      id: "2",
      date: "December 2023",
      title: "First Christmas Together 🎄",
      description:
        "Celebrating our first holiday season as a couple, creating new traditions.",
      type: "milestone",
      color: "#c44569",
      position: "left",
    },
    {
      id: "3",
      date: "February 14, 2024",
      title: "Valentine's Day Magic 💝",
      description:
        "A romantic celebration of our love with surprises and sweet moments.",
      type: "special",
      color: "#f8b500",
      position: "right",
    },
    {
      id: "4",
      date: "June 16, 2024",
      title: "Second Anniversary 🌟",
      description:
        "Two years of growing together, supporting each other, and building dreams.",
      type: "celebration",
      color: "#ff6348",
      position: "left",
    },
    {
      id: "5",
      date: "Present",
      title: "Our Journey Continues... 💫",
      description: "Every day we write a new chapter in our love story.",
      type: "memory",
      color: "#a55eea",
      position: "right",
    },
  ];

  // Initialize animations and scroll triggers
  useEffect(() => {
    if (!timelineRef.current) return;

    // Create timeline animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    });

    // Animate timeline line
    tl.fromTo(
      ".timeline-line",
      { height: "0%" },
      { height: "100%", duration: 2, ease: "power2.out" },
    );

    // Animate events as they come into view
    eventsRef.current.forEach((eventEl, index) => {
      if (eventEl) {
        gsap.fromTo(
          eventEl,
          {
            opacity: 0,
            x: timelineEvents[index].position === "left" ? -100 : 100,
            scale: 0.8,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: eventEl,
              start: "top 85%",
              onEnter: () => {
                setVisibleEvents(
                  (prev) => new Set([...prev, timelineEvents[index].id]),
                );
                // Play soft animation sound
                if (isPlaying && playlist?.songs && playlist.songs.length > 0) {
                  playSong(playlist.songs[0]);
                }
              },
            },
          },
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isPlaying, playSong]);

  // Handle event click
  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setShowModal(true);
    // Play interaction sound
    if (isPlaying && playlist?.songs && playlist.songs.length > 0) {
      playSong(playlist.songs[0]);
    } // Create bubble burst effect
    const bubbleBurst = document.createElement("div");
    bubbleBurst.className = "bubble-burst-effect";
    bubbleBurst.innerHTML = "🫧".repeat(6);
    document.body.appendChild(bubbleBurst);

    gsap.fromTo(
      bubbleBurst.children,
      { scale: 0, rotation: 0 },
      {
        scale: 1.5,
        rotation: 360,
        duration: 1.5,
        stagger: 0.1,
        ease: "power2.out",
        onComplete: () => bubbleBurst.remove(),
      },
    );
  };
  // Generate bubbles for celebration effect
  const createCelebrationBubbles = () => {
    const bubbles = ["🫧", "💙", "🔵", "🟦", "🌀", "💎"];
    return bubbles.map((bubble, index) => (
      <motion.div
        key={index}
        className="celebration-bubble"
        initial={{ scale: 0, y: 0, rotate: 0 }}
        animate={{
          scale: [0, 1.2, 0],
          y: [-50, -150, -250],
          rotate: [0, 180, 360],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          delay: index * 0.2,
          repeat: Infinity,
          repeatDelay: 2,
        }}
        style={{
          position: "absolute",
          left: `${20 + index * 10}%`,
          fontSize: "1.5rem",
          pointerEvents: "none",
        }}
      >
        {bubble}
      </motion.div>
    ));
  };

  return (
    <div className="timeline-page" style={{ backgroundColor: "#fef7f0" }}>
      <ParticleSystem
        particleCount={theme === "romantic" ? 150 : 80}
        color={config.primaryColor}
      />

      <Container fluid className="timeline-container">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center py-5"
        >
          {" "}
          <h1 className="display-3 mb-4" style={{ color: config.primaryColor }}>
            Our Love Story Timeline 🫧
          </h1>
          <p className="lead" style={{ color: config.primaryColor }}>
            A journey through our most precious moments together
          </p>{" "}
          <div className="celebration-bubbles-container position-relative">
            {createCelebrationBubbles()}
          </div>
        </motion.div>
        {/* Timeline */}
        <div ref={timelineRef} className="timeline-wrapper position-relative">
          <div className="timeline-line"></div>

          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.id}
              ref={(el) => {
                if (el) eventsRef.current[index] = el;
              }}
              className={`timeline-event timeline-event-${event.position} ${
                visibleEvents.has(event.id) ? "visible" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEventClick(event)}
            >
              <Card
                className="timeline-card h-100"
                style={{
                  borderColor: event.color,
                  borderWidth: "3px",
                  backgroundColor: `${event.color}15`,
                  cursor: "pointer",
                }}
              >
                <Card.Body>
                  <div
                    className="timeline-marker"
                    style={{ backgroundColor: event.color }}
                  >
                    <div className="timeline-marker-inner"></div>
                  </div>

                  <Card.Title style={{ color: event.color }} className="mb-2">
                    {event.title}
                  </Card.Title>

                  <Card.Subtitle
                    className="mb-3 text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {event.date}
                  </Card.Subtitle>
                  <Card.Text style={{ color: config.primaryColor }}>
                    {event.description}
                  </Card.Text>
                  <BubbleButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleEventClick(event)}
                    style={{
                      borderColor: event.color,
                      color: event.color,
                    }}
                  >
                    Read More 🫧
                  </BubbleButton>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </div>{" "}
        {/* Floating Bubbles Animation */}
        <BubbleAnimation
          bubbleCount={theme === "romantic" ? 25 : 15}
          colors={[config.primaryColor, config.accentColor]}
        />{" "}
        {/* Workflow Navigation */}
        <WorkflowNavigation currentStepId="love-story" />
      </Container>

      {/* Event Detail Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header
                closeButton
                style={{
                  backgroundColor: selectedEvent.color + "20",
                  borderColor: selectedEvent.color,
                }}
              >
                <Modal.Title style={{ color: selectedEvent.color }}>
                  {selectedEvent.title}
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p className="text-muted mb-3">{selectedEvent.date}</p>
                <p>{selectedEvent.description}</p>

                {/* Additional content based on event type */}
                {selectedEvent.type === "celebration" && (
                  <div className="text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      style={{ fontSize: "3rem" }}
                    >
                      🎉💕🎊
                    </motion.div>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <BubbleButton
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </BubbleButton>
                <BubbleButton
                  variant="primary"
                  style={{
                    backgroundColor: selectedEvent.color,
                    borderColor: selectedEvent.color,
                  }}
                  onClick={() => {
                    // Add to favorites or share functionality
                    setShowModal(false);
                  }}
                >
                  Add to Favorites 🫧
                </BubbleButton>
              </Modal.Footer>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </div>
  );
};

export default TimelinePage;
