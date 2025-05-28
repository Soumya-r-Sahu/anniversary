import { useState, useEffect } from "react";
import { useThemeStore } from "@store/themeStore";
import { useMusicStore } from "@store/musicStore";

interface InitializationState {
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export const useInitializeApp = (): InitializationState => {
  const [state, setState] = useState<InitializationState>({
    isLoading: true,
    isInitialized: false,
    error: null,
  });

  const { setTheme } = useThemeStore();
  const { setPlaylist } = useMusicStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize theme system
        const savedTheme = localStorage.getItem("anniversary-theme-store");
        if (savedTheme) {
          const themeData = JSON.parse(savedTheme);
          if (themeData.state?.theme) {
            setTheme(themeData.state.theme);
          }
        } else {
          // Set default romantic theme
          setTheme("romantic");
        }

        // Initialize music system
        const savedMusic = localStorage.getItem("anniversary-music-store");
        if (savedMusic) {
          const musicData = JSON.parse(savedMusic);
          if (musicData.state?.playlist) {
            setPlaylist(musicData.state.playlist);
          }
        }

        // Load fonts
        await loadFonts();

        // Initialize performance monitoring
        initializePerformanceMonitoring();

        // Mark as initialized
        setState({
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } catch (error) {
        console.error("App initialization error:", error);
        setState({
          isLoading: false,
          isInitialized: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    initializeApp();
  }, [setTheme, setPlaylist]);

  return state;
};

// Helper functions
const loadFonts = async (): Promise<void> => {
  const fonts = [
    new FontFace(
      "Poppins",
      "url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap)",
    ),
    new FontFace(
      "Dancing Script",
      "url(https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap)",
    ),
    new FontFace(
      "Great Vibes",
      "url(https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap)",
    ),
  ];

  try {
    await Promise.all(fonts.map((font) => font.load()));
    fonts.forEach((font) => document.fonts.add(font));
  } catch (error) {
    console.warn("Font loading failed:", error);
  }
};

const initializePerformanceMonitoring = (): void => {
  // Monitor FPS
  let lastTime = performance.now();
  let frames = 0;

  const measureFPS = () => {
    frames++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime));

      if (fps < 30) {
        console.warn("Low FPS detected:", fps);
        // Could trigger performance optimizations here
      }

      frames = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(measureFPS);
  };

  requestAnimationFrame(measureFPS);

  // Monitor memory usage (if available)
  if ("memory" in performance) {
    setInterval(() => {
      const memory = (performance as any).memory;
      if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
        console.warn("High memory usage detected");
      }
    }, 30000);
  }
};
