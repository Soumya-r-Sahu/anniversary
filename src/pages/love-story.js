/**
 * Love Story Page Controller
 * Manages interactive love story timeline, memory carousels, and story progression
 */

import { PerformanceUtils } from "../utils/performance.js";
import { LazyLoader } from "../utils/lazyLoader.js";
import { throttle, debounce } from "../utils/throttle.js";
import { UnifiedMusicManager } from "../core/UnifiedMusicManager.js";
import { UnifiedHeartAnimation } from "../components/UnifiedHeartAnimation.js";
import { UnifiedGallery } from "../components/UnifiedGallery.js";

class LoveStoryPageController {
  constructor() {
    this.currentChapter = 0;
    this.chapters = [];
    this.musicManager = null;
    this.heartAnimation = null;
    this.gallery = null;
    this.lazyLoader = null;
    this.isAutoPlaying = false;
    this.autoPlayInterval = null;

    // Performance monitoring
    this.performanceMonitor = PerformanceUtils.createMonitor("love-story-page");

    // Throttled scroll handler
    this.handleScroll = throttle(this._handleScroll.bind(this), 16);

    this.init();
  }

  async init() {
    try {
      console.log("💕 Initializing Love Story Page...");

      // Initialize performance monitoring
      this.performanceMonitor.start();

      // Load story data
      await this.loadStoryData();

      // Initialize components
      await this.initializeComponents();

      // Setup story timeline
      this.setupTimeline();

      // Setup navigation
      this.setupNavigation();

      // Setup auto-play functionality
      this.setupAutoPlay();

      // Setup interactive elements
      this.setupInteractivity();

      // Setup scroll-based animations
      this.setupScrollAnimations();

      console.log("✅ Love Story Page initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing love story page:", error);
      this.handleError(error);
    }
  }

  async loadStoryData() {
    // Try to load story data from localStorage or use default
    const savedStory = localStorage.getItem("loveStoryData");

    if (savedStory) {
      this.chapters = JSON.parse(savedStory);
    } else {
      // Default love story chapters
      this.chapters = [
        {
          id: 1,
          title: "First Meeting",
          date: "2023-01-15",
          content:
            "The day our eyes first met, and the world suddenly made sense.",
          image: "images/first-meeting.jpg",
          music: "romantic1.mp3",
          mood: "excitement",
          location: "Coffee Shop Downtown",
        },
        {
          id: 2,
          title: "First Date",
          date: "2023-01-22",
          content:
            "Nervous butterflies, endless conversations, and the beginning of forever.",
          image: "images/first-date.jpg",
          music: "romantic2.mp3",
          mood: "nervous-excitement",
          location: "Riverside Park",
        },
        {
          id: 3,
          title: "First Kiss",
          date: "2023-02-14",
          content:
            "Under the stars, time stopped as our hearts found their rhythm together.",
          image: "images/first-kiss.jpg",
          music: "romantic3.mp3",
          mood: "magical",
          location: "City Overlook",
        },
        {
          id: 4,
          title: "Moving In Together",
          date: "2023-06-01",
          content: "Two lives becoming one, creating our perfect little world.",
          image: "images/moving-in.jpg",
          music: "romantic4.mp3",
          mood: "joy",
          location: "Our First Home",
        },
        {
          id: 5,
          title: "The Proposal",
          date: "2024-02-14",
          content:
            "Forever started with a simple question and a resounding yes.",
          image: "images/proposal.jpg",
          music: "romantic5.mp3",
          mood: "overwhelming-love",
          location: "Where We First Met",
        },
      ];

      // Save default story
      localStorage.setItem("loveStoryData", JSON.stringify(this.chapters));
    }

    console.log(`📚 Loaded ${this.chapters.length} story chapters`);
  }

  async initializeComponents() {
    // Initialize music manager with chapter-specific playlists
    this.musicManager = new UnifiedMusicManager({
      autoPlay: false,
      volume: 0.6,
      fadeTransitions: true,
      playlist: this.chapters.map((chapter) => chapter.music),
    });
    // Initialize bubble animation with story-specific patterns
    this.bubbleAnimation = new UnifiedBubbleAnimation({
      container: document.querySelector(".story-container"),
      pattern: "story-mood",
      intensity: "low",
      responsive: true,
    });

    // Initialize gallery for story images
    this.gallery = new UnifiedGallery({
      container: document.querySelector(".story-gallery"),
      images: this.chapters.map((chapter) => ({
        src: chapter.image,
        title: chapter.title,
        description: chapter.content,
        date: chapter.date,
      })),
      showThumbnails: true,
      autoSlide: false,
    });

    // Initialize lazy loader for performance
    this.lazyLoader = new LazyLoader({
      rootMargin: "100px",
      enableWebP: true,
      enablePlaceholder: true,
    });
  }

  setupTimeline() {
    const timelineContainer = document.querySelector(".timeline-container");
    if (!timelineContainer) return;

    // Clear existing content
    timelineContainer.innerHTML = "";

    // Create timeline structure
    const timeline = document.createElement("div");
    timeline.className = "love-timeline";

    this.chapters.forEach((chapter, index) => {
      const chapterElement = this.createChapterElement(chapter, index);
      timeline.appendChild(chapterElement);
    });

    timelineContainer.appendChild(timeline);

    // Setup intersection observer for chapter animations
    this.setupChapterObserver();
  }

  createChapterElement(chapter, index) {
    const chapterDiv = document.createElement("div");
    chapterDiv.className = `timeline-chapter chapter-${index}`;
    chapterDiv.dataset.chapterId = chapter.id;
    chapterDiv.dataset.mood = chapter.mood;

    chapterDiv.innerHTML = `
            <div class="chapter-marker">
                <div class="chapter-number">${index + 1}</div>
                <div class="chapter-date">${this.formatDate(chapter.date)}</div>
            </div>
            <div class="chapter-content">
                <div class="chapter-image-container">
                    <img 
                        data-src="${chapter.image}" 
                        alt="${chapter.title}"
                        class="chapter-image lazy-load"
                        loading="lazy"
                    >
                    <div class="image-overlay">
                        <button class="view-full" data-chapter="${index}">
                            View Full Size 🔍
                        </button>
                    </div>
                </div>
                <div class="chapter-text">
                    <h3 class="chapter-title">${chapter.title}</h3>
                    <p class="chapter-description">${chapter.content}</p>
                    <div class="chapter-meta">
                        <span class="chapter-location">📍 ${chapter.location}</span>
                        <button class="play-music" data-music="${chapter.music}">
                            🎵 Play Memory Music
                        </button>
                    </div>
                </div>
            </div>
            <div class="chapter-hearts"></div>
        `;

    // Setup lazy loading for this chapter's image
    const img = chapterDiv.querySelector(".chapter-image");
    this.lazyLoader.observe(img);

    return chapterDiv;
  }

  setupChapterObserver() {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "-50px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const chapterElement = entry.target;
          const chapterIndex = parseInt(chapterElement.dataset.chapterId) - 1;
          this.activateChapter(chapterIndex);
          this.updateBubbleAnimation(chapterElement.dataset.mood);
        }
      });
    }, observerOptions);

    // Observe all chapters
    document.querySelectorAll(".timeline-chapter").forEach((chapter) => {
      observer.observe(chapter);
    });
  }

  activateChapter(index) {
    if (this.currentChapter === index) return;

    console.log(
      `📖 Activating chapter ${index + 1}: ${this.chapters[index].title}`,
    );

    // Update current chapter
    this.currentChapter = index;

    // Update visual states
    document.querySelectorAll(".timeline-chapter").forEach((chapter, i) => {
      chapter.classList.toggle("active", i === index);
      chapter.classList.toggle("completed", i < index);
    });

    // Update navigation
    this.updateNavigation();

    // Trigger chapter-specific animations
    this.triggerChapterAnimation(index);

    // Auto-play music if enabled
    if (this.isAutoPlaying && this.chapters[index].music) {
      this.playChapterMusic(this.chapters[index].music);
    }
  }
  updateBubbleAnimation(mood) {
    if (!this.bubbleAnimation) return;

    const moodConfigs = {
      excitement: { pattern: "burst", intensity: "high", color: "#ff6b9d" },
      "nervous-excitement": {
        pattern: "flutter",
        intensity: "medium",
        color: "#ffa8e1",
      },
      magical: { pattern: "swirl", intensity: "high", color: "#9c27b0" },
      joy: { pattern: "celebration", intensity: "high", color: "#ff5722" },
      "overwhelming-love": {
        pattern: "explosion",
        intensity: "maximum",
        color: "#e91e63",
      },
    };

    const config = moodConfigs[mood] || moodConfigs["joy"];
    this.bubbleAnimation.updatePattern(config);
  }

  triggerChapterAnimation(index) {
    const chapterElement = document.querySelector(`.chapter-${index}`);
    if (!chapterElement) return;

    // Add entrance animation
    chapterElement.classList.add("entering");
    // Animate chapter bubbles
    const bubblesContainer = chapterElement.querySelector(
      ".chapter-bubbles, .chapter-hearts",
    );
    if (bubblesContainer && this.bubbleAnimation) {
      this.bubbleAnimation.burst(10, bubblesContainer);
    }

    // Remove entrance class after animation
    setTimeout(() => {
      chapterElement.classList.remove("entering");
    }, 1000);
  }

  setupNavigation() {
    // Previous/Next buttons
    const prevButton = document.querySelector(".nav-previous");
    const nextButton = document.querySelector(".nav-next");

    if (prevButton) {
      prevButton.addEventListener("click", () => this.previousChapter());
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => this.nextChapter());
    }

    // Chapter dots navigation
    this.createChapterDots();

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.previousChapter();
      if (e.key === "ArrowRight") this.nextChapter();
      if (e.key === " ") this.toggleAutoPlay();
    });
  }

  createChapterDots() {
    const dotsContainer = document.querySelector(".chapter-dots");
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";

    this.chapters.forEach((chapter, index) => {
      const dot = document.createElement("button");
      dot.className = "chapter-dot";
      dot.dataset.chapter = index;
      dot.title = chapter.title;
      dot.innerHTML = `<span class="dot-number">${index + 1}</span>`;

      dot.addEventListener("click", () => this.goToChapter(index));

      dotsContainer.appendChild(dot);
    });
  }

  updateNavigation() {
    // Update navigation buttons
    const prevButton = document.querySelector(".nav-previous");
    const nextButton = document.querySelector(".nav-next");

    if (prevButton) {
      prevButton.disabled = this.currentChapter === 0;
    }

    if (nextButton) {
      nextButton.disabled = this.currentChapter === this.chapters.length - 1;
    }

    // Update chapter dots
    document.querySelectorAll(".chapter-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentChapter);
      dot.classList.toggle("completed", index < this.currentChapter);
    });

    // Update progress bar
    const progress = ((this.currentChapter + 1) / this.chapters.length) * 100;
    const progressBar = document.querySelector(".story-progress");
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }

  previousChapter() {
    if (this.currentChapter > 0) {
      this.goToChapter(this.currentChapter - 1);
    }
  }

  nextChapter() {
    if (this.currentChapter < this.chapters.length - 1) {
      this.goToChapter(this.currentChapter + 1);
    }
  }

  goToChapter(index) {
    if (index >= 0 && index < this.chapters.length) {
      const chapterElement = document.querySelector(`.chapter-${index}`);
      if (chapterElement) {
        chapterElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }

  setupAutoPlay() {
    const autoPlayButton = document.querySelector(".auto-play-toggle");
    if (autoPlayButton) {
      autoPlayButton.addEventListener("click", () => this.toggleAutoPlay());
    }

    const autoPlaySpeed = document.querySelector(".auto-play-speed");
    if (autoPlaySpeed) {
      autoPlaySpeed.addEventListener("change", (e) => {
        this.setAutoPlaySpeed(parseInt(e.target.value));
      });
    }
  }

  toggleAutoPlay() {
    this.isAutoPlaying = !this.isAutoPlaying;

    const button = document.querySelector(".auto-play-toggle");
    if (button) {
      button.classList.toggle("playing", this.isAutoPlaying);
      button.textContent = this.isAutoPlaying
        ? "⏸️ Pause Story"
        : "▶️ Play Story";
    }

    if (this.isAutoPlaying) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  }

  startAutoPlay() {
    this.stopAutoPlay(); // Clear any existing interval

    const speed = parseInt(
      document.querySelector(".auto-play-speed")?.value || 5000,
    );

    this.autoPlayInterval = setInterval(() => {
      if (this.currentChapter < this.chapters.length - 1) {
        this.nextChapter();
      } else {
        // Story complete, stop auto-play
        this.toggleAutoPlay();
        this.showStoryComplete();
      }
    }, speed);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  setAutoPlaySpeed(speed) {
    if (this.isAutoPlaying) {
      this.startAutoPlay(); // Restart with new speed
    }
  }

  setupInteractivity() {
    // Music play buttons
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("play-music")) {
        const musicFile = e.target.dataset.music;
        this.playChapterMusic(musicFile);
      }

      if (e.target.classList.contains("view-full")) {
        const chapterIndex = parseInt(e.target.dataset.chapter);
        this.gallery?.showImage(chapterIndex);
      }
    });

    // Story editing (if in edit mode)
    this.setupStoryEditing();

    // Sharing functionality
    this.setupSharing();
  }

  playChapterMusic(musicFile) {
    if (this.musicManager) {
      this.musicManager.play(musicFile);

      // Update UI to show playing state
      document.querySelectorAll(".play-music").forEach((btn) => {
        btn.classList.remove("playing");
      });

      const playingButton = document.querySelector(
        `[data-music="${musicFile}"]`,
      );
      if (playingButton) {
        playingButton.classList.add("playing");
        playingButton.textContent = "🎵 Playing...";
      }
    }
  }

  setupStoryEditing() {
    const editButton = document.querySelector(".edit-story");
    if (editButton) {
      editButton.addEventListener("click", () => this.toggleEditMode());
    }
  }

  toggleEditMode() {
    const isEditing = document.body.classList.toggle("editing-mode");

    if (isEditing) {
      this.enableStoryEditing();
    } else {
      this.disableStoryEditing();
    }
  }

  enableStoryEditing() {
    console.log("✏️ Story editing enabled");

    // Make chapters editable
    document
      .querySelectorAll(".chapter-title, .chapter-description")
      .forEach((element) => {
        element.contentEditable = true;
        element.addEventListener("blur", this.saveChapterEdit.bind(this));
      });

    // Show edit controls
    const editControls = document.querySelector(".edit-controls");
    if (editControls) {
      editControls.style.display = "block";
    }
  }

  disableStoryEditing() {
    console.log("💾 Story editing disabled");

    // Make chapters non-editable
    document
      .querySelectorAll(".chapter-title, .chapter-description")
      .forEach((element) => {
        element.contentEditable = false;
      });

    // Hide edit controls
    const editControls = document.querySelector(".edit-controls");
    if (editControls) {
      editControls.style.display = "none";
    }

    // Save changes
    this.saveStoryData();
  }

  saveChapterEdit(e) {
    const element = e.target;
    const chapterElement = element.closest(".timeline-chapter");
    const chapterId = parseInt(chapterElement.dataset.chapterId);
    const chapter = this.chapters.find((ch) => ch.id === chapterId);

    if (chapter) {
      if (element.classList.contains("chapter-title")) {
        chapter.title = element.textContent;
      } else if (element.classList.contains("chapter-description")) {
        chapter.content = element.textContent;
      }
    }
  }

  saveStoryData() {
    localStorage.setItem("loveStoryData", JSON.stringify(this.chapters));
    console.log("💾 Story data saved");
  }

  setupSharing() {
    const shareButton = document.querySelector(".share-story");
    if (shareButton) {
      shareButton.addEventListener("click", () => this.shareStory());
    }
  }

  shareStory() {
    const shareData = {
      title: "Our Love Story",
      text: `Read the beautiful journey of our love story - ${this.chapters.length} chapters of romance!`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      this.showMessage("Story link copied to clipboard! 📋");
    }
  }

  setupScrollAnimations() {
    window.addEventListener("scroll", this.handleScroll);

    // Parallax effect for background elements
    this.setupParallax();
  }

  _handleScroll() {
    // Update scroll progress
    const scrollProgress =
      window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight);

    const progressIndicator = document.querySelector(".scroll-progress");
    if (progressIndicator) {
      progressIndicator.style.width = `${scrollProgress * 100}%`;
    }

    // Fade header on scroll
    const header = document.querySelector(".story-header");
    if (header) {
      const opacity = Math.max(0, 1 - scrollProgress * 2);
      header.style.opacity = opacity;
    }
  }

  setupParallax() {
    const parallaxElements = document.querySelectorAll("[data-parallax]");

    if (parallaxElements.length === 0) return;

    const updateParallax = throttle(() => {
      const scrollY = window.scrollY;

      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.dataset.parallax || 0.5);
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }, 16);

    window.addEventListener("scroll", updateParallax);
  }

  showStoryComplete() {
    const completionMessage = document.createElement("div");
    completionMessage.className = "story-completion";
    completionMessage.innerHTML = `
            <div class="completion-content">
                <h2>💕 Story Complete 💕</h2>
                <p>You've reached the end of our beautiful journey... so far!</p>
                <button class="restart-story">Start Over</button>
                <button class="continue-journey">Continue to Anniversary</button>
            </div>
        `;

    document.body.appendChild(completionMessage);

    // Setup completion actions
    completionMessage
      .querySelector(".restart-story")
      .addEventListener("click", () => {
        this.goToChapter(0);
        completionMessage.remove();
      });

    completionMessage
      .querySelector(".continue-journey")
      .addEventListener("click", () => {
        window.location.href = "anniversary.html";
      });
    // Trigger celebration
    this.bubbleAnimation?.burst(30);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  showMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.className = "story-message";
    messageElement.textContent = message;

    document.body.appendChild(messageElement);

    setTimeout(() => messageElement.classList.add("show"), 100);
    setTimeout(() => {
      messageElement.classList.remove("show");
      setTimeout(() => messageElement.remove(), 300);
    }, 3000);
  }

  handleError(error) {
    console.error("Love story page error:", error);
    this.showMessage("Something went wrong. Please refresh the page.");
  }

  destroy() {
    // Stop auto-play
    this.stopAutoPlay();

    // Clean up event listeners
    window.removeEventListener("scroll", this.handleScroll);

    // Clean up components
    this.musicManager?.destroy();
    this.heartAnimation?.destroy();
    this.gallery?.destroy();
    this.lazyLoader?.destroy();

    // Stop performance monitoring
    this.performanceMonitor?.stop();

    console.log("🧹 Love story page cleaned up");
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.loveStoryController = new LoveStoryPageController();
  });
} else {
  window.loveStoryController = new LoveStoryPageController();
}

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  window.loveStoryController?.destroy();
});

export { LoveStoryPageController };
