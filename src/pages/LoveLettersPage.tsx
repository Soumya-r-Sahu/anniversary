import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Row, Col, Card, Modal, Form, Badge } from "react-bootstrap";
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

interface LoveLetter {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  mood: "romantic" | "playful" | "sweet" | "passionate";
  isSpecial: boolean;
  readCount: number;
}

const LoveLettersPage: React.FC = () => {
  const { theme, config } = useThemeStore();
  const { isPlaying } = useMusicStore();
  const { completeStep } = useWorkflowStore();

  const [letters, setLetters] = useState<LoveLetter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newLetter, setNewLetter] = useState({
    title: "",
    content: "",
    author: "",
    mood: "romantic" as const,
  });
  const [currentTypewriterTexts, setCurrentTypewriterTexts] = useState<
    string[]
  >([]);
  const [lettersRead, setLettersRead] = useState<Set<string>>(new Set());

  const lettersRef = useRef<HTMLDivElement>(null);
  // Complete step when user reads letters
  useEffect(() => {
    if (lettersRead.size >= 2) {
      completeStep("love-letters");

      // Auto-progress after reading letters
      setTimeout(() => {
        console.log("Love letters step completed!");
      }, 3000);
    }
  }, [lettersRead.size, completeStep]);

  // Pre-written love letters
  const predefinedLetters: LoveLetter[] = [
    {
      id: "1",
      title: "My Dearest Love 💕",
      content: `My beloved,\n\nEvery morning I wake up grateful for another day to love you. You are the sunshine that brightens my darkest days and the star that guides me home. Our love story is my favorite fairy tale, and I never want it to end.\n\nWith every heartbeat, I love you more. You are my today, my tomorrow, and my forever.\n\nYours always,\nForever and Always 💖`,
      author: "Your Secret Admirer",
      date: new Date("2024-02-14"),
      mood: "romantic",
      isSpecial: true,
      readCount: 0,
    },
    {
      id: "2",
      title: "You Make Me Smile 😊",
      content: `Hey Beautiful,\n\nJust wanted to remind you how amazing you are! You have this incredible way of making even the most ordinary moments feel magical. Your laugh is my favorite sound, and your smile can brighten any room.\n\nThank you for being the wonderful, crazy, perfect person you are. I'm so lucky to have you in my life!\n\nLove and giggles,\nYour Biggest Fan 🌟`,
      author: "Someone Who Adores You",
      date: new Date("2024-03-15"),
      mood: "playful",
      isSpecial: false,
      readCount: 0,
    },
    {
      id: "3",
      title: "Sweet Dreams 🌙",
      content: `My Sweet Angel,\n\nAs you close your eyes tonight, I want you to know that you are loved beyond measure. You are the last thought on my mind before I sleep and the first when I wake.\n\nMay your dreams be filled with happiness, love, and all the beautiful things you deserve. Rest well, knowing that you are cherished.\n\nSweet dreams, my love,\nAlways Thinking of You 💤`,
      author: "Your Dream Guardian",
      date: new Date("2024-04-20"),
      mood: "sweet",
      isSpecial: false,
      readCount: 0,
    },
    {
      id: "4",
      title: "Burning with Love 🔥",
      content: `My Passionate Love,\n\nYou set my soul on fire with just a glance. Every moment without you feels like an eternity, and every second with you is pure bliss. You are my desire, my passion, my everything.\n\nI love you with a fierce intensity that grows stronger every day. You are my flame, my heat, my burning love.\n\nWith passionate devotion,\nYour Fire 🔥💋`,
      author: "Your Passionate Lover",
      date: new Date("2024-05-10"),
      mood: "passionate",
      isSpecial: true,
      readCount: 0,
    },
  ];

  // Initialize letters
  useEffect(() => {
    setLetters(predefinedLetters);

    // Set typewriter texts
    setCurrentTypewriterTexts([
      "Love letters straight from the heart 💕",
      "Words of love just for you 💖",
      "Messages filled with affection 💝",
      "Sweet notes of devotion 🌹",
    ]);
  }, []);

  // Animate letters on load
  useEffect(() => {
    if (lettersRef.current && letters.length > 0) {
      const letterCards = lettersRef.current.querySelectorAll(".letter-card");
      gsap.fromTo(
        letterCards,
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
  }, [letters]);

  // Handle letter selection
  const handleLetterSelect = (letter: LoveLetter) => {
    setSelectedLetter(letter);
    setShowLetterModal(true);
    // Update read count
    setLetters((prev) =>
      prev.map((l) =>
        l.id === letter.id ? { ...l, readCount: l.readCount + 1 } : l,
      ),
    );

    // Track letters read
    setLettersRead((prev) => new Set([...prev, letter.id]));

    // Play romantic sound
    if (!isPlaying) {
      // Could play a song from playlist if needed
    }

    // Create bubble shower effect
    createBubbleShower();
  };
  // Create bubble shower effect
  const createBubbleShower = () => {
    // Use unified bubble animation system if available
    if (
      window.BackgroundComponents &&
      window.BackgroundComponents.bubbleAnimation
    ) {
      // Create multiple bubble bursts for shower effect
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * 200 + 100;
          window.BackgroundComponents!.bubbleAnimation!.createBubbleBurst(
            x,
            y,
            8,
          );
        }, i * 500);
      }
      return;
    } // Fallback bubble shower
    const bubbleColors = ["#ff6b9d", "#ec4899", "#ffa8cc", "#f472b6"];
    const bubbleContainer = document.createElement("div");
    bubbleContainer.className = "bubble-shower";
    bubbleContainer.style.position = "fixed";
    bubbleContainer.style.top = "0";
    bubbleContainer.style.left = "0";
    bubbleContainer.style.width = "100vw";
    bubbleContainer.style.height = "100vh";
    bubbleContainer.style.pointerEvents = "none";
    bubbleContainer.style.zIndex = "999";

    for (let i = 0; i < 15; i++) {
      const bubble = document.createElement("div");
      bubble.style.position = "absolute";
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.top = "-50px";
      bubble.style.width = "20px";
      bubble.style.height = "20px";
      bubble.style.borderRadius = "50%";
      bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), ${bubbleColors[Math.floor(Math.random() * bubbleColors.length)]})`;
      bubble.style.border = "1px solid rgba(255, 255, 255, 0.3)";
      bubble.style.opacity = "0.8";
      bubbleContainer.appendChild(bubble);
    }

    document.body.appendChild(bubbleContainer);

    gsap.fromTo(
      bubbleContainer.children,
      { y: -50, rotation: 0, scale: 0.5 },
      {
        y: window.innerHeight + 50,
        rotation: 360,
        scale: 1.2,
        duration: 3 + Math.random() * 2,
        stagger: 0.1,
        ease: "none",
        onComplete: () => bubbleContainer.remove(),
      },
    );
  };

  // Handle new letter submission
  const handleSubmitLetter = () => {
    if (!newLetter.title.trim() || !newLetter.content.trim()) {
      toast.error("Please fill in both title and content! 📝");
      return;
    }

    const letter: LoveLetter = {
      id: Date.now().toString(),
      title: newLetter.title,
      content: newLetter.content,
      author: newLetter.author || "Anonymous",
      date: new Date(),
      mood: newLetter.mood,
      isSpecial: false,
      readCount: 0,
    };

    setLetters((prev) => [letter, ...prev]);
    setNewLetter({ title: "", content: "", author: "", mood: "romantic" });
    setShowWriteModal(false);

    toast.success("💕 Your love letter has been added! 💕", {
      style: { background: config.primaryColor, color: "white" },
    });

    // Create celebration effect
    createBubbleShower();

    if (!isPlaying) {
      // Could play a song from playlist if needed
    }
  };

  // Get mood color
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "romantic":
        return "#ff6b9d";
      case "playful":
        return "#f8b500";
      case "sweet":
        return "#c44569";
      case "passionate":
        return "#ff6348";
      default:
        return config.primaryColor;
    }
  };

  // Get mood emoji
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "romantic":
        return "💕";
      case "playful":
        return "😊";
      case "sweet":
        return "🍯";
      case "passionate":
        return "🔥";
      default:
        return "💖";
    }
  };

  return (
    <div
      className="love-letters-page"
      style={{
        background: `linear-gradient(${config.backgroundGradient.join(", ")})`,
      }}
    >
      <ParticleSystem
        particleCount={theme === "romantic" ? 120 : 70}
        color={config.primaryColor}
      />

      <Container fluid className="love-letters-container py-5">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-5"
        >
          <h1 className="display-3 mb-4" style={{ color: config.primaryColor }}>
            Love Letters 💕📝
          </h1>
          <div className="typewriter-container mb-4">
            <TypewriterEffect
              texts={currentTypewriterTexts}
              speed={80}
              deleteSpeed={40}
              pauseDuration={2000}
              style={{
                fontSize: "1.5rem",
                color: config.primaryColor,
                minHeight: "2rem",
              }}
            />
          </div>
          <BubbleButton
            size="lg"
            variant="romantic"
            style={{
              backgroundColor: config.primaryColor,
              borderColor: config.primaryColor,
            }}
            onClick={() => setShowWriteModal(true)}
            className="mb-4"
          >
            ✍️ Write a Love Letter
          </BubbleButton>
        </motion.div>
        {/* Letters Grid */}
        <Row ref={lettersRef} className="g-4">
          {letters.map((letter) => (
            <Col key={letter.id} lg={6} xl={4}>
              <motion.div
                className="letter-card h-100"
                whileHover={{ scale: 1.03, rotateY: 5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleLetterSelect(letter)}
              >
                <Card
                  className="h-100 letter-item"
                  style={{
                    borderColor: getMoodColor(letter.mood),
                    borderWidth: letter.isSpecial ? "3px" : "1px",
                    backgroundColor: `${getMoodColor(letter.mood)}10`,
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {letter.isSpecial && (
                    <div
                      className="special-badge"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        zIndex: 10,
                      }}
                    >
                      <Badge bg="warning">⭐ Special</Badge>
                    </div>
                  )}

                  <Card.Body className="d-flex flex-column">
                    <div className="letter-header mb-3">
                      <Card.Title
                        style={{ color: getMoodColor(letter.mood) }}
                        className="mb-2"
                      >
                        {getMoodEmoji(letter.mood)} {letter.title}
                      </Card.Title>

                      <div className="letter-meta d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          From: {letter.author}
                        </small>
                        <small className="text-muted">
                          {letter.date.toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <Card.Text
                      className="flex-grow-1"
                      style={{
                        color: "#333",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {letter.content.substring(0, 150)}...
                    </Card.Text>

                    <div className="letter-footer mt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <Badge
                          style={{ backgroundColor: getMoodColor(letter.mood) }}
                        >
                          {letter.mood}
                        </Badge>

                        <small className="text-muted">
                          {letter.readCount > 0 &&
                            `Read ${letter.readCount} time${letter.readCount > 1 ? "s" : ""}`}
                        </small>
                      </div>
                      <BubbleButton
                        variant="outline"
                        size="sm"
                        className="w-100 mt-2"
                        style={{
                          borderColor: getMoodColor(letter.mood),
                          color: getMoodColor(letter.mood),
                        }}
                        onClick={() => {
                          setSelectedLetter(letter);
                          setShowLetterModal(true);
                          setLettersRead(
                            (prev) => new Set([...prev, letter.id]),
                          );
                        }}
                      >
                        📖 Read Letter
                      </BubbleButton>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>{" "}
        {/* Floating Bubbles */}
        <BubbleAnimation
          bubbleCount={theme === "romantic" ? 20 : 12}
          colors={[config.primaryColor, config.accentColor]}
          animationType="floating"
        />
        {/* Workflow Navigation */}
        <WorkflowNavigation currentStepId="love-letters" />
      </Container>

      {/* Letter Reading Modal */}
      <Modal
        show={showLetterModal}
        onHide={() => setShowLetterModal(false)}
        size="lg"
        centered
      >
        <AnimatePresence>
          {selectedLetter && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header
                closeButton
                style={{
                  backgroundColor: getMoodColor(selectedLetter.mood) + "20",
                  borderColor: getMoodColor(selectedLetter.mood),
                }}
              >
                <Modal.Title
                  style={{ color: getMoodColor(selectedLetter.mood) }}
                >
                  {getMoodEmoji(selectedLetter.mood)} {selectedLetter.title}
                  {selectedLetter.isSpecial && <span className="ms-2">⭐</span>}
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <div className="letter-content">
                  <div className="d-flex justify-content-between mb-3">
                    <small className="text-muted">
                      From: {selectedLetter.author}
                    </small>
                    <small className="text-muted">
                      {selectedLetter.date.toLocaleDateString()}
                    </small>
                  </div>
                  <div
                    className="letter-text"
                    style={{
                      whiteSpace: "pre-line",
                      lineHeight: "1.6",
                      fontSize: "1.1rem",
                      color: "#333",
                    }}
                  >
                    {selectedLetter.content}
                  </div>

                  <div className="letter-signature text-end mt-4">
                    <Badge
                      style={{
                        backgroundColor: getMoodColor(selectedLetter.mood),
                      }}
                      className="me-2"
                    >
                      {selectedLetter.mood}
                    </Badge>
                    <small className="text-muted">
                      Read {selectedLetter.readCount} time
                      {selectedLetter.readCount !== 1 ? "s" : ""}
                    </small>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <BubbleButton
                  variant="secondary"
                  onClick={() => setShowLetterModal(false)}
                >
                  Close
                </BubbleButton>
                <BubbleButton
                  variant="romantic"
                  style={{
                    backgroundColor: getMoodColor(selectedLetter.mood),
                    borderColor: getMoodColor(selectedLetter.mood),
                  }}
                  onClick={() => {
                    // Add to favorites functionality
                    toast.success("💝 Added to favorites! 💝");
                  }}
                >
                  💝 Add to Favorites
                </BubbleButton>
              </Modal.Footer>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      {/* Write Letter Modal */}
      <Modal
        show={showWriteModal}
        onHide={() => setShowWriteModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: config.primaryColor }}>
            ✍️ Write a Love Letter 💕
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Letter Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Give your letter a beautiful title..."
                value={newLetter.title}
                onChange={(e) =>
                  setNewLetter((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Name (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Who is this love letter from?"
                value={newLetter.author}
                onChange={(e) =>
                  setNewLetter((prev) => ({ ...prev, author: e.target.value }))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mood</Form.Label>
              <Form.Select
                value={newLetter.mood}
                onChange={(e) =>
                  setNewLetter((prev) => ({
                    ...prev,
                    mood: e.target.value as any,
                  }))
                }
              >
                <option value="romantic">💕 Romantic</option>
                <option value="playful">😊 Playful</option>
                <option value="sweet">🍯 Sweet</option>
                <option value="passionate">🔥 Passionate</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Letter Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                placeholder="Pour your heart out here..."
                value={newLetter.content}
                onChange={(e) =>
                  setNewLetter((prev) => ({ ...prev, content: e.target.value }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <BubbleButton
            variant="secondary"
            onClick={() => setShowWriteModal(false)}
          >
            Cancel
          </BubbleButton>
          <BubbleButton
            variant="romantic"
            style={{
              backgroundColor: config.primaryColor,
              borderColor: config.primaryColor,
            }}
            onClick={handleSubmitLetter}
          >
            💌 Send Love Letter
          </BubbleButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoveLettersPage;
