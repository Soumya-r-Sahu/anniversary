import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Row, Col, Card, ProgressBar, Modal } from "react-bootstrap";
import { gsap } from "gsap";
import { toast } from "react-hot-toast";

// Stores
import { useThemeStore } from "@store/themeStore";
import { useMusicStore } from "@store/musicStore";
import { useWorkflowStore } from "@store/workflowStore";

// Components
import ParticleSystem from "@components/features/ParticleSystem";
import BubbleAnimation from "@components/features/BubbleAnimation";
import WorkflowNavigation from "@components/common/WorkflowNavigation";
import BubbleButton from "@components/common/BubbleButton";

interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
  category: "quiz" | "memory" | "interactive" | "creative";
  color: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const GamesPage: React.FC = () => {
  const { theme, config } = useThemeStore();
  const { isPlaying } = useMusicStore();
  const { completeStep } = useWorkflowStore();

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [loveMeterValue, setLoveMeterValue] = useState(0);
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState<Set<string>>(new Set());
  const gamesRef = useRef<HTMLDivElement>(null);
  // Complete step when user plays games
  useEffect(() => {
    if (gamesPlayed.size >= 2) {
      completeStep("games");

      // Auto-progress after completing games
      setTimeout(() => {
        console.log("Games completed!");
      }, 3000);
    }
  }, [gamesPlayed.size, completeStep]);

  // Available games
  const games: Game[] = [
    {
      id: "love-quiz",
      name: "Love Knowledge Quiz",
      description: "Test how well you know each other with romantic questions!",
      icon: "💕",
      difficulty: "easy",
      category: "quiz",
      color: "#ff6b9d",
    },
    {
      id: "memory-match",
      name: "Memory Match",
      description: "Match romantic symbols and create beautiful patterns!",
      icon: "🧠",
      difficulty: "medium",
      category: "memory",
      color: "#c44569",
    },
    {
      id: "love-meter",
      name: "Love Meter",
      description:
        "Measure the love between you two with our magical love meter!",
      icon: "❤️",
      difficulty: "easy",
      category: "interactive",
      color: "#f8b500",
    },
    {
      id: "couple-creator",
      name: "Couple Avatar Creator",
      description: "Create cute avatars representing your relationship!",
      icon: "👫",
      difficulty: "hard",
      category: "creative",
      color: "#ff6348",
    },
  ];

  // Quiz questions
  const quizQuestions: QuizQuestion[] = [
    {
      id: "1",
      question: "What is the most romantic day of the year?",
      options: ["Christmas", "Valentine's Day", "New Year", "Your Anniversary"],
      correct: 3,
      explanation:
        "Your anniversary is the most special day because it celebrates your unique love story!",
    },
    {
      id: "2",
      question: "What makes a relationship strong?",
      options: ["Trust and Communication", "Money", "Good Looks", "Luck"],
      correct: 0,
      explanation:
        "Trust and communication are the foundation of any strong relationship!",
    },
    {
      id: "3",
      question: "What is the best way to show love?",
      options: [
        "Expensive gifts",
        "Quality time together",
        "Social media posts",
        "Being possessive",
      ],
      correct: 1,
      explanation:
        "Quality time together creates lasting memories and strengthens your bond!",
    },
  ];

  // Initialize games
  useEffect(() => {
    if (gamesRef.current) {
      const gameCards = gamesRef.current.querySelectorAll(".game-card");
      gsap.fromTo(
        gameCards,
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

  // Handle game selection
  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setShowGameModal(true);
    initializeGame(game);
    // Play game start sound
    if (!isPlaying) {
      // Could play a song from playlist if needed
    }

    // Celebration effect
    createCelebrationEffect();
  };

  // Initialize specific game
  const initializeGame = (game: Game) => {
    switch (game.id) {
      case "love-quiz":
        setCurrentQuestion(0);
        setQuizAnswers([]);
        setGameScore(0);
        break;
      case "memory-match":
        initializeMemoryGame();
        break;
      case "love-meter":
        setLoveMeterValue(0);
        animateLoveMeter();
        break;
      case "couple-creator":
        // Initialize avatar creator
        break;
    }
  };

  // Initialize memory game
  const initializeMemoryGame = () => {
    const symbols = ["💕", "💖", "💗", "💝", "💞", "💟", "❤️", "💘"];
    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    setMemoryCards(
      cards.map((symbol, index) => ({ id: index, symbol, flipped: false })),
    );
    setFlippedCards([]);
    setMatchedCards([]);
  };

  // Handle quiz answer
  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);

    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setGameScore((prev) => prev + 10);
      toast.success("Correct! 🫧", {
        style: { background: config.primaryColor, color: "white" },
      });
      createBubbleBurst();
    } else {
      toast.error("Try again! 💔", {
        style: { background: "#ff6b6b", color: "white" },
      });
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // Quiz completed
        const finalScore = newAnswers.reduce((score, answer, index) => {
          return score + (answer === quizQuestions[index].correct ? 10 : 0);
        }, 0);
        showQuizResults(finalScore);
      }
    }, 1500);
  };

  // Show quiz results
  const showQuizResults = (finalScore: number) => {
    const percentage = (finalScore / (quizQuestions.length * 10)) * 100;
    let message = "";

    if (percentage >= 80) {
      message = "🌟 Amazing! You two know each other so well! 🌟";
    } else if (percentage >= 60) {
      message = "💕 Great job! Your love is growing stronger! 💕";
    } else {
      message =
        "💖 Keep learning about each other! Love grows with understanding! 💖";
    }

    toast.success(message, {
      duration: 4000,
      style: { background: config.primaryColor, color: "white" },
    });
  };

  // Handle memory card flip
  const handleCardFlip = (cardIndex: number) => {
    if (
      flippedCards.length >= 2 ||
      flippedCards.includes(cardIndex) ||
      matchedCards.includes(cardIndex)
    ) {
      return;
    }

    const newFlipped = [...flippedCards, cardIndex];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (memoryCards[first].symbol === memoryCards[second].symbol) {
        // Match found
        setTimeout(() => {
          setMatchedCards((prev) => [...prev, first, second]);
          setFlippedCards([]);
          createBubbleBurst();

          if (matchedCards.length + 2 === memoryCards.length) {
            toast.success("🎉 You matched all cards! Perfect memory! 🎉", {
              duration: 4000,
              style: { background: config.primaryColor, color: "white" },
            });
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Animate love meter
  const animateLoveMeter = () => {
    const targetValue = Math.floor(Math.random() * 30) + 70; // 70-100% love

    gsap.to(
      { value: 0 },
      {
        value: targetValue,
        duration: 3,
        ease: "power2.out",
        onUpdate: function () {
          setLoveMeterValue(Math.floor(this.targets()[0].value));
        },
        onComplete: () => {
          toast.success(
            `💕 Your love meter shows ${targetValue}%! Amazing! 💕`,
            {
              duration: 4000,
              style: { background: config.primaryColor, color: "white" },
            },
          );
          createBubbleBurst();
        },
      },
    );
  };

  // Create celebration effect
  const createCelebrationEffect = () => {
    const celebration = document.createElement("div");
    celebration.className = "celebration-effect";
    celebration.innerHTML = "🎉".repeat(10);
    document.body.appendChild(celebration);

    gsap.fromTo(
      celebration.children,
      { scale: 0, rotation: 0, opacity: 1 },
      {
        scale: 2,
        rotation: 360,
        opacity: 0,
        duration: 2,
        stagger: 0.1,
        ease: "power2.out",
        onComplete: () => celebration.remove(),
      },
    );
  };
  // Create bubble burst effect
  const createBubbleBurst = () => {
    const bubbles = ["🫧", "💙", "💎", "✨"];
    const bubbleContainer = document.createElement("div");
    bubbleContainer.className = "bubble-burst";

    bubbles.forEach((bubble) => {
      const bubbleEl = document.createElement("div");
      bubbleEl.textContent = bubble;
      bubbleEl.style.position = "absolute";
      bubbleEl.style.fontSize = "2rem";
      bubbleContainer.appendChild(bubbleEl);
    });
    document.body.appendChild(bubbleContainer);

    gsap.fromTo(
      bubbleContainer.children,
      { scale: 0, x: 0, y: 0 },
      {
        scale: 1.5,
        x: () => (Math.random() - 0.5) * 200,
        y: () => (Math.random() - 0.5) * 200,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => bubbleContainer.remove(),
      },
    );
  };
  return (
    <div
      className="games-page"
      style={{
        background: `linear-gradient(${config.backgroundGradient.join(", ")})`,
      }}
    >
      <ParticleSystem
        particleCount={theme === "romantic" ? 100 : 60}
        color={config.primaryColor}
      />

      <Container fluid className="games-container py-5">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-5"
        >
          <h1 className="display-3 mb-4" style={{ color: config.primaryColor }}>
            Love Games 🎮💕
          </h1>
          <p className="lead" style={{ color: config.primaryColor }}>
            Play fun games together and strengthen your bond!
          </p>
        </motion.div>
        {/* Games Grid */}
        <Row ref={gamesRef} className="g-4">
          {games.map((game) => (
            <Col key={game.id} lg={6} xl={3}>
              <motion.div
                className="game-card h-100"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGameSelect(game)}
              >
                <Card
                  className="h-100 text-center"
                  style={{
                    borderColor: game.color,
                    borderWidth: "3px",
                    backgroundColor: `${game.color}10`,
                    cursor: "pointer",
                  }}
                >
                  <Card.Body className="d-flex flex-column">
                    <div
                      className="game-icon mb-3"
                      style={{ fontSize: "3rem" }}
                    >
                      {game.icon}
                    </div>

                    <Card.Title style={{ color: game.color }} className="mb-3">
                      {game.name}
                    </Card.Title>

                    <Card.Text
                      className="flex-grow-1"
                      style={{ color: config.primaryColor }}
                    >
                      {game.description}
                    </Card.Text>

                    <div className="game-meta mb-3">
                      <span
                        className={`badge bg-${game.difficulty === "easy" ? "success" : game.difficulty === "medium" ? "warning" : "danger"} me-2`}
                      >
                        {game.difficulty}
                      </span>
                      <span className="badge bg-secondary">
                        {game.category}
                      </span>
                    </div>
                    <BubbleButton
                      variant="primary"
                      style={{
                        backgroundColor: game.color,
                        borderColor: game.color,
                      }}
                      className="mt-auto"
                      onClick={() => {
                        setSelectedGame(game);
                        setShowGameModal(true);
                        setGamesPlayed((prev) => new Set([...prev, game.id]));
                      }}
                    >
                      Play Now! 🎮
                    </BubbleButton>
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
        />{" "}
        {/* Workflow Navigation */}
        <WorkflowNavigation currentStepId="games" />
      </Container>

      {/* Game Modal */}
      <Modal
        show={showGameModal}
        onHide={() => setShowGameModal(false)}
        size="lg"
        centered
      >
        <AnimatePresence>
          {selectedGame && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header
                closeButton
                style={{
                  backgroundColor: selectedGame.color + "20",
                  borderColor: selectedGame.color,
                }}
              >
                <Modal.Title style={{ color: selectedGame.color }}>
                  {selectedGame.icon} {selectedGame.name}
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {/* Quiz Game */}
                {selectedGame.id === "love-quiz" && (
                  <div className="quiz-game">
                    <div className="d-flex justify-content-between mb-3">
                      <span>
                        Question {currentQuestion + 1} of {quizQuestions.length}
                      </span>
                      <span>Score: {gameScore}</span>
                    </div>

                    <ProgressBar
                      now={(currentQuestion / quizQuestions.length) * 100}
                      className="mb-4"
                      style={{ height: "10px" }}
                    />

                    <h5 className="mb-4">
                      {quizQuestions[currentQuestion]?.question}
                    </h5>
                    <div className="quiz-options">
                      {quizQuestions[currentQuestion]?.options.map(
                        (option, index) => (
                          <BubbleButton
                            key={index}
                            variant="outline"
                            className="d-block w-100 mb-2 text-start"
                            onClick={() => handleQuizAnswer(index)}
                            disabled={quizAnswers.length > currentQuestion}
                          >
                            {option}
                          </BubbleButton>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Memory Game */}
                {selectedGame.id === "memory-match" && (
                  <div className="memory-game">
                    <div
                      className="memory-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "10px",
                        maxWidth: "400px",
                        margin: "0 auto",
                      }}
                    >
                      {memoryCards.map((card, index) => (
                        <motion.div
                          key={card.id}
                          className="memory-card"
                          style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor:
                              flippedCards.includes(index) ||
                              matchedCards.includes(index)
                                ? selectedGame.color + "20"
                                : "#f8f9fa",
                            border: `2px solid ${selectedGame.color}`,
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2rem",
                            cursor: "pointer",
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCardFlip(index)}
                        >
                          {flippedCards.includes(index) ||
                          matchedCards.includes(index)
                            ? card.symbol
                            : "❓"}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Love Meter */}
                {selectedGame.id === "love-meter" && (
                  <div className="love-meter-game text-center">
                    <div className="love-meter-display mb-4">
                      <h3 style={{ color: selectedGame.color }}>
                        Love Level: {loveMeterValue}%
                      </h3>
                      <ProgressBar
                        now={loveMeterValue}
                        className="mb-3"
                        style={{ height: "30px" }}
                        variant={
                          loveMeterValue > 80
                            ? "success"
                            : loveMeterValue > 60
                              ? "warning"
                              : "info"
                        }
                      />
                      <div style={{ fontSize: "3rem" }}>
                        {loveMeterValue > 90
                          ? "💖💖💖"
                          : loveMeterValue > 70
                            ? "💕💕"
                            : loveMeterValue > 50
                              ? "💕"
                              : "💔"}
                      </div>
                    </div>
                    <BubbleButton
                      variant="romantic"
                      style={{
                        backgroundColor: selectedGame.color,
                        borderColor: selectedGame.color,
                      }}
                      onClick={animateLoveMeter}
                    >
                      Measure Love Again! 💕
                    </BubbleButton>
                  </div>
                )}

                {/* Avatar Creator */}
                {selectedGame.id === "couple-creator" && (
                  <div className="avatar-creator text-center">
                    <p>Create your couple avatar! (Feature coming soon...)</p>
                    <div style={{ fontSize: "5rem" }}>👫💕</div>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <BubbleButton
                  variant="secondary"
                  onClick={() => setShowGameModal(false)}
                >
                  Close
                </BubbleButton>
                <BubbleButton
                  variant="primary"
                  style={{
                    backgroundColor: selectedGame.color,
                    borderColor: selectedGame.color,
                  }}
                  onClick={() => initializeGame(selectedGame)}
                >
                  Restart Game 🔄
                </BubbleButton>
              </Modal.Footer>
            </motion.div>
          )}{" "}
        </AnimatePresence>
      </Modal>

      {/* Floating Bubbles Animation */}
      <BubbleAnimation bubbleCount={theme === "romantic" ? 25 : 15} />

      {/* Workflow Navigation */}
      <WorkflowNavigation currentStepId="games" />
    </div>
  );
};

export default GamesPage;
