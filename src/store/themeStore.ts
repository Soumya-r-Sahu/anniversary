import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeMode, ThemeConfig, ParticleConfig } from "@types/index";

interface ThemeState {
  theme: ThemeMode;
  config: ThemeConfig;
  isDarkMode: boolean;
  particlesEnabled: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setParticlesEnabled: (enabled: boolean) => void;
  getThemeConfig: () => ThemeConfig;
}

const defaultParticleConfig: ParticleConfig = {
  count: 50,
  size: { min: 2, max: 8 },
  speed: { min: 0.5, max: 2 },
  colors: ["#ff6b9d", "#ec4899", "#ffa8cc", "#f472b6", "#f9a8d4"],
  shapes: ["heart", "star", "circle"],
  behavior: "float",
};

const themeConfigs: Record<ThemeMode, ThemeConfig> = {
  light: {
    mode: "light",
    primaryColor: "#ff6b9d",
    secondaryColor: "#ec4899",
    accentColor: "#ffa8cc",
    backgroundGradient: ["#fdf2f8", "#fce7f3"],
    particleConfig: {
      ...defaultParticleConfig,
      colors: ["#ff6b9d", "#ec4899", "#ffa8cc", "#f472b6", "#f9a8d4"],
    },
  },
  dark: {
    mode: "dark",
    primaryColor: "#f472b6",
    secondaryColor: "#ec4899",
    accentColor: "#ffa8cc",
    backgroundGradient: ["#1a0b14", "#2d1b2e"],
    particleConfig: {
      ...defaultParticleConfig,
      colors: ["#f472b6", "#ec4899", "#d946ef", "#e879f9", "#f0abfc"],
    },
  },
  romantic: {
    mode: "romantic",
    primaryColor: "#ff6b9d",
    secondaryColor: "#ec4899",
    accentColor: "#ffa8cc",
    backgroundGradient: ["#fdf2f8", "#fce7f3", "#fef7ff"],
    particleConfig: {
      ...defaultParticleConfig,
      colors: ["#ff6b9d", "#ec4899", "#ffa8cc", "#f472b6", "#f9a8d4"],
      shapes: ["heart", "flower"],
      behavior: "heart",
    },
  },
  starry: {
    mode: "starry",
    primaryColor: "#d946ef",
    secondaryColor: "#a855f7",
    accentColor: "#fbbf24",
    backgroundGradient: ["#0c0c0c", "#1a0b14", "#2d1b2e"],
    particleConfig: {
      ...defaultParticleConfig,
      colors: ["#fbbf24", "#f59e0b", "#ffffff", "#e879f9", "#d946ef"],
      shapes: ["star", "circle"],
      behavior: "spiral",
    },
  },
  sunset: {
    mode: "sunset",
    primaryColor: "#fb7185",
    secondaryColor: "#f43f5e",
    accentColor: "#fbbf24",
    backgroundGradient: ["#fda4af", "#f472b6", "#fb7185"],
    particleConfig: {
      ...defaultParticleConfig,
      colors: ["#fb7185", "#f43f5e", "#fbbf24", "#ff6b9d", "#ffa8cc"],
    },
  },
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "romantic",
      config: themeConfigs.romantic,
      isDarkMode: false,
      particlesEnabled: true,

      setTheme: (theme: ThemeMode) => {
        const config = themeConfigs[theme];
        const isDarkMode = theme === "dark" || theme === "starry";

        set({
          theme,
          config,
          isDarkMode,
        });

        // Update CSS custom properties
        const root = document.documentElement;
        root.style.setProperty("--primary-color", config.primaryColor);
        root.style.setProperty("--secondary-color", config.secondaryColor);
        root.style.setProperty("--accent-color", config.accentColor);
        root.style.setProperty(
          "--bg-gradient-start",
          config.backgroundGradient[0],
        );
        root.style.setProperty(
          "--bg-gradient-end",
          config.backgroundGradient[1] || config.backgroundGradient[0],
        );
      },

      toggleTheme: () => {
        const { theme } = get();
        const themes: ThemeMode[] = [
          "light",
          "dark",
          "romantic",
          "starry",
          "sunset",
        ];
        const currentIndex = themes.indexOf(theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        get().setTheme(nextTheme);
      },

      setParticlesEnabled: (enabled: boolean) => {
        set({ particlesEnabled: enabled });
      },

      getThemeConfig: () => get().config,
    }),
    {
      name: "anniversary-theme-store",
      version: 1,
    },
  ),
);
