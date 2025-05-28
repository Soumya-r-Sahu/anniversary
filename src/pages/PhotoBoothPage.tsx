import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Container, Row, Col, Card, Modal, Badge } from "react-bootstrap";
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

interface PhotoFrame {
  id: string;
  name: string;
  style: React.CSSProperties;
  emoji: string;
  category: "romantic" | "fun" | "elegant" | "playful";
}

interface PhotoFilter {
  id: string;
  name: string;
  css: string;
  emoji: string;
}

interface CapturedPhoto {
  id: string;
  timestamp: Date;
  frameId: string;
  filterId: string;
  dataUrl: string;
}

const PhotoBoothPage: React.FC = () => {
  const { theme, config } = useThemeStore();
  const { isPlaying } = useMusicStore();
  const { completeStep } = useWorkflowStore();

  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<PhotoFrame | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter | null>(
    null,
  );
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<
    "granted" | "denied" | "pending"
  >("pending");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoBoothRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Complete step when user captures photos
  useEffect(() => {
    if (capturedPhotos.length >= 1) {
      completeStep("gallery");

      // Auto-progress after taking photos
      setTimeout(() => {
        // Navigate to next step manually or handle completion
        console.log("Photo booth completed!");
      }, 4000);
    }
  }, [capturedPhotos.length, completeStep]);

  // Photo frames
  const photoFrames: PhotoFrame[] = [
    {
      id: "bubbles",
      name: "Bubble Romance",
      emoji: "🫧",
      category: "romantic",
      style: {
        border: "15px solid transparent",
        borderImage:
          "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='bubbles' patternUnits='userSpaceOnUse' width='20' height='20'><text x='10' y='15' text-anchor='middle' font-size='16'>🫧</text></pattern></defs><rect width='100' height='100' fill='url(%23bubbles)'/></svg>\") 15",
        borderRadius: "20px",
      },
    },
    {
      id: "flowers",
      name: "Flower Power",
      emoji: "🌸",
      category: "elegant",
      style: {
        border: "12px solid #ff6b9d",
        borderRadius: "50px",
        boxShadow: "0 0 20px rgba(255, 107, 157, 0.5)",
      },
    },
    {
      id: "stars",
      name: "Starry Night",
      emoji: "⭐",
      category: "fun",
      style: {
        border: "10px solid #f8b500",
        borderRadius: "15px",
        background: "linear-gradient(45deg, #f8b500, #ff6348)",
        padding: "5px",
      },
    },
    {
      id: "vintage",
      name: "Vintage Love",
      emoji: "📷",
      category: "elegant",
      style: {
        border: "20px solid #8b4513",
        borderRadius: "10px",
        boxShadow: "inset 0 0 0 5px #daa520, 0 0 20px rgba(139, 69, 19, 0.5)",
      },
    },
  ];

  // Photo filters
  const photoFilters: PhotoFilter[] = [
    {
      id: "none",
      name: "Original",
      emoji: "📷",
      css: "none",
    },
    {
      id: "sepia",
      name: "Vintage",
      emoji: "📜",
      css: "sepia(80%) contrast(120%)",
    },
    {
      id: "romantic",
      name: "Romantic",
      emoji: "🫧",
      css: "hue-rotate(320deg) saturate(120%) brightness(110%)",
    },
    {
      id: "dreamy",
      name: "Dreamy",
      emoji: "✨",
      css: "blur(1px) brightness(120%) contrast(90%)",
    },
    {
      id: "warm",
      name: "Warm",
      emoji: "🌅",
      css: "hue-rotate(30deg) saturate(130%) brightness(110%)",
    },
  ];

  // Initialize camera
  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Request camera permission and start stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setCameraPermission("granted");
      setIsPhotoMode(true);

      toast.success("📷 Camera ready! Strike a pose! 📷", {
        style: { background: config.primaryColor, color: "white" },
      });
      if (!isPlaying) {
        // Could play a song from playlist if needed
        // playSong(playlist?.songs[0])
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      setCameraPermission("denied");
      toast.error("Camera access needed for photo booth! 📷❌");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsPhotoMode(false);
    setCameraPermission("pending");
  };

  // Capture photo with countdown
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    setIsCapturing(true);
    let count = 3;
    setCountdown(count);

    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      if (!isPlaying) {
        // Could play countdown sound if available
      }

      if (count === 0) {
        clearInterval(countdownInterval);
        takePicture();
      }
    }, 1000);
  };

  // Take the actual picture
  const takePicture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Apply filter
    if (selectedFilter && selectedFilter.css !== "none") {
      ctx.filter = selectedFilter.css;
    }

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Add frame overlay if selected
    if (selectedFrame) {
      drawFrameOverlay(ctx, canvas.width, canvas.height);
    }

    // Convert to data URL
    const dataUrl = canvas.toDataURL("image/png");

    // Save photo
    const newPhoto: CapturedPhoto = {
      id: Date.now().toString(),
      timestamp: new Date(),
      frameId: selectedFrame?.id || "",
      filterId: selectedFilter?.id || "none",
      dataUrl,
    };

    setCapturedPhotos((prev) => [newPhoto, ...prev]);
    setCountdown(0);
    setIsCapturing(false); // Celebration effect
    createCameraFlash();
    toast.success("📸 Photo captured! Looking gorgeous! 📸", {
      style: { background: config.primaryColor, color: "white" },
    });

    if (!isPlaying) {
      // Could play shutter sound if available
    }
  };

  // Draw frame overlay on canvas
  const drawFrameOverlay = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    if (!selectedFrame) return;

    // Simple frame overlay - could be enhanced with actual frame images
    ctx.save();
    ctx.strokeStyle = config.primaryColor;
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    // Add decorative elements based on frame type
    if (selectedFrame.id === "bubbles") {
      ctx.font = "30px Arial";
      for (let i = 0; i < 8; i++) {
        const x = (i * width) / 8 + 20;
        const y = 40;
        ctx.fillText("🫧", x, y);
        ctx.fillText("🫧", x, height - 20);
      }
    }

    ctx.restore();
  };

  // Create camera flash effect
  const createCameraFlash = () => {
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.top = "0";
    flash.style.left = "0";
    flash.style.width = "100vw";
    flash.style.height = "100vh";
    flash.style.backgroundColor = "white";
    flash.style.zIndex = "9999";
    flash.style.pointerEvents = "none";
    document.body.appendChild(flash);

    gsap.fromTo(
      flash,
      { opacity: 0 },
      {
        opacity: 0.8,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => flash.remove(),
      },
    );
  };

  // Download photo
  const downloadPhoto = (photo: CapturedPhoto) => {
    const link = document.createElement("a");
    link.download = `love-photo-${photo.timestamp.toISOString().split("T")[0]}.png`;
    link.href = photo.dataUrl;
    link.click();

    toast.success("📥 Photo downloaded! 📥");
  };

  // Share photo (simplified - would integrate with Web Share API)
  const sharePhoto = (photo: CapturedPhoto) => {
    if (navigator.share) {
      // Use Web Share API if available
      fetch(photo.dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "love-photo.png", {
            type: "image/png",
          });
          navigator.share({
            title: "Our Love Photo",
            text: "Check out our cute photo from the love photo booth! 🫧",
            files: [file],
          });
        });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText("Check out our love photo! 🫧");
      toast.success("📋 Photo link copied to clipboard!");
    }
  };
  return (
    <div
      className="photo-booth-page"
      style={{
        background: `linear-gradient(${config.backgroundGradient.join(", ")})`,
      }}
    >
      <ParticleSystem
        particleCount={theme === "romantic" ? 80 : 50}
        color={config.primaryColor}
      />

      <Container fluid className="photo-booth-container py-5">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-5"
        >
          <h1 className="display-3 mb-4" style={{ color: config.primaryColor }}>
            Love Photo Booth 📷🫧
          </h1>
          <p className="lead" style={{ color: config.primaryColor }}>
            Capture beautiful memories together with fun frames and filters!
          </p>
        </motion.div>
        <Row>
          {/* Photo Booth Controls */}
          <Col lg={8}>
            <Card className="photo-booth-card h-100">
              <Card.Body>
                {!isPhotoMode ? (
                  /* Start Screen */
                  <div className="text-center py-5">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      style={{ fontSize: "5rem", marginBottom: "2rem" }}
                    >
                      📷🫧
                    </motion.div>

                    <h3 className="mb-4" style={{ color: config.primaryColor }}>
                      Ready to create some memories?
                    </h3>
                    <BubbleButton
                      size="lg"
                      variant="primary"
                      style={{
                        backgroundColor: config.primaryColor,
                        borderColor: config.primaryColor,
                      }}
                      onClick={startCamera}
                      disabled={cameraPermission === "denied"}
                    >
                      {cameraPermission === "denied"
                        ? "❌ Camera Access Denied"
                        : "📷 Start Photo Booth"}
                    </BubbleButton>

                    {cameraPermission === "denied" && (
                      <p className="text-muted mt-3">
                        Please allow camera access to use the photo booth
                        feature.
                      </p>
                    )}
                  </div>
                ) : (
                  /* Photo Booth Interface */
                  <div className="photo-booth-interface">
                    {/* Camera View */}
                    <div
                      ref={photoBoothRef}
                      className="camera-container position-relative mb-4"
                      style={{
                        maxWidth: "640px",
                        margin: "0 auto",
                        ...selectedFrame?.style,
                      }}
                    >
                      <video
                        ref={videoRef}
                        className="w-100"
                        style={{
                          filter: selectedFilter?.css || "none",
                          borderRadius: "10px",
                        }}
                        muted
                        playsInline
                      />

                      {/* Countdown Overlay */}
                      {countdown > 0 && (
                        <motion.div
                          className="countdown-overlay"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: "5rem",
                            color: "white",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                            zIndex: 10,
                          }}
                          animate={{ scale: [1.2, 1, 1.2] }}
                          transition={{ duration: 0.5 }}
                        >
                          {countdown}
                        </motion.div>
                      )}

                      {/* Hearts Animation During Capture */}
                      {isCapturing && (
                        <div className="capture-bubbles">
                          {["🫧", "💙", "💎", "✨"].map((bubble, index) => (
                            <motion.div
                              key={index}
                              style={{
                                position: "absolute",
                                fontSize: "2rem",
                                left: `${20 + index * 20}%`,
                                top: "20%",
                              }}
                              animate={{
                                y: [0, -100, -200],
                                opacity: [0, 1, 0],
                                scale: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                delay: index * 0.2,
                              }}
                            >
                              {bubble}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>{" "}
                    {/* Camera Controls */}
                    <div className="camera-controls text-center">
                      <BubbleButton
                        size="lg"
                        variant="primary"
                        className="me-3"
                        onClick={capturePhoto}
                        disabled={isCapturing}
                        style={{ minWidth: "150px" }}
                      >
                        {isCapturing ? "📷 Capturing..." : "📸 Take Photo"}
                      </BubbleButton>

                      <BubbleButton
                        size="lg"
                        variant="secondary"
                        onClick={stopCamera}
                      >
                        🔴 Stop Camera
                      </BubbleButton>
                    </div>
                  </div>
                )}

                {/* Hidden Canvas for Photo Processing */}
                <canvas ref={canvasRef} style={{ display: "none" }} />
              </Card.Body>
            </Card>
          </Col>

          {/* Customization Panel */}
          <Col lg={4}>
            <Card className="customization-panel h-100">
              <Card.Header
                style={{ backgroundColor: config.primaryColor + "20" }}
              >
                <h5 className="mb-0" style={{ color: config.primaryColor }}>
                  🎨 Customize Your Photo
                </h5>
              </Card.Header>

              <Card.Body>
                {/* Frame Selection */}
                <div className="frame-selection mb-4">
                  <h6 className="mb-3">📏 Choose a Frame:</h6>{" "}
                  <Row className="g-2">
                    {photoFrames.map((frame) => (
                      <Col key={frame.id} xs={6}>
                        <BubbleButton
                          variant={
                            selectedFrame?.id === frame.id
                              ? "primary"
                              : "outline"
                          }
                          className="w-100 p-2"
                          onClick={() => setSelectedFrame(frame)}
                        >
                          <div>{frame.emoji}</div>
                          <small>{frame.name}</small>
                        </BubbleButton>
                      </Col>
                    ))}
                  </Row>
                  {selectedFrame && (
                    <BubbleButton
                      variant="secondary"
                      size="sm"
                      className="mt-2"
                      onClick={() => setSelectedFrame(null)}
                    >
                      Remove Frame
                    </BubbleButton>
                  )}
                </div>
                {/* Filter Selection */}
                <div className="filter-selection mb-4">
                  <h6 className="mb-3">🎭 Choose a Filter:</h6>
                  <Row className="g-2">
                    {photoFilters.map((filter) => (
                      <Col key={filter.id} xs={6}>
                        {" "}
                        <BubbleButton
                          variant={
                            selectedFilter?.id === filter.id
                              ? "primary"
                              : "outline"
                          }
                          className="w-100 p-2"
                          onClick={() => setSelectedFilter(filter)}
                        >
                          <div>{filter.emoji}</div>
                          <small>{filter.name}</small>
                        </BubbleButton>
                      </Col>
                    ))}
                  </Row>
                </div>{" "}
                {/* Photo Gallery Button */}
                <div className="gallery-section">
                  <BubbleButton
                    variant="outline"
                    className="w-100"
                    onClick={() => setShowGallery(true)}
                  >
                    📸 View Gallery ({capturedPhotos.length})
                  </BubbleButton>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>{" "}
        {/* Floating Bubbles */}
        <BubbleAnimation
          bubbleCount={theme === "romantic" ? 15 : 8}
          colors={[config.primaryColor, config.accentColor]}
        />
        {/* Workflow Navigation */}
        <WorkflowNavigation currentStepId="photo-booth" />
      </Container>

      {/* Photo Gallery Modal */}
      <Modal
        show={showGallery}
        onHide={() => setShowGallery(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>📸 Your Love Photos Gallery 🫧</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {capturedPhotos.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📷💔</div>
              <h5>No photos captured yet!</h5>
              <p className="text-muted">
                Start taking some beautiful photos together!
              </p>
            </div>
          ) : (
            <Row className="g-3">
              {capturedPhotos.map((photo) => (
                <Col key={photo.id} md={6} lg={4}>
                  <Card className="photo-card">
                    <Card.Img
                      variant="top"
                      src={photo.dataUrl}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">
                          {photo.timestamp.toLocaleDateString()}
                        </small>
                        <div>
                          {photo.frameId && (
                            <Badge bg="primary" className="me-1">
                              {
                                photoFrames.find((f) => f.id === photo.frameId)
                                  ?.emoji
                              }
                            </Badge>
                          )}
                          <Badge bg="secondary">
                            {
                              photoFilters.find((f) => f.id === photo.filterId)
                                ?.emoji
                            }
                          </Badge>
                        </div>
                      </div>
                      <div className="d-grid gap-2">
                        <BubbleButton
                          size="sm"
                          variant="outline"
                          onClick={() => downloadPhoto(photo)}
                        >
                          📥 Download
                        </BubbleButton>
                        <BubbleButton
                          size="sm"
                          variant="primary"
                          onClick={() => sharePhoto(photo)}
                        >
                          📤 Share
                        </BubbleButton>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <BubbleButton
            variant="secondary"
            onClick={() => setShowGallery(false)}
          >
            Close Gallery
          </BubbleButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PhotoBoothPage;
