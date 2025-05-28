// Core types for the anniversary website
export interface User {
  id: string;
  name: string;
  partnerName: string;
  anniversaryDate: Date;
  relationshipStart: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "romantic" | "starry" | "sunset";
  musicVolume: number;
  enableParticles: boolean;
  enableSoundEffects: boolean;
  language: string;
  personalizedMessages: boolean;
}

// Theme types
export type ThemeMode = "light" | "dark" | "romantic" | "starry" | "sunset";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundGradient: string[];
  particleConfig: ParticleConfig;
}

// Music types
export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  genre: string;
  mood: "romantic" | "upbeat" | "chill" | "nostalgic";
  thumbnail?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  thumbnail: string;
  mood: string;
}

// Game types
export interface GameScore {
  gameId: string;
  score: number;
  playedAt: Date;
  duration: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: "memory" | "preference" | "future" | "fun";
  difficulty: "easy" | "medium" | "hard";
}

export interface LoveMeterResult {
  percentage: number;
  message: string;
  factors: string[];
  timestamp: Date;
}

// Memory types
export interface Memory {
  id: string;
  title: string;
  description: string;
  date: Date;
  photos: string[];
  tags: string[];
  location?: string;
  mood: string;
  favorite: boolean;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
  description: string;
  type: "milestone" | "trip" | "special" | "anniversary";
  images: string[];
  significance: number;
}

// Particle system types
export interface ParticleConfig {
  count: number;
  size: { min: number; max: number };
  speed: { min: number; max: number };
  colors: string[];
  shapes: ParticleShape[];
  behavior: "float" | "fall" | "spiral" | "heart" | "star";
}

export type ParticleShape =
  | "circle"
  | "heart"
  | "star"
  | "flower"
  | "butterfly";

// Animation types
export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease: string;
  repeat?: number;
  direction?: "normal" | "reverse" | "alternate";
}

// Component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
